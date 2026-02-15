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

// ========== INDIVIDUAL SYMBOL RENDERERS (15 premium named symbols) ==========

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
                    <div key={i} style={{
                        position: "absolute",
                        left: 150 + s.x,
                        top: 150 + s.y,
                        width: 24, height: 36,
                        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                        border: "1.5px solid rgba(255,255,255,0.8)",
                        transform: `scale(${scale}) rotate(${i % 2 === 0 ? -15 : 15}deg)`,
                        opacity,
                    }} />
                );
            })}
        </div>
    );
};

const Door: React.FC<{ progress: number }> = ({ progress }) => {
    const openAngle = interpolate(progress, [0, 0.4, 0.8, 1], [0, 45, 60, 55]);
    const glow = interpolate(progress, [0.2, 0.5, 0.8], [0, 1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 100, height: 160, border: "2px solid white", borderRadius: "4px 4px 0 0", overflow: "hidden", perspective: 400 }}>
                <div style={{
                    width: "100%", height: "100%",
                    background: `rgba(255,255,255,${glow * 0.15})`,
                    transformOrigin: "left center",
                    transform: `rotateY(${openAngle}deg)`,
                    borderRight: "1.5px solid rgba(255,255,255,0.5)",
                }} />
            </div>
            <div style={{
                position: "absolute",
                width: 200, height: 200,
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(255,255,255,${glow * 0.1}) 0%, transparent 70%)`,
            }} />
        </div>
    );
};

const Sunrise: React.FC<{ progress: number }> = ({ progress }) => {
    const sunY = interpolate(progress, [0, 0.6, 1], [40, -20, -30]);
    const sunScale = interpolate(progress, [0, 0.3, 0.6], [0.5, 1, 1.1], { extrapolateRight: "clamp" });
    const rays = 8;
    return (
        <div style={{ position: "relative", width: 300, height: 300, overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: 100, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.3)" }} />
            <div style={{ position: "absolute", left: "50%", bottom: 100 + sunY, transform: `translate(-50%, 50%) scale(${sunScale})` }}>
                {Array.from({ length: rays }).map((_, i) => {
                    const angle = (i / rays) * 180 - 90;
                    const rayLen = interpolate(progress, [0.1 + i * 0.05, 0.3 + i * 0.05], [0, 60 + i * 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                    return (
                        <div key={i} style={{
                            position: "absolute", left: 0, top: 0,
                            width: 1.5, height: rayLen,
                            background: "rgba(255,255,255,0.4)",
                            transformOrigin: "bottom center",
                            transform: `rotate(${angle}deg) translateY(-${rayLen}px)`,
                        }} />
                    );
                })}
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid white", transform: "translate(-50%, -50%)" }} />
            </div>
        </div>
    );
};

const Flower: React.FC<{ progress: number }> = ({ progress }) => {
    const petals = 6;
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {Array.from({ length: petals }).map((_, i) => {
                const angle = (i / petals) * 360;
                const delay = i * 0.08;
                const p = Math.max(0, Math.min(1, (progress - delay) / 0.4));
                const petalScale = interpolate(p, [0, 0.5, 1], [0, 1.2, 1]);
                const dist = interpolate(p, [0, 1], [0, 50]);
                return (
                    <div key={i} style={{
                        position: "absolute", left: 150, top: 150,
                        width: 20, height: 40,
                        borderRadius: "50%",
                        border: "1.5px solid rgba(255,255,255,0.7)",
                        transform: `rotate(${angle}deg) translateY(-${dist}px) scale(${petalScale})`,
                        transformOrigin: "center bottom",
                    }} />
                );
            })}
            <div style={{
                position: "absolute", left: 143, top: 143,
                width: 14, height: 14, borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.8)",
                transform: `scale(${interpolate(progress, [0.3, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            }} />
        </div>
    );
};

const Drops: React.FC<{ progress: number }> = ({ progress }) => {
    const drops = [
        { x: -40, delay: 0 }, { x: 0, delay: 0.15 },
        { x: 40, delay: 0.3 }, { x: -20, delay: 0.45 }, { x: 20, delay: 0.6 },
    ];
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {drops.map((d, i) => {
                const p = Math.max(0, Math.min(1, (progress - d.delay) / 0.3));
                const y = interpolate(p, [0, 1], [-50, 100]);
                const opacity = interpolate(p, [0, 0.2, 0.8, 1], [0, 0.8, 0.6, 0]);
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: 150 + d.x, top: 100 + y,
                        width: 12, height: 18,
                        borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%",
                        border: "1.5px solid white",
                        opacity,
                    }} />
                );
            })}
        </div>
    );
};

