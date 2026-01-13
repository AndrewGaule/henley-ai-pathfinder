# AI Business Change Workshop Survey App

A comprehensive web-based survey application designed for collecting feedback from participants in AI business change workshops. Features pre-workshop and post-workshop surveys with multiple question types, real-time statistics, and CSV export capabilities.

## Features

### Survey Capabilities
- **Pre-Workshop Survey**: Collects participant information, AI knowledge assessment, expectations, and organizational context
- **Post-Workshop Survey**: Gathers feedback on satisfaction, learning outcomes, content evaluation, and facilitation quality
- **Question Types**:
  - Multiple choice (single and multi-select)
  - Rating scales (1-5)
  - Text responses (short and long-form)
- **Progress Tracking**: Visual progress indicators and section navigation
- **Mobile-Friendly Design**: Fully responsive interface using Tailwind CSS and shadcn/ui

### Admin Dashboard
- **Survey Results Overview**: View all responses with filtering by survey type
- **Statistics Dashboard**: Real-time analytics including average completion times, response distributions, and rating averages
- **Data Export**: Export survey results to CSV format
- **Response Details**: View individual survey responses in detail
- **Authentication**: Secure admin access

### Data Storage
- **Dual Storage**: LocalStorage (frontend fallback) and SQLite database (backend)
- **Backend API**: RESTful API built with Node.js and Express
- **Data Persistence**: All responses safely stored with transaction support

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- React Router for navigation
- Tailwind CSS for styling
- shadcn/ui component library
- Radix UI primitives

### Backend
- Node.js with ES modules
- Express for API server
- better-sqlite3 for database
- CORS enabled

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

3. Create environment file:
```bash
cp .env.example .env
```

### Development

1. Start the backend server:
```bash
cd server
npm run dev
```
The API server will start on `http://localhost:3001`

2. In a new terminal, start the frontend:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Usage

### For Participants
1. Navigate to the app homepage
2. Choose "Pre-Workshop Survey" or "Post-Workshop Survey"
3. Complete all required questions (marked with *)
4. Navigate between sections using Next/Back buttons
5. Submit the survey

### For Administrators
1. Navigate to `/admin`
2. Login with credentials (default: admin/admin)
3. View survey responses and statistics
4. Export data to CSV
5. Filter responses by survey type

## API Endpoints

- `GET /api/surveys/responses` - Get all responses
- `POST /api/surveys/responses` - Save a new response
- `GET /api/surveys/statistics` - Get survey statistics
- `GET /api/surveys/export/csv` - Export responses to CSV
- `GET /api/health` - Health check

## Survey Questions

### Pre-Workshop Survey
1. About You (name, email, organization, role)
2. AI Knowledge & Experience
3. Workshop Expectations
4. Organization Context

### Post-Workshop Survey
1. Participant Information
2. Overall Satisfaction
3. Learning Outcomes
4. Content Evaluation
5. Facilitation & Delivery
6. Feedback & Suggestions

## License

MIT License
