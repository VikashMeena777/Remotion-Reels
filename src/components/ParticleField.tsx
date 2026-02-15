import React, { useMemo } from "react";
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    random,
} from "remotion";

interface ParticleFieldProps {
    count?: number;
    color: string;
    speed?: number;
    seed?: string;
}

/**
 * Floating luminous bokeh particles — creates depth and cinematic atmosphere.
 * Each particle has randomized position, size, opacity, and drift speed.
 * Equivalent to After Effects "CC Particle World" or "Particular".
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
    count = 40,
    color,
    speed = 1,
    seed = "particles",
}) => {
    const frame = useCurrentFrame();

    const particles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            x: random(`${seed}-x-${i}`) * 100,
            y: random(`${seed}-y-${i}`) * 100,
            size: 2 + random(`${seed}-size-${i}`) * 8,
            opacity: 0.1 + random(`${seed}-opacity-${i}`) * 0.4,
            driftX: (random(`${seed}-dx-${i}`) - 0.5) * 2,
            driftY: (random(`${seed}-dy-${i}`) - 0.5) * 1.5,
            pulseSpeed: 0.5 + random(`${seed}-pulse-${i}`) * 2,
            delay: random(`${seed}-delay-${i}`) * 60,
        }));
    }, [count, seed]);

    return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
            {particles.map((p) => {
                const adjustedFrame = Math.max(0, frame - p.delay);

                // Floating drift motion
                const xPos = p.x + Math.sin(adjustedFrame * 0.02 * speed * p.driftX) * 5;
                const yPos =
                    p.y + adjustedFrame * 0.03 * speed * p.driftY;

                // Gentle pulse
                const pulse = interpolate(
                    Math.sin(adjustedFrame * 0.05 * p.pulseSpeed),
                    [-1, 1],
                    [0.5, 1.2]
                );

                // Fade in
                const fadeIn = interpolate(adjustedFrame, [0, 30], [0, 1], {
                    extrapolateRight: "clamp",
                });

                return (
                    <div
                        key={p.id}
                        style={{
                            position: "absolute",
                            left: `${xPos}%`,
                            top: `${((yPos % 120) + 120) % 120 - 10}%`,
                            width: p.size * pulse,
                            height: p.size * pulse,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${color}${Math.round(p.opacity * 255)
                                .toString(16)
                                .padStart(2, "0")}, transparent 70%)`,
                            boxShadow: `0 0 ${p.size * 2}px ${color}${Math.round(
                                p.opacity * 0.5 * 255
                            )
                                .toString(16)
                                .padStart(2, "0")}`,
                            opacity: fadeIn,
                            transform: `scale(${pulse})`,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};
