import React from "react";
import { interpolate } from "remotion";
import type { PhraseData } from "../schema";
import type { VisualTypeName } from "../schema";

// ========== TEXT-SEEDED RANDOM GENERATOR ==========

function hashText(text: string): number {
    let h = 0;
    for (let i = 0; i < text.length; i++) {
        h = ((h << 5) - h + text.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

function seededRandom(seed: number, index: number): number {
    const x = Math.sin(seed * 9301 + index * 49297 + 233280) * 10000;
    return x - Math.floor(x);
}

// ========== 15 NAMED PREMIUM VISUALS ==========
// Each returns a React element with animations driven by progress (0-1)

function renderFootsteps(progress: number): React.ReactNode {
    const count = 6;
    return (
        <div style={{ position: "relative", width: 200, height: 300 }}>
            {Array.from({ length: count }, (_, i) => {
                const delay = i * 0.12;
                const p = Math.max(0, Math.min(1, (progress - delay) / 0.25));
                const isLeft = i % 2 === 0;
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: isLeft ? 40 : 110,
                        top: 250 - i * 45,
                        opacity: interpolate(p, [0, 0.5, 1], [0, 0.8, 0.4]),
                        transform: `scale(${interpolate(p, [0, 0.3, 1], [0.3, 1.1, 1])}) rotate(${isLeft ? -15 : 15}deg)`,
                    }}>
                        <svg width="36" height="50" viewBox="0 0 36 50">
                            <ellipse cx="18" cy="35" rx="12" ry="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                            <ellipse cx="18" cy="12" rx="7" ry="9" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                        </svg>
                    </div>
                );
            })}
        </div>
    );
}

function renderDoor(progress: number): React.ReactNode {
    const doorOpen = interpolate(progress, [0.1, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const glowOpacity = interpolate(progress, [0.3, 0.6, 0.9], [0, 0.8, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 160, height: 220 }}>
            <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(255,255,255,0.4)", borderRadius: "8px 8px 0 0" }} />
            <div style={{ position: "absolute", left: 4, top: 4, width: `${60 + doorOpen * 30}%`, height: "calc(100% - 8px)", background: `linear-gradient(90deg, rgba(255,200,100,${glowOpacity * 0.3}), rgba(255,255,200,${glowOpacity * 0.15}), transparent)`, borderRadius: "6px 0 0 0", transform: `perspective(200px) rotateY(${doorOpen * -35}deg)`, transformOrigin: "left center", border: "1.5px solid rgba(255,255,255,0.35)" }} />
            <div style={{ position: "absolute", right: 20, top: "48%", width: 8, height: 8, borderRadius: "50%", backgroundColor: `rgba(255,200,100,${0.3 + glowOpacity * 0.5})` }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 180 * glowOpacity, height: 180 * glowOpacity, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,220,100,${glowOpacity * 0.12}), transparent)`, transform: "translate(-50%, -50%)" }} />
        </div>
    );
}

function renderSunrise(progress: number): React.ReactNode {
    const sunY = interpolate(progress, [0, 0.6], [60, -10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const glow = interpolate(progress, [0.1, 0.5, 0.9], [0, 1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const rayCount = 8;
    return (
        <div style={{ position: "relative", width: 250, height: 200, overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: 0, width: "100%", height: 2, backgroundColor: "rgba(255,255,255,0.3)" }} />
            <div style={{ position: "absolute", left: "50%", bottom: sunY, transform: "translateX(-50%)", width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,200,80,${glow * 0.6}), rgba(255,150,50,${glow * 0.3}), transparent)`, boxShadow: `0 0 40px rgba(255,180,60,${glow * 0.3})` }} />
            {Array.from({ length: rayCount }, (_, i) => {
                const angle = (i / rayCount) * Math.PI;
                const length = 50 + Math.sin(progress * 6 + i) * 15;
                return <line key={i} x1={125} y1={140 - sunY} x2={125 + Math.cos(angle) * length} y2={(140 - sunY) - Math.sin(angle) * length} stroke={`rgba(255,200,100,${glow * 0.25})`} strokeWidth="1" />;
            }).length > 0 && (
                    <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 250 200">
                        {Array.from({ length: rayCount }, (_, i) => {
                            const angle = (i / rayCount) * Math.PI;
                            const length = 50 + Math.sin(progress * 6 + i) * 15;
                            return <line key={i} x1={125} y1={140 - sunY} x2={125 + Math.cos(angle) * length} y2={(140 - sunY) - Math.sin(angle) * length} stroke={`rgba(255,200,100,${glow * 0.25})`} strokeWidth="1.5" />;
                        })}
                    </svg>
                )}
        </div>
    );
}

