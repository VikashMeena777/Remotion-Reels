import { Composition } from "remotion";
import { MotivationalReel } from "./compositions/MotivationalReel";
import { ReelSchema } from "./schema";
import type { ReelProps } from "./schema";

/**
 * Root — Preview registration for Remotion Studio.
 * In production, inputProps come from GitHub Actions dispatch.
 *
 * `calculateMetadata` dynamically sets durationInFrames based on
 * the Whisper-synced props (totalFrames from map-timestamps.mjs).
 */
export const RemotionRoot: React.FC = () => {
    // Sample phrases with mock timing for preview
    const samplePhrases = [
        { text: "The past is behind you", visual: "footsteps" as const, startFrame: 0, durationInFrames: 60 },
        { text: "Open a new door", visual: "door" as const, startFrame: 55, durationInFrames: 55 },
        { text: "Let hope rise within", visual: "sunrise" as const, startFrame: 105, durationInFrames: 50 },
        { text: "Watch your growth bloom", visual: "flower" as const, startFrame: 150, durationInFrames: 55 },
        { text: "Feel the heartbeat alive", visual: "heartbeat" as const, startFrame: 200, durationInFrames: 55 },
        { text: "See with clear vision", visual: "eye" as const, startFrame: 250, durationInFrames: 50 },
        { text: "Rise step by step", visual: "stairs" as const, startFrame: 295, durationInFrames: 55 },
        { text: "Break every chain free", visual: "shatter" as const, startFrame: 345, durationInFrames: 55 },
    ];

    return (
        <Composition
            id="MotivationalReel"
            component={MotivationalReel}
            durationInFrames={900}
            fps={30}
            width={1080}
            height={1920}
            schema={ReelSchema}
            calculateMetadata={({ props }) => {
                // Compute actual total duration from phrase timings
                const phrases = (props as any).phrases || [];
                const lastPhrase = phrases[phrases.length - 1];
                const lastPhraseEnd = lastPhrase
                    ? lastPhrase.startFrame + lastPhrase.durationInFrames
                    : 0;
                // Author (2s) + CTA (2s) after phrases end
                const outroDuration = 30 * 4; // 4 seconds at 30fps
                const totalFromPhrases = lastPhraseEnd + outroDuration;

                // Also check if totalFrames was set by map-timestamps.mjs
                const totalFromProps = (props as any).totalFrames;

                // Use whichever is larger, minimum 300 frames (10s)
                const durationInFrames = Math.max(
                    300,
                    totalFromProps || totalFromPhrases
                );

                return { durationInFrames };
            }}
            defaultProps={{
                phrases: samplePhrases,
                author: "Marcus Aurelius",
                cta: "Follow for daily wisdom",
                watermarkText: "@Finority",
                durationInSeconds: 25,
            }}
        />
    );
};
