import React from 'react';

export default function ControlBar({ 
  currentCycle, 
  onStep, 
  onRun, 
  onReset, 
  isRunning, 
  isComplete,
  speed,
  setSpeed
}) {
  return (
    <div className="glass-card p-4 flex items-center justify-between w-full">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Current Cycle</span>
          <div className="text-2xl font-mono text-glow-cyan text-white">
            {currentCycle.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="h-10 w-[1px] bg-cyan-500/20" />

        <div className="flex items-center gap-3">
          <button 
            onClick={onStep}
            disabled={isRunning || isComplete}
            className="neon-btn neon-btn-cyan flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 4 7 8-7 8"/><path d="m12 4 7 8-7 8"/></svg>
            Step
          </button>
          <button 
            onClick={onRun}
            className={`neon-btn ${isRunning ? 'neon-btn-amber' : 'neon-btn-green'} flex items-center gap-2 min-w-[80px] justify-center`}
          >
            {isRunning ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
                Pause
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run
              </>
            )}
          </button>
          <button 
            onClick={onReset}
            className="neon-btn neon-btn-red flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reset
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Execution Speed</span>
          <div className="flex items-center gap-2">
            {[350, 700, 1200].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`text-[9px] px-2 py-0.5 rounded border transition-all ${
                  speed === s 
                    ? 'border-cyan-500/60 bg-cyan-500/20 text-cyan-300' 
                    : 'border-gray-500/20 text-gray-500 hover:border-gray-500/40'
                }`}
              >
                {s === 350 ? 'FAST' : s === 700 ? 'NORM' : 'SLOW'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