function renderFlower(progress: number): React.ReactNode {
    const petalCount = 6;
    const bloom = interpolate(progress, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 180, height: 180 }}>
            <svg viewBox="0 0 180 180" width="180" height="180">
                {Array.from({ length: petalCount }, (_, i) => {
                    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2;
                    const delay = i * 0.08;
                    const p = Math.max(0, Math.min(1, (bloom - delay) / 0.5));
                    const cx = 90 + Math.cos(angle) * 35 * p;
                    const cy = 90 + Math.sin(angle) * 35 * p;
                    return <ellipse key={i} cx={cx} cy={cy} rx={18 * p} ry={28 * p} fill={`rgba(255,180,200,${0.15 * p})`} stroke={`rgba(255,180,200,${0.5 * p})`} strokeWidth="1.2" transform={`rotate(${(angle * 180) / Math.PI + 90} ${cx} ${cy})`} />;
                })}
                <circle cx="90" cy="90" r={10 * bloom} fill={`rgba(255,220,100,${0.3 * bloom})`} stroke={`rgba(255,220,100,${0.6 * bloom})`} strokeWidth="1.5" />
            </svg>
        </div>
    );
}

function renderDrops(progress: number): React.ReactNode {
    const dropCount = 8;
    const seed = 42;
    return (
        <div style={{ position: "relative", width: 200, height: 250, overflow: "hidden" }}>
            {Array.from({ length: dropCount }, (_, i) => {
                const x = seededRandom(seed, i * 3) * 180 + 10;
                const speed = 0.6 + seededRandom(seed, i * 3 + 1) * 0.8;
                const startY = -20 - seededRandom(seed, i * 3 + 2) * 100;
                const y = startY + progress * 300 * speed;
                const opacity = y > 250 ? 0 : interpolate(progress, [0, 0.1, 0.8, 1], [0, 0.6, 0.4, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                    <svg key={i} style={{ position: "absolute", left: x, top: y % 270, opacity }} width="12" height="18" viewBox="0 0 12 18">
                        <path d="M6 0 C6 0 0 10 0 13 A6 6 0 0 0 12 13 C12 10 6 0 6 0Z" fill="none" stroke="rgba(150,200,255,0.6)" strokeWidth="1.2" />
                    </svg>
                );
            })}
        </div>
    );
}

function renderMountain(progress: number): React.ReactNode {
    const climb = interpolate(progress, [0, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const flag = interpolate(progress, [0.6, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 240, height: 200 }}>
            <svg viewBox="0 0 240 200" width="240" height="200">
                {/* Main mountain */}
                <polygon points="120,20 30,180 210,180" fill="none" stroke="rgba(200,200,255,0.5)" strokeWidth="1.8" />
                {/* Snow cap */}
                <polygon points="120,20 100,60 140,60" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                {/* Smaller mountain */}
                <polygon points="180,80 130,180 230,180" fill="none" stroke="rgba(200,200,255,0.25)" strokeWidth="1.2" />
                {/* Climber dot */}
                <circle cx={75 + climb * 45} cy={180 - climb * 160} r="4" fill={`rgba(255,200,100,${0.5 + climb * 0.4})`} />
                {/* Climber trail */}
                <path d={`M75,180 Q${75 + climb * 20},${180 - climb * 80} ${75 + climb * 45},${180 - climb * 160}`} fill="none" stroke={`rgba(255,200,100,${climb * 0.3})`} strokeWidth="1" strokeDasharray="3,3" />
                {/* Flag at summit */}
                {flag > 0 && <g opacity={flag}>
                    <line x1="120" y1="20" x2="120" y2="5" stroke="rgba(255,100,100,0.7)" strokeWidth="1.5" />
                    <polygon points="120,5 140,10 120,15" fill="rgba(255,100,100,0.4)" stroke="rgba(255,100,100,0.6)" strokeWidth="1" />
                </g>}
            </svg>
        </div>
    );
}

function renderHeartbeat(progress: number): React.ReactNode {
    const pulse = 1 + Math.sin(progress * Math.PI * 6) * 0.15;
    const opacity = interpolate(progress, [0, 0.15, 0.8, 1], [0, 0.8, 0.6, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 200, height: 180 }}>
            <svg viewBox="0 0 200 180" width="200" height="180" style={{ transform: `scale(${pulse})`, transition: "transform 0.05s" }}>
                <path d="M100 160 C60 120 10 90 10 55 A35 35 0 0 1 100 55 A35 35 0 0 1 190 55 C190 90 140 120 100 160Z" fill={`rgba(255,100,120,${opacity * 0.12})`} stroke={`rgba(255,100,120,${opacity * 0.6})`} strokeWidth="2" />
            </svg>
            {/* ECG line */}
            <svg style={{ position: "absolute", bottom: -10, left: 0, width: 200, height: 40 }} viewBox="0 0 200 40">
                <polyline points={`0,20 ${progress * 200 * 0.3},20 ${progress * 200 * 0.35},5 ${progress * 200 * 0.4},35 ${progress * 200 * 0.45},20 ${progress * 200 * 0.55},20 ${progress * 200 * 0.6},12 ${progress * 200 * 0.65},20 ${Math.min(200, progress * 200)},20`} fill="none" stroke={`rgba(255,100,120,${opacity * 0.5})`} strokeWidth="1.5" />
            </svg>
        </div>
    );
}

function renderEye(progress: number): React.ReactNode {
    const open = interpolate(progress, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const iris = interpolate(progress, [0.2, 0.5, 0.8], [0, 1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 200, height: 120 }}>
            <svg viewBox="0 0 200 120" width="200" height="120">
                <ellipse cx="100" cy="60" rx="80" ry={40 * open} fill="none" stroke="rgba(180,220,255,0.5)" strokeWidth="2" />
                <circle cx="100" cy="60" r={25 * iris} fill={`rgba(100,180,255,${0.15 * iris})`} stroke={`rgba(100,180,255,${0.6 * iris})`} strokeWidth="1.5" />
                <circle cx="100" cy="60" r={10 * iris} fill={`rgba(30,30,30,${0.8 * iris})`} />
                <circle cx="108" cy="52" r={4 * iris} fill={`rgba(255,255,255,${0.5 * iris})`} />
            </svg>
        </div>
    );
}

function renderFire(progress: number): React.ReactNode {
    const intensity = interpolate(progress, [0, 0.3, 0.8, 1], [0, 1, 0.8, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const flicker = Math.sin(progress * Math.PI * 8) * 5;
    return (
        <div style={{ position: "relative", width: 140, height: 200 }}>
            <svg viewBox="0 0 140 200" width="140" height="200">
                {/* Outer flame */}
                <path d={`M70 ${20 + flicker} C30 80 20 140 40 170 C50 190 90 190 100 170 C120 140 110 80 70 ${20 + flicker}Z`} fill={`rgba(255,120,30,${intensity * 0.12})`} stroke={`rgba(255,140,50,${intensity * 0.5})`} strokeWidth="1.8" />
                {/* Inner flame */}
                <path d={`M70 ${50 + flicker * 0.7} C50 90 45 130 55 155 C60 165 80 165 85 155 C95 130 90 90 70 ${50 + flicker * 0.7}Z`} fill={`rgba(255,200,60,${intensity * 0.15})`} stroke={`rgba(255,200,80,${intensity * 0.4})`} strokeWidth="1.2" />
                {/* Core */}
                <ellipse cx="70" cy="155" rx={12 * intensity} ry={20 * intensity} fill={`rgba(255,255,200,${intensity * 0.2})`} />
            </svg>
            {/* Glow */}
            <div style={{ position: "absolute", left: "50%", top: "40%", width: 120 * intensity, height: 120 * intensity, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,150,50,${intensity * 0.1}), transparent)`, transform: "translate(-50%, -50%)" }} />
        </div>
    );
}

function renderWaves(progress: number): React.ReactNode {
    const opacity = interpolate(progress, [0, 0.15, 0.8, 1], [0, 0.7, 0.5, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 250, height: 150 }}>
            <svg viewBox="0 0 250 150" width="250" height="150" style={{ opacity }}>
                {[0, 1, 2, 3].map(i => {
                    const y = 40 + i * 25;
                    const phase = progress * Math.PI * 4 + i * 1.2;
                    const d = `M0,${y} Q30,${y - 15 * Math.sin(phase)} 62,${y} T125,${y} T187,${y} T250,${y}`;
                    return <path key={i} d={d} fill="none" stroke={`rgba(100,200,255,${0.5 - i * 0.1})`} strokeWidth="1.5" />;
                })}
            </svg>
        </div>
    );
}

function renderClock(progress: number): React.ReactNode {
    const angle = progress * 360;
    const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 0.8, 0.6, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 150, height: 150 }}>
            <svg viewBox="0 0 150 150" width="150" height="150" style={{ opacity }}>
                <circle cx="75" cy="75" r="65" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
                    <line key={a} x1={75 + Math.cos((a * Math.PI) / 180) * 55} y1={75 + Math.sin((a * Math.PI) / 180) * 55} x2={75 + Math.cos((a * Math.PI) / 180) * 62} y2={75 + Math.sin((a * Math.PI) / 180) * 62} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                ))}
                {/* Hour hand */}
                <line x1="75" y1="75" x2={75 + Math.cos(((angle / 12 - 90) * Math.PI) / 180) * 30} y2={75 + Math.sin(((angle / 12 - 90) * Math.PI) / 180) * 30} stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
                {/* Minute hand */}
                <line x1="75" y1="75" x2={75 + Math.cos(((angle - 90) * Math.PI) / 180) * 45} y2={75 + Math.sin(((angle - 90) * Math.PI) / 180) * 45} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="75" cy="75" r="3" fill="rgba(255,255,255,0.5)" />
            </svg>
        </div>
    );
}

function renderLightning(progress: number): React.ReactNode {
    const strike = interpolate(progress, [0.1, 0.25, 0.35, 0.5], [0, 1, 0.3, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const glow = interpolate(progress, [0.15, 0.3, 0.5, 0.8], [0, 1, 0.5, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 160, height: 240 }}>
            <svg viewBox="0 0 160 240" width="160" height="240">
                <polyline points="95,10 55,100 90,100 45,230" fill="none" stroke={`rgba(255,255,150,${strike * 0.8})`} strokeWidth="3" strokeLinejoin="round" />
                <polyline points="95,10 55,100 90,100 45,230" fill="none" stroke={`rgba(255,255,255,${strike * 0.3})`} strokeWidth="6" strokeLinejoin="round" filter="blur(4px)" />
            </svg>
            <div style={{ position: "absolute", left: "40%", top: "45%", width: 150 * glow, height: 150 * glow, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,200,${glow * 0.15}), transparent)`, transform: "translate(-50%, -50%)" }} />
        </div>
    );
}

function renderScale(progress: number): React.ReactNode {
    const tilt = Math.sin(progress * Math.PI * 3) * 12;
    const opacity = interpolate(progress, [0, 0.15, 0.8, 1], [0, 0.8, 0.6, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 200, height: 180 }}>
            <svg viewBox="0 0 200 180" width="200" height="180" style={{ opacity }}>
                {/* Pillar */}
                <line x1="100" y1="30" x2="100" y2="160" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <line x1="70" y1="160" x2="130" y2="160" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                {/* Beam */}
                <line x1="30" y1={70 - tilt} x2="170" y2={70 + tilt} stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                {/* Left pan */}
                <path d={`M15,${80 - tilt} Q30,${95 - tilt} 45,${80 - tilt}`} fill="none" stroke="rgba(200,200,255,0.4)" strokeWidth="1.5" />
                <line x1="30" y1={70 - tilt} x2="15" y2={80 - tilt} stroke="rgba(200,200,255,0.3)" strokeWidth="1" />
                <line x1="30" y1={70 - tilt} x2="45" y2={80 - tilt} stroke="rgba(200,200,255,0.3)" strokeWidth="1" />
                {/* Right pan */}
                <path d={`M155,${80 + tilt} Q170,${95 + tilt} 185,${80 + tilt}`} fill="none" stroke="rgba(200,200,255,0.4)" strokeWidth="1.5" />
                <line x1="170" y1={70 + tilt} x2="155" y2={80 + tilt} stroke="rgba(200,200,255,0.3)" strokeWidth="1" />
                <line x1="170" y1={70 + tilt} x2="185" y2={80 + tilt} stroke="rgba(200,200,255,0.3)" strokeWidth="1" />
                {/* Crown */}
                <polygon points="90,30 100,18 110,30" fill="none" stroke="rgba(255,220,100,0.4)" strokeWidth="1.5" />
            </svg>
        </div>
    );
}

