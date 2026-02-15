import React from "react";
import {
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";
import type { PhraseData } from "../schema";
import { VisualSymbol } from "./VisualSymbol";

interface PhraseSceneProps {
    phrase: PhraseData;
    durationInFrames: number;
}

/**
 * PhraseScene — Renders a single phrase with synchronized visual symbol.
 * Text appears at upper 1/3, geometric animation plays at center.
 */
export const PhraseScene: React.FC<PhraseSceneProps> = ({
    phrase,
    durationInFrames,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = frame / Math.max(1, durationInFrames);

    // Safe fade durations that scale down for short phrases
    // Ensures inputRange is always strictly monotonically increasing
    const fadeIn = Math.min(12, Math.floor(durationInFrames * 0.2));
    const fadeOut = Math.min(12, Math.floor(durationInFrames * 0.2));
    const holdStart = Math.max(fadeIn + 1, fadeIn);
    const holdEnd = Math.max(holdStart + 1, durationInFrames - fadeOut);

    // Text fade in/out
    const textOpacity = interpolate(
        frame,
        [0, fadeIn, holdEnd, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Text slide up
    const slideIn = Math.min(15, Math.floor(durationInFrames * 0.25));
    const slideOut = Math.min(10, Math.floor(durationInFrames * 0.15));
    const textY = interpolate(
        frame,
        [0, slideIn, Math.max(slideIn + 1, durationInFrames - slideOut), durationInFrames],
        [20, 0, 0, -10],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Symbol progress (0 to 1)
    const symStart = Math.min(5, Math.floor(durationInFrames * 0.1));
    const symEnd = Math.max(symStart + 1, durationInFrames - symStart);
    const symbolProgress = interpolate(
        frame,
        [symStart, symEnd],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Overall scene opacity (crossfade)
    const sceneFade = Math.min(8, Math.floor(durationInFrames * 0.15));
    const sceneHoldEnd = Math.max(sceneFade + 1, durationInFrames - sceneFade);
    const sceneOpacity = interpolate(
        frame,
        [0, sceneFade, sceneHoldEnd, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "black",
                opacity: sceneOpacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Phrase text — upper area */}
            <div
                style={{
                    position: "absolute",
                    top: "18%",
                    width: "80%",
                    textAlign: "center",
                    opacity: textOpacity,
                    transform: `translateY(${textY}px)`,
                }}
            >
                <p
                    style={{
                        color: "white",
                        fontSize: 36,
                        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                        fontWeight: 300,
                        letterSpacing: 1.5,
                        lineHeight: 1.5,
                        margin: 0,
                        textShadow: "0 0 30px rgba(255,255,255,0.1)",
                    }}
                >
                    {phrase.text}
                </p>
            </div>

            {/* Visual symbol — center */}
            <VisualSymbol phrase={phrase} progress={symbolProgress} />
        </div>
    );
};
