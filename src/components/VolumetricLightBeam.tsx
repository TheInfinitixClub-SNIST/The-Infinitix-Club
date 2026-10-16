import React, { useEffect, useRef } from 'react';

export interface VolumetricLightBeamProps {
  /** Mode: 'dark' (default cosmic beam) or 'illuminated' (boosted radiant beam) */
  isIlluminated?: boolean;
  /** Primary core color (e.g. electric cyan #00f2fe) */
  coreColor?: string;
  /** Secondary gradient color (e.g. neon violet/purple #8a2be2) */
  secondaryColor?: string;
  /** Base canvas solid background color (default #0b0d19) */
  backgroundColor?: string;
  /** Multiplier for overall beam brightness/opacity (0.1 to 1.5) */
  intensityMultiplier?: number;
  /** Beam cone spread in degrees (default ~42°) */
  spreadAngleDeg?: number;
  /** Custom fixed angle in degrees (0° - 360°). If null/undefined, uses natural diagonal to bottom-left */
  customAngleDeg?: number | null;
  /** Breathing loop duration in seconds (5s to 30s, default 14s) */
  cycleDurationSec?: number;
  /** Number of floating star dust particles (20 to 200, default 88) */
  particleCount?: number;
  /** Twinkle speed multiplier (0.2x to 3.0x, default 1.0) */
  twinkleRate?: number;
  /** Whether idle breathing motion is active (default true) */
  idleMotion?: boolean;
  /** Whether floating star/dust particles are rendered (default true) */
  showParticles?: boolean;
  /** Optional custom origin coordinates {x, y} in pixels. If omitted, uses top-right anchor */
  originOverride?: { x: number; y: number } | null;
  /** Callback notifying parent of the calculated light origin {x, y} */
  onOriginUpdate?: (origin: { x: number; y: number }) => void;
  /** Custom class name for container */
  className?: string;
}

interface StarParticle {
  x: number;          // 0 to 1 normalized
  y: number;          // 0 to 1 normalized
  radius: number;     // pixel radius (subtle, 0.65 - 1.6px)
  speedY: number;     // lazy upward drift
  speedX: number;     // gentle horizontal drift
  twinkleFreq: number;// slow frequency for soft, meditative fades
  twinklePhase: number;
  driftPhase: number;
}

/**
 * VolumetricLightBeam
 * 
 * Meditative, ultra-smooth volumetric spotlight component.
 * - Dynamic live-customizable parameters (colors, angle, intensity, spread, speed, particles).
 * - Fixed diagonal or custom angle orientation with tiny hypnotic drift.
 * - Seamless harmonic morphing between core color and secondary color.
 * - Gentle floating stardust drifting lazily upward with soft 0.2 - 0.8 opacity transitions.
 */
