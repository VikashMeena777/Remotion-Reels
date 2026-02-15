import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface WatermarkProps {
    text: string;
}

/**
 * Minimal watermark — subtle white text, bottom-right corner.
 */
export const Watermark: React.FC<WatermarkProps> = ({ text }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [30, 50], [0, 0.3], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                bottom: 40,
                right: 30,
                color: "white",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: 1,
                opacity,
            }}
        >
            {text}
        </div>
    );
};