function renderStairs(progress: number): React.ReactNode {
    const stepCount = 7;
    const climber = interpolate(progress, [0, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{ position: "relative", width: 220, height: 220 }}>
            <svg viewBox="0 0 220 220" width="220" height="220">
                {Array.from({ length: stepCount }, (_, i) => {
                    const delay = i * 0.08;
                    const p = Math.max(0, Math.min(1, (progress - delay) / 0.3));
                    const x = 20 + i * 26;
                    const y = 190 - i * 25;
                    return (
                        <React.Fragment key={i}>
                            <line x1={x} y1={y} x2={x + 26} y2={y} stroke={`rgba(200,200,255,${0.4 * p})`} strokeWidth="2" />
                            <line x1={x + 26} y1={y} x2={x + 26} y2={y + 25} stroke={`rgba(200,200,255,${0.3 * p})`} strokeWidth="1.5" />
                        </React.Fragment>
                    );
                })}
                {/* Climber */}
                <circle cx={20 + climber * 6 * 26 + 13} cy={190 - climber * 6 * 25 - 12} r="5" fill="rgba(255,200,100,0.6)" />
                <line x1={20 + climber * 6 * 26 + 13} y1={190 - climber * 6 * 25 - 7} x2={20 + climber * 6 * 26 + 13} y2={190 - climber * 6 * 25 + 5} stroke="rgba(255,200,100,0.5)" strokeWidth="1.5" />
            </svg>
        </div>
    );
}

