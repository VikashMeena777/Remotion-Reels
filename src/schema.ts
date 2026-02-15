import { z } from "zod";

/**
 * Visual symbol types for the geometric animation library.
 * Each maps to a distinct animated shape that illustrates the phrase meaning.
 */
export const VisualType = z.enum([
    // Specific metaphor symbols
    "footsteps",    // past, walking, journey, path
    "door",         // future, opportunity, open, gateway
    "sunrise",      // beginning, new, dawn, hope
    "flower",       // growth, bloom, beauty, nature
    "drops",        // rain, tears, falling, emotion
    "mountain",     // climb, peak, challenge, overcome
    "heartbeat",    // heart, feel, alive, passion
    "eye",          // see, vision, clarity, focus
    "fire",         // burn, energy, destroy, ignite
    "waves",        // ocean, calm, flow, peace
    "clock",        // time, wait, moment, now
    "lightning",    // power, strike, sudden, shock
    "scale",        // balance, choice, decide, weight
    "stairs",       // rise, step, progress, level up
    "shatter",      // break, free, destroy, escape
    // Dynamic composition fallback
    "compose",      // AI-directed: uses count + shape + arrangement
]);

export type VisualTypeName = z.infer<typeof VisualType>;

/**
 * A single phrase with its visual mapping and audio-synced timing.
 * startFrame and durationInFrames come from Whisper word timestamps.
 */
export const PhraseSchema = z.object({
    text: z.string().describe("3-5 word phrase synced to voiceover"),
    visual: VisualType.describe("Geometric animation symbol"),
    // Audio-synced timing (set by map-timestamps.mjs in CI)
    startFrame: z.number().default(0)
        .describe("Frame when this phrase starts (from Whisper timestamps)"),
    durationInFrames: z.number().default(60)
        .describe("Duration of this phrase in frames (from Whisper timestamps)"),
    // For "compose" type: dynamic shape composition
    composeShape: z.enum(["circle", "triangle", "square", "line", "dot"]).optional()
        .describe("Base shape for compose mode"),
    composeCount: z.number().min(1).max(8).optional()
        .describe("Number of shapes for compose mode"),
    composeArrangement: z.enum(["flower", "ring", "stack", "grid", "scatter", "row"]).optional()
        .describe("How shapes are arranged in compose mode"),
    composeLabel: z.string().optional()
        .describe("Short label to overlay on composed shapes"),
});

export type PhraseData = z.infer<typeof PhraseSchema>;

/**
 * Input props for the MotivationalReel composition.
 * Timing is now per-phrase (from Whisper), not global.
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
