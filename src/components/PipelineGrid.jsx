import React, { useEffect, useRef, useMemo } from 'react';
import PipelineCell from './PipelineCell';

export default function PipelineGrid({ 
  instructions, 
  schedule, 
  nonForwardingSchedule,
  currentCycle,
  forwardingPaths 
}) {
  const viewportRef = useRef(null);
  const rowRefs = useRef([]);
  const numCycles = schedule?.[0]?.length ?? 0;
  
  const forwardingTargets = new Map(
    forwardingPaths.map((path) => [`${path.toRow}-${path.toCol}`, path.type])
  );


  let activeRowIndex = -1;
  if (schedule && currentCycle > 0) {
    for (let i = schedule.length - 1; i >= 0; i--) {
      const row = schedule[i];
      const hasVisibleStage = row.some((stage, cycleIdx) => stage && cycleIdx < currentCycle);
      if (hasVisibleStage) {
        activeRowIndex = i;
        break;
      }
    }
  }

  useEffect(() => {
    if (activeRowIndex < 0) return;

    const viewport = viewportRef.current;
    const row = rowRefs.current[activeRowIndex];
    if (!viewport || !row) return;

    const rowTop = row.offsetTop;
    const rowBottom = rowTop + row.offsetHeight;
    const viewportTop = viewport.scrollTop;
    const viewportBottom = viewportTop + viewport.clientHeight;

    if (rowBottom > viewportBottom - 16) {
      viewport.scrollTo({
        top: rowBottom - viewport.clientHeight + 16,
        behavior: 'smooth'
      });
    } else if (rowTop < viewportTop + 16) {
      viewport.scrollTo({
        top: Math.max(rowTop - 16, 0),
        behavior: 'smooth'
      });
    }
  }, [activeRowIndex, currentCycle]);

  if (!schedule || schedule.length === 0) {
    return (
      <div className="glass-card min-h-[420px] flex items-center justify-center border-dashed">
        <div className="text-gray-600 font-mono text-sm animate-pulse">
          READY FOR INPUT...
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col overflow-hidden">
      <div className="shrink-0 px-6 pt-4 pb-3 border-b border-cyan-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-400/80">
              Simulation Viewport
            </div>
          </div>
          <div className="text-[10px] font-mono text-gray-500">
            Scroll down to view more instructions
          </div>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="max-h-[70vh] overflow-x-auto overflow-y-scroll px-6 pb-6 pt-4 relative simulation-scrollbar"
      >
        <div className="min-w-max relative">
          {/* Header: Cycle numbers */}
          <div className="sticky top-0 z-10 flex mb-4 pb-3 bg-[rgba(10,14,26,0.92)] backdrop-blur-sm">
            <div className="w-20 shrink-0" /> {/* Spacer for instr labels */}
            <div className="flex gap-4">
              {Array.from({ length: numCycles }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-[72px] text-center text-[10px] font-mono transition-colors ${
                    i + 1 === currentCycle ? 'text-cyan-400 font-bold' : 'text-gray-600'
                  }`}
                >
                  C{(i + 1).toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          {/* Forwarding Arrows SVG Layer */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(245, 158, 11, 0.8)" />
              </marker>
            </defs>
            {forwardingPaths.map((path, idx) => {
              if (path.toCol >= currentCycle) return null;
              
              // X positions: 80 (label) + col * (72 cell + 16 gap)
              const fromX = 80 + path.fromCol * 88 + 72; // Right edge of source cell
              const toX = 80 + path.toCol * 88; // Left edge of dest cell
              
              // Y positions: 44 (header) + row * (52 cell + 16 gap) + 26 (half cell)
              const fromY = 44 + path.fromRow * 68 + 26;
              const toY = 44 + path.toRow * 68 + 26;

              const midX = (fromX + toX) / 2;

              return (
                <path
                  key={`path-${idx}`}
                  d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
                  stroke="rgba(245, 158, 11, 0.6)"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="forwarding-path-animate"
                />
              );
            })}
          </svg>

          {/* Rows: Instructions */}
          <div className="space-y-4 relative">
            {schedule.map((row, instrIdx) => (
              <div
                key={instrIdx}
                ref={(element) => { rowRefs.current[instrIdx] = element; }}
                className="flex items-center group"
              >
                {/* Instruction Label */}
                <div className="w-20 shrink-0 pr-4 relative">
                  <div className="text-[10px] font-bold text-cyan-500/70 font-mono">
                    I{instrIdx + 1}
                  </div>
                  <div className="text-[9px] text-gray-500 truncate font-mono max-w-full">
                    {instructions[instrIdx]}
                  </div>
                </div>

                {/* Grid Cells */}
                <div className="flex gap-4 relative">

                  {row.map((stage, cycleIdx) => (
                    <PipelineCell
                      key={cycleIdx}
                      stage={stage}
                      isVisible={cycleIdx < currentCycle}
                      isActive={cycleIdx + 1 === currentCycle}
                      forwardingType={forwardingTargets.get(`${instrIdx}-${cycleIdx}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Active cycle highlight bar */}
          {currentCycle > 0 && currentCycle <= numCycles && (
            <div
              style={{ transform: `translateX(${80 + (currentCycle - 1) * (72 + 16)}px)` }}
              className="absolute top-[4.25rem] bottom-6 w-[72px] active-cycle-col rounded-xl pointer-events-none transition-transform duration-300 z-30"
            />
          )}
        </div>
      </div>
    </div>
  );
}