const Mountain: React.FC<{ progress: number }> = ({ progress }) => {
    const mainScale = interpolate(progress, [0, 0.4, 1], [0.3, 1, 1]);
    const flagProgress = interpolate(progress, [0.5, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <div style={{ transform: `scaleY(${mainScale})`, transformOrigin: "bottom center" }}>
                <div style={{
                    width: 0, height: 0,
                    borderLeft: "80px solid transparent",
                    borderRight: "80px solid transparent",
                    borderBottom: "140px solid rgba(255,255,255,0.15)",
                }} />
            </div>
            <div style={{
                position: "absolute", top: 80, left: "50%",
                width: 1.5, height: 30 * flagProgress,
                backgroundColor: "white",
                transform: "translateX(-50%)",
            }} />
            <div style={{
                position: "absolute", top: 75, left: "50%",
                width: 15, height: 10,
                border: "1.5px solid white",
                opacity: flagProgress,
            }} />
        </div>
    );
};

const Heartbeat: React.FC<{ progress: number }> = ({ progress }) => {
    const beat = 1 + Math.sin(progress * Math.PI * 6) * 0.15;
    const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.6]);
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: `scale(${beat})`, opacity }}>
                <svg width="80" height="70" viewBox="0 0 80 70">
                    <path d="M40 65 C20 45 0 30 0 15 A15 15 0 0 1 40 15 A15 15 0 0 1 80 15 C80 30 60 45 40 65Z" fill="none" stroke="white" strokeWidth="2" />
                </svg>
            </div>
            {[1, 2, 3].map((ring) => (
                <div key={ring} style={{
                    position: "absolute",
                    width: 80 + ring * 40,
                    height: 80 + ring * 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.1)",
                    opacity: interpolate(progress, [0.2 * ring, 0.2 * ring + 0.3], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    transform: `scale(${beat})`,
                }} />
            ))}
        </div>
    );
};

