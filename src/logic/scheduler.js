import { STAGES_4, STAGES_5 } from '../utils/constants';

/**
 * Builds the pipeline schedule based on instructions, configuration, and hazards.
 * 
 * @param {Array} parsedInstructions 
 * @param {Array} hazards 
 * @param {'4-stage' | '5-stage'} pipelineType 
 * @param {boolean} forwardingEnabled 
 * @returns {Array<Array<string|null>>} schedule
 */
// scheduler.js

// scheduler.js

export function buildSchedule(parsedInstructions, hazards, pipelineType, forwardingEnabled) {
  const STAGES = pipelineType === '5-stage'
    ? ['IF', 'ID', 'EX', 'MEM', 'WB']
    : ['IF', 'ID', 'EX', 'MEM/WB'];

  const numInstr = parsedInstructions.length;
  const numStages = STAGES.length;

  // stageTimings[i][j] = cycle when instruction i enters stage j
  const stageTimings = Array.from({ length: numInstr }, () =>
    new Array(numStages).fill(0)
  );

  for (let i = 0; i < numInstr; i++) {
    // IF and ID always proceed normally (one per cycle)
    stageTimings[i][0] = i + 1; // IF
    stageTimings[i][1] = stageTimings[i][0] + 1; // ID

    let exCycle = stageTimings[i][1] + 1; // default EX

    const consumerHazards = hazards.filter(h => h.consumerIdx === i);

    for (const h of consumerHazards) {
      const producerIdx = h.producerIdx;

      const producerEX = stageTimings[producerIdx][2];
      const producerMEM = stageTimings[producerIdx][3];
      const producerWB = stageTimings[producerIdx][numStages - 1];

      let readyCycle;

      if (forwardingEnabled) {
        if (parsedInstructions[producerIdx].opcode === 'LW') {
          // Load-use: value ready after MEM
          readyCycle = producerMEM + 1;
        } else {
          // ALU: value ready after EX
          readyCycle = producerEX + 1;
        }
      } else {
        // No forwarding: wait until WB completes
        readyCycle = producerWB;
      }

      // 🔥 CRITICAL FIX: take MAX, do NOT accumulate delays
      exCycle = Math.max(exCycle, readyCycle);
    }

    // Assign EX
    stageTimings[i][2] = exCycle;

    // Fill remaining stages sequentially
    for (let s = 3; s < numStages; s++) {
      stageTimings[i][s] = stageTimings[i][s - 1] + 1;
    }
  }

  // Build schedule grid
  const lastInstr = stageTimings[numInstr - 1];
  const maxCycle = lastInstr[numStages - 1];

  const schedule = Array.from({ length: numInstr }, () =>
    new Array(maxCycle).fill(null)
  );

  for (let i = 0; i < numInstr; i++) {
    const timings = stageTimings[i];

    // IF and ID
    schedule[i][timings[0] - 1] = STAGES[0];
    schedule[i][timings[1] - 1] = STAGES[1];

    // Insert stalls between ID and EX
    const stallCount = timings[2] - (timings[1] + 1);

    for (let s = 0; s < stallCount; s++) {
      schedule[i][timings[1] + s] = 'STALL';
    }

    // Remaining stages
    for (let s = 2; s < numStages; s++) {
      schedule[i][timings[s] - 1] = STAGES[s];
    }
  }

  return schedule;
}