import React from 'react';
import { validateInstruction } from '../utils/validators';
import { TEST_CASES } from '../utils/constants';

export default function InstructionPanel({ instructions, setInstructions, onReset }) {
  const addInstruction = () => {
    if (instructions.length < 10) {
      setInstructions([...instructions, '']);
    }
  };

  const removeInstruction = (index) => {
    const newInstr = instructions.filter((_, i) => i !== index);
    setInstructions(newInstr);
    onReset();
  };

  const updateInstruction = (index, value) => {
    const newInstr = [...instructions];
    newInstr[index] = value;
    setInstructions(newInstr);
    onReset();
  };

  const loadTestCase = (testCase) => {
    setInstructions(testCase.instructions);
    onReset();
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-widest text-cyan-400 font-bold">
          Instruction Deck
        </h3>
        <span className="text-[10px] font-mono text-gray-500">
          {instructions.length} / 10
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 min-h-[300px]">
        {instructions.map((instr, index) => {
          const validation = validateInstruction(instr);
          return (
            <div
              key={index}
              className="relative group"
            >
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-mono text-cyan-500/50 w-4">
                  I{index + 1}
                </div>
                <input
                  type="text"
                  value={instr}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder="e.g. ADD R1, R2, R3"
                  className={`neon-input flex-1 ${!validation.valid && instr ? 'error' : ''}`}
                />
                <button
                  onClick={() => removeInstruction(index)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                </button>
              </div>
              {!validation.valid && instr && (
                <div className="text-[10px] text-red-400 mt-1 ml-6 font-mono">
                  {validation.error}
                </div>
              )}
            </div>
          );
        })}

        {instructions.length < 10 && (
          <button
            onClick={addInstruction}
            className="w-full py-2 border border-dashed border-cyan-500/30 rounded-lg text-[10px] text-cyan-500/60 uppercase tracking-widest hover:border-cyan-500/60 hover:text-cyan-400 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            Add Instruction
          </button>
        )}
      </div>

      <div className="pt-4 border-t border-cyan-500/10">
        <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">
          Pre-load Templates
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {TEST_CASES.map((tc, i) => (
            <button
              key={i}
              onClick={() => loadTestCase(tc)}
              className="text-left py-1.5 px-3 rounded bg-cyan-500/5 hover:bg-cyan-500/15 border border-cyan-500/10 text-[10px] text-cyan-300/80 transition-colors truncate"
            >
              {tc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
