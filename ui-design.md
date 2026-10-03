# BOM → BOQ Generator — Frontend-Only Build Plan

A phased, working-frontend-only blueprint for the **BOM-BOQ Generator**: a multi-tenant B2B SaaS where engineering companies manage projects, enter pipeline line specifications, and auto-generate engineering reports (MTO / BOQ).

This document describes how to rebuild the entire UI with **mock data only** (no backend, no auth server, no database). Every screen renders and every interaction works against in-memory state. The plan is divided into **9 phases** that build on each other.

---

## Tech Stack

- **React 19** + **React Router 6** (SPA)
- **Tailwind CSS** — utility-first styling, token-driven theme (light/dark)
- **shadcn/ui** primitives (Button, Input, Select, Dialog, Toast, etc.)
- **react-icons** — icons
- **recharts** — charts (dashboards)
- **framer-motion** — subtle transitions
- No backend: all data lives in a mock module + React Context.

---

## Design System (applies to every phase)

### Brand
- **Industrial, serious** aesthetic. No playful illustrations, no heavy gradients.
- Primary accent: **deep teal** (`#17707B` light / `#2FA39E` dark).
- Neutrals: cool slate.
- 8px rounded cards, subtle elevation, dense tabular data, tabular-nums for numbers.
- Typography: **Inter** (UI) + **IBM Plex Mono** (numbers/code). Letter-spacing `-0.01em`.

### Tokens (CSS variables in `src/index.css`)
```
--background, --foreground, --card, --primary, --secondary, --muted, --accent,
--destructive, --border, --input, --ring, --table-header, --table-row-alt,
--sidebar-*, --chart-1..5, --radius, --font-heading, --font-body, --font-mono
```
Define each under `:root` (light) and `.dark` (dark). Map them in `tailwind.config.js` to `bg-background`, `text-foreground`, `bg-primary`, etc.

### Reusable component classes (`@layer components` in index.css)
- `.surface` — rounded bordered card with subtle shadow.
- `.eng-table` — zebra-striped, hover-highlighted engineering table with crisp header.
- `.field-input` — input with resolved focus ring.
- `.scrollbar-thin` — slim custom scrollbars.
- `.nums` — tabular-nums for numeric cells.

### Layout primitives
- Two app shells: **AdminShell** (dark sidebar) and **CompanyShell** (light sidebar).
- Shells = `flex h-screen`: fixed-width sidebar (240–256px) + flex-1 column (header 64px + scrollable main).

---

## Mock Data Layer (`src/utils/mockData.js`)

Centralized in-memory data so every screen works without a backend:

- `companies[]` — { id, name, email, contactName, status (pending|active|revoked), registeredOn, userCount }
- `projects[]` — { id, companyId, code, title, capacity, revision, active, lineCount }
- `lines[]` — { id, projectId, no, from, to, duty, pipeSize, pipeMOC, length, insThk, insType, items: { [category]: [{...fieldValues, qty}] } }
- `categoryConfigs[]` — { id, companyId, name, order, fields: [{ name, options[], isFreeText }] }
- `users[]` — { id, name, email, role, status, added }
- `recentActivity[]` — audit log entries
- Option lists: `PIPE_SIZES`, `PIPE_MOC`, `DUTY_OPTIONS`, `INSULATION_TYPES`, `RATING_OPTIONS`, etc.
- Report type catalog: `REPORT_TYPES[]` (MTO Pipe & Fittings, Insulation BOQ, Valve Summary, etc.)

All mutations happen through a single `MockStore` (React Context) that wraps `useState` for each collection and exposes CRUD methods. Components read from context, not directly from `mockData`.

---

## Routing (`src/App.jsx`)

```
/                     → Landing (public)
/auth/register        → Register
/auth/otp             → OtpVerify
/auth/pending         → PendingApproval
/auth/revoked         → Revoked
/auth/login           → Login
/admin                → AdminShell (layout)
  /admin              → AdminDashboard
  /admin/requests     → Requests
  /admin/companies    → Companies
  /admin/companies/:id → CompanyDetail
  /admin/settings     → AdminSettings
/app                  → CompanyShell (layout)
  /app                → CompanyDashboard
  /app/projects       → Projects
  /app/line-entry     → LineEntry
  /app/reports        → Reports
  /app/categories     → CategoriesFields
  /app/users          → Users
  /app/settings       → CompanySettings
*                     → PageNotFound
```

