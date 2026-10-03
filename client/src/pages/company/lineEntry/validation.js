// ─────────────────────────────────────────────────────────────────────────────
// Line validation + completeness helpers.
// Errors are shown only for touched fields (see LineEntry) so a freshly created
// line never greets the user with a wall of red.
// ─────────────────────────────────────────────────────────────────────────────

const toNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : NaN;
};

/** Field-level errors for a line. Keys match line field names. */
export function validateLine(line, allLines = []) {
  const errors = {};
  if (!line) return errors;

  const no = String(line.no ?? '').trim();
  if (!no) {
    errors.no = 'Line number is required.';
  } else if (allLines.some((l) => l.id !== line.id && String(l.no ?? '').trim().toLowerCase() === no.toLowerCase())) {
    errors.no = 'This line number is already used.';
  }

  const lenRaw = line.length;
  if (lenRaw !== '' && lenRaw != null) {
    const len = toNum(lenRaw);
    if (isNaN(len) || len < 0) errors.length = 'Enter a valid length in metres.';
    else if (len === 0) errors.length = 'Length must be greater than 0.';
  }

  const thkRaw = line.insThk;
  if (thkRaw !== '' && thkRaw != null) {
    const thk = toNum(thkRaw);
    if (isNaN(thk) || thk < 0) errors.insThk = 'Enter a valid thickness in mm.';
  }

  return errors;
}

/**
 * A line is "complete" when it has an identity and a real pipe length.
 * Used for the progress dots + "N incomplete" hint in the line list.
 */
export function isLineComplete(line) {
  if (!line) return false;
  const no = String(line.no ?? '').trim();
  const len = toNum(line.length);
  return Boolean(no) && !isNaN(len) && len > 0;
}

export function lineIssues(line) {
  if (!line) return ['No line selected'];
  const issues = [];
  if (!String(line.no ?? '').trim()) issues.push('Line no. missing');
  const len = toNum(line.length);
  if (isNaN(len) || len <= 0) issues.push('Length missing');
  if (String(line.size ?? '').trim() === '' || line.size === '—') issues.push('Pipe size missing');
  return issues;
}

/**
 * Glass-box completeness for the header progress bar.
 * Five checks, each worth 20%.
 */
export function lineProgress(line) {
  if (!line) return { pct: 0, filled: 0, total: 5, issues: [] };

  const checks = [
    ['Line no.', Boolean(String(line.no ?? '').trim())],
    ['Duty', Boolean(line.duty && line.duty !== '—')],
    ['From / To', Boolean(String(line.from ?? '').trim() && String(line.to ?? '').trim())],
    ['Pipe size', Boolean(line.size && line.size !== '—')],
    ['Length', (() => { const n = toNum(line.length); return !isNaN(n) && n > 0; })()],
  ];

  const filled = checks.filter(([, ok]) => ok).length;
  return {
    pct: Math.round((filled / checks.length) * 100),
    filled,
    total: checks.length,
    issues: checks.filter(([, ok]) => !ok).map(([label]) => label),
  };
}
