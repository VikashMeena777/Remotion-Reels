import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface GlowTextProps {
    text: string;
    startFrame: number;
    fontSize?: number;
    fontFamily?: string;
    color: string;
    glowColor: string;
    style?: React.CSSProperties;
    /** Animation type */
    animation?: "fade-up" | "scale-in" | "typewriter";
}

/**
 * Text with animated multi-layer glow/bloom effect.
 * Similar to After Effects Glow + Deep Glow plugin.
 */
export const GlowText: React.FC<GlowTextProps> = ({
    text,
    startFrame,
    fontSize = 48,
    fontFamily = "'Inter', sans-serif",
    color,
    glowColor,
    style,
    animation = "fade-up",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = frame - startFrame;

    // Opacity
    const opacity = interpolate(progress, [0, 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Animation transforms
    let transform = "";
    if (animation === "fade-up") {
        const y = interpolate(progress, [0, 20], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        transform = `translateY(${y}px)`;
    } else if (animation === "scale-in") {
        const s = spring({
            frame: progress,
            fps,
            config: { damping: 15, stiffness: 150, mass: 0.8 },
        });
        transform = `scale(${s})`;
    }

    // Pulsing glow
    const glowPulse = interpolate(
        Math.sin(progress * 0.04),
        [-1, 1],
        [0.5, 1]
    );

    const glowAmount = interpolate(progress, [0, 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                fontSize,
                fontFamily,
                fontWeight: 700,
                color,
                opacity,
                transform,
                textAlign: "center",
                textShadow: `
          0 0 ${10 * glowAmount * glowPulse}px ${glowColor},
          0 0 ${30 * glowAmount * glowPulse}px ${glowColor}80,
          0 0 ${60 * glowAmount * glowPulse}px ${glowColor}40,
          0 2px 8px rgba(0,0,0,0.6)
        `,
                lineHeight: 1.2,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                ...style,
            }}
        >
            {text}
        </div>
    );
};