Use layout routes (`<Route element={<CompanyShell/>}>` with `<Outlet/>`). No auth guards in mock mode — all routes freely navigable.

---

# Phase 0 — Project Skeleton & Design System

**Goal:** runnable app with theme, tokens, fonts, and the two shells' chrome.

**Files**
- `index.html` — title, meta, favicon, Google Fonts (Inter, IBM Plex Mono).
- `src/main.jsx` — React root.
- `src/index.css` — tokens (light/dark), base layer, component classes (`.surface`, `.eng-table`, `.field-input`, `.scrollbar-thin`, `.nums`).
- `tailwind.config.js` — map tokens to colors, fontFamily, radius, chart palette.
- `src/utils/utils.js` — `cn()` (clsx + tailwind-merge).
- `src/components/Logo.jsx` — compact + admin variants (teal mark + wordmark).
- `src/components/ThemeToggle.jsx` — sun/moon button using `next-themes`.
- `src/components/ScrollToTop.jsx` — scroll to top on route change.

**Acceptance**
- App boots to a blank themed page.
- Light/dark toggle works and persists.
- Inter + IBM Plex Mono load; numbers render tabular.

---

# Phase 1 — Public & Auth Wizard

**Goal:** the public landing page and the 5-step company registration wizard, all mock.

### 1.1 Landing (`src/pages/Landing.jsx`)
- Hero: sub-headline "BOM → BOQ · ENGINEERING DOCUMENT AUTOMATION", headline, description, two CTAs (Register / Log in).
- Two role cards: **Super Admin** (review/approve registrations), **Company Workspace** (manage projects, line entry, reports).
- Three feature cards: Config-driven, Power-user UX, 8 report types.
- Top nav: logo, theme toggle, "Go to Admin" button (navigates to `/admin`).

### 1.2 Register (`src/pages/auth/Register.jsx`)
- Form: company name, contact name, email, password, confirm.
- Inline validation; on submit → navigate to `/auth/otp` carrying details via route state.
- "Already registered? Log in" link.

### 1.3 OtpVerify (`src/pages/auth/OtpVerify.jsx`)
- 6-digit OTP input (split inputs, auto-advance).
- Resend timer (60s countdown).
- On verify → navigate to `/auth/pending` (mock: any 6 digits accepted, or hardcode `123456`).

### 1.4 PendingApproval (`src/pages/auth/PendingApproval.jsx`)
- "Your company is awaiting admin approval" message.
- Buttons: back to login, contact support (no-op toast).

### 1.5 Revoked (`src/pages/auth/Revoked.jsx`)
- Access revoked message; contact support.

### 1.6 Login (`src/pages/auth/Login.jsx`)
- Email + password; "preset revoked" demo button that shows the revoked error path.
- On submit → navigate to `/app` (mock: any input logs in as a company user; preset "admin@…" logs in as super admin).

### Shared
- `src/components/AuthLayout.jsx` — centered card, logo + theme toggle.

**Acceptance**
- Full wizard flows Register → OTP → Pending, and Login → `/app`, admin login → `/admin`.

---

# Phase 2 — Super Admin Shell

**Goal:** back-office UI for managing company registrations.

### 2.1 AdminShell (`src/components/AdminShell.jsx`)
- Dark sidebar (`hsl(203 40% 9%)`), logo + "Admin" badge.
- Nav: Dashboard, Requests, Companies, Settings. Active = solid teal pill; inactive = slate-300 hover.
- Header: "Back office · Platform administration", theme toggle, avatar.
- Logout button.

### 2.2 AdminDashboard (`src/pages/admin/AdminDashboard.jsx`)
- KPI cards: total companies, pending requests, active companies, revoked.
- Recent activity feed (table).
- Companies-by-status bar chart (recharts).

### 2.3 Requests (`src/pages/admin/Requests.jsx`)
- Tabs: Pending / Active / Revoked / All.
- Table: company, contact, email, registered date, status.
- Row actions: Approve (→ active), Reject (→ revoked), Revoke, Reinstate.

