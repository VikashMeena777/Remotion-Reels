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
 * Loops through AI-generated phrases, rendering each with its matching
 * geometric visual symbol animation. Pure black, monochrome design.
 */
export const MotivationalReel: React.FC<ReelProps> = ({
    phrases,
    author,
    cta,
    watermarkText,
    durationInSeconds,
    phraseDuration,
}) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Calculate phrase timing with overlap for crossfade
    const overlapFrames = 8;
    const effectivePhraseDuration = phraseDuration;
    const totalPhraseFrames = phrases.length * effectivePhraseDuration -
        (phrases.length - 1) * overlapFrames;

    // Reserve time for intro + author/CTA at end
    const introDuration = Math.round(fps * 1.5);
    const outroDuration = Math.round(fps * 4);

    // Intro: fade from black
    const introOpacity = interpolate(
        frame,
        [0, introDuration],
        [0, 1],
        { extrapolateRight: "clamp" }
    );

    // Author scene timing
    const authorStart = introDuration + totalPhraseFrames;
    const ctaStart = authorStart + Math.round(fps * 2);

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
                {/* Phrase sequences */}
                {phrases.map((phrase, index) => {
                    const startFrame =
                        introDuration + index * (effectivePhraseDuration - overlapFrames);

                    return (
                        <Sequence
                            key={index}
                            from={startFrame}
                            durationInFrames={effectivePhraseDuration}
                            name={`Phrase-${index}: ${phrase.text}`}
                        >
                            <PhraseScene
                                phrase={phrase}
                                durationInFrames={effectivePhraseDuration}
                            />
                        </Sequence>
                    );
                })}

                {/* Author attribution */}
                <Sequence
                    from={authorStart}
                    durationInFrames={Math.round(fps * 2.5)}
                    name="Author"
                >
                    <AuthorScene author={author} />
                </Sequence>

                {/* CTA */}
                <Sequence
                    from={ctaStart}
                    durationInFrames={durationInFrames - ctaStart}
                    name="CTA"
                >
                    <CTAMinimal cta={cta} />
                </Sequence>

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
    const opacity = interpolate(frame, [0, 15, 60, 75], [0, 1, 1, 0], {
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
 * Minimal CTA — subtle text at bottom
 */
const CTAMinimal: React.FC<{ cta: string }> = ({ cta }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20, 80, 100], [0, 0.7, 0.7, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 120,
                backgroundColor: "black",
                opacity,
            }}
        >
            <p
                style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 18,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: 2,
                    textAlign: "center",
                    maxWidth: "70%",
                    margin: 0,
                }}
            >
                {cta}
            </p>
        </div>
    );
};
