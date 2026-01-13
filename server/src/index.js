import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import {
  initializeDatabase,
  saveSurveyResponse,
  getAllSurveyResponses,
  getSurveyResponsesByType,
  deleteSurveyResponse
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure data directory exists
const dataDir = join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
initializeDatabase();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all survey responses
app.get('/api/surveys/responses', (req, res) => {
  try {
    const type = req.query.type;
    const responses = type
      ? getSurveyResponsesByType(type)
      : getAllSurveyResponses();

    res.json({
      success: true,
      responses,
      count: responses.length
    });
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch survey responses',
      message: error.message
    });
  }
});

// Save a new survey response
app.post('/api/surveys/responses', (req, res) => {
  try {
    const response = req.body;

    // Validate required fields
    if (!response.id || !response.surveyId || !response.surveyType ||
        !response.participantName || !response.participantEmail || !response.answers) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate survey type
    if (!['pre-workshop', 'post-workshop'].includes(response.surveyType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid survey type'
      });
    }

    saveSurveyResponse(response);

    res.status(201).json({
      success: true,
      message: 'Survey response saved successfully',
      id: response.id
    });
  } catch (error) {
    console.error('Error saving survey response:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save survey response',
      message: error.message
    });
  }
});

// Delete a survey response
app.delete('/api/surveys/responses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteSurveyResponse(id);

    if (deleted) {
      res.json({
        success: true,
        message: 'Survey response deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Survey response not found'
      });
    }
  } catch (error) {
    console.error('Error deleting survey response:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete survey response',
      message: error.message
    });
  }
});

// Get survey statistics
app.get('/api/surveys/statistics', (req, res) => {
  try {
    const type = req.query.type;
    const responses = type
      ? getSurveyResponsesByType(type)
      : getAllSurveyResponses();

    // Calculate statistics
    const totalResponses = responses.length;
    const completionTimes = responses
      .filter(r => r.completionTime !== null && r.completionTime !== undefined)
      .map(r => r.completionTime);

    const averageCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : null;

    // Calculate question statistics
    const questionStats = {};

    responses.forEach(response => {
      response.answers.forEach(answer => {
        if (!questionStats[answer.questionId]) {
          questionStats[answer.questionId] = {
            totalAnswers: 0,
            distribution: {},
            values: []
          };
        }

        questionStats[answer.questionId].totalAnswers++;
        questionStats[answer.questionId].values.push(answer.value);

        // Build distribution
        if (typeof answer.value === 'number') {
          questionStats[answer.questionId].distribution[answer.value] =
            (questionStats[answer.questionId].distribution[answer.value] || 0) + 1;
        } else if (Array.isArray(answer.value)) {
          answer.value.forEach(val => {
            questionStats[answer.questionId].distribution[val] =
              (questionStats[answer.questionId].distribution[val] || 0) + 1;
          });
        } else if (typeof answer.value === 'string') {
          questionStats[answer.questionId].distribution[answer.value] =
            (questionStats[answer.questionId].distribution[answer.value] || 0) + 1;
        }
      });
    });

    // Calculate averages for numeric questions
    Object.keys(questionStats).forEach(questionId => {
      const stats = questionStats[questionId];
      const numericValues = stats.values.filter(v => typeof v === 'number');

      if (numericValues.length > 0) {
        stats.average = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      }

      // Remove raw values from response (keep distribution)
      delete stats.values;
    });

    res.json({
      success: true,
      statistics: {
        totalResponses,
        averageCompletionTime,
        questionStats
      }
    });
  } catch (error) {
    console.error('Error calculating statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate statistics',
      message: error.message
    });
  }
});

// Export responses as CSV
app.get('/api/surveys/export/csv', (req, res) => {
  try {
    const type = req.query.type;
    const responses = type
      ? getSurveyResponsesByType(type)
      : getAllSurveyResponses();

    if (responses.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No responses to export'
      });
    }

    // Get all unique question IDs
    const questionIds = new Set();
    responses.forEach(response => {
      response.answers.forEach(answer => {
        questionIds.add(answer.questionId);
      });
    });

    // Create CSV header
    const headers = [
      'Response ID',
      'Timestamp',
      'Participant Name',
      'Participant Email',
      'Organization',
      'Completion Time (seconds)',
      ...Array.from(questionIds)
    ];

    // Create CSV rows
    const rows = responses.map(response => {
      const row = [
        response.id,
        response.timestamp,
        response.participantName,
        response.participantEmail,
        response.participantOrganization || '',
        response.completionTime?.toString() || ''
      ];

      // Add answers
      questionIds.forEach(questionId => {
        const answer = response.answers.find(a => a.questionId === questionId);
        if (answer) {
          if (Array.isArray(answer.value)) {
            row.push(answer.value.join('; '));
          } else {
            row.push(String(answer.value));
          }
        } else {
          row.push('');
        }
      });

      return row;
    });

    // Generate CSV content
    const csvContent = [headers, ...rows]
      .map(row =>
        row.map(cell => {
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      )
      .join('\n');

    // Set headers for file download
    const filename = `${type || 'all'}-survey-responses-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export CSV',
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Survey API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 API endpoints:`);
  console.log(`   GET    /api/surveys/responses`);
  console.log(`   POST   /api/surveys/responses`);
  console.log(`   DELETE /api/surveys/responses/:id`);
  console.log(`   GET    /api/surveys/statistics`);
  console.log(`   GET    /api/surveys/export/csv`);
  console.log(`\n`);
});

export default app;
