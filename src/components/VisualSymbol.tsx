import React from "react";
import {
    interpolate,
} from "remotion";
import type { PhraseData } from "../schema";

// ========== LAYER 1: AMBIENT PARTICLES ==========

/**
 * Floating particles that create atmosphere behind the main symbol.
 * Uses deterministic pseudo-random positions based on seed for consistency.
 */
const AmbientParticles: React.FC<{
    progress: number;
    count?: number;
    color?: string;
    seed?: number;
}> = ({ progress, count = 12, color = "rgba(255,255,255,0.3)", seed = 42 }) => {
    // Deterministic pseudo-random using seed
    const rng = (i: number) => {
        const x = Math.sin(seed * 9301 + i * 49297 + 233280) * 0.5 + 0.5;
        return x;
    };

    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            {Array.from({ length: count }, (_, i) => {
                const x = rng(i * 3) * 100;
                const startY = rng(i * 3 + 1) * 100;
                const size = 2 + rng(i * 3 + 2) * 4;
                const speed = 0.5 + rng(i * 5) * 1.5;
                const drift = Math.sin(progress * Math.PI * speed + i * 1.2) * 15;
                const y = startY - progress * 30 * speed;
                const opacity = interpolate(
                    progress,
                    [0, 0.15, 0.7, 1],
                    [0, 0.6, 0.4, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ) * (0.3 + rng(i * 7) * 0.7);

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

// ========== LAYER 2: GLOW HALO ==========

/**
 * Soft pulsing radial glow behind the main symbol.
 * Color tint matches the visual mood.
 */
const GlowHalo: React.FC<{
    progress: number;
    color?: string;
    size?: number;
}> = ({ progress, color = "rgba(255,255,255,0.06)", size = 300 }) => {
    const pulse = 1 + Math.sin(progress * Math.PI * 3) * 0.1;
    const opacity = interpolate(
        progress,
        [0, 0.2, 0.8, 1],
        [0, 0.8, 0.6, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: size * pulse,
            height: size * pulse,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            opacity,
        }} />
    );
};

// ========== LAYER 3: EXPANDING RINGS (secondary effect) ==========

const ExpandingRings: React.FC<{
    progress: number;
    count?: number;
}> = ({ progress, count = 3 }) => (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {Array.from({ length: count }, (_, i) => {
            const delay = i * 0.15;
            const p = Math.max(0, Math.min(1, (progress - delay) / 0.5));
            const scale = 0.5 + p * 1.5;
            const opacity = interpolate(p, [0, 0.3, 0.8, 1], [0, 0.4, 0.15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
                <div key={i} style={{
                    position: "absolute",
                    width: 60, height: 60,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.5)",
                    transform: `scale(${scale})`,
                    opacity,
                }} />
            );
        })}
    </div>
);

// ========== LAYER 4: RISING PARTICLES (secondary effect for specific symbols) ==========

const RisingParticles: React.FC<{
    progress: number;
    count?: number;
}> = ({ progress, count = 8 }) => (
    <div style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: count }, (_, i) => {
            const x = 30 + Math.sin(i * 2.4) * 25;
            const startY = 80 - i * 5;
            const y = startY - progress * 60;
            const delay = i * 0.08;
            const p = Math.max(0, Math.min(1, (progress - delay) / 0.4));
            return (
                <div key={i} style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    opacity: interpolate(p, [0, 0.3, 0.8, 1], [0, 0.7, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }} />
            );
        })}
    </div>
);

// ========== PREMIUM NAMED SYMBOL RENDERERS — 15 ENHANCED SYMBOLS ==========

// Each now has gradient fills, secondary elements, and richer animation

const Footsteps: React.FC<{ progress: number }> = ({ progress }) => {
    const steps = [
        { x: -60, y: 80, delay: 0 },
        { x: 40, y: 30, delay: 0.15 },
        { x: -40, y: -20, delay: 0.3 },
        { x: 50, y: -70, delay: 0.45 },
    ];
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {/* Trail line connecting steps */}
            <svg style={{ position: "absolute", inset: 0, opacity: 0.15 }} viewBox="0 0 300 300">
                <path d={`M${150 + steps[0].x},${150 + steps[0].y} ${steps.map(s => `L${150 + s.x},${150 + s.y}`).join(' ')}`}
                    fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,4" />
            </svg>
            {steps.map((s, i) => {
                const p = Math.max(0, Math.min(1, (progress - s.delay) / 0.25));
                const scale = interpolate(p, [0, 0.3, 0.6, 1], [0, 1.2, 1, 0.95]);
                const opacity = interpolate(p, [0, 0.3, 1], [0, 1, 0.7]);
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: 150 + s.x - 12,
                        top: 150 + s.y - 18,
                        width: 24, height: 36,
                        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                        border: "1.5px solid rgba(255,255,255,0.8)",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
                        transform: `scale(${scale}) rotate(${i % 2 === 0 ? -15 : 15}deg)`,
                        opacity,
                        boxShadow: "0 0 15px rgba(255,255,255,0.1)",
                    }} />
                );
            })}
        </div>
    );
};

