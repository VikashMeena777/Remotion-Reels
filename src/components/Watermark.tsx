import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface WatermarkProps {
    text: string;
}

/**
 * Watermark — centered at lower-center area, prominent but elegant.
 */
export const Watermark: React.FC<WatermarkProps> = ({ text }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [30, 50], [0, 0.45], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                bottom: 220,
                left: 0,
                right: 0,
                textAlign: "center",
                color: "white",
                fontSize: 28,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: 2,
                opacity,
            }}
        >
            {text}
        </div>
    );
};
