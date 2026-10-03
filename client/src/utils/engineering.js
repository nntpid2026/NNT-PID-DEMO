// ─────────────────────────────────────────────────────────────────────────────
// Shared engineering calculations for the BOM → BOQ engine.
// Single source of truth — imported by Line Entry (live preview) and Reports
// (generated BOQ) so the two can never drift apart.
// ─────────────────────────────────────────────────────────────────────────────

// Pipe outside diameters (mm) keyed by nominal bore.
export const PIPE_OD_MAP = {
  '15NB': 21.3, '20NB': 26.7, '25NB': 33.4, '32NB': 42.2,
  '40NB': 48.3, '50NB': 60.3, '65NB': 76.1, '80NB': 88.9,
  '100NB': 114.3, '125NB': 139.7, '150NB': 168.3, '200NB': 219.1,
};

export const ROCKWOOL_DENSITY = 160;   // kg/m³
export const ALU_FACTOR = 1.38;        // aluminium cladding kg per m² of surface
export const AREA_WASTAGE_FACTOR = 1.1; // +10% cutting wastage

/**
 * Insulation BOQ calculation.
 * @param {string} sizeNB   Nominal bore, e.g. '50NB'
 * @param {string|number} insThkMm Insulation thickness in mm
 * @param {string|number} lengthM  Pipe length in metres
 * @returns {null | { pipeOD:number, insOD:string, totalArea:string, areaWith10:string, rockwool:string, aluminium:string }}
 */
export function calcInsulation(sizeNB, insThkMm, lengthM) {
  const pipeOD = PIPE_OD_MAP[sizeNB] || null;
  if (!pipeOD || !insThkMm || !lengthM) return null;

  const insThk = parseFloat(insThkMm);
  const length = parseFloat(lengthM);
  if (isNaN(insThk) || isNaN(length) || length === 0 || insThk === 0) return null;

  const insOD = pipeOD + 2 * insThk;
  const totalArea = Math.PI * (insOD / 1000) * length;
  const areaWith10 = totalArea * AREA_WASTAGE_FACTOR;
  const rockwool = areaWith10 * (insThk / 1000) * ROCKWOOL_DENSITY;
  const aluminium = areaWith10 * ALU_FACTOR;

  return {
    pipeOD,
    insOD: insOD.toFixed(1),
    totalArea: totalArea.toFixed(4),
    areaWith10: areaWith10.toFixed(4),
    rockwool: rockwool.toFixed(4),
    aluminium: aluminium.toFixed(4),
  };
}

/**
 * Reports-friendly shape: returns empty strings instead of null so tables render
 * blank cells (never "null"/"NaN") for incomplete lines.
 */
export function calcInsulationForReports(sizeNB, insThkMm, lengthM) {
  const r = calcInsulation(sizeNB, insThkMm, lengthM);
  return r
    ? { insOD: r.insOD, area: r.totalArea, area10: r.areaWith10, rw: r.rockwool, alu: r.aluminium }
    : { insOD: '', area: '', area10: '', rw: '', alu: '' };
}
