/** Pipeline stage definitions and color mappings */

export const STAGES_5 = ['IF', 'ID', 'EX', 'MEM', 'WB'];
export const STAGES_4 = ['IF', 'ID', 'EX', 'MEM/WB'];

export const STAGE_COLORS = {
  IF:     { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.5)',  text: '#93c5fd', glow: 'glow-blue'   },
  ID:     { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.5)',   text: '#67e8f9', glow: 'glow-cyan'   },
  EX:     { bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.5)', text: '#c4b5fd', glow: 'glow-purple' },
  MEM:    { bg: 'rgba(236,72,153,0.15)',  border: 'rgba(236,72,153,0.5)', text: '#f9a8d4', glow: 'glow-pink'   },
  WB:     { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.5)', text: '#6ee7b7', glow: 'glow-green'  },
  'MEM/WB': { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.4)', text: '#f9a8d4', glow: 'glow-pink' },
  STALL:  { bg: 'rgba(239,68,68,0.2)',   border: 'rgba(239,68,68,0.6)',  text: '#fca5a5', glow: 'glow-red'    },
};

/** Pre-loaded test cases */
export const TEST_CASES = [
  {
    name: '1. No Dependency',
    instructions: ['ADD R1, R2, R3', 'SUB R4, R5, R6', 'ADD R7, R8, R9'],
  },
  {
    name: '2. RAW Hazard',
    instructions: ['ADD R1, R2, R3', 'SUB R4, R1, R5'],
  },
  {
    name: '3. Load-Use Hazard',
    instructions: ['LW R1, 0(R2)', 'ADD R3, R1, R4'],
  },
  {
    name: '4. Chain Dependency',
    instructions: ['ADD R1, R2, R3', 'SUB R4, R1, R5', 'ADD R6, R4, R7'],
  },
  {
    name: '5. Multiple Dependencies',
    instructions: ['ADD R1, R2, R3', 'ADD R4, R5, R6', 'ADD R7, R1, R4'],
  },
  {
    name: '6. Store Data Hazard',
    instructions: ['ADD R1, R2, R3', 'SW R1, 0(R4)'],
  },
];

/** Auto-run speed options (ms per cycle) */
export const SPEED_OPTIONS = [
  { label: 'Slow',   ms: 1200 },
  { label: 'Normal', ms: 700  },
  { label: 'Fast',   ms: 350  },
];
