import React from "react";
import { interpolate } from "remotion";
import type { PhraseData } from "../schema";

// ========== TEXT-SEEDED RANDOM GENERATOR ==========
// Converts any phrase text into a deterministic seed for unique visuals

function hashText(text: string): number {
    let h = 0;
    for (let i = 0; i < text.length; i++) {
        h = ((h << 5) - h + text.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

/** Seeded pseudo-random number generator */
function seededRandom(seed: number, index: number): number {
    const x = Math.sin(seed * 9301 + index * 49297 + 233280) * 10000;
    return x - Math.floor(x);
}

// ========== COLOR PALETTES (20+) ==========
// Each phrase gets a unique palette based on its text hash

const PALETTES = [
    // Warm
    { primary: "#FF6B6B", secondary: "#FFA07A", glow: "rgba(255,107,107,0.15)", particle: "rgba(255,160,122,0.3)" },
    { primary: "#FF8C42", secondary: "#FFD166", glow: "rgba(255,140,66,0.15)", particle: "rgba(255,209,102,0.3)" },
    { primary: "#F7B733", secondary: "#FC4A1A", glow: "rgba(247,183,51,0.15)", particle: "rgba(252,74,26,0.3)" },
    // Cool
    { primary: "#4ECDC4", secondary: "#45B7D1", glow: "rgba(78,205,196,0.15)", particle: "rgba(69,183,209,0.3)" },
    { primary: "#6C5CE7", secondary: "#A29BFE", glow: "rgba(108,92,231,0.15)", particle: "rgba(162,155,254,0.3)" },
    { primary: "#74B9FF", secondary: "#0984E3", glow: "rgba(116,185,255,0.15)", particle: "rgba(9,132,227,0.3)" },
    // Nature
    { primary: "#00B894", secondary: "#55EFC4", glow: "rgba(0,184,148,0.15)", particle: "rgba(85,239,196,0.3)" },
    { primary: "#26DE81", secondary: "#20BF6B", glow: "rgba(38,222,129,0.12)", particle: "rgba(32,191,107,0.3)" },
    // Royal
    { primary: "#E056A0", secondary: "#F78FB3", glow: "rgba(224,86,160,0.15)", particle: "rgba(247,143,179,0.3)" },
    { primary: "#A55EEA", secondary: "#8854D0", glow: "rgba(165,94,234,0.15)", particle: "rgba(136,84,208,0.3)" },
    // Golden
    { primary: "#F9CA24", secondary: "#F0932B", glow: "rgba(249,202,36,0.15)", particle: "rgba(240,147,43,0.3)" },
    { primary: "#FDCB6E", secondary: "#E17055", glow: "rgba(253,203,110,0.12)", particle: "rgba(225,112,85,0.3)" },
    // Ice
    { primary: "#81ECEC", secondary: "#DFE6E9", glow: "rgba(129,236,236,0.15)", particle: "rgba(223,230,233,0.25)" },
    { primary: "#A3D8F4", secondary: "#B8E6F1", glow: "rgba(163,216,244,0.12)", particle: "rgba(184,230,241,0.25)" },
    // Neon
    { primary: "#FD79A8", secondary: "#FDCB6E", glow: "rgba(253,121,168,0.18)", particle: "rgba(253,203,110,0.3)" },
    { primary: "#00CEC9", secondary: "#55EFC4", glow: "rgba(0,206,201,0.18)", particle: "rgba(85,239,196,0.3)" },
    // Galaxy
    { primary: "#9B59B6", secondary: "#3498DB", glow: "rgba(155,89,182,0.15)", particle: "rgba(52,152,219,0.3)" },
    { primary: "#E74C3C", secondary: "#F39C12", glow: "rgba(231,76,60,0.15)", particle: "rgba(243,156,18,0.3)" },
    // Muted
    { primary: "#BDC3C7", secondary: "#ECF0F1", glow: "rgba(189,195,199,0.1)", particle: "rgba(236,240,241,0.2)" },
    { primary: "#DAD3BE", secondary: "#C7BEA2", glow: "rgba(218,211,190,0.1)", particle: "rgba(199,190,162,0.2)" },
];

// ========== SHAPE RENDERERS (20 shapes) ==========

function renderShape(
    shape: number,
    size: number,
    color: string,
    fillOpacity: number = 0.08
): React.ReactNode {
    const fill = color.replace(/[\d.]+\)$/, `${fillOpacity})`);
    const key = `shape-${shape}-${size}`;

    switch (shape % 20) {
        case 0: // Circle
            return <div key={key} style={{ width: size, height: size, borderRadius: "50%", border: `1.5px solid ${color}`, background: `radial-gradient(${fill}, transparent)` }} />;
        case 1: // Diamond
            return <div key={key} style={{ width: size * 0.7, height: size * 0.7, border: `1.5px solid ${color}`, transform: "rotate(45deg)", background: `linear-gradient(135deg, ${fill}, transparent)` }} />;
        case 2: // Triangle
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <polygon points="20,4 36,36 4,36" fill={fill} stroke={color} strokeWidth="1.5" />
                </svg>
            );
        case 3: // Star
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <polygon points="20,2 25,15 38,15 27,24 31,38 20,29 9,38 13,24 2,15 15,15" fill={fill} stroke={color} strokeWidth="1.2" />
                </svg>
            );
        case 4: // Hexagon
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill={fill} stroke={color} strokeWidth="1.5" />
                </svg>
            );
        case 5: // Heart
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <path d="M20 35 C10 25 0 18 0 10 A8 8 0 0 1 20 10 A8 8 0 0 1 40 10 C40 18 30 25 20 35Z" fill={fill} stroke={color} strokeWidth="1.5" />
                </svg>
            );
        case 6: // Crescent
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <path d="M25 5 A15 15 0 1 0 25 35 A12 12 0 1 1 25 5" fill={fill} stroke={color} strokeWidth="1.5" />
                </svg>
            );
        case 7: // Infinity
            return (
                <svg key={key} width={size * 1.4} height={size} viewBox="0 0 56 40">
                    <path d="M14 20 C14 10 4 10 4 20 C4 30 14 30 28 20 C42 10 52 10 52 20 C52 30 42 30 28 20" fill="none" stroke={color} strokeWidth="1.5" />
                </svg>
            );
        case 8: // Leaf
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <path d="M20 38 C5 30 2 15 10 5 C20 -2 35 5 38 15 C40 25 30 35 20 38Z" fill={fill} stroke={color} strokeWidth="1.5" />
                    <path d="M20 38 Q15 20 20 8" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
                </svg>
            );
        case 9: // Bolt
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <polyline points="25,2 12,20 22,20 8,38" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
                </svg>
            );
        case 10: // Spiral
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <path d="M20 20 Q20 10 25 10 Q35 10 35 20 Q35 35 20 35 Q5 35 5 20 Q5 5 20 5 Q40 5 40 20" fill="none" stroke={color} strokeWidth="1.5" />
                </svg>
            );
        case 11: // Pentagon
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <polygon points="20,3 37,15 31,35 9,35 3,15" fill={fill} stroke={color} strokeWidth="1.5" />
                </svg>
            );
        case 12: // Arrow up
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <path d="M20 5 L32 20 L25 20 L25 36 L15 36 L15 20 L8 20 Z" fill={fill} stroke={color} strokeWidth="1.5" />
                </svg>
            );
        case 13: // Ring (thick)
            return <div key={key} style={{ width: size, height: size, borderRadius: "50%", border: `3px solid ${color}`, background: "transparent", boxShadow: `0 0 20px ${fill}, inset 0 0 15px ${fill}` }} />;
        case 14: // Cross
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <line x1="20" y1="5" x2="20" y2="35" stroke={color} strokeWidth="2" />
                    <line x1="5" y1="20" x2="35" y2="20" stroke={color} strokeWidth="2" />
                </svg>
            );
        case 15: // Eye
            return (
                <svg key={key} width={size * 1.3} height={size} viewBox="0 0 52 40">
                    <ellipse cx="26" cy="20" rx="22" ry="14" fill="none" stroke={color} strokeWidth="1.5" />
                    <circle cx="26" cy="20" r="7" fill={fill} stroke={color} strokeWidth="1.5" />
                    <circle cx="26" cy="20" r="3" fill={color} opacity="0.6" />
                </svg>
            );
        case 16: // Waves
            return (
                <svg key={key} width={size * 1.5} height={size} viewBox="0 0 60 40">
                    <path d="M5 15 Q15 5 25 15 Q35 25 45 15 Q55 5 55 15" fill="none" stroke={color} strokeWidth="1.5" />
                    <path d="M5 25 Q15 15 25 25 Q35 35 45 25 Q55 15 55 25" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
                </svg>
            );
        case 17: // Octagon
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <polygon points="13,3 27,3 37,13 37,27 27,37 13,37 3,27 3,13" fill={fill} stroke={color} strokeWidth="1.5" />
                </svg>
            );
        case 18: // Droplet
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <path d="M20 5 C20 5 8 20 8 27 A12 12 0 0 0 32 27 C32 20 20 5 20 5Z" fill={fill} stroke={color} strokeWidth="1.5" />
                </svg>
            );
        case 19: // Sun/Star burst
            return (
                <svg key={key} width={size} height={size} viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="8" fill={fill} stroke={color} strokeWidth="1.5" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                        <line key={angle} x1={20 + Math.cos(angle * Math.PI / 180) * 11} y1={20 + Math.sin(angle * Math.PI / 180) * 11} x2={20 + Math.cos(angle * Math.PI / 180) * 17} y2={20 + Math.sin(angle * Math.PI / 180) * 17} stroke={color} strokeWidth="1.5" />
                    ))}
                </svg>
            );
        default:
            return <div key={key} style={{ width: size, height: size, borderRadius: "50%", border: `1.5px solid ${color}`, background: `radial-gradient(${fill}, transparent)` }} />;
    }
}

