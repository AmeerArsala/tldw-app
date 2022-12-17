import React from "react";
import "./TLDW.css";

import axios from "axios";

import ReactPlayer from "react-player";
import YouTubeVideo, { YouTubeVideoProps } from "../youtubevideo/YouTubeVideo";

import { TLDW_Model } from "../../utils/constants";
import { truncateYouTubeURL } from "../../utils/encoding";

//import YouTube, { YouTubeProps } from "@u-wave/react-youtube";

export interface Highlight {
    range: [number, number]; // [start, end]
    segment_text: string;    // transcript for that segment
}

export interface TldwResult {
    youtubeVideoURL: string;
    transcript: string;
    language: string;
    summary: string;
    highlights: Highlight[];
    visualization_img_url: string;
}

export const NO_RESULT: TldwResult = {
    youtubeVideoURL: "",
    transcript: "",
    language: "NOTHING",
    summary: "",
    highlights: [],
    visualization_img_url: TLDW_Model.NO_VISUALIZATION_KEY
};

export function tldw(youtubeURL: string,
                     pretrainedWhisperModelName: string,
                     createVisualization: boolean, 
                     isDeepTranscribe: boolean, isRemoteTranscribe: boolean, 
                     numHighlights: number,
                     onFinish: (result: TldwResult) => void,
                     onError: () => void) {
    let videoID = truncateYouTubeURL(youtubeURL);

    // call the backend
    axios({
        method: "GET",
        url: `/tldw_inference/${videoID}`,
        params: {
            pretrained_whisper_model: pretrainedWhisperModelName,
            visualize: createVisualization,
            deep_transcribe: isDeepTranscribe,
            remote_transcribe: isRemoteTranscribe,
            num_highlights: numHighlights
        }
    })
    .then((response) => {
        console.log("RESPONSE: " + response);

        const res = response.data;
        const result: TldwResult = {
            youtubeVideoURL: youtubeURL,
            transcript: res["transcript"],
            language: res["language"],
            summary: res["summary"],
            highlights: res["highlights"],
            visualization_img_url: res["visualization_img_url"]
        }

        onFinish(result);
    }).catch((error) => {
        console.log("ERROR");
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);

        onError();
    });
}

export default function TLDW(props: TldwResult) {
    const youtubeVideoURL: string = props.youtubeVideoURL;
    const transcript: string = props.transcript;
    const language: string = props.language;
    const summary: string = props.summary;
    const highlights: Highlight[] = props.highlights;
    const visualization_img_url: string = props.visualization_img_url;

    //const youtubeVideoID: string = truncateYouTubeURL(youtubeVideoURL);
    const [currentVideoURL, setCurrentVideoURL] = React.useState(youtubeVideoURL);
    const [currentHighlight, setCurrentHighlight] = React.useState<Highlight>(highlights[0]);

    function youTubeURLToTime(url: string, time: number) {
        const prefix = "https://www.youtube.com/watch?v=";
        const timePrefix = "?t=";
        
        let id = truncateYouTubeURL(url);

        return (prefix + id + timePrefix + time);
    }

    /*const YouTubeVideo = () => {
        return (
          <iframe className="youtube-video" 
            src={youtubeVideoURL}
            allowFullScreen={false}
            frameBorder="0"
            height="315"
            width="420"
          >
          </iframe>)
    };*/

    /*const YouTubeVideo = new YouTube({
        video: youtubeVideoID,
        width: 315,
        height: 420,
        autoplay: true,
        controls: false,
        disableKeyboard: true,
        allowFullscreen: false,
        startSeconds: currentHighlight.range[0],
        endSeconds: currentHighlight.range[1],
    });*/

    /*const YouTubeVideo = (<YouTubeVideo
    getReactPlayer={(onReady: any) => {
      return new ReactPlayer({
          url: youtubeVideoURL,
          playing: true,
          loop: true,
          controls: false,
          onReady: onReady
      });
    }}
    startTime={currentHighlight.range[0]}
    />);*/

    /*const getReactPlayer: (onReady: any) => ReactPlayer = (onReady: any) => {
        return new ReactPlayer({
            url: youtubeVideoURL,
            playing: true,
            loop: true,
            controls: false,
            onReady: onReady
        });
    };*/

    const setAttentionOnHighlight = (highlight: Highlight) => {
        setCurrentVideoURL(youTubeURLToTime(youtubeVideoURL, highlight.range[0]));
        setCurrentHighlight(highlight);
    }

    return (
      <div className="tldw-view">
        {/* DISPLAY THE TLDW RESULT HERE */}
        <h1 className="header">TLDW'd!</h1>
        <div className="youtube-player-panel">
          <ReactPlayer
            url={currentVideoURL}
            playing={true}
            controls={true}
          />
        </div>
        
        <div className="summary-panel">
            <h2>Summary</h2>
            <div className="summary">{summary}</div>
        </div>
        <h2>Highlights</h2>
        <div className="highlights-panel">
            {/* Highlights */}
            <div className="key-points">
                {highlights.map((highlight) => (
                    <div className="key-point">
                        <u onClick={() => setCurrentHighlight(highlight)}>{highlight.segment_text}</u>
                    </div>
                ))}
            </div>

            {/* Timestamps */}
            <div className="timestamps">
                {highlights.map((highlight) => {
                    const [start, end] = highlight.range;
                    const [currentStart, currentEnd] = currentHighlight.range;

                    return (
                      <div className={start === currentStart ? "selected-timestamp" : "timestamp"}>
                        <button onClick={() => setCurrentHighlight(highlight)}><u>{formatTimestamp(start)}</u></button>
                      </div>
                );
            })}
            </div>
        </div>

        <p><b>Language:</b> {language}</p>
        <p><b>Full Transcript:</b> {transcript}</p>

        {(visualization_img_url !== TLDW_Model.NO_VISUALIZATION_KEY) && (<img src={visualization_img_url} alt="DALL-E 2 visualization"/>)}

      </div>
    );
}

function formatTimestamp(timestamp: number) {
  const minutes = Math.floor(timestamp / 60);
  const seconds = timestamp % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
  
  // explanation for the TLDW component:
  
  // The component uses a state variable, selectedKeyPoint, to keep track of the currently selected key point. This state variable is initialized to null and is updated when a key point is clicked or when a transcript segment is clicked.
  
  // The component then renders the summary and key points in a div with the class summary-panel, which takes up 1/3 of the screen width. The summary is displayed as a div with the class summary, and the key points are displayed as clickable div elements with the class key-point.
  
  // Next, the component renders a panel with timestamps for each key point in a div with the class timestamps-panel, which takes up 1/8th of the screen width. The timestamps are displayed as div elements with the class timestamp, and the selected key point's timestamp is highlighted with the class selected-timestamp.
  
  // The component then renders the full transcript in a div with the class transcript-panel, which takes up 1/2 of the screen width. The transcript is displayed as a series of div elements with the class transcript-segment, and the selected key point's transcript segment is highlighted with the class selected-transcript-segment. The component also includes a clickable "copy" icon in a div with the class copy-icon.
  
  // Finally, the component renders a YouTube player in a div with the class youtube-player-panel, which takes up the remaining 1/8th of the screen width. The player is embedded in an iframe element and displays the video specified by the visualization_img_url prop. The component also includes a clickable "copy" icon in a div with the class copy-icon.
  
  //To style the page, you can use the resultspage.css file that you mentioned. You can apply a drop shadow to each box or panel using the box-shadow property in CSS, and you can set the background gradient using the background property.
  
  
  
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
  