### 2.4 Companies (`src/pages/admin/Companies.jsx`)
- Searchable directory table → links to CompanyDetail.

### 2.5 CompanyDetail (`src/pages/admin/CompanyDetail.jsx`)
- Company header + status badge.
- Sub-tabs: Overview (KPIs, projects count, users count), Projects (table), Users (table).

### 2.6 AdminSettings (`src/pages/admin/AdminSettings.jsx`)
- Platform settings form (mock, saves to context).

**Acceptance**
- Admin can approve/reject/revoke companies; statuses update in context and reflect across admin pages.

---

# Phase 3 — Company Shell & Dashboard

**Goal:** the workspace shell and its landing dashboard.

### 3.1 CompanyShell (`src/components/CompanyShell.jsx`)
- Light sidebar: logo, Projects link, "ACTIVE PROJECT" section (Dashboard, Line Entry, Reports, Categories & Fields), lower nav (Users, Settings, Logout), bottom project switcher dropdown.
- Active nav = tinted teal pill (`bg-primary/15 text-primary` + inset ring `ring-primary/30`; dark mode bumps tint to `/25` and ring to `/40`), not solid block.
- Header: company name (small), active project (code – title), theme toggle, avatar pill.
- `<Outlet/>` for page content.

### 3.2 CompanyDashboard (`src/pages/company/CompanyDashboard.jsx`)
- KPIs: active project, total lines, line items, pending reports.
- Lines-by-size donut, items-by-category bar (recharts).
- Recent activity + quick actions (New line, New project, Generate report).

**Acceptance**
- Shell renders with a project selected; dashboard charts populate from mock lines.

---

# Phase 4 — Projects

**Goal:** create / activate / delete projects.

### `src/pages/company/Projects.jsx`
- Header + "New project" button → inline form (code, title, capacity, revision).
- Project grid cards: code, title, capacity, revision, line count, "Activate" / "Open" / "Delete".
- Activating sets `active` flag in context; active project badge highlighted.
- Empty state when no projects.

**Acceptance**
- Create/activate/delete work; active project propagates to shell header and other pages.

---

# Phase 5 — Categories & Fields (Config Engine)

**Goal:** the control center that drives Line Entry and Reports.

### `src/pages/company/CategoriesFields.jsx`
- Left rail: category list with field counts, reorder (up/down), inline add-category.
- Right pane (selected category):
  - Category name (inline edit with pencil), delete category.
  - Field rows: each with name (inline edit), free-text/dropdown toggle, option chips (add/remove), live preview (input or select), delete field.
  - "Add a new field" input + button at bottom.
- All edits persist to `MockStore.categoryConfigs`.

**Seed default categories** (in mockData): Line details (Duty, Pipe size NB, Pipe MOC, Insulation type, From, To), Valve, Reducer, Flange, Elbow, TEE, Pressure Instrument, etc., each with sensible option lists.

**Acceptance**
- Add/rename/delete categories and fields; toggle free-text; add/remove options; reorder categories. Changes immediately reflect in Line Entry.

---

# Phase 6 — Line Entry

**Goal:** the power-user data entry screen — the heart of the app.

### `src/pages/company/LineEntry.jsx`
Layout: left line list (280px) + right detail pane.

**Left list**
- Search (by no, from, to, duty, pipeSize).
- Actions: New / Duplicate / Delete.
- List rows: line no (mono), from → to, pipeSize badge; selected row highlighted.

**Right pane**
- **Line details card** — fixed fields bound to the Line entity:
  - Line No., From, To (text)
  - Duty, Pipe size NB, Pipe MOC, Insulation type — **selects whose options come from the "Line details" category config**.
  - Length (m), Insulation thk (mm) — number inputs.
- **Category sections** (one per non-Line-details category) — `src/components/CategorySection.jsx`:
  - Collapsible header (category name + item count).
  - Table: one column per configured field (select or text per `isFreeText`), plus a Qty column.
  - Add row / remove row; edits call `setLineItems(lineId, category, items)`.
- **Autosave**: "Saved" flash on every edit (no Save button needed, though a Save button exists).