// ========== ARRANGEMENT PATTERNS (15) ==========

function getPositions(count: number, pattern: number, seed: number): { x: number; y: number }[] {
    const rng = (i: number) => seededRandom(seed, i);

    switch (pattern % 15) {
        case 0: // Ring
            return Array.from({ length: count }, (_, i) => ({
                x: Math.cos((i / count) * Math.PI * 2) * 80,
                y: Math.sin((i / count) * Math.PI * 2) * 80,
            }));
        case 1: // Flower
            return Array.from({ length: count }, (_, i) => ({
                x: Math.cos((i / count) * Math.PI * 2 - Math.PI / 2) * 55,
                y: Math.sin((i / count) * Math.PI * 2 - Math.PI / 2) * 55,
            }));
        case 2: // Spiral
            return Array.from({ length: count }, (_, i) => ({
                x: Math.cos((i / count) * Math.PI * 4) * (20 + (i / count) * 70),
                y: Math.sin((i / count) * Math.PI * 4) * (20 + (i / count) * 70),
            }));
        case 3: // Burst
            return Array.from({ length: count }, (_, i) => ({
                x: Math.cos((i / count) * Math.PI * 2) * (40 + (i % 2) * 40),
                y: Math.sin((i / count) * Math.PI * 2) * (40 + (i % 2) * 40),
            }));
        case 4: // Cascade
            return Array.from({ length: count }, (_, i) => ({
                x: -60 + (i / Math.max(1, count - 1)) * 120,
                y: -60 + (i / Math.max(1, count - 1)) * 120,
            }));
        case 5: // Wave
            return Array.from({ length: count }, (_, i) => ({
                x: -80 + (i / Math.max(1, count - 1)) * 160,
                y: Math.sin((i / count) * Math.PI * 2) * 40,
            }));
        case 6: // Grid
            const cols = Math.ceil(Math.sqrt(count));
            return Array.from({ length: count }, (_, i) => ({
                x: -50 + (i % cols) * (100 / Math.max(1, cols - 1)),
                y: -50 + Math.floor(i / cols) * (100 / Math.max(1, Math.ceil(count / cols) - 1)),
            }));
        case 7: // Scatter (random)
            return Array.from({ length: count }, (_, i) => ({
                x: (rng(i * 2) - 0.5) * 180,
                y: (rng(i * 2 + 1) - 0.5) * 180,
            }));
        case 8: // Orbit (elliptical)
            return Array.from({ length: count }, (_, i) => ({
                x: Math.cos((i / count) * Math.PI * 2) * 75,
                y: Math.sin((i / count) * Math.PI * 2) * 40,
            }));
        case 9: // Zigzag
            return Array.from({ length: count }, (_, i) => ({
                x: -80 + (i / Math.max(1, count - 1)) * 160,
                y: i % 2 === 0 ? -35 : 35,
            }));
        case 10: // Pyramid
            const rows: { x: number; y: number }[] = [];
            let r = 0, placed = 0;
            while (placed < count) { const ir = r + 1; for (let c = 0; c < ir && placed < count; c++) { rows.push({ x: (c - (ir - 1) / 2) * 45, y: -40 + r * 40 }); placed++; } r++; }
            return rows;
        case 11: // Double ring
            return Array.from({ length: count }, (_, i) => {
                const ring = i < count / 2 ? 0 : 1;
                const idx = ring === 0 ? i : i - Math.floor(count / 2);
                const rCount = ring === 0 ? Math.floor(count / 2) : Math.ceil(count / 2);
                const radius = ring === 0 ? 45 : 85;
                return { x: Math.cos((idx / rCount) * Math.PI * 2) * radius, y: Math.sin((idx / rCount) * Math.PI * 2) * radius };
            });
        case 12: // Diamond pattern
            return Array.from({ length: count }, (_, i) => {
                const angle = (i / count) * Math.PI * 2;
                const dist = (i % 2 === 0 ? 50 : 80);
                return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
            });
        case 13: // Cross pattern
            return Array.from({ length: count }, (_, i) => {
                const half = Math.floor(count / 2);
                if (i < half) return { x: 0, y: -60 + (i / Math.max(1, half - 1)) * 120 };
                return { x: -60 + ((i - half) / Math.max(1, count - half - 1)) * 120, y: 0 };
            });
        case 14: // Helix
            return Array.from({ length: count }, (_, i) => ({
                x: Math.cos((i / count) * Math.PI * 3) * 60,
                y: -70 + (i / Math.max(1, count - 1)) * 140,
            }));
        default:
            return Array.from({ length: count }, (_, i) => ({
                x: Math.cos((i / count) * Math.PI * 2) * 65,
                y: Math.sin((i / count) * Math.PI * 2) * 65,
            }));
    }
}

