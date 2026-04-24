// parser.js

const R_TYPE_REGEX = /^(ADD|SUB|AND|OR|SLT)\s+R(\d+)\s*,\s*R(\d+)\s*,\s*R(\d+)$/i;
const LW_REGEX     = /^LW\s+R(\d+)\s*,\s*(-?\d+)\s*\(\s*R(\d+)\s*\)$/i;
const SW_REGEX     = /^SW\s+R(\d+)\s*,\s*(-?\d+)\s*\(\s*R(\d+)\s*\)$/i;
const BRANCH_REGEX = /^(BEQ|BNE)\s+R(\d+)\s*,\s*R(\d+)\s*,\s*(-?\d+)$/i;

export function parseInstructions(instructions) {
  return instructions.map((instr, index) => {
    const trimmed = instr.trim();
    if (!trimmed) return null;

    let match = R_TYPE_REGEX.exec(trimmed);
    if (match) {
      return {
        id: `I${index + 1}`,
        opcode: match[1].toUpperCase(),
        dest: `R${match[2]}`,
        src: [`R${match[3]}`, `R${match[4]}`],
        type: 'R'
      };
    }

    match = LW_REGEX.exec(trimmed);
    if (match) {
      return {
        id: `I${index + 1}`,
        opcode: 'LW',
        dest: `R${match[1]}`,
        src: [`R${match[3]}`],
        type: 'I'
      };
    }

    match = SW_REGEX.exec(trimmed);
    if (match) {
      return {
        id: `I${index + 1}`,
        opcode: 'SW',
        dest: null,
        src: [`R${match[1]}`, `R${match[3]}`],
        type: 'S'
      };
    }

    match = BRANCH_REGEX.exec(trimmed);
    if (match) {
      return {
        id: `I${index + 1}`,
        opcode: match[1].toUpperCase(),
        dest: null,
        src: [`R${match[2]}`, `R${match[3]}`],
        type: 'B'
      };
    }

    return {
      id: `I${index + 1}`,
      opcode: 'UNKNOWN',
      dest: null,
      src: [],
      type: 'U'
    };
  }).filter(Boolean);
}