function renderShatter(progress: number): React.ReactNode {
    const shatter = interpolate(progress, [0.1, 0.4, 0.8], [0, 1, 1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const shardCount = 10;
    const seed = 77;
    return (
        <div style={{ position: "relative", width: 200, height: 200 }}>
            {/* Initial shape */}
            <svg viewBox="0 0 200 200" width="200" height="200" style={{ opacity: 1 - shatter * 0.6 }}>
                <rect x="60" y="60" width="80" height="80" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" rx="4" />
            </svg>
            {/* Shards */}
            {Array.from({ length: shardCount }, (_, i) => {
                const angle = (i / shardCount) * Math.PI * 2;
                const dist = shatter * (30 + seededRandom(seed, i) * 50);
                const rot = shatter * (seededRandom(seed, i + 20) * 180 - 90);
                const size = 8 + seededRandom(seed, i + 40) * 15;
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: 100 + Math.cos(angle) * dist,
                        top: 100 + Math.sin(angle) * dist,
                        width: size, height: size * 0.6,
                        border: "1px solid rgba(255,255,255,0.35)",
                        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
                        opacity: Math.max(0, 1 - shatter * 0.7),
                    }} />
                );
            })}
        </div>
    );
}

// ========== NAMED VISUAL LOOKUP ==========

