import { Composition } from "remotion";
import { MotivationalReel } from "./compositions/MotivationalReel";
import { ReelSchema } from "./schema";

/**
 * Root — registers all Remotion compositions.
 * The MotivationalReel composition uses dynamic duration based on inputProps.
 */
export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="MotivationalReel"
                component={MotivationalReel}
                schema={ReelSchema}
                defaultProps={{
                    hook: "Stop scrolling. Read this.",
                    quote:
                        "The pain you feel today is the strength you feel tomorrow. Every challenge you face is building the warrior inside you. Don't run from the struggle. Embrace it. Because on the other side of pain is the person you were always meant to become.",
                    author: "David Goggins",
                    cta: "Follow for daily motivation",
                    theme: "dark" as const,
                    watermarkText: "@YourPage",
                    durationInSeconds: 35,
                }}
                fps={30}
                width={1080}
                height={1920}
                calculateMetadata={({ props }) => {
                    return {
                        durationInFrames: Math.round(props.durationInSeconds * 30),
                    };
                }}
            />
        </>
    );
};
