import React from 'react';

export default function PipelineCell({ stage, isVisible, isActive, forwardingType }) {
  if (!stage) {
    return <div className="w-[72px] h-[52px]" />; // Spacer
  }

  const getCellClass = () => {
    if (stage === 'STALL' || stage === 'BUBBLE') return 'cell-STALL';
    if (stage === 'MEM/WB') return 'cell-MEMWB';
    return `cell-${stage}`;
  };

  if (!isVisible) {
    return <div className="w-[72px] h-[52px]" />;
  }

  return (
    <div
      className={`pipeline-cell w-[72px] h-[52px] ${getCellClass()} ${isActive ? 'shadow-[0_0_15px_rgba(255,255,255,0.1)] brightness-110' : ''} ${forwardingType ? 'pipeline-cell-forwarded' : ''}`}
    >
      {stage}
      {forwardingType && (
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center text-[8px] text-black font-bold shadow-lg" title={`Forwarded via ${forwardingType}`}>
          F
        </span>
      )}
    </div>
  );
}
