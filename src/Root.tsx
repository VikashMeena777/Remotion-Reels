import { Composition } from "remotion";
import { MotivationalReel } from "./compositions/MotivationalReel";
import { ReelSchema } from "./schema";

/**
 * Root — Preview registration for Remotion Studio.
 * In production, inputProps come from GitHub Actions dispatch.
 * Preview uses sample phrases with mock startFrame/durationInFrames.
 */
export const RemotionRoot: React.FC = () => {
    const durationInSeconds = 25;
    // Use a generous max — actual render length is controlled by --frames flag from CI
    const totalFrames = 2000;

    // Sample phrases with mock timing (in production, set by map-timestamps.mjs)
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
            durationInFrames={totalFrames}
            fps={30}
            width={1080}
            height={1920}
            schema={ReelSchema}
            defaultProps={{
                phrases: samplePhrases,
                author: "Marcus Aurelius",
                cta: "Follow for daily wisdom ✨",
                watermarkText: "@Finority",
                durationInSeconds,
            }}
        />
    );
};
