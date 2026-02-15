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

    const progress = frame / durationInFrames;

    // Text fade in/out
    const textOpacity = interpolate(
        frame,
        [0, 12, durationInFrames - 12, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Text slide up
    const textY = interpolate(
        frame,
        [0, 15, durationInFrames - 10, durationInFrames],
        [20, 0, 0, -10],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Symbol progress (0 to 1)
    const symbolProgress = interpolate(
        frame,
        [5, durationInFrames - 5],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Overall scene opacity (crossfade)
    const sceneOpacity = interpolate(
        frame,
        [0, 8, durationInFrames - 8, durationInFrames],
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
