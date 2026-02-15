import React from "react";
import {
    AbsoluteFill,
    Sequence,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    spring,
} from "remotion";
import { ReelProps, THEME_COLORS } from "../schema";
import { GradientBackground } from "../components/GradientBackground";
import { ParticleField } from "../components/ParticleField";
import { KineticText } from "../components/KineticText";
import { GlowText } from "../components/GlowText";
import { Watermark } from "../components/Watermark";
import { CTAScene } from "../components/CTAScene";

/**
 * MotivationalReel — Premium 4-scene motivational reel composition.
 *
 * Scene 1: HOOK (0-3s) — Dramatic text zoom with particles
 * Scene 2: QUOTE REVEAL (3-22s) — Word-by-word kinetic typography
 * Scene 3: AUTHOR (22-28s) — Author name with elegant fade-in
 * Scene 4: CTA (28-35s) — Follow button + handle animation
 */
export const MotivationalReel: React.FC<ReelProps> = ({
    hook,
    quote,
    author,
    cta,
    theme,
    watermarkText,
    durationInSeconds,
}) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
    const colors = THEME_COLORS[theme];

    // --- Scene timing (in frames) ---
    const HOOK_START = 0;
    const HOOK_DURATION = Math.round(fps * 3.5);

    const QUOTE_START = HOOK_DURATION;
    const words = quote.split(/\s+/);
    // Each word gets ~4 frames stagger + 60 frames to breathe at end
    const QUOTE_DURATION = Math.max(words.length * 4 + fps * 3, fps * 15);

    const AUTHOR_START = QUOTE_START + QUOTE_DURATION;
    const AUTHOR_DURATION = Math.round(fps * 5);

    const CTA_START = AUTHOR_START + AUTHOR_DURATION;

    // --- Scene transition opacity helpers ---
    const hookOpacity = interpolate(
        frame,
        [HOOK_START, HOOK_START + 10, QUOTE_START - 10, QUOTE_START],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const quoteOpacity = interpolate(
        frame,
        [QUOTE_START - 5, QUOTE_START + 5, AUTHOR_START - 10, AUTHOR_START],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const authorOpacity = interpolate(
        frame,
        [AUTHOR_START - 5, AUTHOR_START + 5, CTA_START - 8, CTA_START],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const ctaOpacity = interpolate(
        frame,
        [CTA_START - 5, CTA_START + 5, durationInFrames - 10, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // --- Subtle camera drift (apply to entire content) ---
    const cameraX = interpolate(
        Math.sin(frame * 0.008),
        [-1, 1],
        [-3, 3]
    );
    const cameraY = interpolate(
        Math.cos(frame * 0.006),
        [-1, 1],
        [-2, 2]
    );
    const cameraScale = interpolate(
        frame,
        [0, durationInFrames],
        [1, 1.03]
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: colors.primary,
                fontFamily: "'Inter', 'Playfair Display', sans-serif",
            }}
        >
            {/* Layer 1: Animated gradient background */}
            <GradientBackground
                primary={colors.primary}
                secondary={colors.secondary}
                accent={colors.accent}
            />

            {/* Layer 2: Particle field */}
            <ParticleField
                count={45}
                color={colors.particle}
                speed={0.8}
                seed={hook}
            />

            {/* Layer 3: Content with camera drift */}
            <AbsoluteFill
                style={{
                    transform: `translate(${cameraX}px, ${cameraY}px) scale(${cameraScale})`,
                }}
            >
                {/* ===== SCENE 1: HOOK ===== */}
                <AbsoluteFill
                    style={{
                        opacity: hookOpacity,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0 50px",
                    }}
                >
                    <HookScene
                        text={hook}
                        frame={frame}
                        fps={fps}
                        colors={colors}
                    />
                </AbsoluteFill>

                {/* ===== SCENE 2: QUOTE REVEAL ===== */}
                <AbsoluteFill
                    style={{
                        opacity: quoteOpacity,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0 60px",
                    }}
                >
                    <QuoteScene
                        quote={quote}
                        startFrame={QUOTE_START}
                        frame={frame}
                        colors={colors}
                    />
                </AbsoluteFill>

                {/* ===== SCENE 3: AUTHOR ===== */}
                <AbsoluteFill
                    style={{
                        opacity: authorOpacity,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0 60px",
                    }}
                >
                    <AuthorScene
                        author={author}
                        startFrame={AUTHOR_START}
                        frame={frame}
                        fps={fps}
                        colors={colors}
                    />
                </AbsoluteFill>

                {/* ===== SCENE 4: CTA ===== */}
                <AbsoluteFill style={{ opacity: ctaOpacity }}>
                    <CTAScene
                        text={cta}
                        handle={watermarkText}
                        startFrame={CTA_START}
                        color={colors.text}
                        accentColor={colors.accent}
                        glowColor={colors.glow}
                    />
                </AbsoluteFill>
            </AbsoluteFill>

            {/* Layer 4: Watermark (always on top) */}
            <Watermark text={watermarkText} />
        </AbsoluteFill>
    );
};

// ==========================================
// SUB-SCENES
// ==========================================

/**
 * Hook scene — dramatic text with zoom and flash effect
 */
const HookScene: React.FC<{
    text: string;
    frame: number;
    fps: number;
    colors: (typeof THEME_COLORS)[keyof typeof THEME_COLORS];
}> = ({ text, frame, fps, colors }) => {
    // Zoom entrance
    const scale = spring({
        frame,
        fps,
        config: { damping: 8, stiffness: 100, mass: 1 },
    });

    // Flash effect at entrance
    const flash = interpolate(frame, [0, 5, 15], [1, 0.8, 0], {
        extrapolateRight: "clamp",
    });

    return (
        <>
            {/* Flash overlay */}
            <AbsoluteFill
                style={{
                    backgroundColor: colors.accent,
                    opacity: flash * 0.3,
                }}
            />

            {/* Horizontal lines */}
            <div
                style={{
                    position: "absolute",
                    top: "42%",
                    left: "10%",
                    right: "10%",
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                    opacity: interpolate(frame, [10, 25], [0, 0.6], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    }),
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "42%",
                    left: "10%",
                    right: "10%",
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                    opacity: interpolate(frame, [10, 25], [0, 0.6], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    }),
                }}
            />

            {/* Hook text */}
            <div
                style={{
                    transform: `scale(${scale})`,
                    textAlign: "center",
                }}
            >
                <GlowText
                    text={text}
                    startFrame={0}
                    fontSize={72}
                    fontFamily="'Inter', sans-serif"
                    color={colors.text}
                    glowColor={colors.glow}
                    animation="scale-in"
                />
            </div>
        </>
    );
};

