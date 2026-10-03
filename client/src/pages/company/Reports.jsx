import React, { useState } from 'react';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import { cn } from '../../utils/utils';
import { useMockStore } from '../../context/useMockStore';
import { PIPE_OD_MAP, calcInsulationForReports } from '../../utils/engineering';

const TABS = [
  { id: 'bom',    label: 'BOM – Line Entry',          sheet: 'BOM - P33 - VD SKID'       },
  { id: 'pipe',   label: 'Pipe & Fittings MTO',        sheet: 'P33- Pipe & Fittings'       },
  { id: 'valves', label: 'Valves MTO',                 sheet: 'P33 - MTO - VALVES'         },
  { id: 'nut',    label: 'Nut & Bolts',                sheet: 'NUT & BOLTS'                },
  { id: 'boqins', label: 'BOQ Insulation',             sheet: 'BOQ - INSULATION'           },
  { id: 'colour', label: 'Colour & Red Oxide',         sheet: 'COLOR & RED OXIDE'          },
  { id: 'eqins',  label: 'Equipment Insulation',       sheet: 'EQUIP. INSULATION'          },
  { id: 'tcv',    label: 'TCV',                        sheet: 'TCV'                        },
  { id: 'tt',     label: 'TT',                         sheet: 'TT'                         },
  { id: 'cable',  label: 'BOQ Cable Length',           sheet: 'BOQ - Cable Length'         },
  { id: 'tray',   label: 'Cable Tray & Support',       sheet: 'BOQ - CABLE TRAY & SUPPORT' },
];

