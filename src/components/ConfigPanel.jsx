export default function ConfigPanel({ 
  pipelineType, 
  setPipelineType, 
  forwardingEnabled, 
  setForwardingEnabled 
}) {
  return (
    <div className="glass-card p-4 flex flex-col gap-4">
      <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
        System Configuration
      </h3>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-gray-400">Architecture</label>
        <select 
          value={pipelineType}
          onChange={(e) => setPipelineType(e.target.value)}
          className="neon-select w-full"
        >
          <option value="5-stage">5-Stage (MIPS Classic)</option>
          <option value="4-stage">4-Stage (Combined MEM/WB)</option>
        </select>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col">
          <label className="text-xs font-mono text-gray-400">Data Forwarding</label>
          <span className="text-[10px] text-gray-500">Bypass register file</span>
        </div>
        
        <div 
          className={`toggle-switch ${forwardingEnabled ? 'active' : ''}`}
          onClick={() => setForwardingEnabled(!forwardingEnabled)}
        >
          <div className="toggle-knob" />
        </div>
      </div>
    </div>
  );
}
