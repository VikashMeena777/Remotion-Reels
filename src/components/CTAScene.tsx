import React from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

interface CTASceneProps {
    text: string;
    handle: string;
    startFrame: number;
    color: string;
    accentColor: string;
    glowColor: string;
}

/**
 * Call-to-action scene with animated follow button, handle reveal, and icon animations.
 * The final scene that drives engagement.
 */
export const CTAScene: React.FC<CTASceneProps> = ({
    text,
    handle,
    startFrame,
    color,
    accentColor,
    glowColor,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = frame - startFrame;

    // Main CTA text spring entrance
    const ctaSpring = spring({
        frame: progress,
        fps,
        config: { damping: 10, stiffness: 100, mass: 0.8 },
    });

    // Handle slide up
    const handleSpring = spring({
        frame: progress - 12,
        fps,
        config: { damping: 12, stiffness: 120, mass: 0.6 },
    });

    // Button pulse
    const pulse = interpolate(
        Math.sin((progress - 20) * 0.08),
        [-1, 1],
        [1, 1.05]
    );

    const buttonOpacity = interpolate(progress, [20, 35], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Decorative line
    const lineWidth = interpolate(progress, [0, 25], [0, 200], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 60,
                paddingRight: 60,
            }}
        >
            {/* Decorative line above */}
            <div
                style={{
                    width: lineWidth,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                    marginBottom: 40,
                }}
            />

            {/* CTA text */}
            <div
                style={{
                    fontSize: 42,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    color,
                    textAlign: "center",
                    opacity: ctaSpring,
                    transform: `translateY(${(1 - ctaSpring) * 30}px)`,
                    textShadow: `
            0 0 20px ${glowColor}60,
            0 2px 8px rgba(0,0,0,0.5)
          `,
                    letterSpacing: "0.02em",
                    lineHeight: 1.3,
                }}
            >
                {text}
            </div>

            {/* Handle */}
            <div
                style={{
                    fontSize: 32,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 800,
                    color: accentColor,
                    marginTop: 24,
                    opacity: handleSpring,
                    transform: `translateY(${(1 - handleSpring) * 20}px)`,
                    textShadow: `0 0 30px ${glowColor}80`,
                    letterSpacing: "0.03em",
                }}
            >
                {handle}
            </div>

            {/* Animated follow button */}
            <div
                style={{
                    marginTop: 40,
                    padding: "16px 48px",
                    borderRadius: 50,
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
                    boxShadow: `0 0 30px ${accentColor}60, 0 4px 20px rgba(0,0,0,0.3)`,
                    opacity: buttonOpacity,
                    transform: `scale(${buttonOpacity > 0 ? pulse : 0})`,
                }}
            >
                <span
                    style={{
                        fontSize: 24,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        color: "#fff",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                    }}
                >
                    FOLLOW
                </span>
            </div>

            {/* Decorative line below */}
            <div
                style={{
                    width: lineWidth * 0.6,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)`,
                    marginTop: 40,
                }}
            />
        </AbsoluteFill>
    );
};
