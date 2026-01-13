import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'data', 'surveys.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  // Create survey_responses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id TEXT PRIMARY KEY,
      survey_id TEXT NOT NULL,
      survey_type TEXT NOT NULL,
      participant_name TEXT NOT NULL,
      participant_email TEXT NOT NULL,
      participant_organization TEXT,
      timestamp TEXT NOT NULL,
      completion_time INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create survey_answers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS survey_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      response_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      answer_value TEXT NOT NULL,
      FOREIGN KEY (response_id) REFERENCES survey_responses(id) ON DELETE CASCADE
    )
  `);

  // Create indices for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_survey_type ON survey_responses(survey_type);
    CREATE INDEX IF NOT EXISTS idx_timestamp ON survey_responses(timestamp);
    CREATE INDEX IF NOT EXISTS idx_response_id ON survey_answers(response_id);
    CREATE INDEX IF NOT EXISTS idx_question_id ON survey_answers(question_id);
  `);

  console.log('Database initialized successfully');
}

// Survey response operations
export function saveSurveyResponse(response) {
  const insertResponse = db.prepare(`
    INSERT INTO survey_responses (
      id, survey_id, survey_type, participant_name, participant_email,
      participant_organization, timestamp, completion_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAnswer = db.prepare(`
    INSERT INTO survey_answers (response_id, question_id, answer_value)
    VALUES (?, ?, ?)
  `);

  // Use transaction for data consistency
  const transaction = db.transaction((response) => {
    insertResponse.run(
      response.id,
      response.surveyId,
      response.surveyType,
      response.participantName,
      response.participantEmail,
      response.participantOrganization || null,
      response.timestamp,
      response.completionTime || null
    );

    // Insert all answers
    for (const answer of response.answers) {
      const answerValue = Array.isArray(answer.value)
        ? JSON.stringify(answer.value)
        : typeof answer.value === 'number'
        ? answer.value.toString()
        : answer.value;

      insertAnswer.run(response.id, answer.questionId, answerValue);
    }
  });

  transaction(response);
}

export function getAllSurveyResponses() {
  const responses = db.prepare(`
    SELECT * FROM survey_responses
    ORDER BY timestamp DESC
  `).all();

  return responses.map(response => {
    const answers = db.prepare(`
      SELECT question_id, answer_value
      FROM survey_answers
      WHERE response_id = ?
    `).all(response.id);

    return {
      id: response.id,
      surveyId: response.survey_id,
      surveyType: response.survey_type,
      participantName: response.participant_name,
      participantEmail: response.participant_email,
      participantOrganization: response.participant_organization,
      timestamp: response.timestamp,
      completionTime: response.completion_time,
      answers: answers.map(a => {
        let value = a.answer_value;

        // Try to parse as JSON (for array values)
        try {
          value = JSON.parse(a.answer_value);
        } catch {
          // Try to parse as number
          const num = Number(a.answer_value);
          if (!isNaN(num) && a.answer_value.trim() !== '') {
            value = num;
          }
        }

        return {
          questionId: a.question_id,
          value: value
        };
      })
    };
  });
}

export function getSurveyResponsesByType(type) {
  const responses = db.prepare(`
    SELECT * FROM survey_responses
    WHERE survey_type = ?
    ORDER BY timestamp DESC
  `).all(type);

  return responses.map(response => {
    const answers = db.prepare(`
      SELECT question_id, answer_value
      FROM survey_answers
      WHERE response_id = ?
    `).all(response.id);

    return {
      id: response.id,
      surveyId: response.survey_id,
      surveyType: response.survey_type,
      participantName: response.participant_name,
      participantEmail: response.participant_email,
      participantOrganization: response.participant_organization,
      timestamp: response.timestamp,
      completionTime: response.completion_time,
      answers: answers.map(a => {
        let value = a.answer_value;

        try {
          value = JSON.parse(a.answer_value);
        } catch {
          const num = Number(a.answer_value);
          if (!isNaN(num) && a.answer_value.trim() !== '') {
            value = num;
          }
        }

        return {
          questionId: a.question_id,
          value: value
        };
      })
    };
  });
}

export function deleteSurveyResponse(id) {
  const stmt = db.prepare('DELETE FROM survey_responses WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export default db;
