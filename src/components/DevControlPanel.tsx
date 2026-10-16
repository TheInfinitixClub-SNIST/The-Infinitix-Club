import React from 'react';
import {
  Sliders,
  X,
  RotateCcw,
  Sparkles,
  Zap,
  Palette,
  Eye,
  Compass,
  Gauge,
  Clock,
  Sun,
  Moon,
} from 'lucide-react';

export interface DevCustomizerState {
  primaryColor: string;
  secondaryColor: string;
  useCustomAngle: boolean;
  customAngleDeg: number;
  intensityPercent: number;
  spreadAngleDeg: number;
  animationSpeedSec: number;
  particleCount: number;
  twinkleRate: number;
  idleMotion: boolean;
  showParticles: boolean;
}

interface DevControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  state: DevCustomizerState;
  onChange: (updated: Partial<DevCustomizerState>) => void;
  onReset: () => void;
  isIlluminated?: boolean;
  onToggleIlluminate?: () => void;
}

export const DevControlPanel: React.FC<DevControlPanelProps> = ({
  isOpen,
  onClose,
  state,
  onChange,
  onReset,
  isIlluminated = false,
  onToggleIlluminate,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Lighting and Physics Live Customizer"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md h-full bg-[#0b0d19]/95 border-l border-white/15 shadow-2xl backdrop-blur-2xl p-6 overflow-y-auto flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Live Lighting Customizer
                </h3>
                <p className="text-[11px] text-slate-400">
                  Instant canvas update · Real-time physics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                title="Reset to default settings"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Reset settings"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Controls Sections */}
          <div className="mt-6 space-y-6">
            {/* 0. Illuminate Atmosphere Switch */}
            {onToggleIlluminate && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-400/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                    {isIlluminated ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-cyan-300" />}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Illuminate Room Mode
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isIlluminated ? 'Radiant high-power illumination' : 'Deep midnight cosmic mode'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isIlluminated}
                  onClick={onToggleIlluminate}
                  className={`relative w-11 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${
                    isIlluminated
                      ? 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                      : 'bg-white/15'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-md ${
                      isIlluminated ? 'translate-x-5 shadow-[0_0_10px_#00f2fe]' : 'translate-x-0 bg-slate-300'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* 1. Beam Chromatic Colors */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-3">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <span>Beam Color Palette</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Primary Beam Color */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                    Primary Core Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.primaryColor}
                      onChange={(e) => onChange({ primaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input
                      type="text"
                      value={state.primaryColor}
                      onChange={(e) => onChange({ primaryColor: e.target.value })}
                      className="w-full text-xs font-mono uppercase bg-black/40 border border-white/10 rounded-md px-2 py-1 text-slate-200"
                    />
                  </div>
                </div>

                {/* Secondary Beam Color */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                    Secondary Ambient Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.secondaryColor}
                      onChange={(e) => onChange({ secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input
                      type="text"
                      value={state.secondaryColor}
                      onChange={(e) => onChange({ secondaryColor: e.target.value })}
                      className="w-full text-xs font-mono uppercase bg-black/40 border border-white/10 rounded-md px-2 py-1 text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Beam Angle & Rotation */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Beam Angle & Rotation</span>
                </div>
                <button
                  onClick={() => onChange({ useCustomAngle: !state.useCustomAngle })}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium border transition-colors ${
                    state.useCustomAngle
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200'
                      : 'bg-white/5 border-white/15 text-slate-400'
                  }`}
                >
                  {state.useCustomAngle ? 'Custom Angle Active' : 'Natural Diagonal (~145°)'}
                </button>
              </div>

              {state.useCustomAngle && (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Angle Degrees</span>
                    <span className="font-mono text-cyan-400">{state.customAngleDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={state.customAngleDeg}
                    onChange={(e) => onChange({ customAngleDeg: parseInt(e.target.value, 10) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0° (Right)</span>
                    <span>90° (Down)</span>
                    <span>180° (Left)</span>
                    <span>270° (Up)</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Intensity & Spread Sliders */}
            <div className="space-y-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
              {/* Intensity */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Beam Intensity & Opacity
                  </span>
                  <span className="font-mono text-cyan-400 tabular-nums">
                    {state.intensityPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={state.intensityPercent}
                  onChange={(e) => onChange({ intensityPercent: parseInt(e.target.value, 10) })}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                />
              </div>

              {/* Spread Angle */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    Beam Spread (Narrow to Ultra-Wide)
                  </span>
                  <span className="font-mono text-cyan-400 tabular-nums">
                    {state.spreadAngleDeg}°
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="75"
                  step="1"
                  value={state.spreadAngleDeg}
                  onChange={(e) => onChange({ spreadAngleDeg: parseInt(e.target.value, 10) })}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                />
              </div>

              {/* Animation Speed Loop */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Breathing Cycle Duration
                  </span>
                  <span className="font-mono text-cyan-400 tabular-nums">
                    {state.animationSpeedSec}s loop
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={state.animationSpeedSec}
                  onChange={(e) => onChange({ animationSpeedSec: parseInt(e.target.value, 10) })}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Fast (5s)</span>
                  <span>Tranquil (14s)</span>
                  <span>Meditative (30s)</span>
                </div>
              </div>
            </div>

            {/* 4. Particles & Twinkle */}
            <div className="space-y-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Floating Stardust Particles
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={state.showParticles}
                  onClick={() => onChange({ showParticles: !state.showParticles })}
                  className={`relative w-8 h-4 rounded-full p-0.5 transition-colors ${
                    state.showParticles ? 'bg-cyan-500' : 'bg-white/15'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      state.showParticles ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {state.showParticles && (
                <>
                  {/* Particle Count */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Particle Count</span>
                      <span className="font-mono text-cyan-400 tabular-nums">
                        {state.particleCount} particles
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      step="5"
                      value={state.particleCount}
                      onChange={(e) => onChange({ particleCount: parseInt(e.target.value, 10) })}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Twinkle Rate */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Twinkle Fade Rate</span>
                      <span className="font-mono text-cyan-400 tabular-nums">
                        {state.twinkleRate.toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.1"
                      value={state.twinkleRate}
                      onChange={(e) => onChange({ twinkleRate: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Live Canvas Reactivity</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
