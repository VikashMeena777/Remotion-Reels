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
 * A single phrase with its visual mapping.
 */
export const PhraseSchema = z.object({
    text: z.string().describe("3-5 word phrase synced to voiceover"),
    visual: VisualType.describe("Geometric animation symbol"),
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
 */
export const ReelSchema = z.object({
    phrases: z.array(PhraseSchema)
        .min(4)
        .max(20)
        .describe("Array of phrases with visual mappings, from AI"),
    author: z.string().describe("Speaker/author attribution"),
    cta: z.string().default("Follow for daily motivation"),
    watermarkText: z.string().default("@YourPage"),
    durationInSeconds: z.number().default(35),
    phraseDuration: z.number().default(80)
        .describe("Duration per phrase in frames (at 30fps, 80 = ~2.7 seconds)"),
});

export type ReelProps = z.infer<typeof ReelSchema>;