export const VolumetricLightBeam: React.FC<VolumetricLightBeamProps> = ({
  isIlluminated = false,
  coreColor = '#00f2fe',
  secondaryColor = '#8a2be2',
  backgroundColor = '#0b0d19',
  intensityMultiplier = 1.0,
  spreadAngleDeg = 42,
  customAngleDeg = null,
  cycleDurationSec = 14,
  particleCount = 88,
  twinkleRate = 1.0,
  idleMotion = true,
  showParticles = true,
  originOverride = null,
  onOriginUpdate,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Dynamic state tracked for ultra-smooth breathing and physics
  const stateRef = useRef({
    currentIntensity: isIlluminated ? 1.4 : 0.95,
    targetIntensity: isIlluminated ? 1.4 : 0.95,
    currentSpread: (spreadAngleDeg * Math.PI) / 180,
    targetSpread: (spreadAngleDeg * Math.PI) / 180,
    currentAngle: 2.45,
    originX: 0,
    originY: 0,
    startTime: performance.now(),
    particles: [] as StarParticle[],
  });

  // Re-generate or adjust particle count dynamically
  useEffect(() => {
    const current = stateRef.current.particles;
    const targetCount = Math.max(15, Math.min(250, particleCount));
    
    if (current.length === targetCount) return;

    if (current.length < targetCount) {
      const added: StarParticle[] = [];
      for (let i = current.length; i < targetCount; i++) {
        added.push({
          x: Math.random(),
          y: Math.random(),
          radius: 0.65 + Math.random() * 0.95,
          speedY: -(0.000035 + Math.random() * 0.000055),
          speedX: (Math.random() - 0.5) * 0.000025,
          twinkleFreq: 0.20 + Math.random() * 0.26,
          twinklePhase: Math.random() * Math.PI * 2,
          driftPhase: Math.random() * Math.PI * 2,
        });
      }
      stateRef.current.particles = [...current, ...added];
    } else {
      stateRef.current.particles = current.slice(0, targetCount);
    }
  }, [particleCount]);

  // Keep target spread & intensity updated when props change
  useEffect(() => {
    stateRef.current.targetIntensity = (isIlluminated ? 1.4 : 0.95) * intensityMultiplier;
    stateRef.current.targetSpread = (spreadAngleDeg * Math.PI) / 180;
  }, [isIlluminated, intensityMultiplier, spreadAngleDeg]);

  // Sync CSS custom properties on document element
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--beam-intensity', String(isIlluminated ? 1.4 * intensityMultiplier : 0.95 * intensityMultiplier));
    root.style.setProperty('--beam-core-color', coreColor);
    root.style.setProperty('--beam-secondary-color', secondaryColor);
    root.style.setProperty('--bg-navy', backgroundColor);
    root.style.setProperty('--illuminate-state', isIlluminated ? 'illuminated' : 'dark');
  }, [isIlluminated, coreColor, secondaryColor, backgroundColor, intensityMultiplier]);

  // Main high-performance render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const defaultOriginX = width - Math.max(64, width * 0.055);
      const defaultOriginY = Math.max(48, height * 0.055);

      const ox = originOverride ? originOverride.x : defaultOriginX;
      const oy = originOverride ? originOverride.y : defaultOriginY;

      stateRef.current.originX = ox;
      stateRef.current.originY = oy;

      if (onOriginUpdate) {
        onOriginUpdate({ x: ox, y: oy });
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Render step
    const render = (now: number) => {
      const state = stateRef.current;
      const time = (now - state.startTime) * 0.001;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // 1. Calculate base angle: either user custom angle or natural diagonal
      let baseAngle: number;
      if (customAngleDeg !== null && customAngleDeg !== undefined) {
        baseAngle = (customAngleDeg * Math.PI) / 180;
      } else {
        const targetPointX = width * 0.12;
        const targetPointY = height * 0.88;
        baseAngle = Math.atan2(targetPointY - state.originY, targetPointX - state.originX);
      }

      // 2. Slow, meditative breathing loop duration
      const period = Math.max(4, cycleDurationSec);
      const cyclePhase = (time * (Math.PI * 2)) / period;

      // Hypnotic angle drift: ±0.9° across the cycle
      const angleDriftDeg = 0.9;
      const idleAngleDrift = idleMotion ? Math.sin(cyclePhase) * (angleDriftDeg * (Math.PI / 180)) : 0;
      const targetAngle = baseAngle + idleAngleDrift;

      // Smooth dampening for angle transitions
      state.currentAngle += (targetAngle - state.currentAngle) * 0.08;
      const angle = state.currentAngle;

      // Gentle rhythmic breathing on spread and reach
      const breathSine = Math.sin(cyclePhase - Math.PI / 4);
      const idleSpreadDrift = idleMotion ? breathSine * 0.038 : 0;
      const reachFactor = idleMotion ? 1 + Math.sin(cyclePhase) * 0.03 : 1;
      const idleBreathingIntensity = idleMotion ? Math.sin(cyclePhase) * 0.045 : 0;

      // Smooth dampening for intensity & spread adjustments
      state.currentIntensity += (state.targetIntensity - state.currentIntensity) * 0.05;
      state.currentSpread += (state.targetSpread - state.currentSpread) * 0.04;

      const intensity = Math.max(0.05, state.currentIntensity * (1 + idleBreathingIntensity));
      const spread = Math.max(0.1, state.currentSpread * (1 + idleSpreadDrift));
      const halfSpread = spread / 2;

      // Morphing color blend parameter: smoothly shifts stops between core and secondary colors
      const colorMorph = idleMotion ? 0.5 + 0.5 * Math.sin(cyclePhase + Math.PI / 3) : 0.5;

      // Dynamic blur adjustments
      const blurPass1 = Math.round(64 + (idleMotion ? breathSine * 8 : 0));
      const blurPass2 = Math.round(30 + (idleMotion ? breathSine * 4 : 0));
      const blurPass3 = Math.round(14 + (idleMotion ? breathSine * 2 : 0));

      // Setup drawing transform for HiDPI
      ctx.save();
      ctx.scale(dpr, dpr);

      // 3. Solid velvety base background (deep midnight navy #0b0d19)
      if (isIlluminated) {
        ctx.fillStyle = '#0e1122';
      } else {
        ctx.fillStyle = backgroundColor;
      }
      ctx.fillRect(0, 0, width, height);

      const ox = state.originX;
      const oy = state.originY;
      const reach = Math.hypot(width, height) * 1.45 * reachFactor;

      // Helper to draw a cone polygon sector with curved perimeter
      const drawConePath = (coneHalfAngle: number) => {
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        const steps = 22;
        const startA = angle - coneHalfAngle;
        const endA = angle + coneHalfAngle;
        for (let i = 0; i <= steps; i++) {
          const a = startA + (endA - startA) * (i / steps);
          const px = ox + Math.cos(a) * reach;
          const py = oy + Math.sin(a) * reach;
          ctx.lineTo(px, py);
        }
        ctx.closePath();
      };

      // PASS 1: Broad Velvety Ambient Fog / Bloom
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      if ('filter' in ctx) {
        ctx.filter = `blur(${blurPass1}px)`;
      }
      drawConePath(halfSpread * 1.62);
      const gradAmbient = ctx.createRadialGradient(ox, oy, 10, ox, oy, reach * 0.96);
      gradAmbient.addColorStop(0.0, hexToRgba(coreColor, 0.30 * intensity));
      const ambientStop = 0.32 + colorMorph * 0.08;
      gradAmbient.addColorStop(ambientStop, hexToRgba(secondaryColor, 0.20 * intensity));
      gradAmbient.addColorStop(0.72, hexToRgba(secondaryColor, 0.07 * intensity));
      gradAmbient.addColorStop(1.0, 'rgba(11, 13, 25, 0)');
      ctx.fillStyle = gradAmbient;
      ctx.fill();
      ctx.restore();

      // PASS 2: Main Volumetric Spotlight Body
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      if ('filter' in ctx) {
        ctx.filter = `blur(${blurPass2}px)`;
      }
      drawConePath(halfSpread);
      const gradMain = ctx.createRadialGradient(ox, oy, 5, ox, oy, reach * 0.86);
      gradMain.addColorStop(0.00, hexToRgba(coreColor, 0.86 * intensity));
      
      const cyanFalloff = 0.12 + colorMorph * 0.06;
      const intermediateStop = 0.30 + colorMorph * 0.08;
      const violetStop = 0.52 + colorMorph * 0.06;

      gradMain.addColorStop(cyanFalloff, hexToRgba(coreColor, 0.70 * intensity));
      gradMain.addColorStop(intermediateStop, hexToRgba('#5845eb', 0.52 * intensity));
      gradMain.addColorStop(violetStop, hexToRgba(secondaryColor, 0.38 * intensity));
      gradMain.addColorStop(0.78, hexToRgba(secondaryColor, 0.13 * intensity));
      gradMain.addColorStop(1.00, 'rgba(11, 13, 25, 0)');
      ctx.fillStyle = gradMain;
      ctx.fill();
      ctx.restore();

      // PASS 3: Core Concentrated Highlight Beam
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      if ('filter' in ctx) {
        ctx.filter = `blur(${blurPass3}px)`;
      }
      drawConePath(halfSpread * 0.44);
      const gradCore = ctx.createRadialGradient(ox, oy, 0, ox, oy, reach * 0.65);
      gradCore.addColorStop(0.00, hexToRgba('#ffffff', 0.94 * intensity));
      gradCore.addColorStop(0.12, hexToRgba(coreColor, 0.82 * intensity));
      gradCore.addColorStop(0.36, hexToRgba(coreColor, 0.40 * intensity));
      gradCore.addColorStop(0.66, hexToRgba(secondaryColor, 0.18 * intensity));
      gradCore.addColorStop(1.00, 'rgba(11, 13, 25, 0)');
      ctx.fillStyle = gradCore;
      ctx.fill();
      ctx.restore();

      // PASS 4: Stage Light Aperture / Emitter Glow
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      if ('filter' in ctx) {
        ctx.filter = 'blur(22px)';
      }
      const apertureRadius = Math.min(220, width * 0.28) * (1 + (idleMotion ? breathSine * 0.03 : 0));
      const apertureGlow = ctx.createRadialGradient(ox, oy, 0, ox, oy, apertureRadius);
      apertureGlow.addColorStop(0.00, hexToRgba('#ffffff', 0.96 * intensity));
      apertureGlow.addColorStop(0.16, hexToRgba(coreColor, 0.72 * intensity));
      apertureGlow.addColorStop(0.46, hexToRgba(secondaryColor, 0.32 * intensity));
      apertureGlow.addColorStop(1.00, 'rgba(11, 13, 25, 0)');
      ctx.fillStyle = apertureGlow;
      ctx.beginPath();
      ctx.arc(ox, oy, apertureRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // PASS 5: Soft Atmospheric Floor Bounce
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      if ('filter' in ctx) {
        ctx.filter = 'blur(82px)';
      }
      // Calculate projected bounce point based on angle
      const bounceDist = Math.min(width, height) * 0.9;
      const bounceX = ox + Math.cos(angle) * bounceDist;
      const bounceY = oy + Math.sin(angle) * bounceDist;
      const bounceRad = Math.min(380, width * 0.38) * reachFactor;
      const bounceGrad = ctx.createRadialGradient(bounceX, bounceY, 0, bounceX, bounceY, bounceRad);
      bounceGrad.addColorStop(0.00, hexToRgba(secondaryColor, 0.20 * intensity));
      bounceGrad.addColorStop(0.42, hexToRgba(coreColor, 0.09 * intensity));
      bounceGrad.addColorStop(1.00, 'rgba(11, 13, 25, 0)');
      ctx.fillStyle = bounceGrad;
      ctx.beginPath();
      ctx.arc(bounceX, bounceY, bounceRad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // PASS 6: Gentle Floating Stardust
      if (showParticles && state.particles.length > 0) {
        const particles = state.particles;
        const beamConeHalfAngle = halfSpread * 1.16;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          p.y += p.speedY;
          p.x += p.speedX + Math.sin(time * 0.22 + p.driftPhase) * 0.00003;

          if (p.y < -0.04) {
            p.y = 1.04;
            p.x = Math.random();
          }
          if (p.x < -0.04) p.x = 1.04;
          if (p.x > 1.04) p.x = -0.04;

          const px = p.x * width;
          const py = p.y * height;

          const dx = px - ox;
          const dy = py - oy;
          const dist = Math.hypot(dx, dy);
          const pAngle = Math.atan2(dy, dx);

          let diff = pAngle - angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          const absDiff = Math.abs(diff);

          let inBeam = 0;
          if (absDiff < beamConeHalfAngle && dist < reach * 0.95) {
            const lateral = Math.max(0, 1 - absDiff / beamConeHalfAngle);
            const longitudinal = Math.max(0, 1 - dist / (reach * 0.95));
            inBeam = Math.pow(lateral, 1.6) * (0.4 + 0.6 * longitudinal);
          }

          // Twinkle oscillation with customizable twinkleRate
          const twinkle = 0.50 + 0.30 * Math.sin(time * p.twinkleFreq * twinkleRate + p.twinklePhase);

          if (inBeam > 0.04) {
            const beamLuminanceBoost = inBeam * 0.18 * intensity;
            const alpha = Math.min(0.96, twinkle + beamLuminanceBoost);
            const renderedRadius = p.radius * (1 + inBeam * 0.28);

            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = hexToRgba(coreColor, inBeam * 0.24 * intensity * twinkle);
            ctx.beginPath();
            ctx.arc(px, py, renderedRadius * 2.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = inBeam > 0.35 ? hexToRgba('#e4f9ff', alpha) : hexToRgba(coreColor, alpha);
            ctx.beginPath();
            ctx.arc(px, py, renderedRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            ctx.save();
            ctx.fillStyle = `rgba(220, 232, 255, ${twinkle.toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(px, py, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    coreColor,
    secondaryColor,
    backgroundColor,
    idleMotion,
    showParticles,
    customAngleDeg,
    cycleDurationSec,
    twinkleRate,
    originOverride,
    onOriginUpdate,
    isIlluminated,
  ]);

  return (
    <div className={`fixed inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
        style={{
          backgroundColor,
          mixBlendMode: 'normal',
        }}
      />
    </div>
  );
};

/**
 * Utility helper to convert hex to rgba string
 */
function hexToRgba(hex: string, alpha: number): string {
  let c = hex.trim();
  if (c.startsWith('#')) {
    c = c.slice(1);
  }
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) {
    return `rgba(0, 242, 254, ${alpha})`;
  }
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

export default VolumetricLightBeam;
