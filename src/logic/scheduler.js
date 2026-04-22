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
    if (i === 0) {
      stageTimings[0][0] = 1; // IF
      stageTimings[0][1] = 2; // ID
      stageTimings[0][2] = 3; // EX
      for (let s = 3; s < numStages; s++) {
        stageTimings[0][s] = stageTimings[0][s - 1] + 1;
      }
      continue;
    }

    // Simplified academic model: IF and ID happen sequentially without structural delay
    // This places ID immediately after IF, accumulating all stalls between ID and EX.
    stageTimings[i][0] = i + 1; // IF
    stageTimings[i][1] = stageTimings[i][0] + 1; // ID

    // EX stage becomes free when previous instruction leaves EX (enters MEM or MEM/WB)
    let exCycle = Math.max(stageTimings[i - 1][3], stageTimings[i][1] + 1);

    // Check Data Hazards
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
        // No forwarding: consumer reads in ID AFTER producer writes in WB
        if (pipelineType === '5-stage') {
          // 5-stage: WB is a dedicated write stage → split-cycle applies
          // (write first half, read second half of same cycle)
          // Consumer's EX = producerWB + 1
          readyCycle = producerWB + 1;
        } else {
          // 4-stage: MEM/WB combines memory access + write → no split-cycle
          // Register write happens at END of MEM/WB, consumer reads NEXT cycle
          // Consumer's EX = producerWB + 2
          readyCycle = producerWB + 2;
        }
      }

      // Take MAX of all hazard delays and structural delays
      exCycle = Math.max(exCycle, readyCycle);
    }

    // Assign EX
    stageTimings[i][2] = exCycle;

    // Fill remaining stages sequentially, respecting previous instruction's pipeline occupancy
    for (let s = 3; s < numStages; s++) {
      stageTimings[i][s] = Math.max(stageTimings[i - 1][s] + 1, stageTimings[i][s - 1] + 1);
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

    // Place actual stages at their computed cycles
    for (let s = 0; s < numStages; s++) {
      schedule[i][timings[s] - 1] = STAGES[s];
    }

    // Fill any execution gaps with 'STALL'
    // This dynamically handles stalls anywhere in the pipeline (IF/ID or ID/EX)
    const startCycle = timings[0] - 1;
    const endCycle = timings[numStages - 1] - 1;

    for (let c = startCycle + 1; c < endCycle; c++) {
      if (schedule[i][c] === null) {
        schedule[i][c] = 'STALL';
      }
    }
  }

  return schedule;
}