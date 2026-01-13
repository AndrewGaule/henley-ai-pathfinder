# Survey API Backend

Node.js Express server for the AI Workshop Survey application.

## Features

- RESTful API for survey responses
- SQLite database with better-sqlite3
- CORS enabled
- CSV export functionality
- Survey statistics

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Server will start on `http://localhost:3001`

## Production

```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Survey Responses
- `GET /api/surveys/responses` - Get all responses
  - Query params: `?type=pre-workshop|post-workshop`
- `POST /api/surveys/responses` - Create new response
- `DELETE /api/surveys/responses/:id` - Delete response

### Statistics
- `GET /api/surveys/statistics` - Get survey statistics
  - Query params: `?type=pre-workshop|post-workshop`

### Export
- `GET /api/surveys/export/csv` - Export to CSV
  - Query params: `?type=pre-workshop|post-workshop`

## Database

The server uses SQLite with the following schema:

### survey_responses
- id (TEXT PRIMARY KEY)
- survey_id (TEXT)
- survey_type (TEXT)
- participant_name (TEXT)
- participant_email (TEXT)
- participant_organization (TEXT)
- timestamp (TEXT)
- completion_time (INTEGER)
- created_at (DATETIME)

### survey_answers
- id (INTEGER PRIMARY KEY)
- response_id (TEXT FOREIGN KEY)
- question_id (TEXT)
- answer_value (TEXT)

Database file is created at: `server/data/surveys.db`

## Environment Variables

- `PORT` - Server port (default: 3001)