const NAMED_VISUALS: Record<string, (progress: number) => React.ReactNode> = {
    footsteps: renderFootsteps,
    door: renderDoor,
    sunrise: renderSunrise,
    flower: renderFlower,
    drops: renderDrops,
    mountain: renderMountain,
    heartbeat: renderHeartbeat,
    eye: renderEye,
    fire: renderFire,
    waves: renderWaves,
    clock: renderClock,
    lightning: renderLightning,
    scale: renderScale,
    stairs: renderStairs,
    shatter: renderShatter,
};

// ========== GENERATIVE COMPOSABLE SYSTEM (fallback for "compose" or unknown) ==========

const PALETTES = [
    { primary: "#FF6B6B", secondary: "#FFA07A", glow: "rgba(255,107,107,0.15)" },
    { primary: "#4ECDC4", secondary: "#45B7D1", glow: "rgba(78,205,196,0.15)" },
    { primary: "#6C5CE7", secondary: "#A29BFE", glow: "rgba(108,92,231,0.15)" },
    { primary: "#00B894", secondary: "#55EFC4", glow: "rgba(0,184,148,0.15)" },
    { primary: "#E056A0", secondary: "#F78FB3", glow: "rgba(224,86,160,0.15)" },
    { primary: "#F9CA24", secondary: "#F0932B", glow: "rgba(249,202,36,0.15)" },
    { primary: "#74B9FF", secondary: "#0984E3", glow: "rgba(116,185,255,0.15)" },
    { primary: "#A55EEA", secondary: "#8854D0", glow: "rgba(165,94,234,0.15)" },
    { primary: "#FD79A8", secondary: "#FDCB6E", glow: "rgba(253,121,168,0.18)" },
    { primary: "#00CEC9", secondary: "#55EFC4", glow: "rgba(0,206,201,0.18)" },
];

