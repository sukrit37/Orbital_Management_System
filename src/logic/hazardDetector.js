// hazardDetector.js

export function detectHazards(parsedInstructions) {
  const hazards = [];

  for (let i = 0; i < parsedInstructions.length; i++) {
    const consumer = parsedInstructions[i];
    const isBranch = consumer.type === 'B';

    for (const srcReg of consumer.src) {
      for (let j = i - 1; j >= 0; j--) {
        const producer = parsedInstructions[j];

        if (producer.dest && producer.dest === srcReg) {
          hazards.push({
            consumerIdx: i,
            producerIdx: j,
            consumerId: consumer.id,
            producerId: producer.id,
            register: srcReg,
            producerOpcode: producer.opcode,
            isBranchHazard: isBranch
          });

          break;
        }
      }
    }
  }

  return hazards;
}