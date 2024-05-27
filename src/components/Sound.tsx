import React, { useRef, useEffect } from "react";
import { useSubscribeState } from "../subscribe_state/index"
import useSuperState from "../domain/use_super_state";

export default function Sound({
    children,
    src
}: {
    children: React.ReactNode;
    src: string;
}) {
    const [{ sound }, _] = useSubscribeState(["sound"]);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play();
            audioRef.current.volume = sound.volume / 100;
            audioRef.current.muted = sound.muted;
        }
    }, []);

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {children}
            <audio ref={audioRef} autoPlay src={src} controls={false}></audio>
        </div>
    );
}
