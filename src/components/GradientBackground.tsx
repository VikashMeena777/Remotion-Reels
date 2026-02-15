import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface GradientBackgroundProps {
    primary: string;
    secondary: string;
    accent: string;
}

/**
 * Animated multi-color gradient background with slow rotation and color shifting.
 * Equivalent to After Effects "Gradient Ramp" with animated control points.
 * Creates a living, breathing backdrop that keeps the reel visually dynamic.
 */
export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    primary,
    secondary,
    accent,
}) => {
    const frame = useCurrentFrame();

    // Slow rotation of gradient angle
    const angle = interpolate(frame, [0, 900], [135, 225]);

    // Subtle color position shift
    const midPoint = interpolate(
        Math.sin(frame * 0.015),
        [-1, 1],
        [35, 55]
    );

    // Radial glow intensity pulse
    const glowOpacity = interpolate(
        Math.sin(frame * 0.02),
        [-1, 1],
        [0.15, 0.35]
    );

    // Slow scale pulse for the radial overlay
    const glowScale = interpolate(
        Math.sin(frame * 0.01),
        [-1, 1],
        [0.8, 1.2]
    );

    return (
        <AbsoluteFill>
            {/* Base gradient */}
            <AbsoluteFill
                style={{
                    background: `linear-gradient(${angle}deg, ${primary} 0%, ${secondary} ${midPoint}%, ${primary} 100%)`,
                }}
            />

            {/* Accent radial glow — center */}
            <AbsoluteFill
                style={{
                    background: `radial-gradient(ellipse at 50% 40%, ${accent}${Math.round(
                        glowOpacity * 255
                    )
                        .toString(16)
                        .padStart(2, "0")} 0%, transparent 60%)`,
                    transform: `scale(${glowScale})`,
                }}
            />

            {/* Secondary radial glow — bottom */}
            <AbsoluteFill
                style={{
                    background: `radial-gradient(ellipse at 30% 80%, ${secondary}40 0%, transparent 50%)`,
                }}
            />

            {/* Film grain overlay for cinematic feel */}
            <AbsoluteFill
                style={{
                    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
                    opacity: 0.4,
                    mixBlendMode: "overlay",
                }}
            />

            {/* Subtle vignette */}
            <AbsoluteFill
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
                }}
            />
        </AbsoluteFill>
    );
};