const Door: React.FC<{ progress: number }> = ({ progress }) => {
    const openAngle = interpolate(progress, [0, 0.4, 0.8, 1], [0, 50, 65, 60]);
    const glow = interpolate(progress, [0.2, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Light rays from opening */}
            {glow > 0.3 && Array.from({ length: 5 }, (_, i) => (
                <div key={i} style={{
                    position: "absolute",
                    width: 2, height: 80 + i * 20,
                    background: "linear-gradient(rgba(255,255,255,0.1), transparent)",
                    transformOrigin: "bottom center",
                    transform: `rotate(${-30 + i * 15}deg)`,
                    opacity: glow * 0.3,
                    filter: "blur(3px)",
                }} />
            ))}
            <div style={{ width: 100, height: 160, border: "2px solid white", borderRadius: "4px 4px 0 0", overflow: "hidden", perspective: 400, boxShadow: "0 0 30px rgba(255,255,255,0.05)" }}>
                <div style={{
                    width: "100%", height: "100%",
                    background: `linear-gradient(rgba(255,255,255,${glow * 0.15}), rgba(255,255,255,${glow * 0.05}))`,
                    transformOrigin: "left center",
                    transform: `rotateY(${openAngle}deg)`,
                    borderRight: "1.5px solid rgba(255,255,255,0.5)",
                }} />
            </div>
        </div>
    );
};

