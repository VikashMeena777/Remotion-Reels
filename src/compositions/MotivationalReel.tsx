import React from "react";
import {
    useCurrentFrame,
    useVideoConfig,
    Sequence,
    interpolate,
} from "remotion";
import type { ReelProps } from "../schema";
import { PhraseScene } from "../components/PhraseScene";
import { Watermark } from "../components/Watermark";

/**
 * MotivationalReel — Main composition.
 * Each phrase has its own startFrame and durationInFrames from Whisper timestamps,
 * so visuals appear EXACTLY when spoken in the audio.
 */
export const MotivationalReel: React.FC<ReelProps> = ({
    phrases,
    author,
    cta,
    watermarkText,
    durationInSeconds,
}) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Intro: gentle fade from black (1 second)
    const introDuration = Math.round(fps * 1);
    const introOpacity = interpolate(
        frame,
        [0, introDuration],
        [0, 1],
        { extrapolateRight: "clamp" }
    );

    // Last phrase end = the furthest point any phrase reaches
    const lastPhraseEnd = phrases.reduce((max, p) => {
        return Math.max(max, (p.startFrame || 0) + (p.durationInFrames || 60));
    }, 0);

    // Author and CTA start right after the last phrase
    const authorStart = lastPhraseEnd;
    const authorDuration = Math.round(fps * 2);
    const ctaStart = authorStart + Math.round(fps * 1.5);
    const ctaDuration = Math.max(1, durationInFrames - ctaStart);
    const showAuthor = authorStart + authorDuration <= durationInFrames;
    const showCTA = ctaStart < durationInFrames;

    return (
        <div
            style={{
                flex: 1,
                backgroundColor: "black",
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Intro fade */}
            <div style={{ position: "absolute", inset: 0, opacity: introOpacity }}>
                {/* Phrase sequences — each at its exact Whisper timestamp */}
                {phrases.map((phrase: typeof phrases[number], index: number) => {
                    const from = phrase.startFrame || 0;
                    const dur = phrase.durationInFrames || 60;

                    return (
                        <Sequence
                            key={index}
                            from={from}
                            durationInFrames={dur}
                            name={`Phrase-${index}: ${phrase.text}`}
                        >
                            <PhraseScene
                                phrase={phrase}
                                durationInFrames={dur}
                            />
                        </Sequence>
                    );
                })}

                {/* Author attribution */}
                {showAuthor && (
                    <Sequence
                        from={authorStart}
                        durationInFrames={authorDuration}
                        name="Author"
                    >
                        <AuthorScene author={author} />
                    </Sequence>
                )}

                {/* CTA */}
                {showCTA && (
                    <Sequence
                        from={ctaStart}
                        durationInFrames={ctaDuration}
                        name="CTA"
                    >
                        <CTAMinimal cta={cta} />
                    </Sequence>
                )}

                {/* Watermark — always visible */}
                <Watermark text={watermarkText} />
            </div>
        </div>
    );
};

/**
 * Minimal author attribution — clean fade-in text
 */
const AuthorScene: React.FC<{ author: string }> = ({ author }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const lineWidth = interpolate(frame, [5, 30], [0, 60], {
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                opacity,
            }}
        >
            {/* Decorative line */}
            <div
                style={{
                    width: lineWidth,
                    height: 1,
                    backgroundColor: "rgba(255,255,255,0.4)",
                    marginBottom: 20,
                }}
            />
            <p
                style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 20,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    margin: 0,
                }}
            >
                — {author} —
            </p>
            <div
                style={{
                    width: lineWidth,
                    height: 1,
                    backgroundColor: "rgba(255,255,255,0.4)",
                    marginTop: 20,
                }}
            />
        </div>
    );
};

/**
 * Minimal CTA — centered text
 */
const CTAMinimal: React.FC<{ cta: string }> = ({ cta }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20, 60, 80], [0, 0.8, 0.8, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 100,
                backgroundColor: "black",
                opacity,
            }}
        >
            <p
                style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 28,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: 2,
                    textAlign: "center",
                    maxWidth: "75%",
                    margin: 0,
                }}
            >
                {cta}
            </p>
        </div>
    );
};
