# Prudent EMR Lite · CyPath®️ Lung

Role-aware Next.js application that mirrors the Prudent EMR Lite portal (Provider, Lab/QC, Sales, Executive, CRM) with a Prisma-backed API. This repo doubles as the live spec for Kanwar's Figma hand-off—every screen, component, and endpoint lines up with the design brief in `docs/design-brief.md`.

## Stack
- **Next.js 16** (App Router, TypeScript, Tailwind v4)
- **Prisma + SQLite** for Episodes, Attempts, Sales, CRM objects
- **Zod** request validation + typed API responses
- **Lucide / Recharts** for icons + KPI visualizations
- **Local toast + modal system** for UX polish

## Getting Started
```bash
npm install
npx prisma migrate dev
npm run dev
```
- App: http://localhost:3000
- SQLite DB: `prisma/dev.db` (committed schema + migrations)
- Seed: create orders via Provider tab or add CRM data through API calls.

## Key Routes
| Persona | URL | Highlights |
| --- | --- | --- |
| Welcome | `/` | Gradient hero, persona tiles, flows A–E summary |
| Provider | `/provider` | Two-column order form, CTA row, status strip |
| Lab/QC | `/lab-qc` | Episode search, QC/Admin retest modals, attempt timeline |
| Sales | `/sales` | Rep upsert, clinic assignment, inbox w/ pill filters, quota KPIs |
| Executive | `/executive` | Revenue + pipeline KPIs, donut + bar charts, refresh action |
| CRM | `/crm` | NPI search, notes/interactions/stats/insights tabs, quick actions |
| Prototype Notes | `/90-prototype` | Checklist for Kanwar’s Figma hotspots |

## API Surface (Next Route Handlers)
- Orders: `POST /api/order`, `POST /api/progress?episode_id&day=1|2|3`, `POST /api/miss`, `POST /api/release?episode_id`
- QC/Admin: `POST /api/qc/retest`, `POST /api/admin/retest`
- Metrics: `GET /api/exec/metrics`
- Sales: `POST /api/sales/rep/upsert`, `POST /api/sales/assign`, `GET /api/sales/notifications`, `GET /api/sales/metrics`
- CRM: `POST /api/crm/provider/upsert`, `POST /api/crm/provider/assign-rep`, `GET /api/crm/provider/get`, `POST /api/crm/provider/note/add`, `POST /api/crm/provider/interaction/log`, `POST /api/crm/provider/stats/bulk`, `GET /api/crm/provider/insights`
- Utility: `GET /api/episode?episode_id`

Payload schemas live in `src/lib/validators.ts`. Prisma schema + migrations sit under `prisma/`.

## Design Handoff
- Brand tokens, component inventory, flow scripts, and copy deck are documented in `docs/design-brief.md`.
- Theme tokens exposed via CSS variables (`globals.css`) to enable white-label swaps.
- React component names mirror the expected Figma components (e.g., `KpiCard`, `StatusBadge`, `FormField`, `Toast`).

## Testing Checklist
- Run `npm run lint` before committing.
- Smoke-test flows A–E manually: Provider order → Lab/QC retest → Sales notifications → Exec refresh → CRM notes.

Questions? Ping Kanwar with the brief, or inspect the API routes under `src/app/api/**` for exact behavior.