function renderComposeShape(shape: number, size: number, color: string): React.ReactNode {
    const fill = color.replace("0.5)", "0.08)").replace("0.6)", "0.08)").replace("0.4)", "0.08)");
    switch (shape % 10) {
        case 0: return <div style={{ width: size, height: size, borderRadius: "50%", border: `1.5px solid ${color}`, background: `radial-gradient(${fill}, transparent)` }} />;
        case 1: return <div style={{ width: size * 0.7, height: size * 0.7, border: `1.5px solid ${color}`, transform: "rotate(45deg)" }} />;
        case 2: return <svg width={size} height={size} viewBox="0 0 40 40"><polygon points="20,4 36,36 4,36" fill="none" stroke={color} strokeWidth="1.5" /></svg>;
        case 3: return <svg width={size} height={size} viewBox="0 0 40 40"><polygon points="20,2 25,15 38,15 27,24 31,38 20,29 9,38 13,24 2,15 15,15" fill="none" stroke={color} strokeWidth="1.2" /></svg>;
        case 4: return <svg width={size} height={size} viewBox="0 0 40 40"><polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="none" stroke={color} strokeWidth="1.5" /></svg>;
        case 5: return <svg width={size} height={size} viewBox="0 0 40 40"><path d="M20 35 C10 25 0 18 0 10 A8 8 0 0 1 20 10 A8 8 0 0 1 40 10 C40 18 30 25 20 35Z" fill="none" stroke={color} strokeWidth="1.5" /></svg>;
        case 6: return <svg width={size} height={size} viewBox="0 0 40 40"><path d="M25 5 A15 15 0 1 0 25 35 A12 12 0 1 1 25 5" fill="none" stroke={color} strokeWidth="1.5" /></svg>;
        case 7: return <svg width={size} height={size} viewBox="0 0 40 40"><path d="M20 38 C5 30 2 15 10 5 C20 -2 35 5 38 15 C40 25 30 35 20 38Z" fill="none" stroke={color} strokeWidth="1.5" /></svg>;
        case 8: return <svg width={size} height={size} viewBox="0 0 40 40"><path d="M20 5 C20 5 8 20 8 27 A12 12 0 0 0 32 27 C32 20 20 5 20 5Z" fill="none" stroke={color} strokeWidth="1.5" /></svg>;
        case 9: return <svg width={size} height={size} viewBox="0 0 40 40"><circle cx="20" cy="20" r="8" fill="none" stroke={color} strokeWidth="1.5" />{[0, 45, 90, 135, 180, 225, 270, 315].map(a => <line key={a} x1={20 + Math.cos(a * Math.PI / 180) * 11} y1={20 + Math.sin(a * Math.PI / 180) * 11} x2={20 + Math.cos(a * Math.PI / 180) * 17} y2={20 + Math.sin(a * Math.PI / 180) * 17} stroke={color} strokeWidth="1.5" />)}</svg>;
        default: return <div style={{ width: size, height: size, borderRadius: "50%", border: `1.5px solid ${color}` }} />;
    }
}

