import React from "react";
import {
    useCurrentFrame,
    useVideoConfig,
    interpolate,
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
    const fadeIn = Math.min(8, Math.floor(durationInFrames * 0.15));
    const fadeOut = Math.min(6, Math.floor(durationInFrames * 0.1));
    const holdEnd = Math.max(fadeIn + 2, durationInFrames - fadeOut);

    // Text fade in/out — gentle transitions
    const textOpacity = interpolate(
        frame,
        [0, fadeIn, holdEnd, durationInFrames],
        [0, 1, 1, 0.3],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Text slide up
    const slideIn = Math.min(12, Math.floor(durationInFrames * 0.2));
    const textY = interpolate(
        frame,
        [0, slideIn, durationInFrames],
        [15, 0, -5],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Symbol progress — runs full duration for continuous visual movement
    const symbolProgress = interpolate(
        frame,
        [0, durationInFrames],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Symbol opacity — NEVER goes below 0.2 to prevent black screen
    const symbolOpacity = interpolate(
        frame,
        [0, 4, Math.max(5, durationInFrames - 4), durationInFrames],
        [0.2, 1, 1, 0.3],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Scene opacity — NEVER fades to 0, minimum 0.3 to prevent black flashes
    const sceneOpacity = interpolate(
        frame,
        [0, Math.min(6, Math.floor(durationInFrames * 0.1)), Math.max(7, durationInFrames - 4), durationInFrames],
        [0.3, 1, 1, 0.4],
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
                {/* Dark gradient backdrop for readability */}
                <div style={{
                    position: "absolute",
                    inset: -30,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.7) 70%, transparent)",
                    borderRadius: 20,
                    pointerEvents: "none",
                }} />
                <p
                    style={{
                        position: "relative",
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
            <div style={{ opacity: symbolOpacity }}>
                <VisualSymbol phrase={phrase} progress={symbolProgress} />
            </div>
        </div>
    );
};