### `src/components/CategorySection.jsx`
- Props: `category, fields, items, defaultOpen, onChange`.
- Empty fields → "No configurable fields." placeholder.
- Row add/remove with stable keys.

**Acceptance**
- Create/duplicate/delete lines; edit line details; select options appear from config; add items to categories; all persists in context and shows in Reports.

---

# Phase 7 — Reports

**Goal:** generate and view engineering reports from line data; export.

### `src/pages/company/Reports.jsx`
- Report type selector (cards or tabs): Pipe & Fittings MTO, Insulation BOQ, Valve Summary, Line List, etc.
- Generates an `eng-table` from the current project's lines + items.
- Aggregation: sums quantities per size/MOC/type across all lines.
- Filters: by category, by size, by MOC.
- **Export**: CSV (download via Blob) and PDF (via `jspdf` + `html2canvas` snapshot of the table).
- Print-friendly view.

**Acceptance**
- Pick a report type → table renders with correct aggregated quantities; CSV and PDF exports download real files.

---

# Phase 8 — Users & Settings

### 8.1 Users (`src/pages/company/Users.jsx`)
- Team table: name, email, role (Company Admin / Engineer), status, added date.
- Invite user (email + role) → appends mock row.
- Remove user (mock).
- Current user row flagged "You".

### 8.2 CompanySettings (`src/pages/company/CompanySettings.jsx`)
- Company profile (name, email, contact) — editable, mock-save.
- Preferences: default report type, units.
- Danger zone: "Request account deletion" (mock confirm dialog).

**Acceptance**
- Invite/remove users; edit profile; settings persist in context for the session.

---

# Phase 9 — Polish, Responsiveness & Edge States

- **Loading states**: skeletons for every async-looking list/chart (even though data is instant, show 300ms skeleton to feel real).
- **Empty states**: every table/list has a friendly empty illustration-free message + primary CTA.
- **Responsive**: shells collapse sidebar to a top bar under `lg`; tables scroll horizontally; grids reflow to single column on mobile.
- **Keyboard**: Line Entry arrow-key navigation, `Ctrl+D` duplicate, `Delete` remove, `Ctrl+K` command palette for project switching (optional stretch).
- **Toasts**: success/error toasts on all mutations.
- **404 page**: `src/pages/PageNotFound.jsx` branded.
- **Cross-browser smoke**: Chrome, Safari, mobile viewport.

---

## File Map (reference)

```
src/
  main.jsx
  index.css
  App.jsx
  utils/
    utils.js
    mockData.js
  context/
    MockStore.jsx        (context provider over mockData)
  components/
    Logo.jsx  ThemeToggle.jsx  AuthLayout.jsx  ScrollToTop.jsx
    AdminShell.jsx  CompanyShell.jsx
    CategorySection.jsx  StatusBadge.jsx
    ui/ (shadcn primitives)
  pages/
    PageNotFound.jsx
    Landing.jsx
    auth/ Register.jsx  OtpVerify.jsx  PendingApproval.jsx  Revoked.jsx  Login.jsx
    admin/ AdminDashboard.jsx  Requests.jsx  Companies.jsx  CompanyDetail.jsx  AdminSettings.jsx
    company/ CompanyDashboard.jsx  Projects.jsx  LineEntry.jsx  Reports.jsx
             CategoriesFields.jsx  Users.jsx  CompanySettings.jsx
```

---

## Build Order Summary

| Phase | Deliverable | Key screens |
|-------|-------------|-------------|
| 0 | Skeleton + design system | blank themed app |
| 1 | Public + auth wizard | Landing, Register→OTP→Pending, Login |
| 2 | Super admin back-office | Dashboard, Requests, Companies, Detail |
| 3 | Company shell + dashboard | shell, dashboard |
| 4 | Projects | create/activate/delete |
| 5 | Categories & Fields | config engine |
| 6 | Line Entry | line list + details + category sections |
| 7 | Reports | generate + CSV/PDF export |
| 8 | Users & Settings | team mgmt, profile |
| 9 | Polish | responsive, loading/empty, toasts, 404 |

Each phase is independently shippable and testable against mock data. Build phases in order — later phases depend on the MockStore and config engine established in earlier ones.