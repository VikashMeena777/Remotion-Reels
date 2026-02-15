import { z } from "zod";

/**
 * Input schema for the MotivationalReel composition.
 * All data is passed from n8n → GitHub Actions → Remotion render.
 */
export const ReelSchema = z.object({
    // Content
    hook: z.string().describe("Scroll-stopping opening line (5-8 words)"),
    quote: z.string().describe("Main motivational speech/quote (60-80 words)"),
    author: z.string().describe("Speaker/author attribution"),
    cta: z.string().default("Follow for daily motivation"),

    // Visual theme
    theme: z
        .enum(["dark", "sunset", "ocean", "fire", "galaxy"])
        .default("dark")
        .describe("Color theme for background gradients"),

    // Branding
    watermarkText: z.string().default("@YourPage"),

    // Timing (calculated from voiceover duration)
    durationInSeconds: z.number().default(35),
});

export type ReelProps = z.infer<typeof ReelSchema>;

/**
 * Theme color palettes — each theme has primary, secondary, accent, and particle colors.
 */
export const THEME_COLORS: Record<
    ReelProps["theme"],
    {
        primary: string;
        secondary: string;
        accent: string;
        particle: string;
        text: string;
        glow: string;
    }
> = {
    dark: {
        primary: "#0a0a1a",
        secondary: "#1a1a3e",
        accent: "#6366f1",
        particle: "#818cf8",
        text: "#f8fafc",
        glow: "#6366f1",
    },
    sunset: {
        primary: "#1a0a0a",
        secondary: "#3e1a0a",
        accent: "#f97316",
        particle: "#fb923c",
        text: "#fef3c7",
        glow: "#f97316",
    },
    ocean: {
        primary: "#0a1a1a",
        secondary: "#0a2e3e",
        accent: "#06b6d4",
        particle: "#22d3ee",
        text: "#ecfeff",
        glow: "#06b6d4",
    },
    fire: {
        primary: "#1a0a0a",
        secondary: "#3e0a0a",
        accent: "#ef4444",
        particle: "#f87171",
        text: "#fef2f2",
        glow: "#ef4444",
    },
    galaxy: {
        primary: "#050520",
        secondary: "#0f0f3d",
        accent: "#a855f7",
        particle: "#c084fc",
        text: "#f5f3ff",
        glow: "#a855f7",
    },
};
