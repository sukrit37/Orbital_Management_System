/**
 * Instruction format validators.
 * Supported: ADD, SUB, AND, OR, SLT (R-type), LW, SW (I-type)
 */

const R_TYPE_REGEX = /^(ADD|SUB|AND|OR|SLT)\s+R(\d+)\s*,\s*R(\d+)\s*,\s*R(\d+)$/i;
const LW_REGEX     = /^LW\s+R(\d+)\s*,\s*(-?\d+)\s*\(\s*R(\d+)\s*\)$/i;
const SW_REGEX     = /^SW\s+R(\d+)\s*,\s*(-?\d+)\s*\(\s*R(\d+)\s*\)$/i;

/**
 * Validate a single instruction string.
 * @param {string} instr - instruction text
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateInstruction(instr) {
  const trimmed = instr.trim();
  if (!trimmed) return { valid: false, error: 'Instruction cannot be empty' };

  if (R_TYPE_REGEX.test(trimmed)) return { valid: true };
  if (LW_REGEX.test(trimmed))     return { valid: true };
  if (SW_REGEX.test(trimmed))     return { valid: true };

  return {
    valid: false,
    error: `Invalid format. Expected: ADD Rd, Rs1, Rs2 | SUB Rd, Rs1, Rs2 | LW Rd, offset(Rs) | SW Rs, offset(Rb)`,
  };
}

/**
 * Validate entire instruction list.
 * @param {string[]} instructions
 * @returns {{ valid: boolean, errors: (string|null)[] }}
 */
export function validateAllInstructions(instructions) {
  const errors = instructions.map((instr) => {
    const result = validateInstruction(instr);
    return result.valid ? null : result.error;
  });
  return { valid: errors.every((e) => e === null), errors };
}
