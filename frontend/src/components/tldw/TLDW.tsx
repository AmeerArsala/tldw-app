import React from "react";
import "./TLDW.css";
import "./resultspage.css";

import axios from "axios";
import { NO_VISUALIZATION } from "../../utils/constants";

export interface Highlight {
    range: [number, number];
    segment_text: string;
}

export interface TldwResult {
    transcript: string;
    language: string;
    highlights: Highlight[];
    visualization_img_url: string;
}

export const NO_RESULT: TldwResult = {
    transcript: "",
    language: "NOTHING",
    highlights: [],
    visualization_img_url: NO_VISUALIZATION
};

export function tldw(url: string,
                     pretrainedWhisperModelName: string,
                     createVisualization: boolean, 
                     isDeepTranscribe: boolean, isRemoteTranscribe: boolean, 
                     numHighlights: number,
                     onFinish: (result: TldwResult) => void) {
    // call the backend
    //...
    //onFinish(result);
}

export default function TLDW(props: TldwResult) {
    const transcript: string = props.transcript;
    const language: string = props.language;
    const highlights: Highlight[] = props.highlights;
    const visualization_img_url: string = props.visualization_img_url;

    return (
        <div className="tldw-view">
        <nav className="navbar">
            <a href="/about">About</a>
            <a href="/">TLDW</a>
        </nav>
        <h1 className="header">TLDW'd!</h1>
        <div className="summary-panel">
            <h2>Summary and key points</h2>
            <div className="summary">{transcript}</div>
            <hr />
            {highlights.map((highlight) => (
            <div
                className="key-point"
                onClick={() => setSelectedKeyPoint(highlight)}
            >
                {highlight.segment_text}
            </div>
            ))}
        </div>
        <div className="timestamps-panel">
            {highlights.map((highlight) => (
            <div
                className={
                highlight === selectedKeyPoint
                    ? "selected-timestamp"
                    : "timestamp"
                }
            >
                {formatTimestamp(highlight.range[0])}
            </div>
            ))}
        </div>
        <div className="transcript-panel">
            <h2>Full transcript</h2>
            <div
            className="transcript"
            onClick={(event) => {
                const target = event.target as HTMLDivElement;
                const index = Array.from(target.parentElement!.children).indexOf(
                target
                );
                setSelectedKeyPoint(highlights[index]);
            }}
            >
            {highlights.map((highlight, index) => (
                <div
                className={
                    highlight === selectedKeyPoint
                    ? "selected-transcript-segment"
                    : "transcript-segment"
                }
                >
                {highlight.segment_text}
                </div>
            ))}
            </div>
            <div className="copy-icon">Copy icon here</div>
        </div>
        <div className="youtube-player-panel">
            <iframe src={visualization_img_url} />
            <div className="copy-icon">Copy icon here</div>
        </div>
        </div>
    );
}

function formatTimestamp(timestamp: number) {
  const minutes = Math.floor(timestamp / 60);
  const seconds = timestamp % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}



// This code defines a function tldw and a React component TLDW.

//The tldw function takes a number of parameters:

//url: a string representing a URL.
//pretrainedWhisperModelName: a string representing the name of a pretrained model.
//createVisualization: a boolean indicating whether to create a visualization or not.
//isDeepTranscribe: a boolean indicating whether to use deep transcription or not.
//isRemoteTranscribe: a boolean indicating whether to use remote transcription or not.
//numHighlights: a number representing the number of highlights to be returned.
//onFinish: a function that will be called when the tldw function finishes execution. This function takes in a single parameter, result, which is of type TldwResult.
//The TLDW component is a React component that expects to receive props of type TldwResult. It destructures these props into the variables transcript, language, highlights, and visualization_img_url. It then returns a div element with the class tldw-view.

//The tldw function is currently incomplete, as it has a commented out line that calls the onFinish callback with a result parameter. It is also importing the axios library, which is often used for making HTTP requests in JavaScript.

//The TLDW component is expected to display the result of the tldw function in some way, but the code for doing so is currently commented out and not present in the code snippet.