// ========== ANIMATION STYLES (10) ==========

function getAnimatedTransform(
    anim: number,
    progress: number,
    itemIndex: number,
    itemCount: number
): { scale: number; rotation: number; yOffset: number; xOffset: number } {
    const delay = itemIndex * (0.4 / Math.max(1, itemCount));
    const p = Math.max(0, Math.min(1, (progress - delay) / 0.4));

    switch (anim % 10) {
        case 0: // Fade in with scale
            return { scale: interpolate(p, [0, 0.4, 1], [0, 1.15, 1]), rotation: 0, yOffset: 0, xOffset: 0 };
        case 1: // Bounce
            return { scale: interpolate(p, [0, 0.3, 0.5, 0.7, 1], [0, 1.3, 0.9, 1.05, 1]), rotation: 0, yOffset: 0, xOffset: 0 };
        case 2: // Rotate in
            return { scale: interpolate(p, [0, 0.5, 1], [0, 1.1, 1]), rotation: interpolate(p, [0, 1], [180, 0]), yOffset: 0, xOffset: 0 };
        case 3: // Float
            return { scale: interpolate(p, [0, 0.4, 1], [0, 1, 1]), rotation: 0, yOffset: Math.sin(progress * Math.PI * 3 + itemIndex * 0.8) * 12, xOffset: 0 };
        case 4: // Pulse
            return { scale: (interpolate(p, [0, 0.3, 1], [0, 1, 1])) * (1 + Math.sin(progress * Math.PI * 4 + itemIndex) * 0.15), rotation: 0, yOffset: 0, xOffset: 0 };
        case 5: // Spin in
            return { scale: interpolate(p, [0, 0.5, 1], [0, 1.05, 1]), rotation: progress * 120 + itemIndex * 30, yOffset: 0, xOffset: 0 };
        case 6: // Slide up
            return { scale: interpolate(p, [0, 0.5, 1], [0.5, 1, 1]), rotation: 0, yOffset: interpolate(p, [0, 0.5, 1], [30, -5, 0]), xOffset: 0 };
        case 7: // Ripple
            return { scale: interpolate(p, [0, 0.3, 0.6, 1], [0, 1.2, 0.95, 1]), rotation: 0, yOffset: 0, xOffset: Math.sin(progress * Math.PI * 2 + itemIndex * 1.2) * 5 };
        case 8: // Grow and sway
            return { scale: interpolate(p, [0, 0.5, 1], [0, 1, 1]), rotation: Math.sin(progress * Math.PI * 2 + itemIndex) * 10, yOffset: 0, xOffset: 0 };
        case 9: // Pop
            return { scale: interpolate(p, [0, 0.15, 0.3, 1], [0, 1.4, 1, 1]), rotation: 0, yOffset: 0, xOffset: 0 };
        default:
            return { scale: interpolate(p, [0, 0.5, 1], [0, 1, 1]), rotation: 0, yOffset: 0, xOffset: 0 };
    }
}