/**
 * Quote scene — word-by-word kinetic typography reveal with quotation marks
 */
const QuoteScene: React.FC<{
    quote: string;
    startFrame: number;
    frame: number;
    colors: (typeof THEME_COLORS)[keyof typeof THEME_COLORS];
}> = ({ quote, startFrame, frame, colors }) => {
    // Quote marks
    const quoteMarkOpacity = interpolate(
        frame - startFrame,
        [0, 20],
        [0, 0.15],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div style={{ position: "relative" }}>
            {/* Large decorative quote mark */}
            <div
                style={{
                    position: "absolute",
                    top: -80,
                    left: -20,
                    fontSize: 200,
                    fontFamily: "Georgia, serif",
                    color: colors.accent,
                    opacity: quoteMarkOpacity,
                    lineHeight: 1,
                    userSelect: "none",
                }}
            >
                ❝
            </div>

            {/* Kinetic text */}
            <KineticText
                text={quote}
                startFrame={startFrame + 8}
                stagger={4}
                fontSize={52}
                fontFamily="'Playfair Display', 'Georgia', serif"
                color={colors.text}
                glowColor={colors.glow}
                style={{
                    maxWidth: 900,
                    textAlign: "center",
                }}
            />

            {/* Closing quote mark */}
            <div
                style={{
                    position: "absolute",
                    bottom: -100,
                    right: -20,
                    fontSize: 200,
                    fontFamily: "Georgia, serif",
                    color: colors.accent,
                    opacity: quoteMarkOpacity,
                    lineHeight: 1,
                    userSelect: "none",
                    transform: "rotate(180deg)",
                }}
            >
                ❝
            </div>
        </div>
    );
};

/**
 * Author scene — elegant name reveal with decorative elements
 */
const AuthorScene: React.FC<{
    author: string;
    startFrame: number;
    frame: number;
    fps: number;
    colors: (typeof THEME_COLORS)[keyof typeof THEME_COLORS];
}> = ({ author, startFrame, frame, fps, colors }) => {
    const progress = frame - startFrame;

    // Dash line animation
    const dashWidth = interpolate(progress, [0, 20], [0, 120], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
            }}
        >
            {/* Decorative dash */}
            <div
                style={{
                    width: dashWidth,
                    height: 3,
                    background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                    borderRadius: 2,
                }}
            />

            {/* Author name */}
            <GlowText
                text={`— ${author}`}
                startFrame={startFrame + 10}
                fontSize={40}
                fontFamily="'Inter', sans-serif"
                color={colors.accent}
                glowColor={colors.glow}
                animation="fade-up"
                style={{
                    fontStyle: "italic",
                    letterSpacing: "0.1em",
                }}
            />

            {/* Subtitle */}
            <GlowText
                text="Let this sink in."
                startFrame={startFrame + 25}
                fontSize={28}
                fontFamily="'Inter', sans-serif"
                color={`${colors.text}B0`}
                glowColor={colors.glow}
                animation="fade-up"
                style={{
                    fontWeight: 400,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                }}
            />
        </div>
    );
};
