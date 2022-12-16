import React from "react";
import "./TLDW.css";

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

    // ...

    return (
      <div className="tldw-view">
        {/* DISPLAY THE TLDW RESULT HERE */}
      </div>);
}