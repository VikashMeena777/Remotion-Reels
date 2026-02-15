import React from "react";
import {
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    Easing,
} from "remotion";
import type { PhraseData } from "../schema";

/**
 * SpotlightBeam — Volumetric light cone used as ambient in some scenes.
 */
const SpotlightBeam: React.FC<{ progress: number }> = ({ progress }) => {
    const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]);
    const breathe = 1 + Math.sin(progress * Math.PI * 4) * 0.05;
    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: `translateX(-50%) scaleX(${breathe})`,
                width: 0,
                height: 0,
                borderLeft: "200px solid transparent",
                borderRight: "200px solid transparent",
                borderTop: "700px solid rgba(255,255,255,0.08)",
                filter: "blur(30px)",
                opacity,
            }}
        />
    );
};

// ========== INDIVIDUAL SYMBOL RENDERERS ==========

const Footsteps: React.FC<{ progress: number }> = ({ progress }) => {
    const steps = [
        { x: -60, y: 100, delay: 0 },
        { x: 40, y: 40, delay: 0.15 },
        { x: -40, y: -20, delay: 0.3 },
        { x: 50, y: -80, delay: 0.45 },
    ];
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {steps.map((s, i) => {
                const p = Math.max(0, Math.min(1, (progress - s.delay) / 0.3));
                const opacity = interpolate(p, [0, 0.5, 1], [0, 1, 0.6]);
                const scale = interpolate(p, [0, 0.3, 1], [0.5, 1.1, 1]);
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: 150 + s.x,
                            top: 150 + s.y,
                            width: 20,
                            height: 30,
                            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                            backgroundColor: "white",
                            opacity,
                            transform: `scale(${scale}) rotate(${i % 2 === 0 ? -15 : 15}deg)`,
                            boxShadow: "0 0 20px rgba(255,255,255,0.4)",
                        }}
                    />
                );
            })}
        </div>
    );
};

const Door: React.FC<{ progress: number }> = ({ progress }) => {
    const rectScale = interpolate(progress, [0, 0.3, 1], [0, 1, 1], { extrapolateRight: "clamp" });
    const glowIntensity = interpolate(progress, [0.2, 0.5, 0.8, 1], [0, 1, 1, 0.5]);
    const lightWidth = interpolate(progress, [0.3, 0.7], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Light beam behind door */}
            <div style={{
                position: "absolute",
                width: lightWidth,
                height: 350,
                background: "radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)",
                filter: "blur(20px)",
            }} />
            {/* Door frame */}
            <div style={{
                width: 160,
                height: 280,
                border: "2px solid rgba(255,255,255,0.8)",
                borderRadius: 4,
                transform: `scaleY(${rectScale})`,
                boxShadow: `0 0 ${30 * glowIntensity}px rgba(255,255,255,0.3), inset 0 0 ${20 * glowIntensity}px rgba(255,255,255,0.05)`,
            }} />
        </div>
    );
};

const Sunrise: React.FC<{ progress: number }> = ({ progress }) => {
    const arcRise = interpolate(progress, [0, 0.5], [60, 0], { extrapolateRight: "clamp" });
    const rayCount = 8;
    return (
        <div style={{ position: "relative", width: 300, height: 300, overflow: "hidden" }}>
            {/* Horizon line */}
            <div style={{ position: "absolute", bottom: 100, left: 30, right: 30, height: 1, backgroundColor: "rgba(255,255,255,0.3)" }} />
            {/* Sun arc */}
            <div style={{
                position: "absolute",
                bottom: 100 - arcRise,
                left: "50%",
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "white",
                transform: "translateX(-50%)",
                boxShadow: "0 0 40px rgba(255,255,255,0.5)",
                opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
            }} />
            {/* Rays */}
            {Array.from({ length: rayCount }).map((_, i) => {
                const angle = (i / rayCount) * 180 - 90;
                const rayProgress = Math.max(0, (progress - 0.3) / 0.5);
                const len = interpolate(rayProgress, [0, 1], [0, 80]);
                return (
                    <div key={i} style={{
                        position: "absolute",
                        bottom: 140 - arcRise,
                        left: "50%",
                        width: 1,
                        height: len,
                        backgroundColor: "rgba(255,255,255,0.3)",
                        transform: `translateX(-50%) rotate(${angle}deg)`,
                        transformOrigin: "bottom center",
                        opacity: interpolate(rayProgress, [0, 0.5], [0, 0.6], { extrapolateRight: "clamp" }),
                    }} />
                );
            })}
        </div>
    );
};

