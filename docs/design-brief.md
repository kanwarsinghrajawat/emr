# Prudent EMR Lite · CyPath®️ Edition — Figma Hand-off

This repository contains the running Next.js + Prisma demo used to brief Kanwar on the Prudent EMR Lite CyPath Lung workflow. Use this document as the source of truth when producing the white-label UI kit and prototype.

## 1. Brand + Tokens
- Palette (CSS variables in `src/app/globals.css`): `--brand-royal #1F3B8F`, `--brand-indigo #3B4BD6`, `--brand-purple #6B3BD6`, `--brand-cyan #0EA5E9`, accents for green/amber/red, and ink neutrals.
- Typography: Inter (600 headings / 400 body). Tabular numbers for KPIs.
- Elevation: Cards 12–16px radius, soft 20/60 shadow. Inputs/buttons radius 12px.
- Header gradient: `linear(#1F3B8F → #3B4BD6 → #6B3BD6)` implemented via `.gradient-hero` utility.

## 2. Information Architecture
Tabs map personas 1:1 with the code: Provider, Lab/QC, Sales, Executive, CRM, plus a Welcome/Landing and Prototype notes page. Header carries Prudent and CyPath logos, AIIP + CyPath chips, and the persona tab bar.

## 3. Screen Inventory (Build in Figma)
1. **Provider – Create Order:** Two-column form, CTA row (Create / Mark Day 1-3 / Release ± / Missed Day). Inline status strip with Episode + Attempt IDs. Empty state illustration.
2. **Lab/QC – Quality Control:** Episode search, QC button group (Low Microfuge, Leaky Cup, Admin Retest with modals), attempt timeline with badges, helper policy panel.
3. **Sales – Rep & Territory:** Section A upsert rep, Section B assign clinic, Section C notifications inbox with pill filters, Section D KPI mini-cards + progress bar.
4. **Executive – KPIs:** Cards for Booked / Projected / Outcomes / Pipeline, donut + stacked bar charts, Refresh CTA, empty state copy.
5. **CRM – Provider 360:** Hero summary, tabs (Notes, Interactions, Stats table, Insights cards), sidebar quick actions (Assign Rep, Add Note, Log Interaction).
6. **Welcome / Landing (optional):** Gradient hero, persona tiles, Flow A–E cards.
7. **Prototype Page:** Flow A–E click map instructions.

## 4. Components / Naming
Build these in the shared library (names mirror React components):
- Buttons: `COMP/Btn/Primary|Secondary|Tertiary|Destructive`
- Inputs/Textareas/Selects with help + error states
- Badges (`StatusBadge` map: ordered/open/missed/qc_retest/admin_retest/collected/released)
- Cards: KPI, Entity, Notification
- Tables: logs + CRM stats
- Toasts (success/warning/error/info), Modals (QC/Admin retest, Release)
- Empty states (illustration + CTA), Loaders (skeleton rows + spinner)
- Layout templates: Header/Main, Two-column form, KPI Dashboard, Inbox list

## 5. User Flows (Prototype hotspots)
- **Flow A – Core Order:** Provider → Create order → Mark Day 1/2/3 → Release Positive → Exec Refresh KPIs.
- **Flow B – Missed Day:** Provider creates order → Mark Day 1 only → Trigger Missed Day (Lab/QC or Provider) → new attempt → Release Negative.
- **Flow C – QC Retest:** Lab/QC search episode → Low Microfuge / Leaky Cup modal → new attempt marked `qc_retest` → Provider finishes → Release.
- **Flow D – Sales Enablement:** Upsert rep → Assign clinic → Provider order triggers ORDER_CREATED → QC/Admin retests show RETEST_TRIGGERED → Release result → Sales metrics update.
- **Flow E – CRM 360:** Search NPI → view provider → Add Note / Log Interaction / Assign Rep → Stats + Insights populate.

## 6. Copy Deck
- Header: “Prudent EMR Lite · AIIP-backed · CyPath®️ Lung”
- Provider helper: “Three consecutive days required. Missed day auto-opens a new attempt.”
- QC modal texts for Low Microfuge, Leaky Cup, Admin Retest (see `src/app/lab-qc/page.tsx`).
- Executive empty state: “No data yet—run a test flow to populate KPIs.”
- Sales inbox empty: “No notifications. Create an order to trigger events.”

## 7. API Contracts (Live in this Next.js app)
Endpoints live under `/api/**` with Prisma schema covering: Episode, Attempt, SalesRep, Notification, Provider, ProviderNote, ProviderInteraction, ProviderStat. Contracts mirror the FastAPI service (`/api/order`, `/api/progress`, `/api/miss`, `/api/qc/retest`, `/api/admin/retest`, `/api/release`, `/api/exec/metrics`, `/api/sales/*`, `/api/crm/provider/*`).

Use these objects + labels as-is when naming tables, cards, and forms so dev mapping stays 1:1.

## 8. Accessibility & States
- Cover disabled/loading/double-submit on all CTAs.
- Form validation (required + formatting) with helper/error text.
- Retest confirmations and reason badges.
- Empty states for each tab, 404 inline for Lab/QC lookup.
- Toasts for every action.
- Focus rings (2px) and keyboard-friendly nav; body text contrast ≥ 4.5:1.

## 9. Figma File Structure
1. 00 Cover (logos, palette, elevator pitch)
2. 01 Tokens (color/type/shadow/radius/grid)
3. 02 Components (buttons, inputs, chips, cards, tables, toasts, modals)
4. 03 Layout Templates (header, forms, dashboards)
5. 10 Provider — states & flows
6. 11 Lab/QC — search/actions/timeline/modals
7. 12 Sales — forms/inbox/KPIs
8. 13 Executive — KPI dashboard
9. 14 CRM — profile + insights
10. 90 Prototype — flows A–E
11. 99 Dev Handoff — redlines, exports (`prudent-logo.svg`, `cypath-logo.svg`, status icons, empty states)

## 10. Definition of Done
- Variant-driven components, responsive layouts, tokenized for theme swap.
- Six main screens plus edge/error/loading states.
- Hotspot prototype covering flows A–E.
- Dev handoff (spacing, type scale, component names matching React counterparts).
- SVG assets optimized & named.

For any clarifications, inspect the live pages under `src/app/**` or hit the API routes running locally (`npm run dev`).