const Eye: React.FC<{ progress: number }> = ({ progress }) => {
    const openness = interpolate(progress, [0, 0.3, 0.5, 1], [0.1, 1, 1, 0.8]);
    const irisScale = interpolate(progress, [0.2, 0.5], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 120, height: 60 * openness, borderRadius: "50%", border: "2px solid white", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                    width: 30, height: 30,
                    borderRadius: "50%",
                    border: "2px solid white",
                    transform: `scale(${irisScale})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "white" }} />
                </div>
            </div>
        </div>
    );
};

const Fire: React.FC<{ progress: number }> = ({ progress }) => {
    const flames = [
        { x: -20, h: 80, delay: 0 },
        { x: 0, h: 110, delay: 0.1 },
        { x: 20, h: 80, delay: 0.2 },
        { x: -10, h: 60, delay: 0.15 },
        { x: 10, h: 60, delay: 0.25 },
    ];
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            {flames.map((f, i) => {
                const p = Math.max(0, Math.min(1, (progress - f.delay) / 0.5));
                const flicker = 1 + Math.sin(progress * Math.PI * (8 + i)) * 0.1;
                const height = f.h * p * flicker;
                return (
                    <div key={i} style={{
                        position: "absolute",
                        bottom: 80,
                        left: 150 + f.x,
                        width: 20, height,
                        borderRadius: "50% 50% 20% 20%",
                        border: "1.5px solid rgba(255,255,255,0.6)",
                        transform: `translateX(-50%) scaleX(${0.6 + Math.sin(progress * 10 + i) * 0.2})`,
                        opacity: interpolate(p, [0, 0.3, 1], [0, 0.8, 0.6]),
                    }} />
                );
            })}
        </div>
    );
};

const Waves: React.FC<{ progress: number }> = ({ progress }) => (
    <div style={{ position: "relative", width: 300, height: 300 }}>
        {[0, 1, 2, 3].map((i) => {
            const waveY = 150 + i * 25;
            const amplitude = 15 + i * 5;
            const freq = 2 + i * 0.5;
            const phase = progress * Math.PI * 2 * freq + i * 0.5;
            const points = Array.from({ length: 20 }, (_, j) => {
                const x = (j / 19) * 300;
                const y = waveY + Math.sin(phase + j * 0.3) * amplitude;
                return `${x},${y}`;
            }).join(" ");
            return (
                <svg key={i} style={{ position: "absolute", inset: 0 }} viewBox="0 0 300 300">
                    <polyline points={points} fill="none" stroke={`rgba(255,255,255,${0.6 - i * 0.1})`} strokeWidth="1.5" />
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
            <div style={{ width: 120, height: 120, borderRadius: "50%", border: "2px solid white", position: "relative" }}>
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} style={{
                        position: "absolute", left: "50%", top: "50%",
                        width: 1.5, height: 8,
                        backgroundColor: "white",
                        transformOrigin: "center 0",
                        transform: `translateX(-50%) rotate(${i * 30}deg) translateY(-52px)`,
                        opacity: 0.5,
                    }} />
                ))}
                <div style={{
                    position: "absolute", left: "50%", top: "50%",
                    width: 2, height: 30,
                    backgroundColor: "white",
                    transformOrigin: "center top",
                    transform: `translateX(-50%) rotate(${hourAngle}deg)`,
                }} />
                <div style={{
                    position: "absolute", left: "50%", top: "50%",
                    width: 1.5, height: 42,
                    backgroundColor: "white",
                    transformOrigin: "center top",
                    transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
                    opacity: 0.8,
                }} />
            </div>
        </div>
    );
};

const Lightning: React.FC<{ progress: number }> = ({ progress }) => {
    const flash = progress > 0.3 && progress < 0.5 ? 0.2 : 0;
    const boltOpacity = interpolate(progress, [0.2, 0.35, 0.5, 0.8], [0, 1, 1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: `rgba(255,255,255,${flash})` }} />
            <svg width="80" height="140" viewBox="0 0 80 140" style={{ opacity: boltOpacity }}>
                <polyline points="45,0 20,60 40,60 15,140 55,70 35,70 60,0" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
        </div>
    );
};

const Scale: React.FC<{ progress: number }> = ({ progress }) => {
    const tilt = Math.sin(progress * Math.PI * 2) * 15;
    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
                width: 2, height: 80,
                backgroundColor: "white",
                position: "absolute", bottom: 90,
            }} />
            <div style={{
                width: 160, height: 2,
                backgroundColor: "white",
                transform: `rotate(${tilt}deg)`,
                position: "absolute", top: 120,
            }}>
                <div style={{ position: "absolute", left: -10, top: -20, width: 30, height: 20, border: "1.5px solid white", borderTop: "none", borderRadius: "0 0 50% 50%" }} />
                <div style={{ position: "absolute", right: -10, top: -20, width: 30, height: 20, border: "1.5px solid white", borderTop: "none", borderRadius: "0 0 50% 50%" }} />
            </div>
        </div>
    );
};

const Stairs: React.FC<{ progress: number }> = ({ progress }) => {
    const stepCount = 5;
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {Array.from({ length: stepCount }).map((_, i) => {
                const delay = i * 0.12;
                const p = Math.max(0, Math.min(1, (progress - delay) / 0.25));
                const w = 40 + i * 15;
                return (
                    <div key={i} style={{
                        position: "absolute",
                        bottom: 60 + i * 35,
                        left: 150 - w / 2,
                        width: w, height: 6,
                        backgroundColor: "rgba(255,255,255,0.5)",
                        opacity: interpolate(p, [0, 1], [0, 0.8]),
                        transform: `scaleX(${p})`,
                    }} />
                );
            })}
        </div>
    );
};

const Shatter: React.FC<{ progress: number }> = ({ progress }) => {
    const shards = Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const dist = interpolate(progress, [0.2, 0.8], [0, 100 + i * 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, rot: i * 30 + progress * 180 };
    });
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {shards.map((s, i) => (
                <div key={i} style={{
                    position: "absolute",
                    left: 150 + s.x, top: 150 + s.y,
                    width: 12 + i % 3 * 5, height: 8 + i % 2 * 4,
                    border: "1px solid white",
                    transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
                    opacity: interpolate(progress, [0.1, 0.3, 0.9], [0, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }} />
            ))}
        </div>
    );
};

// ========== EXPANDED COMPOSE SYSTEM (20 shapes × 14 arrangements × 12 animations) ==========

/**
 * Render a single shape by name — 20 distinct shapes.
 */
function renderComposeShape(shape: string, size: number): React.ReactNode {
    const s: React.CSSProperties = {
        width: size, height: size,
        position: "absolute" as const,
        transform: "translate(-50%, -50%)",
    };

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
                    borderBottom: `${size}px solid rgba(255,255,255,0.8)`,
                }} />
            );
        case "line":
            return <div style={{ ...s, height: 2, backgroundColor: "white", borderRadius: 1 }} />;
        case "star":
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <polygon points="20,2 25,15 38,15 27,24 31,38 20,29 9,38 13,24 2,15 15,15" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
            );
        case "hexagon":
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
            );
        case "diamond":
            return <div style={{ ...s, border: "1.5px solid white", transform: "translate(-50%, -50%) rotate(45deg)" }} />;
        case "cross":
            return (
                <div style={{ ...s }}>
                    <div style={{ position: "absolute", left: "50%", top: 0, width: 2, height: "100%", backgroundColor: "white", transform: "translateX(-50%)" }} />
                    <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 2, backgroundColor: "white", transform: "translateY(-50%)" }} />
                </div>
            );
        case "spiral":
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <path d="M20 20 Q20 10 25 10 Q35 10 35 20 Q35 35 20 35 Q5 35 5 20 Q5 5 20 5 Q40 5 40 20" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
            );
        case "arrow":
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <polyline points="10,30 20,10 30,30" fill="none" stroke="white" strokeWidth="1.5" />
                    <line x1="20" y1="10" x2="20" y2="38" stroke="white" strokeWidth="1.5" />
                </svg>
            );
        case "crescent":
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <path d="M25 5 A15 15 0 1 0 25 35 A12 12 0 1 1 25 5" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
            );
        case "ring":
            return (
                <div style={{
                    ...s, borderRadius: "50%",
                    border: "3px solid white",
                    boxShadow: "inset 0 0 0 4px transparent, 0 0 0 1px rgba(255,255,255,0.3)",
                }} />
            );
        case "pentagon":
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <polygon points="20,2 38,14 31,36 9,36 2,14" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
            );
        case "spark":
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeWidth="1.5" />
                    <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeWidth="1.5" />
                    <line x1="6" y1="6" x2="34" y2="34" stroke="white" strokeWidth="1" />
                    <line x1="34" y1="6" x2="6" y2="34" stroke="white" strokeWidth="1" />
                </svg>
            );
        case "infinity":
            return (
                <svg width={size * 1.5} height={size} viewBox="0 0 60 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <path d="M15 20 C15 10 5 10 5 20 C5 30 15 30 30 20 C45 10 55 10 55 20 C55 30 45 30 30 20 C15 10 15 10 15 20" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
            );
        case "heart":
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <path d="M20 35 C10 25 0 18 0 10 A8 8 0 0 1 20 10 A8 8 0 0 1 40 10 C40 18 30 25 20 35Z" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
            );
        case "leaf":
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <path d="M20 38 C5 30 2 15 10 5 C20 -2 35 5 38 15 C40 25 30 35 20 38Z" fill="none" stroke="white" strokeWidth="1.5" />
                    <path d="M20 38 Q15 20 20 8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                </svg>
            );
        case "bolt":
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <polyline points="25,2 12,20 22,20 8,38" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                </svg>
            );
        case "wave":
            return (
                <svg width={size * 1.5} height={size} viewBox="0 0 60 40" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                    <path d="M0 20 Q10 5 20 20 Q30 35 40 20 Q50 5 60 20" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
            );
        default:
            return <div style={{ ...s, borderRadius: "50%", border: "1.5px solid white" }} />;
    }
}

/**
 * Calculate positions for 14 arrangement types.
 */
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
        case "row": {
            const spacing = 250 / (count + 1);
            return Array.from({ length: count }, (_, i) => ({ x: -125 + spacing * (i + 1), y: 0 }));
        }
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
        case "spiral":
            return Array.from({ length: count }, (_, i) => {
                const angle = (i / count) * Math.PI * 4;
                const r = 20 + (i / count) * 70;
                return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
            });
        case "cascade":
            return Array.from({ length: count }, (_, i) => ({
                x: -60 + (i / (count - 1 || 1)) * 120,
                y: -60 + (i / (count - 1 || 1)) * 120,
            }));
        case "burst":
            return Array.from({ length: count }, (_, i) => {
                const angle = (i / count) * Math.PI * 2;
                const r = 40 + (i % 2) * 40;
                return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
            });
        case "orbit":
            return Array.from({ length: count }, (_, i) => {
                const angle = (i / count) * Math.PI * 2;
                const r = 60;
                return { x: Math.cos(angle) * r, y: Math.sin(angle) * r * 0.5 };
            });
        case "zigzag":
            return Array.from({ length: count }, (_, i) => ({
                x: -80 + (i / (count - 1 || 1)) * 160,
                y: i % 2 === 0 ? -30 : 30,
            }));
        case "pyramid": {
            const positions: { x: number; y: number }[] = [];
            let row = 0;
            let placed = 0;
            while (placed < count) {
                const itemsInRow = row + 1;
                for (let col = 0; col < itemsInRow && placed < count; col++) {
                    positions.push({
                        x: (col - (itemsInRow - 1) / 2) * 40,
                        y: -40 + row * 35,
                    });
                    placed++;
                }
                row++;
            }
            return positions;
        }
        case "wave":
            return Array.from({ length: count }, (_, i) => ({
                x: -80 + (i / (count - 1 || 1)) * 160,
                y: Math.sin((i / count) * Math.PI * 2) * 40,
            }));
        case "radial":
            return Array.from({ length: count }, (_, i) => {
                const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
                const r = 30 + (i % 3) * 25;
                return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
            });
        case "scatter":
        default:
            return Array.from({ length: count }, (_, i) => ({
                x: Math.sin(i * 2.4) * 80,
                y: Math.cos(i * 1.7) * 80,
            }));
    }
}

/**
 * Apply animation style to get transform/opacity modifiers.
 */
function getAnimationModifiers(
    animation: string,
    progress: number,
    itemIndex: number,
    itemCount: number,
): { scale: number; opacity: number; rotation: number; translateX: number; translateY: number } {
    const delay = itemIndex * (0.5 / itemCount);
    const p = Math.max(0, Math.min(1, (progress - delay) / 0.4));
    const base = { scale: 1, opacity: 1, rotation: 0, translateX: 0, translateY: 0 };

    switch (animation) {
        case "fadeIn":
            return { ...base, scale: interpolate(p, [0, 0.5, 1], [0, 1.1, 1]), opacity: interpolate(p, [0, 0.3, 1], [0, 1, 0.8]) };
        case "pulse":
            return { ...base, scale: 1 + Math.sin(progress * Math.PI * 4 + itemIndex) * 0.2, opacity: interpolate(p, [0, 0.2], [0, 0.9], { extrapolateRight: "clamp" }) };
        case "rotate":
            return { ...base, rotation: progress * 120 + itemIndex * 30, opacity: interpolate(p, [0, 0.2], [0, 0.85], { extrapolateRight: "clamp" }), scale: interpolate(p, [0, 0.3], [0.5, 1], { extrapolateRight: "clamp" }) };
        case "float":
            return { ...base, translateY: Math.sin(progress * Math.PI * 3 + itemIndex * 0.8) * 15, opacity: interpolate(p, [0, 0.2], [0, 0.85], { extrapolateRight: "clamp" }), scale: interpolate(p, [0, 0.3], [0.7, 1], { extrapolateRight: "clamp" }) };
        case "spin":
            return { ...base, rotation: progress * 360, opacity: interpolate(p, [0, 0.2], [0, 0.85], { extrapolateRight: "clamp" }) };
        case "morph":
            return { ...base, scale: 0.8 + Math.sin(progress * Math.PI * 2 + itemIndex) * 0.3, opacity: interpolate(p, [0, 0.2], [0, 0.9], { extrapolateRight: "clamp" }) };
        case "flicker": {
            const flick = Math.sin(progress * Math.PI * 12 + itemIndex * 2) > 0 ? 0.9 : 0.3;
            return { ...base, opacity: interpolate(p, [0, 0.1], [0, flick], { extrapolateRight: "clamp" }) };
        }
        case "bounce":
            return { ...base, scale: interpolate(p, [0, 0.3, 0.5, 0.7, 1], [0, 1.3, 0.9, 1.05, 1]), opacity: interpolate(p, [0, 0.1], [0, 0.9], { extrapolateRight: "clamp" }) };
        case "ripple": {
            const wave = Math.sin(progress * Math.PI * 4 - itemIndex * 0.7);
            return { ...base, scale: 1 + wave * 0.15, opacity: interpolate(p, [0, 0.2], [0, 0.8 + wave * 0.1], { extrapolateRight: "clamp" }) };
        }
        case "grow":
            return { ...base, scale: interpolate(p, [0, 0.6, 1], [0, 1.15, 1]), opacity: interpolate(p, [0, 0.1], [0, 0.9], { extrapolateRight: "clamp" }) };
        case "dissolve": {
            const reveal = Math.random() > (1 - p) ? 1 : 0;
            return { ...base, opacity: interpolate(p, [0, 0.5], [0, 0.85], { extrapolateRight: "clamp" }), scale: interpolate(p, [0, 0.3], [0.3, 1], { extrapolateRight: "clamp" }) };
        }
        case "glitch": {
            const glitchX = progress > 0.2 && progress < 0.4 ? (Math.random() - 0.5) * 10 : 0;
            return { ...base, translateX: glitchX, opacity: interpolate(p, [0, 0.15], [0, 0.9], { extrapolateRight: "clamp" }) };
        }
        default:
            return { ...base, scale: interpolate(p, [0, 0.5, 1], [0, 1.1, 1]), opacity: interpolate(p, [0, 0.3, 1], [0, 1, 0.8]) };
    }
}

/**
 * ComposeShapes — Dynamic visual system.
 * 20 shapes × 14 arrangements × 12 animations = 3360+ unique combinations.
 */
const ComposeShapes: React.FC<{
    progress: number;
    shape: string;
    count: number;
    arrangement: string;
    animation: string;
    label?: string;
}> = ({ progress, shape, count, arrangement, animation, label }) => {
    const positions = getArrangementPositions(count, arrangement);

    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            {positions.map((pos, i) => {
                const mods = getAnimationModifiers(animation, progress, i, count);
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: 150 + pos.x + mods.translateX,
                        top: 150 + pos.y + mods.translateY,
                        transform: `scale(${mods.scale}) rotate(${mods.rotation}deg)`,
                        opacity: mods.opacity,
                    }}>
                        {renderComposeShape(shape, 40)}
                    </div>
                );
            })}
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

    return (
        <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {showSpotlight && <SpotlightBeam progress={progress} />}
            <div style={{ transform: "scale(1.3)" }}>
                {renderSymbol()}
            </div>
        </div>
    );
};