const Sunrise: React.FC<{ progress: number }> = ({ progress }) => {
    const sunY = interpolate(progress, [0, 0.6, 1], [40, -20, -30]);
    const sunScale = interpolate(progress, [0, 0.3, 0.6], [0.5, 1, 1.1], { extrapolateRight: "clamp" });
    const rays = 10;
    return (
        <div style={{ position: "relative", width: 300, height: 300, overflow: "hidden" }}>
            {/* Horizon glow */}
            <div style={{
                position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
                width: 250, height: 100,
                background: "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.08) 0%, transparent 70%)",
                opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }} />
            <div style={{ position: "absolute", bottom: 100, left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />
            <div style={{ position: "absolute", left: "50%", bottom: 100 + sunY, transform: `translate(-50%, 50%) scale(${sunScale})` }}>
                {Array.from({ length: rays }).map((_, i) => {
                    const angle = (i / rays) * 180 - 90;
                    const rayLen = interpolate(progress, [0.1 + i * 0.04, 0.3 + i * 0.04], [0, 50 + i * 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                    return (
                        <div key={i} style={{
                            position: "absolute", left: 0, top: 0,
                            width: 1.5, height: rayLen,
                            background: "linear-gradient(rgba(255,255,255,0.5), transparent)",
                            transformOrigin: "bottom center",
                            transform: `rotate(${angle}deg) translateY(-${rayLen}px)`,
                        }} />
                    );
                })}
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid white", transform: "translate(-50%, -50%)", background: "radial-gradient(rgba(255,255,255,0.1), transparent)", boxShadow: "0 0 30px rgba(255,255,255,0.15)" }} />
            </div>
        </div>
    );
};

const Flower: React.FC<{ progress: number }> = ({ progress }) => {
    const petals = 7;
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {Array.from({ length: petals }).map((_, i) => {
                const angle = (i / petals) * 360;
                const delay = i * 0.06;
                const p = Math.max(0, Math.min(1, (progress - delay) / 0.35));
                const petalScale = interpolate(p, [0, 0.4, 0.7, 1], [0, 1.15, 1, 0.95]);
                const dist = interpolate(p, [0, 1], [0, 50]);
                return (
                    <div key={i} style={{
                        position: "absolute", left: 150, top: 150,
                        width: 20, height: 40,
                        borderRadius: "50%",
                        border: "1.5px solid rgba(255,255,255,0.7)",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
                        transform: `rotate(${angle}deg) translateY(-${dist}px) scale(${petalScale})`,
                        transformOrigin: "center bottom",
                        boxShadow: "0 0 10px rgba(255,255,255,0.05)",
                    }} />
                );
            })}
            <div style={{
                position: "absolute", left: 143, top: 143,
                width: 14, height: 14, borderRadius: "50%",
                background: "radial-gradient(white, rgba(255,255,255,0.5))",
                transform: `scale(${interpolate(progress, [0.3, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                boxShadow: "0 0 20px rgba(255,255,255,0.2)",
            }} />
        </div>
    );
};

const Drops: React.FC<{ progress: number }> = ({ progress }) => {
    const drops = [
        { x: -40, delay: 0 }, { x: 0, delay: 0.12 },
        { x: 40, delay: 0.24 }, { x: -20, delay: 0.36 }, { x: 20, delay: 0.48 },
    ];
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {/* Ripple at bottom */}
            <div style={{
                position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
                width: 120, height: 20, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
                opacity: interpolate(progress, [0.4, 0.6], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }} />
            {drops.map((d, i) => {
                const p = Math.max(0, Math.min(1, (progress - d.delay) / 0.3));
                const y = interpolate(p, [0, 1], [-60, 80]);
                const opacity = interpolate(p, [0, 0.15, 0.7, 1], [0, 0.9, 0.7, 0]);
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: 150 + d.x - 6, top: 100 + y,
                        width: 12, height: 18,
                        borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%",
                        border: "1.5px solid white",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                        opacity,
                        boxShadow: "0 0 12px rgba(255,255,255,0.1)",
                    }} />
                );
            })}
        </div>
    );
};

const Mountain: React.FC<{ progress: number }> = ({ progress }) => {
    const mainScale = interpolate(progress, [0, 0.4, 1], [0.3, 1, 1]);
    const flagP = interpolate(progress, [0.5, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            {/* Snow cap glow */}
            <div style={{
                position: "absolute", top: 75, left: "50%", transform: "translateX(-50%)",
                width: 40, height: 25,
                background: "radial-gradient(rgba(255,255,255,0.15), transparent)",
                opacity: mainScale,
            }} />
            <div style={{ transform: `scaleY(${mainScale})`, transformOrigin: "bottom center" }}>
                <div style={{
                    width: 0, height: 0,
                    borderLeft: "80px solid transparent",
                    borderRight: "80px solid transparent",
                    borderBottom: "140px solid rgba(255,255,255,0.12)",
                    filter: "drop-shadow(0 0 15px rgba(255,255,255,0.05))",
                }} />
            </div>
            {/* Secondary smaller mountain */}
            <div style={{ position: "absolute", bottom: 60, left: 90, transform: `scaleY(${mainScale * 0.8})`, transformOrigin: "bottom center", opacity: 0.4 }}>
                <div style={{ width: 0, height: 0, borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: "70px solid rgba(255,255,255,0.1)" }} />
            </div>
            <div style={{ position: "absolute", top: 80, left: "50%", width: 1.5, height: 30 * flagP, backgroundColor: "white", transform: "translateX(-50%)" }} />
            <div style={{ position: "absolute", top: 75, left: "50%", width: 15, height: 10, border: "1.5px solid white", opacity: flagP }} />
        </div>
    );
};

const Heartbeat: React.FC<{ progress: number }> = ({ progress }) => {
    const beat = 1 + Math.sin(progress * Math.PI * 6) * 0.18;
    const opacity = interpolate(progress, [0, 0.15, 0.8, 1], [0, 1, 1, 0.6]);
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Pulse rings */}
            {[1, 2, 3].map((ring) => (
                <div key={ring} style={{
                    position: "absolute",
                    width: 60 + ring * 40,
                    height: 60 + ring * 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.12)",
                    opacity: interpolate(progress, [0.15 * ring, 0.15 * ring + 0.3], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    transform: `scale(${beat})`,
                }} />
            ))}
            <div style={{ transform: `scale(${beat})`, opacity }}>
                <svg width="80" height="70" viewBox="0 0 80 70">
                    <path d="M40 65 C20 45 0 30 0 15 A15 15 0 0 1 40 15 A15 15 0 0 1 80 15 C80 30 60 45 40 65Z"
                        fill="rgba(255,255,255,0.06)" stroke="white" strokeWidth="2"
                        style={{ filter: "drop-shadow(0 0 15px rgba(255,255,255,0.15))" }} />
                </svg>
            </div>
        </div>
    );
};

const Eye: React.FC<{ progress: number }> = ({ progress }) => {
    const openness = interpolate(progress, [0, 0.3, 0.5, 1], [0.1, 1, 1, 0.8]);
    const irisScale = interpolate(progress, [0.2, 0.5], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Vision rays */}
            {openness > 0.5 && Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{
                    position: "absolute", width: 1, height: 40 + i * 10,
                    background: "linear-gradient(rgba(255,255,255,0.08), transparent)",
                    transform: `rotate(${i * 60}deg)`,
                    opacity: (openness - 0.5) * 0.6,
                }} />
            ))}
            <div style={{ width: 120, height: 60 * openness, borderRadius: "50%", border: "2px solid white", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 25px rgba(255,255,255,0.08)" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid white", transform: `scale(${irisScale})`, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(rgba(255,255,255,0.1), transparent)" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(white, rgba(255,255,255,0.6))" }} />
                </div>
            </div>
        </div>
    );
};

const Fire: React.FC<{ progress: number }> = ({ progress }) => {
    const flames = [
        { x: -20, h: 85, delay: 0 },
        { x: 0, h: 115, delay: 0.08 },
        { x: 20, h: 85, delay: 0.16 },
        { x: -10, h: 65, delay: 0.12 },
        { x: 10, h: 65, delay: 0.2 },
    ];
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            {/* Embers rising */}
            {Array.from({ length: 6 }, (_, i) => {
                const emberP = Math.max(0, Math.min(1, (progress - 0.2 - i * 0.1) / 0.5));
                return (
                    <div key={`ember-${i}`} style={{
                        position: "absolute",
                        bottom: 120 + emberP * 80,
                        left: 140 + Math.sin(i * 3.7) * 30,
                        width: 3, height: 3,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.5)",
                        opacity: interpolate(emberP, [0, 0.3, 0.8, 1], [0, 0.6, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    }} />
                );
            })}
            {flames.map((f, i) => {
                const p = Math.max(0, Math.min(1, (progress - f.delay) / 0.4));
                const flicker = 1 + Math.sin(progress * Math.PI * (8 + i)) * 0.12;
                const height = f.h * p * flicker;
                return (
                    <div key={i} style={{
                        position: "absolute", bottom: 80, left: 150 + f.x,
                        width: 20, height,
                        borderRadius: "50% 50% 20% 20%",
                        border: "1.5px solid rgba(255,255,255,0.7)",
                        background: "linear-gradient(rgba(255,255,255,0.08), transparent)",
                        transform: `translateX(-50%) scaleX(${0.6 + Math.sin(progress * 10 + i) * 0.2})`,
                        opacity: interpolate(p, [0, 0.2, 1], [0, 0.85, 0.65]),
                        boxShadow: "0 0 20px rgba(255,255,255,0.08)",
                    }} />
                );
            })}
        </div>
    );
};

const Waves: React.FC<{ progress: number }> = ({ progress }) => (
    <div style={{ position: "relative", width: 300, height: 300 }}>
        {[0, 1, 2, 3].map((i) => {
            const waveY = 140 + i * 30;
            const amplitude = 18 + i * 5;
            const phase = progress * Math.PI * 2 * (2 + i * 0.5) + i * 0.5;
            const points = Array.from({ length: 25 }, (_, j) => {
                const x = (j / 24) * 300;
                const y = waveY + Math.sin(phase + j * 0.3) * amplitude;
                return `${x},${y}`;
            }).join(" ");
            return (
                <svg key={i} style={{ position: "absolute", inset: 0 }} viewBox="0 0 300 300">
                    <polyline points={points} fill="none" stroke={`rgba(255,255,255,${0.55 - i * 0.1})`} strokeWidth="1.5" />
                </svg>
            );
        })}
    </div>
);

const Clock: React.FC<{ progress: number }> = ({ progress }) => {
    const minuteAngle = progress * 360;
    const hourAngle = progress * 30;
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", border: "2px solid white", position: "relative", boxShadow: "0 0 30px rgba(255,255,255,0.06), inset 0 0 20px rgba(255,255,255,0.03)" }}>
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 10 : 6, backgroundColor: "white", transformOrigin: "center 0", transform: `translateX(-50%) rotate(${i * 30}deg) translateY(-52px)`, opacity: i % 3 === 0 ? 0.7 : 0.35 }} />
                ))}
                <div style={{ position: "absolute", left: "50%", top: "50%", width: 2.5, height: 28, backgroundColor: "white", transformOrigin: "center top", transform: `translateX(-50%) rotate(${hourAngle}deg)`, borderRadius: 1 }} />
                <div style={{ position: "absolute", left: "50%", top: "50%", width: 1.5, height: 42, backgroundColor: "rgba(255,255,255,0.8)", transformOrigin: "center top", transform: `translateX(-50%) rotate(${minuteAngle}deg)`, borderRadius: 1 }} />
                <div style={{ position: "absolute", left: "50%", top: "50%", width: 6, height: 6, borderRadius: "50%", backgroundColor: "white", transform: "translate(-50%, -50%)" }} />
            </div>
        </div>
    );
};

const Lightning: React.FC<{ progress: number }> = ({ progress }) => {
    const flash = progress > 0.25 && progress < 0.4 ? 0.15 : 0;
    const boltOpacity = interpolate(progress, [0.15, 0.3, 0.5, 0.8], [0, 1, 1, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: `rgba(255,255,255,${flash})`, transition: "background-color 0.05s" }} />
            <svg width="80" height="140" viewBox="0 0 80 140" style={{ opacity: boltOpacity, filter: "drop-shadow(0 0 15px rgba(255,255,255,0.2))" }}>
                <polyline points="45,0 20,60 40,60 15,140 55,70 35,70 60,0" fill="rgba(255,255,255,0.06)" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
        </div>
    );
};

const Scale: React.FC<{ progress: number }> = ({ progress }) => {
    const tilt = Math.sin(progress * Math.PI * 2) * 15;
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 2, height: 80, backgroundColor: "white", position: "absolute", bottom: 90, boxShadow: "0 0 10px rgba(255,255,255,0.1)" }} />
            <div style={{ position: "absolute", bottom: 85, width: 30, height: 15, borderRadius: "0 0 50% 50%", border: "1.5px solid rgba(255,255,255,0.4)", borderTop: "none" }} />
            <div style={{ width: 160, height: 2, backgroundColor: "white", transform: `rotate(${tilt}deg)`, position: "absolute", top: 120 }}>
                <div style={{ position: "absolute", left: -10, top: -20, width: 30, height: 20, border: "1.5px solid white", borderTop: "none", borderRadius: "0 0 50% 50%", background: "rgba(255,255,255,0.04)" }} />
                <div style={{ position: "absolute", right: -10, top: -20, width: 30, height: 20, border: "1.5px solid white", borderTop: "none", borderRadius: "0 0 50% 50%", background: "rgba(255,255,255,0.04)" }} />
            </div>
        </div>
    );
};

const Stairs: React.FC<{ progress: number }> = ({ progress }) => {
    const stepCount = 6;
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {Array.from({ length: stepCount }).map((_, i) => {
                const delay = i * 0.1;
                const p = Math.max(0, Math.min(1, (progress - delay) / 0.2));
                const w = 45 + i * 12;
                return (
                    <div key={i} style={{
                        position: "absolute",
                        bottom: 50 + i * 32,
                        left: 150 - w / 2,
                        width: w, height: 6,
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                        opacity: interpolate(p, [0, 1], [0, 0.85]),
                        transform: `scaleX(${p})`,
                        boxShadow: "0 0 10px rgba(255,255,255,0.05)",
                    }} />
                );
            })}
            {/* Climber dot */}
            {progress > 0.3 && (
                <div style={{
                    position: "absolute",
                    bottom: 56 + Math.min(5, Math.floor(progress * 6)) * 32,
                    left: 148,
                    width: 6, height: 6, borderRadius: "50%",
                    backgroundColor: "white",
                    boxShadow: "0 0 10px rgba(255,255,255,0.4)",
                    opacity: interpolate(progress, [0.3, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }} />
            )}
        </div>
    );
};

const Shatter: React.FC<{ progress: number }> = ({ progress }) => {
    const shards = Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const dist = interpolate(progress, [0.15, 0.7], [0, 90 + (i % 3) * 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, rot: i * 25 + progress * 200 };
    });
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {/* Center impact flash */}
            <div style={{
                position: "absolute", left: "50%", top: "50%",
                width: 30, height: 30, borderRadius: "50%",
                background: "radial-gradient(white, transparent)",
                transform: "translate(-50%, -50%)",
                opacity: interpolate(progress, [0.1, 0.2, 0.4], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }} />
            {shards.map((s, i) => (
                <div key={i} style={{
                    position: "absolute",
                    left: 150 + s.x, top: 150 + s.y,
                    width: 10 + i % 4 * 5, height: 6 + i % 3 * 3,
                    border: "1px solid rgba(255,255,255,0.8)",
                    background: "rgba(255,255,255,0.05)",
                    transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
                    opacity: interpolate(progress, [0.08, 0.25, 0.85], [0, 0.85, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }} />
            ))}
        </div>
    );
};

// ========== COMPOSE SYSTEM (for non-keyword matched visuals) ==========

function renderComposeShape(shape: string, size: number): React.ReactNode {
    const s: React.CSSProperties = { width: size, height: size, position: "absolute" as const, transform: "translate(-50%, -50%)" };
    switch (shape) {
        case "circle": return <div style={{ ...s, borderRadius: "50%", border: "1.5px solid white", background: "radial-gradient(rgba(255,255,255,0.06), transparent)" }} />;
        case "dot": return <div style={{ ...s, borderRadius: "50%", background: "radial-gradient(white, rgba(255,255,255,0.4))", boxShadow: "0 0 12px rgba(255,255,255,0.2)" }} />;
        case "square": return <div style={{ ...s, border: "1.5px solid white", background: "linear-gradient(135deg, rgba(255,255,255,0.06), transparent)" }} />;
        case "triangle": return (
            <div style={{ ...s, width: 0, height: 0, border: "none", borderLeft: `${size / 2}px solid transparent`, borderRight: `${size / 2}px solid transparent`, borderBottom: `${size}px solid rgba(255,255,255,0.15)`, filter: "drop-shadow(0 0 8px rgba(255,255,255,0.08))" }} />
        );
        case "star": return (
            <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                <polygon points="20,2 25,15 38,15 27,24 31,38 20,29 9,38 13,24 2,15 15,15" fill="rgba(255,255,255,0.06)" stroke="white" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.1))" }} />
            </svg>
        );
        case "hexagon": return (
            <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="1.5" />
            </svg>
        );
        case "diamond": return <div style={{ ...s, border: "1.5px solid white", transform: "translate(-50%, -50%) rotate(45deg)", background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent)" }} />;
        case "cross": return (
            <div style={{ ...s }}>
                <div style={{ position: "absolute", left: "50%", top: 0, width: 2, height: "100%", backgroundColor: "white", transform: "translateX(-50%)" }} />
                <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 2, backgroundColor: "white", transform: "translateY(-50%)" }} />
            </div>
        );
        case "heart": return (
            <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                <path d="M20 35 C10 25 0 18 0 10 A8 8 0 0 1 20 10 A8 8 0 0 1 40 10 C40 18 30 25 20 35Z" fill="rgba(255,255,255,0.06)" stroke="white" strokeWidth="1.5" />
            </svg>
        );
        case "leaf": return (
            <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                <path d="M20 38 C5 30 2 15 10 5 C20 -2 35 5 38 15 C40 25 30 35 20 38Z" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="1.5" />
                <path d="M20 38 Q15 20 20 8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            </svg>
        );
        case "bolt": return (
            <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                <polyline points="25,2 12,20 22,20 8,38" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.15))" }} />
            </svg>
        );
        case "infinity": return (
            <svg width={size * 1.5} height={size} viewBox="0 0 60 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                <path d="M15 20 C15 10 5 10 5 20 C5 30 15 30 30 20 C45 10 55 10 55 20 C55 30 45 30 30 20 C15 10 15 10 15 20" fill="none" stroke="white" strokeWidth="1.5" />
            </svg>
        );
        case "spiral": return (
            <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                <path d="M20 20 Q20 10 25 10 Q35 10 35 20 Q35 35 20 35 Q5 35 5 20 Q5 5 20 5 Q40 5 40 20" fill="none" stroke="white" strokeWidth="1.5" />
            </svg>
        );
        case "crescent": return (
            <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                <path d="M25 5 A15 15 0 1 0 25 35 A12 12 0 1 1 25 5" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="1.5" />
            </svg>
        );
        default: return <div style={{ ...s, borderRadius: "50%", border: "1.5px solid white", background: "radial-gradient(rgba(255,255,255,0.06), transparent)" }} />;
    }
}

function getArrangementPositions(count: number, arrangement: string): { x: number; y: number }[] {
    switch (arrangement) {
        case "flower": return Array.from({ length: count }, (_, i) => ({ x: Math.cos((i / count) * Math.PI * 2 - Math.PI / 2) * 50, y: Math.sin((i / count) * Math.PI * 2 - Math.PI / 2) * 50 }));
        case "ring": return Array.from({ length: count }, (_, i) => ({ x: Math.cos((i / count) * Math.PI * 2) * 80, y: Math.sin((i / count) * Math.PI * 2) * 80 }));
        case "row": { const sp = 250 / (count + 1); return Array.from({ length: count }, (_, i) => ({ x: -125 + sp * (i + 1), y: 0 })); }
        case "stack": return Array.from({ length: count }, (_, i) => ({ x: 0, y: -60 + i * (120 / (count - 1 || 1)) }));
        case "grid": { const c = Math.ceil(Math.sqrt(count)); return Array.from({ length: count }, (_, i) => ({ x: -50 + (i % c) * (100 / (c - 1 || 1)), y: -50 + Math.floor(i / c) * (100 / (Math.ceil(count / c) - 1 || 1)) })); }
        case "spiral": return Array.from({ length: count }, (_, i) => ({ x: Math.cos((i / count) * Math.PI * 4) * (20 + (i / count) * 70), y: Math.sin((i / count) * Math.PI * 4) * (20 + (i / count) * 70) }));
        case "cascade": return Array.from({ length: count }, (_, i) => ({ x: -60 + (i / (count - 1 || 1)) * 120, y: -60 + (i / (count - 1 || 1)) * 120 }));
        case "burst": return Array.from({ length: count }, (_, i) => ({ x: Math.cos((i / count) * Math.PI * 2) * (40 + (i % 2) * 40), y: Math.sin((i / count) * Math.PI * 2) * (40 + (i % 2) * 40) }));
        case "orbit": return Array.from({ length: count }, (_, i) => ({ x: Math.cos((i / count) * Math.PI * 2) * 60, y: Math.sin((i / count) * Math.PI * 2) * 30 }));
        case "zigzag": return Array.from({ length: count }, (_, i) => ({ x: -80 + (i / (count - 1 || 1)) * 160, y: i % 2 === 0 ? -30 : 30 }));
        case "pyramid": { const p: { x: number; y: number }[] = []; let r = 0, pl = 0; while (pl < count) { const ir = r + 1; for (let c = 0; c < ir && pl < count; c++) { p.push({ x: (c - (ir - 1) / 2) * 40, y: -40 + r * 35 }); pl++; } r++; } return p; }
        case "wave": return Array.from({ length: count }, (_, i) => ({ x: -80 + (i / (count - 1 || 1)) * 160, y: Math.sin((i / count) * Math.PI * 2) * 40 }));
        case "radial": return Array.from({ length: count }, (_, i) => ({ x: Math.cos((i / count) * Math.PI * 2 - Math.PI / 2) * (30 + (i % 3) * 25), y: Math.sin((i / count) * Math.PI * 2 - Math.PI / 2) * (30 + (i % 3) * 25) }));
        default: return Array.from({ length: count }, (_, i) => ({ x: Math.sin(i * 2.4) * 80, y: Math.cos(i * 1.7) * 80 }));
    }
}

const ComposeShapes: React.FC<{
    progress: number; shape: string; count: number; arrangement: string; animation: string; label?: string;
}> = ({ progress, shape, count, arrangement, animation, label }) => {
    const positions = getArrangementPositions(count, arrangement);
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {positions.map((pos, i) => {
                const delay = i * (0.4 / count);
                const p = Math.max(0, Math.min(1, (progress - delay) / 0.4));
                const scale = animation === "bounce"
                    ? interpolate(p, [0, 0.3, 0.5, 0.7, 1], [0, 1.3, 0.9, 1.05, 1])
                    : interpolate(p, [0, 0.4, 1], [0, 1.1, 1]);
                const rotation = animation === "rotate" ? progress * 120 + i * 30
                    : animation === "spin" ? progress * 360 : 0;
                const floatY = animation === "float" ? Math.sin(progress * Math.PI * 3 + i * 0.8) * 12 : 0;
                const pulseScale = animation === "pulse" ? 1 + Math.sin(progress * Math.PI * 4 + i) * 0.15 : 1;
                const opacity = interpolate(p, [0, 0.2, 1], [0, 0.85, 0.75]);
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: 150 + pos.x,
                        top: 150 + pos.y + floatY,
                        transform: `scale(${scale * pulseScale}) rotate(${rotation}deg)`,
                        opacity,
                    }}>
                        {renderComposeShape(shape, 40)}
                    </div>
                );
            })}
            {label && (
                <div style={{
                    position: "absolute", bottom: 10, width: "100%", textAlign: "center",
                    color: "white", fontSize: 14, fontFamily: "'Inter', sans-serif",
                    letterSpacing: 2, textTransform: "uppercase",
                    opacity: interpolate(progress, [0.5, 0.7], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}>{label}</div>
            )}
        </div>
    );
};

// ========== VISUAL MOOD MAPPING (glow colors + particle styles) ==========

const visualMood: Record<string, { glowColor: string; particleColor: string }> = {
    footsteps: { glowColor: "rgba(200,200,255,0.06)", particleColor: "rgba(200,200,255,0.2)" },
    door: { glowColor: "rgba(255,240,200,0.08)", particleColor: "rgba(255,240,200,0.25)" },
    sunrise: { glowColor: "rgba(255,220,150,0.08)", particleColor: "rgba(255,220,150,0.25)" },
    flower: { glowColor: "rgba(200,255,200,0.06)", particleColor: "rgba(200,255,200,0.2)" },
    drops: { glowColor: "rgba(180,220,255,0.06)", particleColor: "rgba(180,220,255,0.2)" },
    mountain: { glowColor: "rgba(200,210,230,0.06)", particleColor: "rgba(200,210,230,0.2)" },
    heartbeat: { glowColor: "rgba(255,180,180,0.07)", particleColor: "rgba(255,180,180,0.25)" },
    eye: { glowColor: "rgba(180,230,255,0.06)", particleColor: "rgba(180,230,255,0.2)" },
    fire: { glowColor: "rgba(255,200,150,0.08)", particleColor: "rgba(255,200,150,0.3)" },
    waves: { glowColor: "rgba(150,210,255,0.06)", particleColor: "rgba(150,210,255,0.2)" },
    clock: { glowColor: "rgba(220,220,240,0.05)", particleColor: "rgba(220,220,240,0.2)" },
    lightning: { glowColor: "rgba(220,230,255,0.08)", particleColor: "rgba(220,230,255,0.3)" },
    scale: { glowColor: "rgba(220,220,220,0.05)", particleColor: "rgba(220,220,220,0.2)" },
    stairs: { glowColor: "rgba(200,220,255,0.06)", particleColor: "rgba(200,220,255,0.2)" },
    shatter: { glowColor: "rgba(255,210,210,0.07)", particleColor: "rgba(255,210,210,0.25)" },
    compose: { glowColor: "rgba(255,255,255,0.06)", particleColor: "rgba(255,255,255,0.2)" },
};

// ========== MASTER COMPONENT ==========

interface VisualSymbolProps {
    phrase: PhraseData;
    progress: number;
}

export const VisualSymbol: React.FC<VisualSymbolProps> = ({ phrase, progress }) => {
    const mood = visualMood[phrase.visual] || visualMood.compose;
    const showRings = ["heartbeat", "shatter", "lightning", "fire"].includes(phrase.visual);
    const showRising = ["mountain", "stairs", "sunrise", "fire"].includes(phrase.visual);

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
            default:
                return (
                    <ComposeShapes
                        progress={progress}
                        shape={phrase.composeShape || "circle"}
                        count={phrase.composeCount || 4}
                        arrangement={phrase.composeArrangement || "flower"}
                        animation={phrase.composeAnimation || "fadeIn"}
                        label={phrase.composeLabel}
                    />
                );
        }
    };

    // Deterministic seed from visual name for consistent particles
    const seed = phrase.visual.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + (phrase.text?.length || 0);

    return (
        <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {/* Layer 1: Ambient particles */}
            <AmbientParticles progress={progress} seed={seed} color={mood.particleColor} count={10} />

            {/* Layer 2: Glow halo */}
            <GlowHalo progress={progress} color={mood.glowColor} size={350} />

            {/* Layer 3: Secondary effects */}
            {showRings && <ExpandingRings progress={progress} />}
            {showRising && <RisingParticles progress={progress} />}

            {/* Layer 4: Main symbol */}
            <div style={{ transform: "scale(1.3)", position: "relative" }}>
                {renderSymbol()}
            </div>
        </div>
    );
};
