# CLAUDE.md - AI Assistant Guide for Henley AI Pathfinder

> **Last Updated:** 2025-12-05
>
> This document provides comprehensive guidance for AI assistants working on the Henley AI Pathfinder codebase.

## Table of Contents

- [Project Overview](#project-overview)
- [Codebase Structure](#codebase-structure)
- [Technology Stack](#technology-stack)
- [Development Workflow](#development-workflow)
- [Key Conventions](#key-conventions)
- [Component Patterns](#component-patterns)
- [State Management](#state-management)
- [Styling Guidelines](#styling-guidelines)
- [Data Models](#data-models)
- [Common Tasks](#common-tasks)
- [Testing Strategy](#testing-strategy)
- [Security Considerations](#security-considerations)
- [Deployment](#deployment)

---

## Project Overview

**Project Name:** Henley AI Pathfinder
**Purpose:** Workshop intake application that collects participant information, analyzes AI adoption maturity, and provides personalized track recommendations
**Current Status:** MVP with local storage persistence (ready for backend integration)

### Application Flow

```
Welcome Screen
    ↓
Basic Details Form (name, org, role, focus area)
    ↓
Conversational Questions (4 open-ended questions)
    ↓
Processing Screen (AI analysis simulation)
    ↓
Results Display (track, readiness, themes)
    ↓
Data saved to localStorage
    ↓
Admin Dashboard (view/filter/export participants)
```

### Key Features

1. **Intake Flow**: 5-step wizard collecting participant information
2. **AI Analysis**: Mock keyword-based analysis engine (ready for real AI integration)
3. **Admin Dashboard**: Password-protected view with filtering and CSV export
4. **Responsive Design**: Mobile, tablet, and desktop optimized
5. **Dark Mode**: Configured and ready (class-based toggle)

---

## Codebase Structure

```
/
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Root component with routing
│   ├── index.css                   # Global styles + Tailwind directives
│   │
│   ├── pages/                      # Route-level components
│   │   ├── Index.tsx               # Main intake flow orchestrator
│   │   ├── Admin.tsx               # Admin dashboard
│   │   └── NotFound.tsx            # 404 page
│   │
│   ├── components/
│   │   ├── intake/                 # 5-step intake flow components
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── BasicDetailsForm.tsx
│   │   │   ├── ConversationalQuestions.tsx
│   │   │   ├── ProcessingScreen.tsx
│   │   │   └── ResultScreen.tsx
│   │   │
│   │   ├── admin/                  # Admin dashboard components
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── ParticipantsTable.tsx
│   │   │   └── ParticipantDetail.tsx
│   │   │
│   │   ├── ui/                     # shadcn/ui components (49 files)
│   │   │   └── [button, input, form, card, table, etc.]
│   │   │
│   │   └── NavLink.tsx             # Router-aware navigation
│   │
│   ├── lib/                        # Core business logic
│   │   ├── ai-service.ts           # AI analysis engine (mock)
│   │   ├── auth.ts                 # Admin authentication
│   │   ├── storage.ts              # localStorage persistence
│   │   └── utils.ts                # Utility functions (cn)
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-mobile.tsx          # Mobile breakpoint detection (768px)
│   │   └── use-toast.ts            # Toast notification hook
│   │
│   └── types/
│       └── participant.ts          # TypeScript data models
│
├── public/                         # Static assets
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind customization
├── tsconfig.json                   # TypeScript config
├── components.json                 # shadcn/ui configuration
└── package.json                    # Dependencies and scripts
```

**File Statistics:**
- Total TypeScript files: 71
- shadcn/ui components: 49
- Custom components: 9
- Custom hooks: 2
- Library utilities: 4

---

## Technology Stack

### Core Framework
- **React 18.3** - UI library with hooks
- **TypeScript 5.8** - Type-safe development (strict mode OFF for velocity)
- **Vite 5.4** - Build tool with SWC for fast transpilation
- **React Router v6.30** - Client-side routing

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Radix UI-based component library (fully customizable)
- **Lucide React** - Icon library (462 icons)
- **next-themes** - Dark mode support

### State & Data
- **React Query 5.83** - Server state management (configured, ready for API)
- **localStorage** - Current persistence layer (no backend yet)
- **sessionStorage** - Admin authentication

### Forms & Validation
- **React Hook Form 7.61** - Form state management
- **Zod 3.25** - Schema validation (installed, ready for use)

### Development Tools
- **ESLint 9** - Code linting
- **@vitejs/plugin-react-swc** - Fast refresh with SWC
- **lovable-tagger** - Component tagging for development

---

## Development Workflow

### Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Branch Strategy

**Current Branch:** `claude/claude-md-mistowlzjjogsry0-01N3Qp1hNyouSh54ttYwyikf`

- All development happens on feature branches prefixed with `claude/`
- Commit frequently with descriptive messages
- Push to remote when changes are complete: `git push -u origin <branch-name>`

### Git Workflow

```bash
# Check current status
git status

# Stage changes
git add <files>

# Commit with descriptive message
git commit -m "feat: add participant filtering by readiness level"

# Push to remote
git push -u origin <branch-name>
```

### Commit Message Convention

Use semantic prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `style:` - Styling changes
- `docs:` - Documentation
- `test:` - Testing
- `chore:` - Maintenance

---

## Key Conventions

### File Organization

1. **Always prefer editing existing files over creating new ones**
2. Place components in appropriate directories:
   - Page-level → `/src/pages/`
   - Feature components → `/src/components/[feature]/`
   - Reusable UI → `/src/components/ui/`
3. Keep business logic in `/src/lib/`
4. Define types in `/src/types/`

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `WelcomeScreen.tsx` |
| Functions | camelCase | `analyzeParticipant()` |
| Types/Interfaces | PascalCase | `Participant`, `AIAnalysis` |
| Constants | UPPER_SNAKE_CASE | `FOCUS_AREAS`, `ADMIN_PASSWORD` |
| CSS classes | kebab-case | `bg-primary`, `text-foreground` |
| Files (components) | PascalCase | `BasicDetailsForm.tsx` |
| Files (config) | kebab-case | `vite.config.ts` |

### Import Organization

```typescript
// 1. External dependencies
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// 2. Internal components
import { Button } from "@/components/ui/button"
import { WelcomeScreen } from "@/components/intake/WelcomeScreen"

// 3. Utilities and types
import { cn } from "@/lib/utils"
import type { Participant } from "@/types/participant"

// 4. Styles (if any)
import "./styles.css"
```

### TypeScript Guidelines

1. **Use explicit types for function parameters and return values**
   ```typescript
   function analyzeParticipant(
     details: BasicDetails,
     answers: ConversationalAnswers
   ): Promise<AIAnalysis> {
     // ...
   }
   ```

2. **Avoid `any` type** - Use proper typing or `unknown`

3. **Use type inference for local variables**
   ```typescript
   const [step, setStep] = useState<Step>("welcome") // Explicit
   const participants = getParticipants() // Inferred
   ```

4. **Define interfaces at the top of files**
   ```typescript
   interface BasicDetailsFormProps {
     onComplete: (details: BasicDetails) => void
     onBack: () => void
   }
   ```

---

## Component Patterns

### Functional Components with Hooks

**Standard Pattern:**
```typescript
import { useState } from "react"
import type { SomeType } from "@/types/participant"

interface MyComponentProps {
  onComplete: (data: SomeType) => void
  initialValue?: string
}

export const MyComponent = ({ onComplete, initialValue = "" }: MyComponentProps) => {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = () => {
    // Validation logic
    onComplete({ value })
  }

  return (
    <div className="container">
      {/* JSX */}
    </div>
  )
}
```

### Form Components Pattern

**Example: src/components/intake/BasicDetailsForm.tsx**

```typescript
interface FormData {
  name: string
  organisation: string
  role: string
  focusArea: FocusArea
}

export const BasicDetailsForm = ({ onComplete, onBack }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    organisation: "",
    role: "",
    focusArea: "" as FocusArea,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    // ... more validation

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onComplete(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### Modal/Dialog Pattern

**Example: src/components/admin/ParticipantDetail.tsx**

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Props {
  participant: Participant | null
  onClose: () => void
}

export const ParticipantDetail = ({ participant, onClose }: Props) => {
  return (
    <Dialog open={!!participant} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        {participant && (
          <div>
            {/* Content */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

---

## State Management

### Current Architecture: Local State with Hooks

**No centralized state management** - Uses React's built-in state management:
- `useState` for component state
- `useEffect` for side effects
- Props for parent-child communication
- Callbacks for child-parent communication

### Intake Flow State (Index.tsx)

```typescript
// Step control
const [step, setStep] = useState<Step>("welcome")

// Form data
const [basicDetails, setBasicDetails] = useState<BasicDetails | null>(null)
const [answers, setAnswers] = useState<ConversationalAnswers | null>(null)

// Analysis results
const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)

// Error handling
const [error, setError] = useState<string | null>(null)
```

### Admin Dashboard State (Admin.tsx)

```typescript
// Authentication
const [isAuthenticated, setIsAuthenticated] = useState(false)

// Participants data
const [participants, setParticipants] = useState<Participant[]>([])

// Selection
const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
```

### When to Use Different State Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| `useState` | Local component state | Form inputs, UI toggles |
| `useEffect` | Side effects, data fetching | Load participants on mount |
| Props | Parent → Child data | Pass onComplete callback |
| Callbacks | Child → Parent data | Form submission |
| React Query | Server state (future) | API calls when backend ready |
| Context | Cross-cutting concerns (future) | Theme, auth, global settings |

---

## Styling Guidelines

### Tailwind CSS + shadcn/ui

**Path Alias:** Use `@/` for imports
```typescript
import { Button } from "@/components/ui/button"
```

### Design Tokens (CSS Variables)

**Located in:** `src/index.css`

```css
/* Light Mode */
--primary: 220 60% 35%        /* Henley Blue */
--background: 0 0% 99%        /* Off-white */
--foreground: 220 20% 15%     /* Dark blue-gray */
--accent: 220 60% 95%         /* Light blue */
--muted: 220 10% 96%          /* Gray background */
--destructive: 0 70% 50%      /* Red for errors */

/* Dark Mode */
--primary: 220 60% 55%        /* Lighter blue */
--background: 220 20% 8%      /* Very dark blue */
--foreground: 220 10% 95%     /* Off-white text */
```

### Utility Classes

**Common Patterns:**
```typescript
// Container with padding
<div className="container mx-auto px-4 py-8">

// Card layout
<div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">

// Button variants
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Conditional classes (use cn utility)
<div className={cn("base-class", isActive && "active-class")}>
```

### cn() Utility

**Location:** `src/lib/utils.ts`

```typescript
import { cn } from "@/lib/utils"

// Merge classes safely
<div className={cn(
  "base-styles",
  isPrimary && "primary-styles",
  isDisabled && "disabled-styles"
)}>
```

### Custom Animations

**Fade-in animation:** Defined in `index.css`
```css
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Responsive Breakpoints

```
sm: 640px   (mobile landscape)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
2xl: 1536px (extra large)
```

**Use mobile-first approach:**
```typescript
// Mobile by default, tablet at md, desktop at lg
<div className="text-sm md:text-base lg:text-lg">
```

---

## Data Models

**Location:** `src/types/participant.ts`

### Core Types

```typescript
// Focus areas (workshop tracks)
type FocusArea =
  | "Strategy and leadership"
  | "Operations and efficiency"
  | "Innovation and new business models"
  | "Data and platforms"
  | "Investment and ventures"

type Track = FocusArea  // Alias

// AI adoption maturity levels
type Readiness = "Early" | "Experimenting" | "Scaling"

// Priority themes
type Theme =
  | "Cost and productivity"
  | "New revenue"
  | "Customer experience"
  | "Risk and regulation"
  | "Talent and skills"
```

### Data Structures

```typescript
// Step 2: Basic participant information
interface BasicDetails {
  name: string
  organisation: string
  role: string
  focusArea: FocusArea
}

// Step 3: Conversational responses
interface ConversationalAnswers {
  aiHope: string           // "What is the main way you hope AI can help..."
  aiStuck: string          // "Where do you feel most stuck today with AI?"
  aiTried: string          // "What have you already tried with AI..."
  workshopSuccess: string  // "What would success from this workshop look like..."
}

// AI-generated analysis
interface AIAnalysis {
  summary: string          // Generated text summary
  track: Track             // Recommended track
  readiness: Readiness     // Maturity assessment
  themes: Theme[]          // 1-3 priority themes
}

// Complete participant record
interface Participant {
  id: string               // UUID
  timestamp: string        // ISO 8601 datetime
  basicDetails: BasicDetails
  answers: ConversationalAnswers
  analysis: AIAnalysis
}
```

### Storage Schema

**localStorage key:** `"henley_participants"`
**Format:** JSON array of `Participant[]`

**sessionStorage key:** `"henley_admin_auth"`
**Format:** Boolean flag (string "true")

---

## Common Tasks

### Adding a New Question to the Intake Flow

1. **Update ConversationalQuestions.tsx**
   ```typescript
   const QUESTIONS = [
     // ... existing questions
     "What is your new question?",
   ]
   ```

2. **Update ConversationalAnswers type**
   ```typescript
   // src/types/participant.ts
   interface ConversationalAnswers {
     // ... existing
     newQuestion: string
   }
   ```

3. **Update analysis logic**
   ```typescript
   // src/lib/ai-service.ts
   export async function analyzeParticipant(
     details: BasicDetails,
     answers: ConversationalAnswers
   ): Promise<AIAnalysis> {
     // Include new question in theme detection
   }
   ```

### Adding a New Admin Filter

1. **Update ParticipantsTable.tsx state**
   ```typescript
   const [newFilter, setNewFilter] = useState<string>("")
   ```

2. **Add filter UI**
   ```typescript
   <Select value={newFilter} onValueChange={setNewFilter}>
     <SelectTrigger>
       <SelectValue placeholder="Filter by..." />
     </SelectTrigger>
     <SelectContent>
       {/* Options */}
     </SelectContent>
   </Select>
   ```

3. **Update filtered data logic**
   ```typescript
   const filteredParticipants = useMemo(() => {
     return participants.filter(p => {
       // ... existing filters
       if (newFilter && !matchesNewFilter(p)) return false
       return true
     })
   }, [participants, newFilter])
   ```

### Connecting to a Real AI Backend

1. **Update ai-service.ts**
   ```typescript
   export async function analyzeParticipant(
     details: BasicDetails,
     answers: ConversationalAnswers
   ): Promise<AIAnalysis> {
     // Replace mock with real API call
     const response = await fetch('/api/analyze', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ details, answers })
     })

     if (!response.ok) throw new Error('Analysis failed')

     return await response.json()
   }
   ```

2. **Use React Query for better state management**
   ```typescript
   import { useMutation } from '@tanstack/react-query'

   const analyzeMutation = useMutation({
     mutationFn: ({ details, answers }: { details: BasicDetails, answers: ConversationalAnswers }) =>
       analyzeParticipant(details, answers),
     onSuccess: (data) => {
       setAnalysis(data)
       setStep("result")
     },
     onError: (error) => {
       setError(error.message)
     }
   })
   ```

### Adding a New shadcn/ui Component

```bash
# Install component (if not already present)
npx shadcn@latest add [component-name]

# Example: Add skeleton component
npx shadcn@latest add skeleton
```

This adds the component to `src/components/ui/`

### Exporting Additional Data Fields

1. **Update exportToCSV in storage.ts**
   ```typescript
   export function exportToCSV(participants: Participant[]): string {
     const headers = [
       // ... existing headers
       "New Field",
     ].join(",")

     const rows = participants.map(p => [
       // ... existing fields
       escapeCSV(p.newField),
     ].join(","))

     return [headers, ...rows].join("\n")
   }
   ```

---

## Testing Strategy

### Current State
- **No tests currently implemented**
- **Testing framework not configured**

### Recommended Testing Setup

1. **Install Vitest + Testing Library**
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   ```

2. **Add test script to package.json**
   ```json
   "scripts": {
     "test": "vitest",
     "test:ui": "vitest --ui"
   }
   ```

3. **Create vitest.config.ts**
   ```typescript
   import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react-swc'
   import path from 'path'

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       setupFiles: ['./src/test/setup.ts'],
     },
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
   })
   ```

### Test Patterns

**Component Test Example:**
```typescript
// src/components/intake/__tests__/WelcomeScreen.test.tsx
import { render, screen } from '@testing-library/react'
import { WelcomeScreen } from '../WelcomeScreen'

describe('WelcomeScreen', () => {
  it('renders welcome message', () => {
    const onStart = vi.fn()
    render(<WelcomeScreen onStart={onStart} />)

    expect(screen.getByText(/Welcome to the AI Workshop/i)).toBeInTheDocument()
  })

  it('calls onStart when button clicked', async () => {
    const onStart = vi.fn()
    const { user } = render(<WelcomeScreen onStart={onStart} />)

    await user.click(screen.getByRole('button', { name: /start/i }))

    expect(onStart).toHaveBeenCalledTimes(1)
  })
})
```

**Service Test Example:**
```typescript
// src/lib/__tests__/ai-service.test.ts
import { analyzeParticipant } from '../ai-service'

describe('analyzeParticipant', () => {
  it('assigns correct track based on focus area', async () => {
    const result = await analyzeParticipant(
      {
        name: 'Test',
        organisation: 'Test Co',
        role: 'Manager',
        focusArea: 'Strategy and leadership'
      },
      {
        aiHope: 'improve decision making',
        aiStuck: 'getting started',
        aiTried: 'nothing yet',
        workshopSuccess: 'clear roadmap'
      }
    )

    expect(result.track).toBe('Strategy and leadership')
    expect(result.readiness).toBe('Early')
  })
})
```

---

## Security Considerations

### Current Security State

⚠️ **Development/MVP Security Level**

**Current Limitations:**
1. **Hardcoded password** in `src/lib/auth.ts` (`"henley2024"`)
2. **Client-side only authentication** (no backend validation)
3. **localStorage data** - unencrypted, client-accessible
4. **No HTTPS enforcement** (development mode)
5. **No rate limiting** on form submissions
6. **No input sanitization** (relies on React's XSS protection)

### Production Checklist

Before deploying to production:

- [ ] **Move authentication to backend** with JWT or session tokens
- [ ] **Encrypt sensitive data** before storing
- [ ] **Use environment variables** for secrets (not hardcoded)
- [ ] **Enforce HTTPS** on all connections
- [ ] **Implement rate limiting** on API endpoints
- [ ] **Validate all inputs** on backend (never trust client)
- [ ] **Add CSRF protection** for state-changing operations
- [ ] **Implement proper session management** (timeouts, secure cookies)
- [ ] **Add audit logging** for admin actions
- [ ] **Review OWASP Top 10** vulnerabilities
- [ ] **Consider GDPR/data privacy** compliance requirements

### Safe Coding Practices

**Always:**
- Validate user inputs before processing
- Use parameterized queries (when backend added)
- Sanitize data before display (React does this by default)
- Keep dependencies updated
- Never log sensitive information

**Never:**
- Trust client-side data
- Store passwords in plain text
- Expose API keys in frontend code
- Disable CORS in production
- Use `dangerouslySetInnerHTML` without sanitization

---

## Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Output directory: dist/
# Contains: index.html, assets/[hash].js, assets/[hash].css
```

### Deployment Options

**Option 1: Lovable Platform (Recommended)**
1. Visit [Lovable Project](https://lovable.dev/projects/da0c1e67-a3af-4502-a81b-26f943dd320c)
2. Click Share → Publish
3. Custom domain supported in Project > Settings > Domains

**Option 2: Static Hosting (Vercel, Netlify, etc.)**
```bash
# Build
npm run build

# Deploy dist/ folder to hosting provider
# Configure build command: npm run build
# Configure output directory: dist
```

**Option 3: Docker**
```dockerfile
# Example Dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables

**Create .env for production:**
```env
VITE_API_URL=https://api.example.com
VITE_ADMIN_PASSWORD_HASH=...  # When moving auth to backend
```

**Access in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

### Pre-Deployment Checklist

- [ ] Run `npm run lint` (no errors)
- [ ] Run `npm run build` (successful)
- [ ] Test production build locally: `npm run preview`
- [ ] Check responsive design on mobile/tablet/desktop
- [ ] Verify all routes work (especially after refresh)
- [ ] Test admin login/logout flow
- [ ] Verify CSV export functionality
- [ ] Check dark mode appearance
- [ ] Review console for errors/warnings
- [ ] Test intake flow end-to-end
- [ ] Verify data persistence across sessions

---

## Working with AI Assistants

### Best Practices for AI Collaboration

**When making changes:**
1. ✅ **Always read files before editing** - Never propose changes to unseen code
2. ✅ **Prefer editing over creating** - Update existing files rather than creating new ones
3. ✅ **Follow existing patterns** - Match the style and structure already in use
4. ✅ **Keep it simple** - Don't over-engineer or add unnecessary features
5. ✅ **Test changes locally** - Run `npm run dev` to verify
6. ✅ **Commit frequently** - Small, focused commits with clear messages

**What to avoid:**
- ❌ Don't add features not explicitly requested
- ❌ Don't refactor code unless asked
- ❌ Don't add comments/docs to unchanged code
- ❌ Don't create abstraction layers prematurely
- ❌ Don't add error handling for impossible scenarios
- ❌ Don't use backwards-compatibility hacks

### Understanding the Codebase

**Start here when analyzing:**
1. Read `src/pages/Index.tsx` - Main intake flow orchestration
2. Read `src/types/participant.ts` - Core data models
3. Explore `src/components/intake/` - UI flow components
4. Review `src/lib/ai-service.ts` - Business logic

**Common questions:**
- **"How does the intake flow work?"** → Read `Index.tsx` (step state machine)
- **"Where is data stored?"** → `src/lib/storage.ts` (localStorage)
- **"How is AI analysis done?"** → `src/lib/ai-service.ts` (mock keyword-based)
- **"Where are the forms?"** → `src/components/intake/`
- **"How does admin auth work?"** → `src/lib/auth.ts` (sessionStorage)

### Example Task Workflows

**Task: "Add email field to basic details"**
1. Read `src/components/intake/BasicDetailsForm.tsx`
2. Add email field to form UI and state
3. Update validation logic
4. Read `src/types/participant.ts`
5. Add `email: string` to `BasicDetails` interface
6. Read `src/components/admin/ParticipantsTable.tsx`
7. Add email column to table
8. Read `src/lib/storage.ts`
9. Add email to CSV export
10. Test locally, commit, push

**Task: "Change color scheme"**
1. Read `src/index.css`
2. Update CSS variables in `:root` and `.dark`
3. Test in browser (light and dark mode)
4. Commit changes

**Task: "Fix bug in participant filtering"**
1. Read `src/components/admin/ParticipantsTable.tsx`
2. Locate filtering logic in `useMemo`
3. Identify and fix bug
4. Test in browser
5. Commit fix

---

## Troubleshooting

### Common Issues

**Issue: "Port 8080 already in use"**
```bash
# Find process using port
lsof -i :8080

# Kill process or change port in vite.config.ts
```

**Issue: "Module not found" errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: "Types not recognized"**
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

**Issue: "Tailwind classes not applying"**
```bash
# Verify tailwind.config.ts includes content paths
# Restart dev server
```

**Issue: "localStorage data lost"**
- Check browser dev tools → Application → Local Storage
- Verify key: `henley_participants`
- Clearing browser data will reset

---

## Additional Resources

### Documentation Links
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Internal Documentation
- `README.md` - Project overview and setup
- `components.json` - shadcn/ui configuration
- `package.json` - Dependencies and scripts

### Project Links
- **Lovable Project:** https://lovable.dev/projects/da0c1e67-a3af-4502-a81b-26f943dd320c
- **Repository:** Check git remote for URL

---

## Changelog

### 2025-12-05
- ✨ Initial CLAUDE.md created with comprehensive codebase documentation
- 📝 Documented complete project structure, patterns, and conventions
- 🎯 Added guides for common tasks and AI assistant workflows

---

**Last Updated:** 2025-12-05
**Document Version:** 1.0.0
**Codebase Version:** MVP with localStorage persistence

For questions or updates to this documentation, please update this file and commit changes.
