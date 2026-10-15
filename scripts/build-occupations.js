// Build src/data/occupations.json from the raw O*NET 31.0 Database tables in data-raw/.
// Run from the project root:  npm run build:data
//
// Raw files (JSON format) were downloaded from https://www.onetcenter.org/database.html
//   data-raw/occupation_data.json        Occupation Data
//   data-raw/career_interest_types.json  Career Interest Types (RIASEC)
//   data-raw/job_zones.json              Job Zones

import { readFileSync, writeFileSync } from 'node:fs';

const RAW_DIR = new URL('../data-raw/', import.meta.url);
const OUT_FILE = new URL('../src/data/occupations.json', import.meta.url);
const RETRIEVED = '2026-10-13'; // date the raw files were downloaded

// O*NET element_name -> the single-letter keys used in questions.json
const RIASEC_LETTER = {
  Realistic: 'R',
  Investigative: 'I',
  Artistic: 'A',
  Social: 'S',
  Enterprising: 'E',
  Conventional: 'C',
};

function readRows(fileName) {
  const table = JSON.parse(readFileSync(new URL(fileName, RAW_DIR), 'utf8'));
  return table.row;
}

const occupationRows = readRows('occupation_data.json');
const interestRows = readRows('career_interest_types.json');
const jobZoneRows = readRows('job_zones.json');

// 1. Long -> wide: collect the 6 OI scores of each occupation into one object.
//    Only the OI scale (scores) is used; IH (high-point codes) is skipped.
const riasecByCode = {};
for (const row of interestRows) {
  if (row.scale_id !== 'OI') continue;
  const letter = RIASEC_LETTER[row.element_name];
  if (!riasecByCode[row.onetsoc_code]) riasecByCode[row.onetsoc_code] = {};
  riasecByCode[row.onetsoc_code][letter] = row.data_value;
}

// 2. Job Zone lookup: already one row per occupation.
const jobZoneByCode = {};
for (const row of jobZoneRows) {
  jobZoneByCode[row.onetsoc_code] = row.job_zone;
}

// 3. Inner join: keep only occupations that have all 6 RIASEC scores and a Job Zone.
const occupations = [];
const skipped = [];
for (const row of occupationRows) {
  const riasec = riasecByCode[row.onetsoc_code];
  const jobZone = jobZoneByCode[row.onetsoc_code];
  const hasAllScores = riasec && Object.keys(riasec).length === 6;

  if (!hasAllScores || jobZone === undefined) {
    skipped.push(row.title);
    continue;
  }

  occupations.push({
    code: row.onetsoc_code,
    title: row.title,
    riasec: { R: riasec.R, I: riasec.I, A: riasec.A, S: riasec.S, E: riasec.E, C: riasec.C },
    jobZone,
  });
}

const output = {
  source: {
    name: 'O*NET 31.0 Database',
    tables: ['Occupation Data', 'Career Interest Types (OI scale)', 'Job Zones'],
    url: 'https://www.onetcenter.org/database.html',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    retrieved: RETRIEVED,
  },
  occupations,
};

writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + '\n');

console.log(`Occupation Data rows: ${occupationRows.length}`);
console.log(`Written: ${occupations.length} occupations -> src/data/occupations.json`);
console.log(`Skipped (missing RIASEC or Job Zone): ${skipped.length}`);
