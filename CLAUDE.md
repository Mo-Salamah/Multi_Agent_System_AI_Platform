# Multi Agent System AI Platform — Demo

## What This Is
Static demo of a multi-agent AI platform for managing workstreams, events, and organizational workflows. Deployed via GitHub Pages — no backend, no real AI, no real data.

## Setup
```bash
pnpm install
pnpm dev       # http://localhost:3000
pnpm build     # Static export to out/
```

## Architecture
```
Static Next.js App (GitHub Pages)
├── src/app/           — Pages (dashboard, 7 workstreams, login)
├── src/components/    — UI components (shadcn + shared)
├── src/lib/           — Mock data, hooks, constants, utils
└── src/stores/        — Zustand auth store (auto-authenticated)
```

No backend. All data is static mock data in `src/lib/mock-data.ts`.

## Key Files
| File | Purpose |
|------|---------|
| `src/lib/mock-data.ts` | 650 anonymized events, financial reports, conversations |
| `src/lib/api-hooks.ts` | React Query hooks returning mock data (no API calls) |
| `src/app/dashboard/initiatives/page.tsx` | Calendar workstream — functional dashboard, events list, calendar |
| `src/components/shared/demo-chat.tsx` | Chat UI with fake history, shows error for AI features |
| `src/components/shared/workstream-layout.tsx` | Tab layout shared by all workstreams |
| `next.config.ts` | Static export + GitHub Pages basePath |

## Functional vs Non-Functional
### Functional (calendar workstream only):
- **لوحة التحكم** — Dashboard with charts (city, type, tier, owner, monthly, heatmap)
- **بيانات الفعاليات** — Events table with 7 filters + date range (overlap logic)
- **التقويم** — Month calendar view, click date → filtered events list

### Non-Functional (shows toast message):
- All AI chat features → "يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي"
- PPT generation, Intel discovery, approvals, admin panel
- File upload/download, workstream memory, tracker files

## 7 Workstreams
| # | ID | Page |
|---|----|------|
| 1 | city-calendars | /dashboard/initiatives (functional) |
| 2 | financial | /dashboard/financial-monitoring (overview + reports) |
| 3 | quality | /dashboard/quality (overview only) |
| 4 | esports | /dashboard/esports (overview only) |
| 5 | 300th-anniversary | /dashboard/anniversary (overview only) |
| 6 | documents | /dashboard/documents (overview only) |
| 7 | general-support | /dashboard/ai (overview only) |

## Data
- All event names: "فعالية ١", "فعالية ٢", etc.
- All organizers: "جهة ١", "جهة ٢", etc.
- Financial numbers are generic/fake
- No real events committee data anywhere

## Deployment
- Push to `main` triggers `.github/workflows/deploy.yml`
- Builds static export → deploys to GitHub Pages
- Live at: `https://mo-salamah.github.io/Multi_Agent_System_AI_Platform/`

## Tech Stack
- Next.js 16 (static export)
- React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Recharts (charts)
- Zustand (state) + React Query (data)
- Arabic-first RTL layout (IBM Plex Sans Arabic)

## Rules
- No real data — all events/organizers anonymized
- No API calls — everything is client-side mock data
- No secrets — no .env files, no credentials, no API keys
