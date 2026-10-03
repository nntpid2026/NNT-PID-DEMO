/**
 * Default category template — global, applied to every new project.
 * Extracted from MockStore so that module only exports components,
 * which keeps React Fast Refresh working.
 */

// ─── Default Category Template (Global — used for ALL new projects) ────────
export const DEFAULT_CATEGORIES = [
  {
    id: 'line-desc', name: 'Line Description', system: true,
    description: 'Core line identification',
    fields: [
      { id: 'ld1', name: 'Sr. No.',  type: 'auto',   options: [] },
      { id: 'ld2', name: 'Line No.', type: 'text',   options: [] },
      { id: 'ld3', name: 'From',     type: 'text',   options: [] },
      { id: 'ld4', name: 'To',       type: 'text',   options: [] },
    ],
  },
  {
    id: 'duty', name: 'Duty', system: true,
    description: 'Process fluid duty',
    fields: [
      { id: 'dy1', name: 'Duty', type: 'select', options: ['OIL','SAMPLE','WATER','STEAM','CONDENSATE','AIR','GAS','VACUUM','COOLING WATER'] },
    ],
  },
  {
    id: 'pipe', name: 'Pipe', system: true,
    description: 'Pipe specification (drives insulation BOQ calculations)',
    fields: [
      { id: 'p1', name: 'Size (NB)',            type: 'select', options: ['15NB','20NB','25NB','32NB','40NB','50NB','65NB','80NB','100NB','125NB','150NB','200NB'] },
      { id: 'p2', name: 'MOC',                  type: 'select', options: ['CS','SS304','SS316','CS-SL','MS','GI','CPVC','PVC'] },
      { id: 'p3', name: 'Insulation Thickness', type: 'number', options: [] },
      { id: 'p4', name: 'Insulation Type',      type: 'select', options: ['Hot','Cold','Acoustic'] },
      { id: 'p5', name: 'Length (m)',            type: 'number', options: [] },
    ],
  },
  {
    id: 'valve', name: 'Valve', system: false,
    description: 'Valve components per line',
    fields: [
      { id: 'v1', name: 'No',       type: 'text',   options: [] },
      { id: 'v2', name: 'Type',     type: 'select', options: ['BALL','GATE','GLOBE','NRV','BUTTERFLY','NEEDLE','DISC CHECK'] },
      { id: 'v3', name: 'Size',     type: 'select', options: ['15NB','25NB','40NB','50NB','65NB','80NB','100NB'] },
      { id: 'v4', name: 'Body',     type: 'select', options: ['SS304','SS316','CS','CI','CF8M'] },
      { id: 'v5', name: 'Internal', type: 'select', options: ['SS304','SS316','CS'] },
    ],
  },
  {
    id: 'reducer', name: 'Reducers', system: false,
    description: 'Pipe reducers (concentric / eccentric)',
    fields: [
      { id: 'r1', name: 'No',   type: 'text',   options: [] },
      { id: 'r2', name: 'Type', type: 'select', options: ['CON','ECC'] },
      { id: 'r3', name: 'Size', type: 'text',   options: [] },
      { id: 'r4', name: 'MOC',  type: 'select', options: ['SS304','SS316','CS'] },
    ],
  },
  {
    id: 'flange', name: 'Flanges', system: false,
    description: 'Flanges with nut-bolt sets',
    fields: [
      { id: 'fl1', name: 'Size (NB)',       type: 'select', options: ['15NB','25NB','40NB','50NB','65NB','80NB','100NB'] },
      { id: 'fl2', name: 'MOC',            type: 'select', options: ['SS304','SS316','CS'] },
      { id: 'fl3', name: 'NOS',            type: 'number', options: [] },
      { id: 'fl4', name: 'Nut Bolt (SET)', type: 'number', options: [] },
    ],
  },
  {
    id: 'elbow', name: 'Elbow', system: false,
    description: 'Elbow fittings',
    fields: [
      { id: 'e1', name: 'Size (NB)', type: 'select', options: ['15NB','25NB','40NB','50NB','65NB','80NB'] },
      { id: 'e2', name: 'MOC',       type: 'select', options: ['SS304','SS316','CS'] },
      { id: 'e3', name: 'NOS',       type: 'number', options: [] },
    ],
  },
  {
    id: 'blind-flange', name: 'Blind Flanges', system: false,
    description: 'Blind flange fittings',
    fields: [
      { id: 'bf1', name: 'Size (NB)', type: 'select', options: ['15NB','25NB','40NB','50NB','65NB','80NB'] },
      { id: 'bf2', name: 'MOC',       type: 'select', options: ['SS304','SS316','CS'] },
      { id: 'bf3', name: 'NOS',       type: 'number', options: [] },
    ],
  },
  {
    id: 'tee', name: 'TEE', system: false,
    description: 'TEE fittings',
    fields: [
      { id: 't1', name: 'Size (NB)', type: 'select', options: ['15NB','25NB','40NB','50NB','65NB','80NB'] },
      { id: 't2', name: 'MOC',       type: 'select', options: ['SS304','SS316','CS'] },
      { id: 't3', name: 'NOS',       type: 'number', options: [] },
    ],
  },
  {
    id: 'pressure-inst', name: 'Pressure Instruments', system: false,
    description: 'Pressure gauges, transmitters, etc.',
    fields: [
      { id: 'pi1', name: 'Type',          type: 'select', options: ['PG','PT','PS','PSV'] },
      { id: 'pi2', name: 'Size (NB/BSP)', type: 'text',   options: [] },
      { id: 'pi3', name: 'NOS',           type: 'number', options: [] },
    ],
  },
  {
    id: 'temp-inst', name: 'Temp Instruments', system: false,
    description: 'Temperature gauges, transmitters, thermowells',
    fields: [
      { id: 'ti1', name: 'Type',      type: 'select', options: ['TG','TT','TC','TW'] },
      { id: 'ti2', name: 'Size (NB)', type: 'text',   options: [] },
      { id: 'ti3', name: 'NOS',       type: 'number', options: [] },
    ],
  },
  {
    id: 'flow-inst', name: 'Flow Instruments', system: false,
    description: 'Flow meters and indicators',
    fields: [
      { id: 'foi1', name: 'Type',      type: 'select', options: ['FE','FT','FI','FM'] },
      { id: 'foi2', name: 'Size (NB)', type: 'text',   options: [] },
      { id: 'foi3', name: 'NOS',       type: 'number', options: [] },
    ],
  },
  {
    id: 'strainer', name: 'Strainer', system: false,
    description: 'Y-type or basket strainers',
    fields: [
      { id: 'st1', name: 'Type',      type: 'select', options: ['Y-TYPE','BASKET','T-TYPE'] },
      { id: 'st2', name: 'Size (NB)', type: 'select', options: ['15NB','25NB','40NB','50NB','65NB','80NB'] },
      { id: 'st3', name: 'NOS',       type: 'number', options: [] },
    ],
  },
  {
    id: 'trap', name: 'TRAP', system: false,
    description: 'Steam traps',
    fields: [
      { id: 'tr1', name: 'Type',      type: 'select', options: ['FLOAT','THERMODYNAMIC','BIMETALLIC'] },
      { id: 'tr2', name: 'Size (NB)', type: 'select', options: ['15NB','25NB','40NB','50NB'] },
      { id: 'tr3', name: 'NOS',       type: 'number', options: [] },
    ],
  },
  {
    id: 'socket', name: 'Socket', system: false,
    description: 'Socket fittings',
    fields: [
      { id: 'so1', name: 'Size (NB)', type: 'select', options: ['1/2" BSP','15NB','25NB','40NB','50NB'] },
      { id: 'so2', name: 'MOC',       type: 'select', options: ['SS304','SS316','CS'] },
      { id: 'so3', name: 'NOS',       type: 'number', options: [] },
    ],
  },
  {
    id: 'nipple', name: 'Nipple', system: false,
    description: 'Nipple fittings',
    fields: [
      { id: 'ni1', name: 'Size (NB/BSP)', type: 'select', options: ['1/2" BSP','15NB','25NB','40NB','50NB'] },
      { id: 'ni2', name: 'MOC',           type: 'select', options: ['SS304','SS316','CS'] },
      { id: 'ni3', name: 'NOS',           type: 'number', options: [] },
    ],
  },
  {
    id: 'misc', name: 'Misc.', system: false,
    description: 'Miscellaneous fittings and items',
    fields: [
      { id: 'm1', name: 'Description', type: 'text',   options: [] },
      { id: 'm2', name: 'Qty',         type: 'number', options: [] },
    ],
  },
];