"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const DEFAULT_ACCENT_RGB = "143, 186, 160";
const HEX = "0123456789ABCDEF";

const LOG_POOL = [
  "> netrun --attach daemon",
  "> bypass_ICE --layer 3",
  "handshake :: OK",
  "decrypt [██████░░░░] 62%",
  "upload :: packet_0x4F2A",
  "trace blocked :: proxy active",
  "mem_dump 0x00FF2C..8A",
  "daemon :: listening",
  "signal :: encrypted",
  "quickhack :: queued",
  "ICE integrity :: 41%",
  "port scan :: 443 OPEN",
  "shell :: session active",
  "buffer overflow :: patched",
  "ping :: 12ms",
];

interface HexColumn {
  x: number;
  y: number;
  speed: number;
  gap: number;
  rows: string[];
  opacity: number;
}

interface MemBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  addr: string;
  life: number;
  maxLife: number;
}

interface GlitchSlice {
  y: number;
  h: number;
  shift: number;
  life: number;
  rgb: boolean;
}

interface ScanPulse {
  y: number;
  life: number;
}

function getAccentRgb(element: HTMLElement | null): string {
  if (!element) return DEFAULT_ACCENT_RGB;
  const themed =
    element.closest(".theme-portfolio, .theme-tech, .theme-reflections") ??
    element;
  const rgb = getComputedStyle(themed)
    .getPropertyValue("--signal-accent-rgb")
    .trim();
  return rgb || DEFAULT_ACCENT_RGB;
}

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function edgeWeight(x: number, y: number, width: number, height: number) {
  const dx = Math.abs(x - width / 2) / (width / 2);
  const dy = Math.abs(y - height / 2) / (height / 2);
  return Math.min(1, Math.max(0, Math.max(dx, dy) * 1.15 - 0.35));
}

function randomHexPair() {
  return (
    HEX[Math.floor(Math.random() * 16)] + HEX[Math.floor(Math.random() * 16)]
  );
}

function randomHexRow() {
  const len = 3 + Math.floor(Math.random() * 3);
  return Array.from({ length: len }, () => randomHexPair()).join(" ");
}

function randomAddr() {
  return `0x${randomHexPair()}${randomHexPair()}${randomHexPair()}`;
}

function buildColumns(width: number, height: number): HexColumn[] {
  const columns: HexColumn[] = [];
  const slots = [
    width * 0.04,
    width * 0.08,
    width * 0.92,
    width * 0.96,
    width * 0.12,
    width * 0.88,
  ];

  for (const x of slots) {
    if (edgeWeight(x, height / 2, width, height) < 0.45) continue;
    columns.push({
      x,
      y: Math.random() * height,
      speed: 0.35 + Math.random() * 0.55,
      gap: 14 + Math.random() * 6,
      rows: Array.from({ length: 14 + Math.floor(Math.random() * 10) }, () =>
        randomHexRow(),
      ),
      opacity: 0.12 + Math.random() * 0.18,
    });
  }

  return columns;
}

function createMemBlock(width: number, height: number): MemBlock {
  const x =
    Math.random() < 0.5
      ? width * (0.02 + Math.random() * 0.12)
      : width * (0.86 + Math.random() * 0.12);
  const y = height * (0.15 + Math.random() * 0.7);
  const maxLife = 180 + Math.floor(Math.random() * 120);
  return {
    x,
    y,
    w: 36 + Math.random() * 48,
    h: 10 + Math.random() * 8,
    addr: randomAddr(),
    life: maxLife,
    maxLife,
  };
}

function buildMemBlocks(width: number, height: number): MemBlock[] {
  return Array.from({ length: 8 }, () => createMemBlock(width, height));
}