function renderGenerativeVisual(seed: number, progress: number): React.ReactNode {
    const palette = PALETTES[seed % PALETTES.length];
    const shape = Math.floor(seededRandom(seed, 100) * 10);
    const count = 4 + Math.floor(seededRandom(seed, 200) * 5);
    const mainSize = 28 + Math.floor(seededRandom(seed, 300) * 18);

    const baseOpacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 0.8, 0.6, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const pulse = 1 + Math.sin(progress * Math.PI * 2.5) * 0.08;

    return (
        <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Glow */}
            <div style={{ position: "absolute", width: 200 * pulse, height: 200 * pulse, borderRadius: "50%", background: `radial-gradient(circle, ${palette.glow}, transparent)`, opacity: baseOpacity * 0.6 }} />
            {/* Shapes in ring */}
            {Array.from({ length: count }, (_, i) => {
                const angle = (i / count) * Math.PI * 2;
                const radius = 55 + seededRandom(seed, i + 50) * 25;
                const delay = i * (0.3 / count);
                const p = Math.max(0, Math.min(1, (progress - delay) / 0.35));
                const scale = interpolate(p, [0, 0.3, 1], [0, 1.15, 1]);
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: 150 + Math.cos(angle) * radius,
                        top: 150 + Math.sin(angle) * radius,
                        transform: `translate(-50%, -50%) scale(${scale})`,
                        opacity: baseOpacity,
                        filter: `drop-shadow(0 0 6px ${palette.glow})`,
                    }}>
                        {renderComposeShape((shape + i) % 10, mainSize, palette.primary)}
                    </div>
                );
            })}
            {/* Center accent */}
            <div style={{ opacity: baseOpacity, transform: `scale(${pulse})`, filter: `drop-shadow(0 0 12px ${palette.glow})` }}>
                {renderComposeShape((shape + 5) % 10, mainSize + 10, palette.secondary)}
            </div>
        </div>
    );
}

// ========== MAIN VISUAL COMPONENT ==========

interface VisualSymbolProps {
    phrase: PhraseData;
    progress: number;
}

export const VisualSymbol: React.FC<VisualSymbolProps> = ({ phrase, progress }) => {
    const visual = phrase.visual as VisualTypeName;

    // Use named premium visual if available, otherwise fall back to generative
    if (visual && visual !== "compose" && NAMED_VISUALS[visual]) {
        return (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {NAMED_VISUALS[visual](progress)}
            </div>
        );
    }

    // Generative fallback — unique visual from text hash
    const text = (phrase.text || "") + (phrase.visual || "") + (phrase.visualSeed || phrase.speechSegment || "");
    const seed = hashText(text);

    return (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {renderGenerativeVisual(seed, progress)}
        </div>
    );
};
