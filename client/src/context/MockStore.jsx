import React, { useMemo, useState } from 'react';
import { MockStoreContext } from './mockStoreContext';
import { DEFAULT_CATEGORIES } from './defaultCategories';
import { COMPANY_NAME, INITIAL_PROJECTS } from './mockProjects';

// ─── Initial mock lines ────────────────────────────────────────────────────
const INITIAL_LINES = [
  {
    id: 1, srNo: 1, no: '1002', from: 'P101', to: 'VD101',
    duty: 'OIL', size: '50NB', moc: 'SS304', length: '7', insThk: '40', insType: 'Hot',
    components: {
      valve: [{ no: 'V1', type: 'NRV', size: '50NB', body: 'SS304', internal: 'SS304', qty: 1 }],
      reducer: [{ no: 'R1', type: 'CON', size: '65X50', moc: 'SS304', qty: 1 }, { no: 'R2', type: 'CON', size: '50X25', moc: 'SS304', qty: 1 }],
      flange: [{ size: '50NB', moc: 'SS304', nos: 1, nutBoltSet: 1 }],
      elbow: [], blindFlange: [], tee: [],
      pressureInstrument: [{ type: 'PG', size: '1/2" BSP', nos: 1 }],
      tempInstrument: [], flowInstrument: [], strainer: [], trap: [],
      socket: [{ size: '1/2" BSP', moc: 'SS304', nos: 1 }],
      nipple: [], misc: [],
    }
  },
  {
    id: 2, srNo: 2, no: '1003', from: 'VD101', to: 'OC102',
    duty: 'OIL', size: '50NB', moc: 'SS304', length: '5', insThk: '40', insType: 'Hot',
    components: {
      valve: [{ no: 'V1', type: 'BALL', size: '50NB', body: 'SS304', internal: 'SS304', qty: 1 }, { no: 'V2', type: 'BALL', size: '50NB', body: 'SS304', internal: 'SS304', qty: 1 }],
      reducer: [{ no: 'R1', type: 'CON', size: '65X50', moc: 'SS304', qty: 1 }],
      flange: [{ size: '50NB', moc: 'SS304', nos: 1, nutBoltSet: 1 }],
      elbow: [], blindFlange: [], tee: [],
      pressureInstrument: [], tempInstrument: [], flowInstrument: [], strainer: [], trap: [],
      socket: [{ size: '50NB', moc: 'SS304', nos: 1 }],
      nipple: [], misc: [],
    }
  },
  {
    id: 3, srNo: 3, no: '1004', from: '1003', to: 'OC102',
    duty: 'OIL', size: '50NB', moc: 'SS304', length: '2', insThk: '25', insType: 'Hot',
    components: {
      valve: [{ no: 'V1', type: 'BALL', size: '50NB', body: 'SS304', internal: 'SS304', qty: 1 }],
      reducer: [], flange: [], elbow: [], blindFlange: [], tee: [],
      pressureInstrument: [], tempInstrument: [], flowInstrument: [], strainer: [], trap: [],
      socket: [{ size: '50NB', moc: 'SS304', nos: 1 }],
      nipple: [], misc: [],
    }
  },
];

// ─── Context ───────────────────────────────────────────────────────────────

export function MockStoreProvider({ children }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState(INITIAL_PROJECTS[0].id);
  const [allLines, setAllLines] = useState(() =>
    INITIAL_LINES.map((l) => ({ ...l, projectId: INITIAL_PROJECTS[0].id }))
  );

  // Global default categories
  const [defaultCategories] = useState(DEFAULT_CATEGORIES);

  // Per-project categories
  const [projectCategories, setProjectCategories] = useState({});

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  // Lines are scoped to the active project so every consumer (dashboard,
  // reports, line entry) stays in sync when the project changes.
  const lines = useMemo(
    () => allLines.filter((l) => l.projectId === activeProjectId),
    [allLines, activeProjectId]
  );

  // Get active categories (project override or global default)
  const activeCategories = projectCategories[activeProjectId] || defaultCategories;

  // Save changes automatically to the current project
  const updateCategories = (newCategories) => {
    setProjectCategories(prev => ({ ...prev, [activeProjectId]: newCategories }));
  };

  // ── Projects CRUD ────────────────────────────────────────────────────────
  const setActiveProject = (id) => setActiveProjectId(id);

  const addProject = (data = {}) => {
    const id = `p-${Date.now()}`;
    setProjects(prev => [...prev, {
      id,
      code: (data.code || '').trim() || `P-${new Date().getFullYear()}-NEW`,
      title: (data.title || '').trim() || 'Untitled Project',
      capacity: (data.capacity || '').trim() || '—',
      rev: (data.rev || '').trim() || '00',
      updated: 'Just now',
    }]);
    return id;
  };

  const deleteProject = (id) => {
    setProjects(prev => {
      const next = prev.filter(p => p.id !== id);
      return next.length ? next : prev; // never delete the last project
    });
  };

  const lineCountForProject = (id) => allLines.filter(l => l.projectId === id).length;

  // ── Lines CRUD ───────────────────────────────────────────────────────────
  const addLine = () => {
    const projectLines = allLines.filter(l => l.projectId === activeProjectId);
    const maxSr = projectLines.length ? Math.max(...projectLines.map(l => l.srNo)) : 0;
    const newId = Date.now();
    const emptyComponents = {
      valve: [], reducer: [], flange: [], elbow: [], blindFlange: [],
      tee: [], pressureInstrument: [], tempInstrument: [], flowInstrument: [],
      strainer: [], trap: [], socket: [], nipple: [], misc: [],
    };
    setAllLines(prev => [...prev, {
      id: newId, projectId: activeProjectId, srNo: maxSr + 1, no: `${1000 + maxSr + 1}`,
      from: '', to: '', duty: '—', size: '50NB', moc: 'SS304',
      length: '0', insThk: '0', insType: '—',
      components: emptyComponents,
    }]);
    return newId;
  };

  const duplicateLine = (id) => {
    const src = allLines.find(l => l.id === id);
    if (!src) return null;
    const projectLines = allLines.filter(l => l.projectId === src.projectId);
    const maxSr = projectLines.length ? Math.max(...projectLines.map(l => l.srNo)) : 0;
    const newId = Date.now();
    setAllLines(prev => [...prev, { ...src, id: newId, srNo: maxSr + 1, no: `${1000 + maxSr + 1}` }]);
    return newId;
  };

  const deleteLine = (id) => setAllLines(prev => prev.filter(l => l.id !== id));

  const updateLine = (id, field, value) => {
    setAllLines(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  return (
    <MockStoreContext.Provider value={{
      lines, addLine, duplicateLine, deleteLine, updateLine,
      activeProjectId, activeProject, setActiveProject,
      projects, addProject, deleteProject, lineCountForProject,
      companyName: COMPANY_NAME,
      categories: activeCategories,
      updateCategories,
    }}>
      {children}
    </MockStoreContext.Provider>
  );
}
