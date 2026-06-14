"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

interface Node {
  x: number;
  y: number;
  pulse: number;
  depth: number;
}

interface Edge {
  a: number;
  b: number;
  t: number;
  speed: number;
}

interface Sonar {
  x: number;
  y: number;
  r: number;
  life: number;
}

interface Mote {
  x: number;
  y: number;
  size: number;
  opacity: number;
  drift: number;
}

const DEFAULT_ACCENT_RGB = "143, 186, 160";
const NODE_COUNT = 42;
const LINK_RADIUS = 168;
const MAX_LINKS = 3;

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

function centerWeight(x: number, y: number, width: number, height: number) {
  const dx = (x - width / 2) / (width * 0.38);
  const dy = (y - height / 2) / (height * 0.34);
  return Math.min(1, Math.max(0, (dx * dx + dy * dy - 0.22) * 1.35));
}

function placeNodes(width: number, height: number): Node[] {
  const nodes: Node[] = [];
  const margin = 48;
  let attempts = 0;

  while (nodes.length < NODE_COUNT && attempts < NODE_COUNT * 80) {
    attempts += 1;
    const x = margin + Math.random() * (width - margin * 2);
    const y = margin + Math.random() * (height - margin * 2);
    if (centerWeight(x, y, width, height) < 0.08) continue;

    const tooClose = nodes.some((node) => {
      const dx = node.x - x;
      const dy = node.y - y;
      return dx * dx + dy * dy < 76 * 76;
    });
    if (tooClose) continue;

    nodes.push({
      x,
      y,
      pulse: 0,
      depth: 0.35 + Math.random() * 0.65,
    });
  }

  return nodes;
}

function buildEdges(nodes: Node[]): Edge[] {
  const edges: Edge[] = [];

  for (let i = 0; i < nodes.length; i += 1) {
    const neighbors = nodes
      .map((node, j) => ({
        j,
        d: Math.hypot(node.x - nodes[i].x, node.y - nodes[i].y),
      }))
      .filter(({ j, d }) => j !== i && d < LINK_RADIUS)
      .sort((a, b) => a.d - b.d)
      .slice(0, MAX_LINKS);

    for (const { j } of neighbors) {
      if (i < j) {
        edges.push({
          a: i,
          b: j,
          t: Math.random(),
          speed: 0.0018 + Math.random() * 0.0028,
        });
      }
    }
  }

  return edges;
}

function buildMotes(width: number, height: number): Mote[] {
  return Array.from({ length: 18 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 0.9 + 0.35,
    opacity: Math.random() * 0.18 + 0.04,
    drift: Math.random() * 0.06 + 0.015,
  }));
}

export function SignalMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let motes: Mote[] = [];
    let sonars: Sonar[] = [];
    let accentRgb = DEFAULT_ACCENT_RGB;
    let isVisible = !document.hidden;
    let frame = 0;
    let carrierY = -80;
    let carrierCooldown = 480;
    let carrierActive = false;
    let sonarCooldown = 220;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      accentRgb = getAccentRgb(wrap);
      nodes = placeNodes(canvas.width, canvas.height);
      edges = buildEdges(nodes);
      motes = buildMotes(canvas.width, canvas.height);
      sonars = [];
      frame = 0;
      carrierY = -80;
      carrierCooldown = 480;
      carrierActive = false;
      sonarCooldown = 220;
    };

    const drawCarrier = (time: number) => {
      const { width } = canvas;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const nx = x / width;
        const wave =
          carrierY +
          Math.sin(nx * Math.PI * 5 + time * 0.04) * 14 +
          Math.sin(nx * Math.PI * 11 - time * 0.02) * 5;
        if (x === 0) ctx.moveTo(x, wave);
        else ctx.lineTo(x, wave);
      }
      ctx.strokeStyle = `rgba(${accentRgb}, 0.045)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      const gradient = ctx.createLinearGradient(0, carrierY - 28, 0, carrierY + 28);
      gradient.addColorStop(0, `rgba(${accentRgb}, 0)`);
      gradient.addColorStop(0.5, `rgba(${accentRgb}, 0.035)`);
      gradient.addColorStop(1, `rgba(${accentRgb}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, carrierY - 28, width, 56);
    };

    const drawStatic = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const edge of edges) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const weight = centerWeight(midX, midY, width, height);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${accentRgb}, ${0.04 + weight * 0.05})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      for (const node of nodes) {
        const weight = centerWeight(node.x, node.y, width, height);
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.1 + node.depth * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, ${0.08 + weight * 0.14})`;
        ctx.fill();
      }
    };

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      if (!isVisible) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      frame += 1;

      if (carrierCooldown > 0) {
        carrierCooldown -= 1;
      } else {
        carrierActive = true;
        carrierY += 0.85;
        if (carrierY > height + 90) {
          carrierActive = false;
          carrierY = -80;
          carrierCooldown = 720 + Math.floor(Math.random() * 360);
        }
      }

      if (sonarCooldown > 0) {
        sonarCooldown -= 1;
      } else if (nodes.length > 0) {
        const node = nodes[Math.floor(Math.random() * nodes.length)];
        sonars.push({ x: node.x, y: node.y, r: 4, life: 1 });
        sonarCooldown = 280 + Math.floor(Math.random() * 220);
      }

      for (const edge of edges) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const weight = centerWeight(midX, midY, width, height);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${accentRgb}, ${0.035 + weight * 0.045})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        edge.t += edge.speed;
        if (edge.t >= 1) {
          edge.t = 0;
          nodes[edge.b].pulse = 1;
        }

        const px = a.x + (b.x - a.x) * edge.t;
        const py = a.y + (b.y - a.y) * edge.t;
        const packetWeight = centerWeight(px, py, width, height);

        ctx.beginPath();
        ctx.arc(px, py, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, ${0.22 + packetWeight * 0.35})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, ${0.04 + packetWeight * 0.05})`;
        ctx.fill();
      }

      if (carrierActive) {
        drawCarrier(frame);
      }

      sonars = sonars.filter((sonar) => sonar.life > 0.02);
      for (const sonar of sonars) {
        sonar.r += 1.1;
        sonar.life *= 0.965;
        const weight = centerWeight(sonar.x, sonar.y, width, height);
        ctx.beginPath();
        ctx.arc(sonar.x, sonar.y, sonar.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${accentRgb}, ${sonar.life * 0.07 * weight})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      for (const node of nodes) {
        if (node.pulse > 0.01) {
          node.pulse *= 0.92;
        } else {
          node.pulse = 0;
        }

        const weight = centerWeight(node.x, node.y, width, height);
        const glow = node.pulse * 0.45;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 2 + node.depth + glow * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, ${0.03 + glow * 0.08})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, 1 + node.depth * 0.5 + glow * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, ${0.1 + weight * 0.2 + glow * 0.5})`;
        ctx.fill();
      }

      for (const mote of motes) {
        mote.y -= mote.drift;
        if (mote.y < -8) {
          mote.y = height + 8;
          mote.x = Math.random() * width;
        }
        const weight = centerWeight(mote.x, mote.y, width, height);
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, ${mote.opacity * (0.35 + weight * 0.65)})`;
        ctx.fill();
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
      className="signal-mesh-root pointer-events-none fixed inset-0 z-0 print:hidden"
      aria-hidden
    >
      <div className="signal-mesh-aura signal-mesh-aura-a" />
      <div className="signal-mesh-aura signal-mesh-aura-b" />
      <canvas
        ref={canvasRef}
        className="signal-mesh-canvas absolute inset-0 h-full w-full"
      />
      <div className="signal-mesh-vignette absolute inset-0" />
    </div>
  );
}