// ========== BACKGROUND EFFECTS ==========

const BackgroundGlow: React.FC<{
    progress: number;
    color1: string;
    color2: string;
}> = ({ progress, color1, color2 }) => {
    const pulse = 1 + Math.sin(progress * Math.PI * 2.5) * 0.12;
    const opacity = interpolate(progress, [0, 0.15, 0.8, 1], [0, 0.7, 0.5, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <>
            {/* Primary glow */}
            <div style={{
                position: "absolute", left: "50%", top: "45%",
                width: 320 * pulse, height: 320 * pulse,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color1} 0%, transparent 70%)`,
                transform: "translate(-50%, -50%)",
                opacity,
            }} />
            {/* Secondary offset glow */}
            <div style={{
                position: "absolute", left: "45%", top: "55%",
                width: 200 * pulse, height: 200 * pulse,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color2} 0%, transparent 70%)`,
                transform: "translate(-50%, -50%)",
                opacity: opacity * 0.5,
            }} />
        </>
    );
};

const FloatingParticles: React.FC<{
    progress: number;
    count: number;
    color: string;
    seed: number;
}> = ({ progress, count, color, seed }) => {
    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            {Array.from({ length: count }, (_, i) => {
                const x = seededRandom(seed, i * 3) * 100;
                const startY = seededRandom(seed, i * 3 + 1) * 100;
                const size = 2 + seededRandom(seed, i * 3 + 2) * 4;
                const speed = 0.5 + seededRandom(seed, i * 5) * 1.5;
                const drift = Math.sin(progress * Math.PI * speed + i * 1.2) * 15;
                const y = startY - progress * 30 * speed;
                const opacity = interpolate(
                    progress,
                    [0, 0.1, 0.7, 1],
                    [0, 0.5, 0.35, 0.15],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ) * (0.3 + seededRandom(seed, i * 7) * 0.7);

                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: `${x + drift * 0.3}%`,
                        top: `${y}%`,
                        width: size,
                        height: size,
                        borderRadius: "50%",
                        backgroundColor: color,
                        opacity,
                        filter: size > 4 ? "blur(1px)" : "none",
                    }} />
                );
            })}
        </div>
    );
};

