export function identifyForwardingPaths(hazards, schedule, pipelineType, forwardingEnabled) {
  if (!forwardingEnabled) return [];

  const paths = [];

  for (const h of hazards) {
    const producerRow = h.producerIdx;
    const consumerRow = h.consumerIdx;

    const producerEX = schedule[producerRow].indexOf('EX');
    const producerMEM = schedule[producerRow].indexOf(
      pipelineType === '5-stage' ? 'MEM' : 'MEM/WB'
    );
    const producerWB = schedule[producerRow].indexOf(
      pipelineType === '5-stage' ? 'WB' : 'MEM/WB'
    );

    if (h.isBranchHazard) {
      const consumerID = schedule[consumerRow].indexOf('ID');
      if (producerMEM !== -1 && producerMEM + 1 === consumerID) {
        paths.push({
          fromRow: producerRow,
          fromCol: producerMEM,
          toRow: consumerRow,
          toCol: consumerID,
          type: 'MEM->ID'
        });
      } else if (producerEX !== -1 && producerEX + 1 === consumerID) {
        paths.push({
          fromRow: producerRow,
          fromCol: producerEX,
          toRow: consumerRow,
          toCol: consumerID,
          type: 'EX->ID'
        });
      }
    } else {
      const consumerEX = schedule[consumerRow].indexOf('EX');
      if (producerEX === -1 || consumerEX === -1) continue;

      if (h.producerOpcode === 'LW') {
        if (producerMEM + 1 === consumerEX) {
          paths.push({
            fromRow: producerRow,
            fromCol: producerMEM,
            toRow: consumerRow,
            toCol: consumerEX,
            type: 'MEM->EX'
          });
        }
      } else {
        if (producerEX + 1 === consumerEX) {
          paths.push({
            fromRow: producerRow,
            fromCol: producerEX,
            toRow: consumerRow,
            toCol: consumerEX,
            type: 'EX->EX'
          });
        } else if (producerMEM + 1 === consumerEX) {
          paths.push({
            fromRow: producerRow,
            fromCol: producerMEM,
            toRow: consumerRow,
            toCol: consumerEX,
            type: 'MEM->EX'
          });
        }
      }
    }
  }

  return paths;
}