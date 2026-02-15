import { Composition } from "remotion";
import { MotivationalReel } from "./compositions/MotivationalReel";
import { ReelSchema } from "./schema";

const FPS = 30;

// Default phrases for preview
const defaultPhrases = [
    { text: "the past does not", visual: "footsteps" as const },
    { text: "define your future", visual: "door" as const },
    { text: "every ending is", visual: "sunrise" as const },
    { text: "a new beginning", visual: "flower" as const },
    { text: "let your vision", visual: "eye" as const },
    { text: "burn with passion", visual: "fire" as const },
    { text: "rise above the storm", visual: "mountain" as const },
    { text: "find your rhythm", visual: "heartbeat" as const },
    { text: "break free", visual: "shatter" as const },
    { text: "from all limits", visual: "lightning" as const },
];

export const RemotionRoot: React.FC = () => {
    const durationInSeconds = 35;
    const phraseDuration = 80; // ~2.7 sec per phrase at 30fps
    // Use a generous max — actual render length is controlled by --frames flag from CI
    const totalFrames = 2000;

    return (
        <>
            <Composition
                id="MotivationalReel"
                component={MotivationalReel}
                durationInFrames={totalFrames}
                fps={FPS}
                width={1080}
                height={1920}
                schema={ReelSchema}
                defaultProps={{
                    phrases: defaultPhrases,
                    author: "Unknown",
                    cta: "Follow for daily motivation",
                    watermarkText: "@YourPage",
                    durationInSeconds,
                    phraseDuration,
                }}
            />
        </>
    );
};
