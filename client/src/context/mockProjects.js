// ─────────────────────────────────────────────────────────────────────────────
// Mock company + project seed data (frontend-only phase).
// Kept in its own module so MockStore.jsx only exports components
// (React Fast Refresh friendly).
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY_NAME = 'Acme Engineering';

export const INITIAL_PROJECTS = [
  {
    id: 'p-2024-alpha',
    code: 'P-2024-ALPHA',
    title: 'Main Pipeline Expansion',
    capacity: '500 TPD',
    rev: '02',
    updated: '2 hours ago',
  },
  {
    id: 'p-2024-beta',
    code: 'P-2024-BETA',
    title: 'Cooling Tower Phase II',
    capacity: '1200 TPD',
    rev: '00',
    updated: 'Yesterday',
  },
  {
    id: 'p-2023-delta',
    code: 'P-2023-DELTA',
    title: 'Reactor Modernization',
    capacity: '150 TPD',
    rev: '05',
    updated: '2 weeks ago',
  },
];
