import React from "react";
import {
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

interface KineticTextProps {
    text: string;
    startFrame: number;
    /** Frames between each word appearing */
    stagger?: number;
    fontSize?: number;
    fontFamily?: string;
    color: string;
    glowColor: string;
    style?: React.CSSProperties;
    mode?: "word" | "line";
}

/**
 * Kinetic typography — word-by-word reveal with spring animations.
 * Each word scales up from 0, fades in, and settles with a satisfying spring.
 * Equivalent to After Effects "Text Animator" with cascade.
 */
export const KineticText: React.FC<KineticTextProps> = ({
    text,
    startFrame,
    stagger = 4,
    fontSize = 64,
    fontFamily = "'Playfair Display', serif",
    color,
    glowColor,
    style,
    mode = "word",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const units = mode === "word" ? text.split(/\s+/) : text.split(/\n/);

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: mode === "word" ? "12px 16px" : "8px",
                flexDirection: mode === "line" ? "column" : "row",
                ...style,
            }}
        >
            {units.map((unit, index) => {
                const wordStart = startFrame + index * stagger;

                // Spring-based scale animation
                const scaleSpring = spring({
                    frame: frame - wordStart,
                    fps,
                    config: {
                        damping: 12,
                        stiffness: 200,
                        mass: 0.5,
                    },
                });

                // Fade in
                const opacity = interpolate(
                    frame - wordStart,
                    [0, 8],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                // Slight upward motion
                const translateY = interpolate(
                    frame - wordStart,
                    [0, 12],
                    [30, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                // Glow intensity peaks then settles
                const glowIntensity = interpolate(
                    frame - wordStart,
                    [0, 6, 20],
                    [0, 1, 0.3],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                return (
                    <span
                        key={index}
                        style={{
                            display: "inline-block",
                            fontSize,
                            fontFamily,
                            fontWeight: 700,
                            color,
                            opacity,
                            transform: `scale(${scaleSpring}) translateY(${translateY}px)`,
                            textShadow: `
                0 0 ${20 * glowIntensity}px ${glowColor},
                0 0 ${40 * glowIntensity}px ${glowColor}80,
                0 0 ${80 * glowIntensity}px ${glowColor}40,
                0 2px 4px rgba(0,0,0,0.5)
              `,
                            lineHeight: 1.3,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {unit}
                    </span>
                );
            })}
        </div>
    );
};