function pickLogs(count: number) {
  const pool = [...LOG_POOL];
  const picked: string[] = [];
  for (let i = 0; i < count; i += 1) {
    if (pool.length === 0) pool.push(...LOG_POOL);
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

export function SignalMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed || reducedMotion) return;

    let lineIndex = 0;
    const lines = pickLogs(6);

    const tick = () => {
      const line = lines[lineIndex % lines.length];
      lineIndex += 1;

      const el = document.createElement("div");
      el.className = "netrun-feed-line";
      el.textContent = line;
      feed.prepend(el);

      while (feed.children.length > 5) {
        feed.lastElementChild?.remove();
      }

      window.setTimeout(() => el.classList.add("is-fading"), 2800);
      window.setTimeout(() => el.remove(), 4200);
    };

    tick();
    const id = window.setInterval(tick, 3200);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let columns: HexColumn[] = [];
    let memBlocks: MemBlock[] = [];
    let glitches: GlitchSlice[] = [];
    let scans: ScanPulse[] = [];
    let accentRgb = DEFAULT_ACCENT_RGB;
    let isVisible = !document.hidden;
    let glitchCooldown = 200;
    let scanCooldown = 360;
    let breachProgress = 0;
    let breachActive = false;
    let breachCooldown = 600;

    const mono = "var(--font-geist-mono), ui-monospace, monospace";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      accentRgb = getAccentRgb(wrap);
      columns = buildColumns(canvas.width, canvas.height);
      memBlocks = buildMemBlocks(canvas.width, canvas.height);
      glitches = [];
      scans = [];
      glitchCooldown = 200;
      scanCooldown = 360;
      breachProgress = 0;
      breachActive = false;
      breachCooldown = 600;
    };

    const drawHexColumns = (animate: boolean) => {
      const { width, height } = canvas;
      ctx.font = "10px " + mono;
      ctx.textAlign = "left";

      for (const col of columns) {
        const weight = edgeWeight(col.x, height / 2, width, height);
        if (weight < 0.2) continue;

        if (animate) {
          col.y += col.speed;
          if (col.y > height + 40) col.y = -col.rows.length * col.gap;
        }

        for (let i = 0; i < col.rows.length; i += 1) {
          const y = col.y + i * col.gap;
          if (y < -20 || y > height + 20) continue;
          const rowWeight = edgeWeight(col.x, y, width, height);
          ctx.fillStyle = `rgba(${accentRgb}, ${col.opacity * (0.4 + rowWeight * 0.6)})`;
          ctx.fillText(col.rows[i], col.x, y);
        }
      }
    };

    const drawMemBlocks = (animate: boolean) => {
      const { width, height } = canvas;
      ctx.font = "8px " + mono;

      for (const block of memBlocks) {
        if (animate) block.life -= 1;
        const t = block.life / block.maxLife;
        if (t <= 0) {
          Object.assign(block, createMemBlock(width, height));
          continue;
        }

        const weight = edgeWeight(block.x, block.y, width, height);
        const alpha = t * 0.35 * (0.5 + weight * 0.5);

        ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.strokeRect(block.x, block.y, block.w, block.h);

        ctx.fillStyle = `rgba(${accentRgb}, ${alpha * 0.55})`;
        ctx.fillRect(block.x, block.y, block.w, 1);

        ctx.fillStyle = `rgba(${accentRgb}, ${alpha * 0.75})`;
        ctx.fillText(block.addr, block.x + 3, block.y + block.h - 2);
      }
    };

    const drawScans = () => {
      const { width } = canvas;
      scans = scans.filter((s) => s.life > 0.02);

      for (const scan of scans) {
        scan.life -= 0.018;
        const gradient = ctx.createLinearGradient(0, scan.y - 18, 0, scan.y + 18);
        gradient.addColorStop(0, `rgba(${accentRgb}, 0)`);
        gradient.addColorStop(0.45, `rgba(${accentRgb}, ${scan.life * 0.09})`);
        gradient.addColorStop(0.5, `rgba(${accentRgb}, ${scan.life * 0.14})`);
        gradient.addColorStop(0.55, `rgba(${accentRgb}, ${scan.life * 0.09})`);
        gradient.addColorStop(1, `rgba(${accentRgb}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scan.y - 18, width, 36);

        ctx.beginPath();
        ctx.moveTo(0, scan.y);
        ctx.lineTo(width, scan.y);
        ctx.strokeStyle = `rgba(${accentRgb}, ${scan.life * 0.22})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    };

    const applyGlitches = () => {
      const { width } = canvas;
      glitches = glitches.filter((g) => g.life > 0.02);

      for (const glitch of glitches) {
        glitch.life -= 0.08;
        const image = ctx.getImageData(0, glitch.y, width, glitch.h);
        ctx.putImageData(image, glitch.shift, glitch.y);

        if (glitch.rgb) {
          ctx.globalCompositeOperation = "screen";
          ctx.globalAlpha = glitch.life * 0.12;
          ctx.fillStyle = `rgba(255, 60, 80, 0.5)`;
          ctx.fillRect(glitch.shift - 2, glitch.y, width, glitch.h);
          ctx.fillStyle = `rgba(60, 200, 255, 0.4)`;
          ctx.fillRect(glitch.shift + 2, glitch.y, width, glitch.h);
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1;
        }
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawHexColumns(false);
      drawMemBlocks(false);
    };

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      if (!isVisible) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      drawHexColumns(true);
      drawMemBlocks(true);

      if (scanCooldown > 0) {
        scanCooldown -= 1;
      } else {
        scans.push({ y: Math.random() * height, life: 1 });
        scanCooldown = 480 + Math.floor(Math.random() * 320);
      }
      drawScans();

      if (glitchCooldown > 0) {
        glitchCooldown -= 1;
      } else {
        glitches.push({
          y: Math.random() * height * 0.85 + height * 0.05,
          h: 2 + Math.random() * 10,
          shift: (Math.random() - 0.5) * 18,
          life: 1,
          rgb: Math.random() > 0.55,
        });
        glitchCooldown = 140 + Math.floor(Math.random() * 200);
      }
      applyGlitches();

      if (breachCooldown > 0) {
        breachCooldown -= 1;
      } else if (!breachActive) {
        breachActive = true;
        breachProgress = 0;
      }

      if (breachActive) {
        breachProgress += 0.004;
        const barW = width * 0.22;
        const barX = width * 0.04;
        const barY = height * 0.08;

        ctx.strokeStyle = `rgba(${accentRgb}, 0.25)`;
        ctx.lineWidth = 0.8;
        ctx.strokeRect(barX, barY, barW, 5);

        ctx.fillStyle = `rgba(${accentRgb}, 0.45)`;
        ctx.fillRect(barX, barY, barW * breachProgress, 5);

        ctx.font = "8px " + mono;
        ctx.fillStyle = `rgba(${accentRgb}, 0.5)`;
        ctx.fillText("BREACH", barX, barY - 4);

        if (breachProgress >= 1) {
          breachActive = false;
          breachCooldown = 900 + Math.floor(Math.random() * 400);
        }
      }

      const gridStep = 88;
      ctx.strokeStyle = `rgba(${accentRgb}, 0.025)`;
      ctx.lineWidth = 0.5;
      for (let x = gridStep; x < width; x += gridStep) {
        const w = edgeWeight(x, height / 2, width, height);
        if (w < 0.55) continue;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.globalAlpha = w * 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    const onVisibility = () => {
      isVisible = !document.hidden;
    };

    function onResize() {
      resize();
      if (reducedMotion) drawStatic();
    }

    resize();
    if (reducedMotion) {
      drawStatic();
    } else {
      draw();
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={wrapRef}
      className="netrun-root pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden"
      aria-hidden
    >
      <div className="netrun-noise" />
      <div className="netrun-aura netrun-aura-a" />
      <div className="netrun-aura netrun-aura-b" />

      <canvas
        ref={canvasRef}
        className="netrun-canvas absolute inset-0 h-full w-full"
      />

      <div className="netrun-bracket netrun-bracket-tl" />
      <div className="netrun-bracket netrun-bracket-tr" />
      <div className="netrun-bracket netrun-bracket-bl" />
      <div className="netrun-bracket netrun-bracket-br" />

      <div className="netrun-statusbar">
        <span className="netrun-statusbar-tag">NETRUN</span>
        <span className="netrun-statusbar-sep">{"//"}</span>
        <span className="netrun-statusbar-state">DAEMON ACTIVE</span>
        <span className="netrun-statusbar-ice">ICE:L3</span>
      </div>

      <div ref={feedRef} className="netrun-feed" />

      <div className="netrun-ice-panel">
        <span className="netrun-ice-label">ICE</span>
        <div className="netrun-ice-bars">
          <span /><span /><span /><span className="is-bypassed" />
        </div>
        <span className="netrun-ice-status">BYPASSED</span>
      </div>

      <div className="netrun-diamond" />

      {!reducedMotion && <div className="netrun-glitch-burst" />}

      <div className="netrun-vignette" />
    </div>
  );
}
