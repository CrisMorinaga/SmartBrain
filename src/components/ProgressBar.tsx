import { useEffect, useState } from "react";
import { Progress } from "./shadcn-ui/progress";

export default function ProgressBar() {
    const [progress, setProgress] = useState(13);

    useEffect(() => {
        if (progress === 13) {
            const timer = setTimeout(() => setProgress(66), 400)
        } else {
            const timer = setTimeout(() => setProgress(87), 1000)
        }
        // return () => clearTimeout(timer)
      }, [progress])

    return (
        <Progress value={progress} />
    )
}