// ── Shared table helpers ────────────────────────────────────────────────────
const Th = ({ children, right, center, grey }) => (
  <th className={cn(
    "px-4 py-3 text-sm font-bold text-foreground border border-border whitespace-nowrap",
    grey && "bg-muted/60", !grey && "bg-muted/30",
    right && "text-right", center && "text-center"
  )}>{children}</th>
);
const Td = ({ children, right, center, bold, muted, teal }) => (
  <td className={cn(
    "px-4 py-2.5 text-[15px] border border-border",
    right && "text-right nums", center && "text-center",
    bold && "font-bold", muted && "text-muted-foreground",
    teal && "text-[#17707B] font-semibold"
  )}>{children ?? ''}</td>
);
const SectionHeader = ({ title }) => (
  <div className="bg-[#17707B]/10 border border-[#17707B]/30 rounded-md px-4 py-2 text-sm font-bold text-[#17707B] mt-6 mb-3 first:mt-0">
    {title}
  </div>
);
// Generic keyed table used by several reports.
const EqTable = ({ rows, cols }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead><tr>{cols.map(c => <Th key={c.key} grey right={c.right}>{c.label}</Th>)}</tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-muted/10">
            {cols.map(c => <Td key={c.key} right={c.right} bold={c.bold}>{r[c.key]}</Td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CableTable = ({ rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr>
          <Th grey>Equ. Code</Th>
          <Th grey>To</Th>
          <Th grey right>Final Length (m)</Th>
          <Th grey>Unit</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-muted/10">
            <Td bold teal>{r.equCode}</Td>
            <Td>{r.to}</Td>
            <Td right bold>{r.length}</Td>
            <Td muted>METER</Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── BOM (Line Entry data) — exact BOM - P33 - VD SKID structure ────────────
function BOMReport({ lines }) {
  // Insulation auto-calculation — shared with Line Entry (utils/engineering).
  const calcIns = (l) => calcInsulationForReports(l.size, l.insThk, l.length);

  // Helper: get first component row value (since components are arrays)
  const comp = (line, cat, field) => {
    const items = line.components?.[cat] || [];
    return items.map(i => i[field] ?? '').filter(Boolean).join(', ') || '';
  };
  const compNos = (line, cat) => (line.components?.[cat] || []).length || '';

  const thStyle = "px-2 py-1.5 text-[11px] font-bold text-foreground border border-border whitespace-nowrap bg-muted/40 text-center";
  const thGrp   = "px-2 py-1.5 text-[11px] font-bold text-[#17707B] border border-border bg-[#17707B]/10 text-center whitespace-nowrap";
  const td      = (v, right) => `px-2 py-2 text-xs border border-border whitespace-nowrap${right ? ' text-right nums' : ''}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-sm text-foreground">Line Wise Bill of Material – Vacuum Drying System – 500 LPH</span>
        <span className="ml-auto text-xs text-muted-foreground">{lines.length} lines</span>
      </div>
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse" style={{minWidth:'2800px'}}>
          {/* ── ROW 1: Group headers ── */}
          <thead>
            <tr>
              <th className={thGrp} colSpan={2}></th>
              <th className={thGrp} colSpan={2}>Line Description</th>
              <th className={thGrp} colSpan={1}>Duty</th>
              <th className={thGrp} colSpan={5}>Pipe</th>
              <th className={thGrp} colSpan={5}>Valve</th>
              <th className={thGrp} colSpan={4}>Reducers</th>
              <th className={thGrp} colSpan={4}>Flanges</th>
              <th className={thGrp} colSpan={3}>Elbow</th>
              <th className={thGrp} colSpan={3}>Blind Flanges</th>
              <th className={thGrp} colSpan={3}>TEE</th>
              <th className={thGrp} colSpan={3}>Pressure Instruments</th>
              <th className={thGrp} colSpan={3}>Temp Instruments</th>
              <th className={thGrp} colSpan={3}>Flow Instruments</th>
              <th className={thGrp} colSpan={3}>Strainer</th>
              <th className={thGrp} colSpan={3}>TRAP</th>
              <th className={thGrp} colSpan={3}>Socket</th>
              <th className={thGrp} colSpan={3}>Nipple</th>
              <th className={thGrp} colSpan={1}>Misc.</th>
              <th className={thGrp} colSpan={1}>Remarks</th>
              <th className={thGrp} colSpan={9}>Insulation</th>
            </tr>

            {/* ── ROW 2: Field sub-headers ── */}
            <tr>
              {/* Fixed */}
              <th className={thStyle}>Sr. No.</th>
              <th className={thStyle}>Line No.</th>
              {/* Line Description */}
              <th className={thStyle}>From</th>
              <th className={thStyle}>To</th>
              {/* Duty */}
              <th className={thStyle}>Duty</th>
              {/* Pipe */}
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>MOC</th>
              <th className={thStyle}>Ins. Thickness</th>
              <th className={thStyle}>Ins. Type</th>
              <th className={thStyle}>Length (m)</th>
              {/* Valve */}
              <th className={thStyle}>No</th>
              <th className={thStyle}>Type</th>
              <th className={thStyle}>Size</th>
              <th className={thStyle}>Body</th>
              <th className={thStyle}>Internal</th>
              {/* Reducers */}
              <th className={thStyle}>No</th>
              <th className={thStyle}>Type</th>
              <th className={thStyle}>Size</th>
              <th className={thStyle}>MOC</th>
              {/* Flanges */}
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>MOC</th>
              <th className={thStyle}>NOS</th>
              <th className={thStyle}>Nut Bolt (SET)</th>
              {/* Elbow */}
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>MOC</th>
              <th className={thStyle}>NOS</th>
              {/* Blind Flanges */}
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>MOC</th>
              <th className={thStyle}>NOS</th>
              {/* TEE */}
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>MOC</th>
              <th className={thStyle}>NOS</th>
              {/* Pressure Instruments */}
              <th className={thStyle}>Type</th>
              <th className={thStyle}>Size (NB/BSP)</th>
              <th className={thStyle}>NOS</th>
              {/* Temp Instruments */}
              <th className={thStyle}>Type</th>
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>NOS</th>
              {/* Flow Instruments */}
              <th className={thStyle}>Type</th>
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>NOS</th>
              {/* Strainer */}
              <th className={thStyle}>Type</th>
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>NOS</th>
              {/* TRAP */}
              <th className={thStyle}>Type</th>
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>NOS</th>
              {/* Socket */}
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>MOC</th>
              <th className={thStyle}>NOS</th>
              {/* Nipple */}
              <th className={thStyle}>Size (NB/BSP)</th>
              <th className={thStyle}>MOC</th>
              <th className={thStyle}>NOS</th>
              {/* Misc + Remarks */}
              <th className={thStyle}>Description</th>
              <th className={thStyle}>Remarks</th>
              {/* Insulation */}
              <th className={thStyle}>Temp.</th>
              <th className={thStyle}>Size (NB)</th>
              <th className={thStyle}>Pipe OD (mm)</th>
              <th className={thStyle}>Ins. Thickness (MM)</th>
              <th className={thStyle}>Ins. OD.</th>
              <th className={thStyle}>Total Ins. Area (sq.m)</th>
              <th className={thStyle}>Ins. Area +10%</th>
              <th className={thStyle}>Rockwool (KG)</th>
              <th className={thStyle}>Aluminium Cladding (KG)</th>
            </tr>
          </thead>

          <tbody>
            {lines.length === 0 ? (
              <tr>
                <td colSpan={65} className="text-center py-10 text-muted-foreground text-sm border border-border italic">
                  No lines entered yet. Go to Line Entry to add lines.
                </td>
              </tr>
            ) : lines.map((l, i) => {
              const ins = calcIns(l);
              const C = (cat, field) => comp(l, cat, field);
              const CN = (cat) => compNos(l, cat);
              return (
                <tr key={l.id} className="hover:bg-muted/10">
                  {/* Fixed */}
                  <td className={td(i+1, true)}>{l.srNo ?? i + 1}</td>
                  <td className="px-2 py-2 text-xs border border-border font-bold text-[#17707B] whitespace-nowrap">{l.no}</td>
                  {/* Line Description */}
                  <td className={td(l.from)}>{l.from}</td>
                  <td className={td(l.to)}>{l.to}</td>
                  {/* Duty */}
                  <td className={td(l.duty)}>{l.duty}</td>
                  {/* Pipe */}
                  <td className={td(l.size)}>{l.size}</td>
                  <td className={td(l.moc)}>{l.moc}</td>
                  <td className={td(l.insThk, true)}>{l.insThk}</td>
                  <td className={td(l.insType)}>{l.insType}</td>
                  <td className={td(l.length, true)}>{l.length}</td>
                  {/* Valve */}
                  <td className={td('')}>{C('valve','no')}</td>
                  <td className={td('')}>{C('valve','type')}</td>
                  <td className={td('')}>{C('valve','size')}</td>
                  <td className={td('')}>{C('valve','body')}</td>
                  <td className={td('')}>{C('valve','internal')}</td>
                  {/* Reducers */}
                  <td className={td('')}>{C('reducer','no')}</td>
                  <td className={td('')}>{C('reducer','type')}</td>
                  <td className={td('')}>{C('reducer','size')}</td>
                  <td className={td('')}>{C('reducer','moc')}</td>
                  {/* Flanges */}
                  <td className={td('')}>{C('flange','size')}</td>
                  <td className={td('')}>{C('flange','moc')}</td>
                  <td className={td('',true)}>{C('flange','nos')}</td>
                  <td className={td('',true)}>{C('flange','nutBoltSet')}</td>
                  {/* Elbow */}
                  <td className={td('')}>{C('elbow','size')}</td>
                  <td className={td('')}>{C('elbow','moc')}</td>
                  <td className={td('',true)}>{CN('elbow')}</td>
                  {/* Blind Flanges */}
                  <td className={td('')}>{C('blindFlange','size')}</td>
                  <td className={td('')}>{C('blindFlange','moc')}</td>
                  <td className={td('',true)}>{CN('blindFlange')}</td>
                  {/* TEE */}
                  <td className={td('')}>{C('tee','size')}</td>
                  <td className={td('')}>{C('tee','moc')}</td>
                  <td className={td('',true)}>{CN('tee')}</td>
                  {/* Pressure Instruments */}
                  <td className={td('')}>{C('pressureInstrument','type')}</td>
                  <td className={td('')}>{C('pressureInstrument','size')}</td>
                  <td className={td('',true)}>{C('pressureInstrument','nos')}</td>
                  {/* Temp Instruments */}
                  <td className={td('')}>{C('tempInstrument','type')}</td>
                  <td className={td('')}>{C('tempInstrument','size')}</td>
                  <td className={td('',true)}>{CN('tempInstrument')}</td>
                  {/* Flow Instruments */}
                  <td className={td('')}>{C('flowInstrument','type')}</td>
                  <td className={td('')}>{C('flowInstrument','size')}</td>
                  <td className={td('',true)}>{CN('flowInstrument')}</td>
                  {/* Strainer */}
                  <td className={td('')}>{C('strainer','type')}</td>
                  <td className={td('')}>{C('strainer','size')}</td>
                  <td className={td('',true)}>{CN('strainer')}</td>
                  {/* TRAP */}
                  <td className={td('')}>{C('trap','type')}</td>
                  <td className={td('')}>{C('trap','size')}</td>
                  <td className={td('',true)}>{CN('trap')}</td>
                  {/* Socket */}
                  <td className={td('')}>{C('socket','size')}</td>
                  <td className={td('')}>{C('socket','moc')}</td>
                  <td className={td('',true)}>{C('socket','nos')}</td>
                  {/* Nipple */}
                  <td className={td('')}>{C('nipple','size')}</td>
                  <td className={td('')}>{C('nipple','moc')}</td>
                  <td className={td('',true)}>{CN('nipple')}</td>
                  {/* Misc + Remarks */}
                  <td className={td('')}>{C('misc','description')}</td>
                  <td className={td('')}></td>
                  {/* Insulation (auto-calculated) */}
                  <td className={td(l.insType)}>{l.insType}</td>
                  <td className={td(l.size)}>{l.size}</td>
                  <td className={td('',true)}>{PIPE_OD_MAP[l.size] ?? ''}</td>
                  <td className={td('',true)}>{l.insThk}</td>
                  <td className={td('',true)}>{ins.insOD}</td>
                  <td className={td('',true)}>{ins.area}</td>
                  <td className={td('',true)}>{ins.area10}</td>
                  <td className="px-2 py-2 text-xs border border-border text-right nums font-semibold text-[#17707B]">{ins.rw}</td>
                  <td className="px-2 py-2 text-xs border border-border text-right nums font-semibold text-[#17707B]">{ins.alu}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Pipe & Fittings MTO ─────────────────────────────────────────────────────
// Structure: grouped by MOC+Type+Application, then Size row, then Qty row
function PipeFittingsReport({ lines }) {
  // Group lines by moc
  const groups = {};
  lines.forEach(l => {
    const key = l.moc;
    if (!groups[key]) groups[key] = { moc: l.moc, sizes: {} };
    groups[key].sizes[l.size] = (groups[key].sizes[l.size] || 0) + parseFloat(l.length || 0);
  });

  const allGroups = [
    { sr: 1, item: 'Pipes', moc: 'SS304',  type: 'ERW SCH10',      app: 'Veg Oil',                 sizes: { '15 NB': 1, '50 NB': 28 }, unit: 'MTR' },
    { sr: 2, item: 'Pipes', moc: 'CS-SL',  type: 'Seamless SCH10', app: 'Steam - 3.5 Kg/Cm2',     sizes: { '15 NB': 1, '25 NB': 4, '40 NB': 5, '50 NB': 4 }, unit: 'MTR' },
    { sr: 3, item: 'Pipes', moc: 'CS',     type: 'ERW CLASS C',    app: 'Condensate',              sizes: { '15 NB': 14, '40 NB': 3, '50 NB': 1 }, unit: 'MTR' },
    { sr: 4, item: 'Pipes', moc: 'CS',     type: 'ERW CLASS C',    app: 'Chilling / Cooling Water',sizes: { '40 NB': 13 }, unit: 'MTR' },
    { sr: 5, item: 'Pipes', moc: 'CS',     type: 'ERW CLASS C',    app: 'VACUUM',                  sizes: { '80 NB': 11 }, unit: 'MTR' },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader title="P33 – MATERIAL TAKE OFF – VACUUM DRYING SYSTEM – 500 LPH" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <colgroup><col className="w-12"/><col/><col/><col/><col/></colgroup>
          <thead>
            <tr>
              <Th grey>Sr.</Th>
              <Th grey>Item</Th>
              <Th grey>MOC</Th>
              <Th grey>Type</Th>
              <Th grey>Application</Th>
              <Th grey center>Size / Qty.</Th>
              <Th grey right>Unit</Th>
            </tr>
          </thead>
          <tbody>
            {allGroups.map(g => (
              <React.Fragment key={g.sr}>
                {/* Header row */}
                <tr className="bg-muted/10">
                  <Td bold>{g.sr}</Td>
                  <Td bold>{g.item}</Td>
                  <Td bold>{g.moc}</Td>
                  <Td>{g.type}</Td>
                  <Td>{g.app}</Td>
                  <Td></Td>
                  <Td></Td>
                </tr>
                {/* Size row */}
                <tr>
                  <Td></Td>
                  <Td muted>Size</Td>
                  {Object.keys(g.sizes).map(s => <Td key={s} center bold teal>{s}</Td>)}
                  <Td></Td>
                  <Td muted right>{g.unit}</Td>
                </tr>
                {/* Quantity row */}
                <tr className="bg-muted/5">
                  <Td></Td>
                  <Td muted>Quantity</Td>
                  {Object.values(g.sizes).map((q, i) => <Td key={i} center bold>{q}</Td>)}
                  <Td></Td>
                  <Td></Td>
                </tr>
                {/* spacer */}
                <tr><td colSpan={7} className="h-2 border-0"></td></tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Valves MTO ──────────────────────────────────────────────────────────────
function ValvesMTOReport() {
  const valves = [
    { sr:1, item:'Ball Valves',       endConn:'Socket Weld ASME B16.11', moc:'Body – SS304 / Int – SS304', temp:'0–110°C', app:'Veg Oil',       sizes:{'15 NB':1,'50 NB':7},  unit:'NOS' },
    { sr:2, item:'Ball Valves',       endConn:'Socket Weld ASME B16.11', moc:'Body – CS / Int – SS304',    temp:'0–100°C', app:'Condensate',     sizes:{'15 NB':9},             unit:'NOS' },
    { sr:3, item:'Ball Valves',       endConn:'Socket Weld ASME B16.11', moc:'Body – CS / Int – SS304',    temp:'0–40°C',  app:'Cooling Water',  sizes:{'40 NB':1},             unit:'NOS' },
    { sr:4, item:'Disc Check Valve',  endConn:'Disc type',               moc:'Body – CF8M / Disc – CF8M',  temp:'0–110°C', app:'Veg Oil',        sizes:{'50 NB':1},             unit:'NOS' },
    { sr:5, item:'Disc Check Valve',  endConn:'Disc type',               moc:'Body – CF8M / Disc – CF8M',  temp:'0–100°C', app:'Condensate',     sizes:{'15 NB':3},             unit:'NOS' },
    { sr:6, item:'Butterfly Valve',   endConn:'Wafer',                   moc:'Body – CI / Int – SS304',    temp:'0–50°C',  app:'VACUUM',         sizes:{'80 NB':2},             unit:'NOS' },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader title="P33 – MATERIAL TAKE OFF – VALVE – VACUUM DRYING SYSTEM – 500 LPH" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th grey>Sr.</Th><Th grey>Item</Th><Th grey>End Connection</Th>
              <Th grey>MOC</Th><Th grey>Temp.</Th><Th grey>Application</Th>
              <Th grey center>Size / Qty.</Th><Th grey right>Unit</Th>
            </tr>
          </thead>
          <tbody>
            {valves.map(v => (
              <React.Fragment key={v.sr}>
                <tr className="bg-muted/10">
                  <Td bold>{v.sr}</Td><Td bold>{v.item}</Td><Td muted>{v.endConn}</Td>
                  <Td>{v.moc}</Td><Td>{v.temp}</Td><Td>{v.app}</Td>
                  <Td></Td><Td></Td>
                </tr>
                <tr>
                  <Td></Td><Td muted>Size</Td><Td colSpan={3}></Td>
                  {Object.keys(v.sizes).map(s => <Td key={s} center bold teal>{s}</Td>)}
                  <Td muted right>{v.unit}</Td>
                </tr>
                <tr className="bg-muted/5">
                  <Td></Td><Td muted>Quantity</Td><Td colSpan={3}></Td>
                  {Object.values(v.sizes).map((q,i) => <Td key={i} center bold>{q}</Td>)}
                  <Td></Td>
                </tr>
                <tr><td colSpan={8} className="h-2 border-0"></td></tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Nut & Bolts ─────────────────────────────────────────────────────────────
function NutBoltsReport() {
  const msEquip = [
    { size:'25NB', ss304equ:2, ssPump:0, other:0, total:2, boltPer:4, totalQty:8,  boltSize:'M14×65' },
    { size:'40NB', ss304equ:3, ssPump:0, other:0, total:3, boltPer:4, totalQty:12, boltSize:'M14×70' },
    { size:'50NB', ss304equ:4, ssPump:0, other:0, total:4, boltPer:4, totalQty:16, boltSize:'M16×85' },
    { size:'80NB', ss304equ:3, ssPump:2, other:0, total:5, boltPer:4, totalQty:20, boltSize:'M16×90' },
  ];
  const ss304Equip = [
    { size:'25NB', ss304equ:0, ssPump:2, other:0, total:2, boltPer:4, totalQty:8,  boltSize:'M14×65' },
    { size:'50NB', ss304equ:2, ssPump:0, other:0, total:2, boltPer:4, totalQty:8,  boltSize:'M16×85' },
    { size:'65NB', ss304equ:2, ssPump:0, other:0, total:2, boltPer:4, totalQty:8,  boltSize:'M16×90' },
    { size:'80NB', ss304equ:1, ssPump:0, other:0, total:1, boltPer:4, totalQty:4,  boltSize:'M16×90' },
  ];
  const msPipe = [
    { size:'15NB', unitQty:6, boltPer:4, totalQty:24, boltSize:'M14×55' },
    { size:'40NB', unitQty:4, boltPer:4, totalQty:16, boltSize:'M14×70' },
    { size:'50NB', unitQty:2, boltPer:4, totalQty:8,  boltSize:'M16×85' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="NUT BOLT – #150 CLASS FLANGE – VD – MS – Equipment Counter" />
      <EqTable rows={msEquip} cols={[
        {key:'size',label:'Flange Size'},{key:'ss304equ',label:'SS304-Equ.',right:true},{key:'ssPump',label:'SS-Pump',right:true},
        {key:'other',label:'Other',right:true},{key:'total',label:'Total',right:true,bold:true},
        {key:'boltPer',label:'Bolt Per Flange',right:true},{key:'totalQty',label:'Total Qty.',right:true,bold:true},{key:'boltSize',label:'Bolt Size'}
      ]} />

      <SectionHeader title="NUT BOLT – #150 CLASS FLANGE – VD – SS304 – Equipment Counter" />
      <EqTable rows={ss304Equip} cols={[
        {key:'size',label:'Flange Size'},{key:'ss304equ',label:'SS304-Equ.',right:true},{key:'ssPump',label:'SS-Pump',right:true},
        {key:'other',label:'Other',right:true},{key:'total',label:'Total',right:true,bold:true},
        {key:'boltPer',label:'Bolt Per Flange',right:true},{key:'totalQty',label:'Total Qty.',right:true,bold:true},{key:'boltSize',label:'Bolt Size'}
      ]} />

      <SectionHeader title="NUT BOLT – #150 CLASS FLANGE – VD – MS – Pipe" />
      <EqTable rows={msPipe} cols={[
        {key:'size',label:'Flange Size'},{key:'unitQty',label:'Unit Qty.',right:true},
        {key:'boltPer',label:'Bolt Per Flange',right:true},{key:'totalQty',label:'Total Qty.',right:true,bold:true},{key:'boltSize',label:'Bolt Size'}
      ]} />
    </div>
  );
}

// ── BOQ Insulation ──────────────────────────────────────────────────────────
function BOQInsulationReport() {
  return (
    <div className="space-y-6">
      <SectionHeader title="BOQ – Insulation – Pipe – Vacuum Drying System – P33" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th grey>MOC</Th>
              <Th grey center>25 MM</Th>
              <Th grey center>40 MM</Th>
              <Th grey>Qty.</Th>
              <Th grey>Unit</Th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-muted/5">
              <Td bold>ROCKWOOL</Td>
              <Td center>4</Td>
              <Td center>12</Td>
              <Td bold right>16</Td>
              <Td muted>Sq. Meter</Td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th grey>MOC</Th>
              <Th grey center>24 Gauge</Th>
              <Th grey>Unit</Th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-muted/5">
              <Td bold>ALUMINIUM CLADDING</Td>
              <Td center bold>22</Td>
              <Td muted>KG</Td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader title="BOQ – Insulation – Equipment – Vacuum Drying System – P33" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th grey>MOC</Th>
              <Th grey center>65MM</Th>
              <Th grey>Qty.</Th>
              <Th grey>Unit</Th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-muted/5">
              <Td bold>ROCKWOOL</Td>
              <Td center>20</Td>
              <Td bold right>20</Td>
              <Td muted>Sq. Meter</Td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th grey>MOC</Th>
              <Th grey center>24 Gauge</Th>
              <Th grey>Unit</Th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-muted/5">
              <Td bold>ALUMINIUM CLADDING</Td>
              <Td center bold>27</Td>
              <Td muted>KG</Td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Colour & Red Oxide ──────────────────────────────────────────────────────
function ColourRedOxideReport() {
  const colourData = [
    { fluid: 'VACUUM', size: '80NB', od: 88.9, length: 11, area: (Math.PI * 0.0889 * 11).toFixed(4) },
  ];
  const redOxideData = [
    { fluid: 'STEAM',      rows: [{ size:'15NB',od:21.3,len:1},{size:'25NB',od:33.4,len:4},{size:'40NB',od:48.3,len:5},{size:'50NB',od:60.3,len:4}] },
    { fluid: 'CONDENSATE', rows: [{ size:'15NB',od:21.3,len:14},{size:'40NB',od:48.3,len:3},{size:'50NB',od:60.3,len:1}] },
    { fluid: 'COOLING WATER', rows: [{ size:'40NB',od:48.3,len:13}] },
    { fluid: 'VACUUM',     rows: [{ size:'80NB',od:88.9,len:11}] },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <SectionHeader title="SQ M FOR COLOUR – PIPE" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <Th grey>Fluid</Th><Th grey>Size (NB)</Th>
                <Th grey right>OD (mm)</Th><Th grey right>Length (m)</Th>
                <Th grey right>Area (sq.m)</Th>
              </tr>
            </thead>
            <tbody>
              {colourData.map((r, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <Td bold>{r.fluid}</Td><Td>{r.size}</Td>
                  <Td right>{r.od}</Td><Td right>{r.length}</Td>
                  <Td right bold>{r.area}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <SectionHeader title="SQ M FOR RED OXIDE – PIPE" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <Th grey>Fluid</Th><Th grey>Size (NB)</Th>
                <Th grey right>OD (mm)</Th><Th grey right>Length (m)</Th>
                <Th grey right>Area (sq.m)</Th>
              </tr>
            </thead>
            <tbody>
              {redOxideData.map(g => (
                <React.Fragment key={g.fluid}>
                  <tr className="bg-[#17707B]/5">
                    <Td bold teal>{g.fluid}</Td><Td></Td><Td></Td><Td></Td><Td></Td>
                  </tr>
                  {g.rows.map((r, i) => (
                    <tr key={i} className="hover:bg-muted/10">
                      <Td></Td>
                      <Td>{r.size}</Td>
                      <Td right>{r.od}</Td>
                      <Td right>{r.len}</Td>
                      <Td right bold>{(Math.PI * (r.od / 1000) * r.len).toFixed(6)}</Td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Equipment Insulation ─────────────────────────────────────────────────────
function EquipInsulationReport() {
  const equip = [
    { sr:1, code:'VD101', name:'Vacuum Dryer', moc:'SS304', temp:'40–110°C', insTh:65, od:1212, insDia:1342, stHt:950, cones:2, cylArea:3.3947, coneDish:4.0057, insArea:7.4005, area10:8.1405, qty:1, totalArea:8.1405 },
    { sr:2, code:'VD101', name:'Vacuum Dryer', moc:'SS304', temp:'40–110°C', insTh:65, od:1412, insDia:1542, stHt:2100, cones:0, cylArea:0, coneDish:10.1744, insArea:10.1744, area10:11.1919, qty:1, totalArea:11.1919 },
  ];
  const totalArea = equip.reduce((s, e) => s + e.totalArea, 0);

  return (
    <div className="space-y-4">
      <SectionHeader title="Equipment Insulation – Vacuum Drying System – P33" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th grey>Sr.</Th>
              <Th grey>Tag</Th>
              <Th grey>Equipment Name</Th>
              <Th grey>MOC</Th>
              <Th grey center>Process Temp.</Th>
              <Th grey center>Ins Thk (mm)</Th>
              <Th grey right>OD (mm)</Th>
              <Th grey right>Ins. Dia (mm)</Th>
              <Th grey right>Str. Ht (mm)</Th>
              <Th grey center>Cones</Th>
              <Th grey right>Cyl Area (m²)</Th>
              <Th grey right>Cone Area (m²)</Th>
              <Th grey right>Total Area (m²)</Th>
              <Th grey right>+10% (m²)</Th>
              <Th grey center>Qty</Th>
              <Th grey right>Final Area (m²)</Th>
            </tr>
          </thead>
          <tbody>
            {equip.map(e => (
              <tr key={e.sr} className="hover:bg-muted/10">
                <Td muted>{e.sr}</Td>
                <Td bold teal>{e.code}</Td>
                <Td>{e.name}</Td>
                <Td>{e.moc}</Td>
                <Td center>{e.temp}</Td>
                <Td center>{e.insTh}</Td>
                <Td right>{e.od}</Td>
                <Td right>{e.insDia}</Td>
                <Td right>{e.stHt}</Td>
                <Td center>{e.cones}</Td>
                <Td right>{e.cylArea.toFixed(4)}</Td>
                <Td right>{e.coneDish.toFixed(4)}</Td>
                <Td right>{e.insArea.toFixed(4)}</Td>
                <Td right>{e.area10.toFixed(4)}</Td>
                <Td center>{e.qty}</Td>
                <Td right bold>{e.totalArea.toFixed(4)}</Td>
              </tr>
            ))}
            <tr className="bg-muted/20 font-bold">
              <Td colSpan={15} right bold>Total Insulation Area</Td>
              <Td right bold teal>{totalArea.toFixed(4)}</Td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── TCV ──────────────────────────────────────────────────────────────────────
function TCVReport() {
  const rows = [
    { sr:1, tag:'MS104', equName:'MOISTURE SEPARATOR', fluid:'Steam', state:'Steam', scope:'N&T', tcvTag:'TCV – MS104', type:'GLOBE', endConn:'Flanged End', line:'50', mocBody:'CS', mocInt:'SS304', qty:1, presMin:1.5, presMax:3.5, tempMin:0, tempMax:110 },
  ];
  return (
    <div className="space-y-4">
      <SectionHeader title="P33 – MATERIAL TAKE OFF – VALVE – TCV – VACUUM DRYING SYSTEM – 500 LPH" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th grey>Sr.</Th><Th grey>Equ. Tag</Th><Th grey>Equipment Name</Th>
              <Th grey>Material</Th><Th grey>State</Th><Th grey>Scope</Th>
              <Th grey>TCV Tag</Th><Th grey>Type</Th><Th grey>End Conn.</Th>
              <Th grey center>Line (NB)</Th><Th grey>Body MOC</Th><Th grey>Int. MOC</Th>
              <Th grey right>Qty.</Th><Th grey right>Press. Min</Th><Th grey right>Press. Max</Th>
              <Th grey right>Temp. Min</Th><Th grey right>Temp. Max</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.sr} className="hover:bg-muted/10">
                <Td muted>{r.sr}</Td><Td bold teal>{r.tag}</Td><Td>{r.equName}</Td>
                <Td>{r.fluid}</Td><Td>{r.state}</Td><Td>{r.scope}</Td>
                <Td bold>{r.tcvTag}</Td><Td>{r.type}</Td><Td>{r.endConn}</Td>
                <Td center>{r.line}</Td><Td>{r.mocBody}</Td><Td>{r.mocInt}</Td>
                <Td right bold>{r.qty}</Td><Td right>{r.presMin}</Td><Td right>{r.presMax}</Td>
                <Td right>{r.tempMin}</Td><Td right>{r.tempMax}</Td>
              </tr>
            ))}
            <tr className="bg-muted/20">
              <Td colSpan={12} right bold muted>Total</Td>
              <Td right bold>{rows.reduce((s,r)=>s+r.qty,0)}</Td>
              <Td colSpan={4}></Td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── TT ───────────────────────────────────────────────────────────────────────
function TTReport() {
  const rows = [
    { sr:1, equTag:'VD101', equName:'Vacuum Dryer', fluid:'Veg Oil', state:'Liquid', scope:'N&T', tag:'VD101-TT', type:'PT100', endConn:'1/2" BSP (M) Thread', instrConn:'', line:'Vessel', moc:'SS304', qty:1, thermowell:'No' },
  ];
  return (
    <div className="space-y-4">
      <SectionHeader title="P33 – MATERIAL TAKE OFF – TEMPERATURE TRANSMITTER (TT) – VACUUM DRYING SYSTEM – 500 LPH" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th grey>Sr.</Th><Th grey>Equ. Tag</Th><Th grey>Equipment Name</Th>
              <Th grey>Material</Th><Th grey>State</Th><Th grey>Scope</Th>
              <Th grey>TT Tag</Th><Th grey>Type</Th>
              <Th grey>End Conn. (with TW)</Th><Th grey>Line / Vessel</Th>
              <Th grey>MOC</Th><Th grey right>Qty.</Th><Th grey>Thermowell</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.sr} className="hover:bg-muted/10">
                <Td muted>{r.sr}</Td><Td bold teal>{r.equTag}</Td><Td>{r.equName}</Td>
                <Td>{r.fluid}</Td><Td>{r.state}</Td><Td>{r.scope}</Td>
                <Td bold>{r.tag}</Td><Td>{r.type}</Td>
                <Td>{r.endConn}</Td><Td>{r.line}</Td>
                <Td>{r.moc}</Td><Td right bold>{r.qty}</Td><Td>{r.thermowell}</Td>
              </tr>
            ))}
            <tr className="bg-muted/20">
              <Td colSpan={11} right bold muted>Total</Td>
              <Td right bold>{rows.reduce((s,r)=>s+r.qty,0)}</Td>
              <Td></Td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── BOQ Cable Length ──────────────────────────────────────────────────────────
function CableLengthReport() {
  const powerCable = [
    { equCode:'VD101', to:'AGITATOR', length:30.6 },
    { equCode:'',      to:'Push Button', length:11.48 },
    { equCode:'P101',  to:'PUMP', length:25.36 },
    { equCode:'P103 (VP)', to:'VACUUM PUMP', length:22.04 },
  ];
  const tcvCable = [
    { equCode:'TCV-MS104', to:'TCV', length:26.14 },
  ];
  const ttCable = [
    { equCode:'VD101-TT', to:'TT', length:25.08 },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="BOQ – Power Cable Length – Vacuum Drying System – P33" />
      <CableTable rows={powerCable} />

      <SectionHeader title="BOQ – TCV Cable Length – Vacuum Drying System – P33" />
      <CableTable rows={tcvCable} />

      <SectionHeader title="BOQ – TT Cable Length – Vacuum Drying System – P33" />
      <CableTable rows={ttCable} />
    </div>
  );
}

// ── Cable Tray & Support ──────────────────────────────────────────────────────
function CableTrayReport() {
  return (
    <div className="space-y-6">
      <SectionHeader title="BOQ – Cable Tray – Vacuum Drying System – P33" />
      <p className="text-xs text-muted-foreground -mt-2">Perforated Cable Tray</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th grey>MOC</Th>
              <Th grey center>50MM × 50MM × 1.5MM</Th>
              <Th grey center>100MM × 50MM × 1.5MM</Th>
              <Th grey right>Qty.</Th>
              <Th grey>Unit</Th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-muted/10">
              <Td bold>GI</Td>
              <Td center>24</Td>
              <Td center>12</Td>
              <Td right bold>36</Td>
              <Td muted>Meter</Td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader title="BOQ – Support Material – Vacuum Drying System – P33" />
      <p className="text-xs text-muted-foreground -mt-2">Cable Tray & Pipe Duct Support</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th grey>MOC</Th>
              <Th grey center>ISMC 100×50</Th>
              <Th grey center>ISA 50×50×5MM</Th>
              <Th grey>Unit</Th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-muted/10">
              <Td bold>MS</Td>
              <Td center>6</Td>
              <Td center>6</Td>
              <Td muted>Meter</Td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Reports() {
  const { lines } = useMockStore();
  const [activeTab, setActiveTab] = useState('bom');
  const active = TABS.find(t => t.id === activeTab);

  const renderReport = () => {
    switch (activeTab) {
      case 'bom':    return <BOMReport lines={lines} />;
      case 'pipe':   return <PipeFittingsReport lines={lines} />;
      case 'valves': return <ValvesMTOReport />;
      case 'nut':    return <NutBoltsReport />;
      case 'boqins': return <BOQInsulationReport />;
      case 'colour': return <ColourRedOxideReport />;
      case 'eqins':  return <EquipInsulationReport />;
      case 'tcv':    return <TCVReport />;
      case 'tt':     return <TTReport />;
      case 'cable':  return <CableLengthReport />;
      case 'tray':   return <CableTrayReport />;
      default:       return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Reports</h2>
          <p className="text-sm text-muted-foreground">Auto-generated from line data · {TABS.length} document types</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 flex items-center gap-2 rounded-md border border-border bg-card text-sm font-medium hover:bg-muted transition-colors shadow-sm">
            <FiDownload size={16} /> Export to Excel
          </button>
          <button className="h-9 px-4 flex items-center gap-2 rounded-md bg-[#17707B] text-white text-sm font-medium hover:bg-[#125861] transition-colors shadow-sm">
            <FiPrinter size={16} /> Print / PDF
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-border shrink-0 overflow-x-auto scrollbar-none">
        <div className="flex gap-1 min-w-max">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative",
                activeTab === tab.id ? "text-[#17707B]" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#17707B]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pt-6 pb-12">
        <div className="surface rounded-xl overflow-hidden shadow-sm bg-card border border-border">
          {/* Card Header */}
          <div className="flex items-start justify-between p-5 border-b border-border">
            <div>
              <h3 className="font-bold text-foreground text-lg">{active?.label}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Sheet: {active?.sheet} · Rev 00</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#17707B]/10 text-[#17707B]">
              Auto-generated
            </span>
          </div>

          <div className="p-6 animate-in fade-in duration-200">
            {renderReport()}
          </div>
        </div>
      </div>
    </div>
  );
}
