import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface WatermarkProps {
    text: string;
    color?: string;
}

/**
 * Semi-transparent channel watermark — always visible, never distracting.
 * Positioned at top-right with subtle opacity.
 */
export const Watermark: React.FC<WatermarkProps> = ({
    text,
    color = "rgba(255,255,255,0.25)",
}) => {
    const frame = useCurrentFrame();

    const opacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                top: 60,
                right: 40,
                fontSize: 20,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color,
                opacity,
                letterSpacing: "0.05em",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
        >
            {text}
        </div>
    );
};
