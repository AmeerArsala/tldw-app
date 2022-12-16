import React from "react";
import "./YouTubeVideo.css";

import ReactPlayer from "react-player";

export interface YouTubeVideoProps {
    getReactPlayer: (onReady: any) => ReactPlayer;
    startTime: number; // in seconds

}

export default function YouTubeVideo(props: YouTubeVideoProps) {
    const getReactPlayer: (onReady: any) => ReactPlayer = props.getReactPlayer;
    const startTime: number = props.startTime;

    const [isReady, setIsReady] = React.useState(true);
    const playerRef: any = React.useRef();
    
    const onReady: any = React.useCallback(() => {
        if (!isReady) {
            playerRef.current.seekTo(startTime, "seconds");
            setIsReady(true);
        }
    }, [isReady]);

    const YouTube = getReactPlayer(onReady);

    return (
        <div className="youtube-player-container">
            {YouTube.render()}
        </div>
    );
}