const OrbitRings: React.FC<{
    progress: number;
    color: string;
    count: number;
}> = ({ progress, color, count }) => (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {Array.from({ length: count }, (_, i) => {
            const delay = i * 0.12;
            const p = Math.max(0, Math.min(1, (progress - delay) / 0.5));
            const scale = 0.3 + p * (1.2 + i * 0.3);
            const opacity = interpolate(p, [0, 0.3, 0.7, 1], [0, 0.35, 0.15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const rotation = progress * (30 + i * 20);
            return (
                <div key={i} style={{
                    position: "absolute",
                    width: 60 + i * 25, height: 60 + i * 25,
                    borderRadius: "50%",
                    border: `1px solid ${color}`,
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    opacity,
                }} />
            );
        })}
    </div>
);

const GridLines: React.FC<{
    progress: number;
    color: string;
}> = ({ progress, color }) => {
    const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.08, 0.05, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <svg style={{ position: "absolute", inset: 0, opacity }} viewBox="0 0 1080 1920">
            {Array.from({ length: 8 }, (_, i) => (
                <React.Fragment key={i}>
                    <line x1={i * 135} y1="0" x2={i * 135} y2="1920" stroke={color} strokeWidth="0.5" />
                    <line x1="0" y1={i * 240} x2="1080" y2={i * 240} stroke={color} strokeWidth="0.5" />
                </React.Fragment>
            ))}
        </svg>
    );
};

// ========== MAIN VISUAL GENERATOR ==========

interface VisualSymbolProps {
    phrase: PhraseData;
    progress: number;
}

export const VisualSymbol: React.FC<VisualSymbolProps> = ({ phrase, progress }) => {
    // Generate a unique seed from phrase text + visual name
    const text = (phrase.text || "") + (phrase.visual || "") + (phrase.speechSegment || "");
    const seed = hashText(text);

    // Deterministically select visual parameters from seed
    const paletteIdx = seed % PALETTES.length;
    const palette = PALETTES[paletteIdx];

    const primaryShape = Math.floor(seededRandom(seed, 100) * 20);
    const secondaryShape = (primaryShape + 3 + Math.floor(seededRandom(seed, 101) * 10)) % 20;
    const arrangement = Math.floor(seededRandom(seed, 200) * 15);
    const animation = Math.floor(seededRandom(seed, 300) * 10);
    const elementCount = 4 + Math.floor(seededRandom(seed, 400) * 5); // 4-8 elements
    const secondaryCount = 2 + Math.floor(seededRandom(seed, 401) * 3); // 2-4 secondary

    // Background effect selection
    const bgEffect = Math.floor(seededRandom(seed, 500) * 4); // 0=rings, 1=grid, 2=both, 3=none

    // Get positions for main and secondary elements
    const mainPositions = getPositions(elementCount, arrangement, seed);
    const secondaryArrangement = (arrangement + 5) % 15;
    const secondaryPositions = getPositions(secondaryCount, secondaryArrangement, seed + 999);

    // Element sizes
    const mainSize = 28 + Math.floor(seededRandom(seed, 600) * 20); // 28-48
    const secondarySize = 16 + Math.floor(seededRandom(seed, 601) * 12); // 16-28

    // Total items opacity (never fully invisible)
    const itemBaseOpacity = interpolate(
        progress,
        [0, 0.15, 0.85, 1],
        [0, 0.85, 0.7, 0.4],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {/* Layer 1: Background glow */}
            <BackgroundGlow
                progress={progress}
                color1={palette.glow}
                color2={palette.glow.replace(/[\d.]+\)$/, "0.08)")}
            />

            {/* Layer 2: Floating particles */}
            <FloatingParticles
                progress={progress}
                count={12}
                color={palette.particle}
                seed={seed}
            />

            {/* Layer 3: Background effects */}
            {(bgEffect === 0 || bgEffect === 2) && (
                <OrbitRings progress={progress} color={palette.primary} count={3} />
            )}
            {(bgEffect === 1 || bgEffect === 2) && (
                <GridLines progress={progress} color={palette.primary} />
            )}

            {/* Layer 4: Secondary shapes (smaller, behind main) */}
            <div style={{ position: "relative", width: 300, height: 300 }}>
                {secondaryPositions.map((pos, i) => {
                    const anim = getAnimatedTransform((animation + 3) % 10, progress, i + elementCount, elementCount + secondaryCount);
                    return (
                        <div key={`sec-${i}`} style={{
                            position: "absolute",
                            left: 150 + pos.x,
                            top: 150 + pos.y,
                            transform: `translate(-50%, -50%) scale(${anim.scale * 0.8}) rotate(${anim.rotation}deg)`,
                            opacity: itemBaseOpacity * 0.4,
                        }}>
                            {renderShape(secondaryShape, secondarySize, palette.secondary, 0.05)}
                        </div>
                    );
                })}
            </div>

            {/* Layer 5: Main composition shapes */}
            <div style={{ position: "absolute", width: 300, height: 300, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
                {mainPositions.map((pos, i) => {
                    const anim = getAnimatedTransform(animation, progress, i, elementCount);
                    return (
                        <div key={`main-${i}`} style={{
                            position: "absolute",
                            left: 150 + pos.x + anim.xOffset,
                            top: 150 + pos.y + anim.yOffset,
                            transform: `translate(-50%, -50%) scale(${anim.scale}) rotate(${anim.rotation}deg)`,
                            opacity: itemBaseOpacity,
                            filter: `drop-shadow(0 0 8px ${palette.glow})`,
                        }}>
                            {renderShape(primaryShape, mainSize, palette.primary)}
                        </div>
                    );
                })}
            </div>

            {/* Layer 6: Center accent (always present) */}
            <div style={{
                position: "absolute",
                opacity: interpolate(progress, [0.1, 0.3, 0.9, 1], [0, 0.9, 0.7, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `scale(${1 + Math.sin(progress * Math.PI * 2) * 0.08})`,
                filter: `drop-shadow(0 0 15px ${palette.glow})`,
            }}>
                {renderShape((primaryShape + 7) % 20, mainSize + 12, palette.primary, 0.1)}
            </div>
        </div>
    );
};
