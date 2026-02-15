import { z } from "zod";

/**
 * Original 15 named visual symbols (premium, detailed animations).
 * These are high-quality animated scenes kept as-is.
 */
export const NamedVisualType = z.enum([
    "footsteps", "door", "sunrise", "flower", "drops",
    "mountain", "heartbeat", "eye", "fire", "waves",
    "clock", "lightning", "scale", "stairs", "shatter",
]);

/**
 * Expanded shape library for compose mode — 20 shapes.
 * These generate unique geometric visuals for each phrase.
 */
export const ComposeShape = z.enum([
    "circle", "triangle", "square", "line", "dot",
    "star", "hexagon", "diamond", "cross", "spiral",
    "arrow", "crescent", "ring", "pentagon", "spark",
    "infinity", "heart", "leaf", "bolt", "wave",
]);

/**
 * Layout arrangements — 14 ways to position shapes.
 */
export const ComposeArrangement = z.enum([
    "flower", "ring", "stack", "grid", "scatter", "row",
    "spiral", "cascade", "burst", "orbit", "zigzag",
    "pyramid", "wave", "radial",
]);

/**
 * Animation style applied to composed visuals.
 */
export const ComposeAnimation = z.enum([
    "fadeIn",     // default gentle fade
    "pulse",      // rhythmic pulsing
    "rotate",     // slow rotation
    "float",      // gentle floating up/down
    "spin",       // continuous rotation
    "morph",      // shape morphing
    "flicker",    // rapid opacity flicker
    "bounce",     // elastic bounce in
    "ripple",     // outward wave ripple
    "grow",       // scale from 0 to full
    "dissolve",   // particle dissolve reveal
    "glitch",     // digital glitch effect
]);

/**
 * Visual type — either a named symbol or "compose" for unlimited dynamic visuals.
 */
export const VisualType = z.enum([
    // Named symbols (15 premium)
    "footsteps", "door", "sunrise", "flower", "drops",
    "mountain", "heartbeat", "eye", "fire", "waves",
    "clock", "lightning", "scale", "stairs", "shatter",
    // Compose mode (unlimited combos)
    "compose",
]);

export type VisualTypeName = z.infer<typeof VisualType>;

/**
 * A single phrase with its visual mapping and audio-synced timing.
 * startFrame and durationInFrames come from Whisper word timestamps.
 */
export const PhraseSchema = z.object({
    text: z.string().describe("3-6 word display phrase shown on screen"),
    visual: VisualType.describe("Named symbol or 'compose' for dynamic visual"),
    // Speech segment for Whisper matching (stripped by map-timestamps.mjs)
    speechSegment: z.string().optional()
        .describe("Exact words from the speech for this phrase (used for Whisper matching)"),
    // Audio-synced timing (set by map-timestamps.mjs in CI)
    startFrame: z.number().default(0)
        .describe("Frame when this phrase starts (from Whisper timestamps)"),
    durationInFrames: z.number().default(60)
        .describe("Duration of this phrase in frames (from Whisper timestamps)"),
    // Compose mode parameters — for unlimited visual variety
    composeShape: ComposeShape.optional()
        .describe("Primary shape for compose mode"),
    composeCount: z.number().min(1).max(12).optional()
        .describe("Number of shapes (1-12)"),
    composeArrangement: ComposeArrangement.optional()
        .describe("Layout arrangement for shapes"),
    composeAnimation: ComposeAnimation.optional()
        .describe("Animation style for the visual"),
    composeLabel: z.string().optional()
        .describe("Optional short label overlay"),
});

export type PhraseData = z.infer<typeof PhraseSchema>;

/**
 * Input props for the MotivationalReel composition.
 * Timing is per-phrase (from Whisper), not global.
 */
export const ReelSchema = z.object({
    phrases: z.array(PhraseSchema)
        .min(4)
        .max(20)
        .describe("Array of phrases with visual mappings and timing from Whisper"),
    author: z.string().describe("Speaker/author attribution"),
    cta: z.string().default("Follow for daily motivation"),
    watermarkText: z.string().default("@YourPage"),
    durationInSeconds: z.number().default(35),
    audioDuration: z.number().optional()
        .describe("Actual audio duration in seconds (from Whisper)"),
});

export type ReelProps = z.infer<typeof ReelSchema>;
