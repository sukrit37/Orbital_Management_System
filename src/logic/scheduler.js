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

  const stageTimings = Array.from({ length: numInstr }, () =>
    new Array(numStages).fill(0)
  );

  for (let i = 0; i < numInstr; i++) {
    if (i === 0) {
      stageTimings[0][0] = 1;
      for (let s = 1; s < numStages; s++) {
        stageTimings[0][s] = stageTimings[0][s - 1] + 1;
      }
      continue;
    }

    // IF stage starts after previous IF
    stageTimings[i][0] = stageTimings[i - 1][0] + 1;

    // ID stage starts after current IF, but can be delayed by previous ID (structural/stall)
    stageTimings[i][1] = Math.max(stageTimings[i][0] + 1, stageTimings[i - 1][1] + 1);

    // Initial guess for EX cycle
    let exCycle = stageTimings[i][1] + 1;

    // Handle Data Hazards
    const consumerHazards = hazards.filter(h => h.consumerIdx === i);

    for (const h of consumerHazards) {
      const producerIdx = h.producerIdx;
      const pTimings = stageTimings[producerIdx];
      
      const pEX = pTimings[2];
      const pMEM = pTimings[3];
      const pWB = pTimings[numStages - 1];

      if (forwardingEnabled) {
        if (h.isBranchHazard) {
          // Branch in ID needs data
          // Data ready after EX (for R-type) or after MEM (for LW)
          // In the repo's logic, branches might forward from MEM or EX
          // Usually, Branch in ID reads from EX/MEM. 
          // If producer is in EX, Branch stalls 1 cycle. If producer is in MEM, it forwards.
          let dataReadyForID;
          if (parsedInstructions[producerIdx].opcode === 'LW') {
            dataReadyForID = pMEM + 1; // Needs to finish MEM
          } else {
            dataReadyForID = pEX + 1; // Needs to finish EX
          }
          // ID must be at or after dataReadyForID
          stageTimings[i][1] = Math.max(stageTimings[i][1], dataReadyForID);
          exCycle = stageTimings[i][1] + 1;
        } else {
          // Normal instruction in EX needs data
          let dataReadyForEX;
          if (parsedInstructions[producerIdx].opcode === 'LW') {
            // Load-Use hazard: 1 cycle stall
            dataReadyForEX = pMEM + 1; 
          } else {
            // R-type: Forwarded from EX or MEM
            dataReadyForEX = pEX + 1;
          }
          exCycle = Math.max(exCycle, dataReadyForEX);
        }
      } else {
        // No Forwarding: wait until WB (split-cycle assumes ID can read in WB)
        let dataReadyForID = pWB; 
        stageTimings[i][1] = Math.max(stageTimings[i][1], dataReadyForID);
        exCycle = stageTimings[i][1] + 1;
      }
    }

    // Ensure structural hazard: EX must be after previous EX
    exCycle = Math.max(exCycle, stageTimings[i - 1][2] + 1);
    
    stageTimings[i][2] = exCycle;

    // Fill MEM and WB
    for (let s = 3; s < numStages; s++) {
      stageTimings[i][s] = Math.max(stageTimings[i][s - 1] + 1, stageTimings[i - 1][s] + 1);
    }

    // If ID was delayed (stalled), we might need to "stall" the IF of following instructions.
    // However, in this simple scheduler, we'll re-adjust the timings if needed in the next iteration.
  }

  // Build schedule grid
  const lastInstr = stageTimings[numInstr - 1];
  const maxCycle = Math.max(...stageTimings.map(t => t[numStages - 1]));

  const schedule = Array.from({ length: numInstr }, () =>
    new Array(maxCycle).fill(null)
  );

  for (let i = 0; i < numInstr; i++) {
    const timings = stageTimings[i];
    for (let s = 0; s < numStages; s++) {
      schedule[i][timings[s] - 1] = STAGES[s];
    }

    // Fill stalls
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