const Flower: React.FC<{ progress: number }> = ({ progress }) => {
    const petalPositions = [
        { x: 0, y: -50 },
        { x: 50, y: 0 },
        { x: 0, y: 50 },
        { x: -50, y: 0 },
    ];
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {petalPositions.map((p, i) => {
                const delay = i * 0.12;
                const petalP = Math.max(0, Math.min(1, (progress - delay) / 0.4));
                const scale = interpolate(petalP, [0, 1], [0, 1]);
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: 150 + p.x - 40,
                        top: 150 + p.y - 40,
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        border: "1.5px solid rgba(255,255,255,0.7)",
                        transform: `scale(${scale})`,
                        opacity: interpolate(petalP, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
                    }} />
                );
            })}
            {/* Center dot */}
            <div style={{
                position: "absolute", left: 142, top: 142, width: 16, height: 16,
                borderRadius: "50%", backgroundColor: "white",
                transform: `scale(${interpolate(progress, [0.4, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                boxShadow: "0 0 15px rgba(255,255,255,0.5)",
            }} />
        </div>
    );
};

const Drops: React.FC<{ progress: number }> = ({ progress }) => {
    const drops = Array.from({ length: 12 }, (_, i) => ({
        x: 40 + (i % 4) * 60 + (Math.sin(i * 2.5) * 20),
        delay: (i * 0.06) % 0.5,
        speed: 0.8 + (i % 3) * 0.3,
        size: 4 + (i % 3) * 3,
    }));
    return (
        <div style={{ position: "relative", width: 300, height: 300, overflow: "hidden" }}>
            {drops.map((d, i) => {
                const t = ((progress - d.delay + 1) % 1) * d.speed;
                const y = t * 350 - 50;
                const opacity = y > 250 ? interpolate(y, [250, 300], [1, 0]) : y < 0 ? 0 : 0.7;
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: d.x,
                        top: y,
                        width: d.size,
                        height: d.size * 1.4,
                        borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                        backgroundColor: "white",
                        opacity,
                        boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                    }} />
                );
            })}
        </div>
    );
};

const Mountain: React.FC<{ progress: number }> = ({ progress }) => {
    const drawProgress = interpolate(progress, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });
    const flagProgress = interpolate(progress, [0.6, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <svg width="300" height="300" viewBox="0 0 300 300">
            {/* Mountain outline */}
            <polygon
                points="150,60 260,240 40,240"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray={600}
                strokeDashoffset={600 * (1 - drawProgress)}
                opacity={0.8}
            />
            {/* Flag pole */}
            <line x1="150" y1="60" x2="150" y2="30" stroke="white" strokeWidth="1.5"
                opacity={flagProgress} />
            {/* Flag */}
            <polygon points="150,30 178,38 150,46" fill="white"
                opacity={flagProgress}
                transform={`scale(${flagProgress})`}
                style={{ transformOrigin: "150px 38px" }}
            />
        </svg>
    );
};

const Heartbeat: React.FC<{ progress: number }> = ({ progress }) => {
    const pulse = 1 + Math.sin(progress * Math.PI * 6) * 0.15;
    const lineProgress = interpolate(progress, [0, 0.8], [0, 1], { extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Pulse circle */}
            <div style={{
                width: 60, height: 60, borderRadius: "50%", backgroundColor: "white",
                transform: `scale(${pulse})`,
                boxShadow: `0 0 ${30 * pulse}px rgba(255,255,255,0.4)`,
            }} />
            {/* EKG line */}
            <svg style={{ position: "absolute", width: 300, height: 60, top: 180 }} viewBox="0 0 300 60">
                <polyline
                    points="0,30 60,30 80,30 100,10 115,50 130,30 160,30 180,30 200,10 215,50 230,30 300,30"
                    fill="none" stroke="white" strokeWidth="2"
                    strokeDasharray={400}
                    strokeDashoffset={400 * (1 - lineProgress)}
                    opacity={0.7}
                />
            </svg>
        </div>
    );
};

const Eye: React.FC<{ progress: number }> = ({ progress }) => {
    const openAmount = interpolate(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8]);
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="200" height="120" viewBox="0 0 200 120">
                {/* Upper eyelid */}
                <path d={`M 10,60 Q 100,${60 - 50 * openAmount} 190,60`} fill="none" stroke="white" strokeWidth="2" />
                {/* Lower eyelid */}
                <path d={`M 10,60 Q 100,${60 + 50 * openAmount} 190,60`} fill="none" stroke="white" strokeWidth="2" />
                {/* Iris */}
                <circle cx="100" cy="60" r={20 * openAmount} fill="none" stroke="white" strokeWidth="1.5" opacity={openAmount} />
                {/* Pupil */}
                <circle cx="100" cy="60" r={8 * openAmount} fill="white" opacity={openAmount} />
            </svg>
        </div>
    );
};

const Fire: React.FC<{ progress: number }> = ({ progress }) => {
    const flames = Array.from({ length: 7 }, (_, i) => ({
        x: 110 + i * 15 + Math.sin(i * 1.8) * 15,
        delay: i * 0.05,
        height: 30 + (i % 3) * 20,
    }));
    return (
        <div style={{ position: "relative", width: 300, height: 300, overflow: "hidden" }}>
            {flames.map((f, i) => {
                const t = Math.max(0, Math.min(1, (progress - f.delay) / 0.5));
                const flicker = 1 + Math.sin(progress * 20 + i * 3) * 0.2;
                const y = interpolate(t, [0, 1], [250, 250 - f.height * 2]);
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: f.x,
                        top: y,
                        width: 0, height: 0,
                        borderLeft: "10px solid transparent",
                        borderRight: "10px solid transparent",
                        borderBottom: `${f.height * flicker}px solid rgba(255,255,255,0.7)`,
                        opacity: interpolate(t, [0, 0.3, 0.8], [0, 0.8, 0.6]),
                        filter: "blur(1px)",
                    }} />
                );
            })}
        </div>
    );
};

const Waves: React.FC<{ progress: number }> = ({ progress }) => {
    return (
        <svg width="300" height="300" viewBox="0 0 300 200" style={{ marginTop: 50 }}>
            {[0, 1, 2].map((i) => {
                const yOffset = 60 + i * 35;
                const t = progress * Math.PI * 2 + i * 0.8;
                const points = Array.from({ length: 30 }, (_, j) => {
                    const x = j * 11;
                    const y = yOffset + Math.sin(t + j * 0.5) * (15 - i * 3);
                    return `${x},${y}`;
                }).join(" ");
                const opacity = interpolate(progress, [i * 0.1, i * 0.1 + 0.3], [0, 0.7 - i * 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return <polyline key={i} points={points} fill="none" stroke="white" strokeWidth="1.5" opacity={opacity} />;
            })}
        </svg>
    );
};

const Clock: React.FC<{ progress: number }> = ({ progress }) => {
    const handAngle = interpolate(progress, [0, 1], [0, 360]);
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1.5" opacity={interpolate(progress, [0, 0.2], [0, 0.8], { extrapolateRight: "clamp" })} />
                {/* Hour marks */}
                {Array.from({ length: 12 }).map((_, i) => {
                    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
                    return <line key={i} x1={100 + Math.cos(a) * 70} y1={100 + Math.sin(a) * 70} x2={100 + Math.cos(a) * 78} y2={100 + Math.sin(a) * 78} stroke="white" strokeWidth="1.5" opacity={0.5} />;
                })}
                {/* Hand */}
                <line x1="100" y1="100" x2={100 + Math.cos((handAngle - 90) * Math.PI / 180) * 55} y2={100 + Math.sin((handAngle - 90) * Math.PI / 180) * 55} stroke="white" strokeWidth="2" />
                <circle cx="100" cy="100" r="4" fill="white" />
            </svg>
        </div>
    );
};

const Lightning: React.FC<{ progress: number }> = ({ progress }) => {
    const flash = progress > 0.2 && progress < 0.35 ? 1 : 0;
    const boltOpacity = interpolate(progress, [0.15, 0.25, 0.7, 1], [0, 1, 1, 0.3]);
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {/* Flash overlay */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundColor: "rgba(255,255,255,0.15)",
                opacity: flash,
            }} />
            <svg width="300" height="300" viewBox="0 0 300 300" style={{ position: "absolute" }}>
                <polygon
                    points="170,30 120,140 160,140 110,280 200,150 155,150"
                    fill="white" opacity={boltOpacity}
                    filter="url(#glow)"
                />
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

const Scale: React.FC<{ progress: number }> = ({ progress }) => {
    const tilt = Math.sin(progress * Math.PI * 3) * 8;
    const drawP = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
    return (
        <svg width="300" height="300" viewBox="0 0 300 300">
            {/* Base */}
            <polygon points="120,250 180,250 150,180" fill="none" stroke="white" strokeWidth="1.5" opacity={drawP} />
            {/* Beam */}
            <line x1="70" y1="160" x2="230" y2="160" stroke="white" strokeWidth="2" opacity={drawP}
                transform={`rotate(${tilt}, 150, 160)`} />
            {/* Pivot */}
            <circle cx="150" cy="160" r="5" fill="white" opacity={drawP} />
            {/* Left pan */}
            <circle cx="80" cy={155 - tilt} r="20" fill="none" stroke="white" strokeWidth="1.5" opacity={drawP * 0.8} />
            {/* Right pan */}
            <circle cx="220" cy={155 + tilt} r="20" fill="none" stroke="white" strokeWidth="1.5" opacity={drawP * 0.8} />
        </svg>
    );
};

const Stairs: React.FC<{ progress: number }> = ({ progress }) => {
    const steps = 5;
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {Array.from({ length: steps }).map((_, i) => {
                const delay = i * 0.12;
                const p = Math.max(0, Math.min(1, (progress - delay) / 0.3));
                const x = 60 + i * 38;
                const y = 230 - i * 35;
                return (
                    <div key={i} style={{
                        position: "absolute", left: x, top: y,
                        width: 40, height: 4,
                        backgroundColor: "white",
                        opacity: interpolate(p, [0, 1], [0, 0.8]),
                        transform: `scaleX(${p})`,
                        boxShadow: "0 0 10px rgba(255,255,255,0.2)",
                    }} />
                );
            })}
        </div>
    );
};

const Shatter: React.FC<{ progress: number }> = ({ progress }) => {
    const shards = Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return { angle, speed: 1 + (i % 3) * 0.5, size: 8 + (i % 4) * 5 };
    });
    const preCrack = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
    const explode = interpolate(progress, [0.3, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Initial circle */}
            {explode < 0.5 && (
                <div style={{
                    width: 70 * preCrack, height: 70 * preCrack, borderRadius: "50%",
                    border: "2px solid white", position: "absolute",
                    boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                }} />
            )}
            {/* Shards flying out */}
            {shards.map((s, i) => {
                const dist = explode * 120 * s.speed;
                const x = 150 + Math.cos(s.angle) * dist;
                const y = 150 + Math.sin(s.angle) * dist;
                return (
                    <div key={i} style={{
                        position: "absolute", left: x - s.size / 2, top: y - s.size / 2,
                        width: s.size, height: s.size * 0.6,
                        backgroundColor: "white",
                        opacity: interpolate(explode, [0, 0.3, 1], [0, 0.8, 0]),
                        transform: `rotate(${s.angle * 180 / Math.PI + explode * 180}deg)`,
                    }} />
                );
            })}
        </div>
    );
};

// ========== COMPOSE: Dynamic Shape Composition ==========

const ComposeShapes: React.FC<{
    progress: number;
    shape: "circle" | "triangle" | "square" | "line" | "dot";
    count: number;
    arrangement: "flower" | "ring" | "stack" | "grid" | "scatter" | "row";
    label?: string;
}> = ({ progress, shape, count, arrangement, label }) => {
    const positions = getArrangementPositions(count, arrangement);

    const renderShape = (size: number) => {
        const s: React.CSSProperties = { width: size, height: size, position: "absolute" as const, transform: "translate(-50%, -50%)" };
        switch (shape) {
            case "circle":
                return <div style={{ ...s, borderRadius: "50%", border: "1.5px solid white" }} />;
            case "dot":
                return <div style={{ ...s, borderRadius: "50%", backgroundColor: "white" }} />;
            case "square":
                return <div style={{ ...s, border: "1.5px solid white" }} />;
            case "triangle":
                return (
                    <div style={{
                        ...s, width: 0, height: 0, border: "none",
                        borderLeft: `${size / 2}px solid transparent`,
                        borderRight: `${size / 2}px solid transparent`,
                        borderBottom: `${size}px solid white`,
                        opacity: 0.8,
                    }} />
                );
            case "line":
                return <div style={{ ...s, height: 2, backgroundColor: "white", borderRadius: 1 }} />;
            default:
                return <div style={{ ...s, borderRadius: "50%", border: "1.5px solid white" }} />;
        }
    };

    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {positions.map((pos, i) => {
                const delay = i * (0.5 / count);
                const p = Math.max(0, Math.min(1, (progress - delay) / 0.4));
                const scale = interpolate(p, [0, 0.5, 1], [0, 1.1, 1]);
                const opacity = interpolate(p, [0, 0.3, 1], [0, 1, 0.8]);
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: 150 + pos.x,
                        top: 150 + pos.y,
                        transform: `scale(${scale})`,
                        opacity,
                    }}>
                        {renderShape(40)}
                    </div>
                );
            })}
            {/* Label */}
            {label && (
                <div style={{
                    position: "absolute",
                    bottom: 10,
                    width: "100%",
                    textAlign: "center",
                    color: "white",
                    fontSize: 16,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    opacity: interpolate(progress, [0.5, 0.7], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}>
                    {label}
                </div>
            )}
        </div>
    );
};

function getArrangementPositions(count: number, arrangement: string): { x: number; y: number }[] {
    switch (arrangement) {
        case "flower":
            return Array.from({ length: count }, (_, i) => {
                const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
                return { x: Math.cos(angle) * 50, y: Math.sin(angle) * 50 };
            });
        case "ring":
            return Array.from({ length: count }, (_, i) => {
                const angle = (i / count) * Math.PI * 2;
                return { x: Math.cos(angle) * 80, y: Math.sin(angle) * 80 };
            });
        case "row":
            const spacing = 250 / (count + 1);
            return Array.from({ length: count }, (_, i) => ({
                x: -125 + spacing * (i + 1), y: 0,
            }));
        case "stack":
            return Array.from({ length: count }, (_, i) => ({
                x: 0, y: -60 + i * (120 / (count - 1 || 1)),
            }));
        case "grid": {
            const cols = Math.ceil(Math.sqrt(count));
            return Array.from({ length: count }, (_, i) => ({
                x: -50 + (i % cols) * (100 / (cols - 1 || 1)),
                y: -50 + Math.floor(i / cols) * (100 / (Math.ceil(count / cols) - 1 || 1)),
            }));
        }
        case "scatter":
        default:
            return Array.from({ length: count }, (_, i) => ({
                x: Math.sin(i * 2.4) * 80,
                y: Math.cos(i * 1.7) * 80,
            }));
    }
}

// ========== MASTER COMPONENT ==========

interface VisualSymbolProps {
    phrase: PhraseData;
    progress: number; // 0 to 1
}

export const VisualSymbol: React.FC<VisualSymbolProps> = ({ phrase, progress }) => {
    const showSpotlight = ["door", "sunrise", "stairs", "mountain"].includes(phrase.visual);

    const renderSymbol = () => {
        switch (phrase.visual) {
            case "footsteps": return <Footsteps progress={progress} />;
            case "door": return <Door progress={progress} />;
            case "sunrise": return <Sunrise progress={progress} />;
            case "flower": return <Flower progress={progress} />;
            case "drops": return <Drops progress={progress} />;
            case "mountain": return <Mountain progress={progress} />;
            case "heartbeat": return <Heartbeat progress={progress} />;
            case "eye": return <Eye progress={progress} />;
            case "fire": return <Fire progress={progress} />;
            case "waves": return <Waves progress={progress} />;
            case "clock": return <Clock progress={progress} />;
            case "lightning": return <Lightning progress={progress} />;
            case "scale": return <Scale progress={progress} />;
            case "stairs": return <Stairs progress={progress} />;
            case "shatter": return <Shatter progress={progress} />;
            case "compose":
                return (
                    <ComposeShapes
                        progress={progress}
                        shape={phrase.composeShape || "circle"}
                        count={phrase.composeCount || 4}
                        arrangement={phrase.composeArrangement || "flower"}
                        label={phrase.composeLabel}
                    />
                );
            default: return <Flower progress={progress} />;
        }
    };

    return (
        <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {showSpotlight && <SpotlightBeam progress={progress} />}
            {renderSymbol()}
        </div>
    );
};
