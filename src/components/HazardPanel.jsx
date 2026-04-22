import React from 'react';

export default function HazardPanel({ hazards, forwardingEnabled }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-3 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-widest text-pink-500 font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          Hazard Diagnostics
        </h3>
        <div className="text-[9px] text-gray-500 font-mono">
          LOG_CAPTURE_TIMESTAMP: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 custom-scrollbar">
        {hazards.length === 0 ? (
          <div className="h-full flex items-center">
            <div className="text-[10px] font-mono text-gray-600 italic">
              NO CONFLICTS DETECTED. NOMINAL OPERATION.
            </div>
          </div>
        ) : (
          <div className="flex gap-4 h-full">
            {hazards.map((hazard, index) => (
              <div
                key={`${hazard.consumerId}-${hazard.register}-${index}`}
                className="w-72 shrink-0 p-3 rounded-lg bg-red-500/5 border border-red-500/20 flex flex-col justify-center"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-tight">
                    RAW Hazard
                  </span>
                  <span className="text-[9px] font-mono text-gray-500">#{index + 1}</span>
                </div>
                <div className="text-xs text-gray-300 font-mono leading-relaxed">
                  <span className="text-cyan-400 font-bold">{hazard.consumerId}</span> depends on 
                  <span className="text-pink-400 font-bold"> {hazard.register} </span> 
                  from <span className="text-purple-400 font-bold">{hazard.producerId}</span>.
                </div>
                
                {forwardingEnabled ? (
                  <div className="mt-2 text-[9px] text-green-400/80 flex items-center gap-1 font-mono">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Forwarding active
                  </div>
                ) : (
                  <div className="mt-2 text-[9px] text-amber-400/80 flex items-center gap-1 font-mono">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    Stall inserted
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
