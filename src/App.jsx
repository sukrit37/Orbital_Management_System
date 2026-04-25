import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import InstructionPanel from './components/InstructionPanel';
import ConfigPanel from './components/ConfigPanel';
import ControlBar from './components/ControlBar';
import PipelineGrid from './components/PipelineGrid';
import HazardPanel from './components/HazardPanel';

import { parseInstructions } from './logic/parser';
import { detectHazards } from './logic/hazardDetector';
import { buildSchedule } from './logic/scheduler';
import { identifyForwardingPaths } from './logic/forwarder';
import { validateAllInstructions } from './utils/validators';

function App() {
  const [instructions, setInstructions] = useState(['ADD R1, R2, R3', 'SUB R4, R1, R5']);
  const [pipelineType, setPipelineType] = useState('5-stage');
  const [forwardingEnabled, setForwardingEnabled] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(700);

  // Derived state
  const { schedule, hazards, forwardingPaths } = useMemo(() => {
    const { valid } = validateAllInstructions(instructions);
    if (!valid) return { schedule: [], hazards: [], forwardingPaths: [] };

    const parsed = parseInstructions(instructions);
    const detectedHazards = detectHazards(parsed);
    const computedSchedule = buildSchedule(parsed, detectedHazards, pipelineType, forwardingEnabled);
    const computedPaths = identifyForwardingPaths(detectedHazards, computedSchedule, pipelineType, forwardingEnabled);
    
    return {
      schedule: computedSchedule,
      hazards: detectedHazards,
      forwardingPaths: computedPaths
    };
  }, [instructions, pipelineType, forwardingEnabled]);

  const totalCycles = schedule.length > 0 ? schedule[0].length : 0;
  const isComplete = currentCycle >= totalCycles;

  const handleStep = useCallback(() => {
    if (currentCycle < totalCycles) {
      setCurrentCycle(prev => prev + 1);
    } else {
      setIsRunning(false);
    }
  }, [currentCycle, totalCycles]);

  const handleReset = useCallback(() => {
    setCurrentCycle(0);
    setIsRunning(false);
  }, []);

  const toggleRun = useCallback(() => {
    if (isComplete) {
      setCurrentCycle(0);
      setIsRunning(true);
    } else {
      setIsRunning(prev => !prev);
    }
  }, [isComplete]);

  // Auto-run effect
  useEffect(() => {
    let timer;
    if (isRunning && !isComplete) {
      timer = setInterval(handleStep, speed);
    } else if (isComplete) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, isComplete, handleStep, speed]);

  return (
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden">
      <Navbar />

      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Sidebar */}
        <div className="w-80 flex flex-col gap-6 shrink-0 h-full overflow-y-auto pr-2 custom-scrollbar">
          <div className="shrink-0">
            <ConfigPanel
              pipelineType={pipelineType}
              setPipelineType={(val) => { setPipelineType(val); handleReset(); }}
              forwardingEnabled={forwardingEnabled}
              setForwardingEnabled={(val) => { setForwardingEnabled(val); handleReset(); }}
            />
          </div>
          <div className="shrink-0 min-h-[500px]">
            <InstructionPanel
              instructions={instructions}
              setInstructions={setInstructions}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 min-h-0 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
          <ControlBar
            currentCycle={currentCycle}
            onStep={handleStep}
            onRun={toggleRun}
            onReset={handleReset}
            isRunning={isRunning}
            isComplete={isComplete}
            speed={speed}
            setSpeed={setSpeed}
          />

          <div className="shrink-0">
            <PipelineGrid
              instructions={instructions}
              schedule={schedule}
              currentCycle={currentCycle}
              forwardingPaths={forwardingPaths}
            />
          </div>

          <div className="h-48 shrink-0">
            <HazardPanel
              hazards={hazards}
              forwardingEnabled={forwardingEnabled}
            />
          </div>
        </div>
      </main>

      {/* Footer / Status bar */}
      <footer className="h-8 border-t border-cyan-500/10 px-6 flex items-center justify-between text-[9px] font-mono text-gray-600 bg-bg-secondary/50">
        <div className="flex gap-4">
          <span>PIPELINE_MODE: {pipelineType.toUpperCase()}</span>
          <span>FORWARDING: {forwardingEnabled ? 'ON' : 'OFF'}</span>
          <span>BUFFER_LIMIT: 10_INSTR</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
          <span>SIMULATION_ENGINE_v1.0.4</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
