import React from "react";
import "./LandingPage.css";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse } from "@mui/material";
import { TextField } from "@mui/material";
import { Select, SelectChangeEvent, MenuItem } from "@mui/material";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
//import Button from '@mui/material/Button';
import { LinearProgress } from "@mui/material";

import Expandable from "../../expandable/Expandable";
import FormControlGroup, { FormControlItem } from "../../formcontrolgroup/FormControlGroup";
import TriggerBtn from "../../triggerbtn/TriggerBtn";
//import UrlTextBox from "./urltextbox"; //maybe the ./ part will cause an error - could do two .. ? 

import { TLDW_Model } from "../../../utils/constants";
import TLDW, { tldw, TldwResult, NO_RESULT } from "../../tldw/TLDW";
import { isYouTubeURL } from "../../../utils/tests";

interface ErrorState {
  error: boolean;
  helperText: string;
}

export default function LandingPage() {
  // YouTube URL
  const [url, setURL] = React.useState("");
  const [errorState, setErrorState] = React.useState({error: false, helperText: ""});

  // Pretrained Whisper Model Name
  const [transcriptionModelName, setTranscriptionModelName] = React.useState(TLDW_Model.DEFAULT_WHISPER_PRETRAINED_MODEL);
  
  // Expander for Advanced Options
  const [advancedExpanded, setAdvancedExpanded] = React.useState(false);

  // All Advanced Options
  const [isDeepTranscribe, setIsDeepTranscribe] = React.useState(true);
  const [isRemoteTranscribe, setIsRemoteTranscribe] = React.useState(false);
  const [createVisualization, setCreateVisualization] = React.useState(false);
  const [numHighlights, setNumHighlights] = React.useState(5);

  // TLDW
  const [isTLDWing, setIsTLDWing] = React.useState(false);
  const [tldwResult, setTldwResult] = React.useState(NO_RESULT);

  const runTldw = () => {
    if (!isYouTubeURL(url)) {
      setErrorState({error: true, helperText: "Not a YouTube link."});
      return;
    } 

    const onFinish = (result: TldwResult) => {
      setIsTLDWing(false);
      setTldwResult(result);
    }

    setIsTLDWing(true);
    tldw(url, transcriptionModelName, createVisualization, isDeepTranscribe, isRemoteTranscribe, numHighlights, onFinish);
  }

  // Advanced Options Component
  const AdvancedOptions = () => {
    const numHighlightsSlider = (
      <Slider
        min={3}
        max={15}
        step={1}
        defaultValue={5}
        valueLabelDisplay="on"
        marks
        value={numHighlights}
        onChange={(event: Event, newValue: number | number[]) => {
          setNumHighlights(newValue as number);
        }}/>
    );

    const advancedOptions: FormControlItem[] = [
      {
        component: (<Switch className="advanced-options-switch" checked={isDeepTranscribe} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setIsDeepTranscribe(!isDeepTranscribe);
        }}/>),
        label: "Transcribe Deeply"
      },
      {
        component: (<Switch className="advanced-options-switch" checked={isRemoteTranscribe} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setIsRemoteTranscribe(!isRemoteTranscribe);
        }}/>),
        label: "Transcribe Remotely"
      },
      {
        component: (<Switch className="advanced-options-switch" checked={createVisualization} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCreateVisualization(!createVisualization);
        }}/>),
        label: "Create Visualization"
      },
      {
        component: numHighlightsSlider,
        label: "Number of Highlight Moments"
      }
    ]

    return (<div id="advanced-options"><FormControlGroup items={advancedOptions}/></div>);
  };  

  return (
    <div id="body-landingpage">
      <h2 className="tldw-title">Too Long? Don't Watch</h2>

      <Card className="tldw-input">
        {/* Horizontal: TextField tldwInput, Dropdown transcriptModelSelect */}
        <div className="tldw-main-input">
          {/* URL Input */}
          <TextField
            className="text-input-field" 
            id="tldw-text-input" 
            label="Enter YouTube URL (or drag and drop one!)" 
            variant="outlined"
            value={url}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setURL(event.target.value); }}
            error={errorState.error}
            helperText={errorState.helperText}/>
          
          {/* Whisper Pretrained Model Dropdown Menu */}
          <Select
            className="whisper-modelselect-dropdown"
            labelId="whisper-modelselect-dropdown-label"
            value={transcriptionModelName}
            label="Transcription Model"
            onChange={(event: SelectChangeEvent) => setTranscriptionModelName(event.target.value as string)}
          >
            {TLDW_Model.VALID_WHISPER_PRETRAINED_MODELS.map((validModel: string) => (<MenuItem value={validModel}>{validModel}</MenuItem>))}
          </Select>
        </div>

        <CardActions disableSpacing>
          <Expandable
            expand={advancedExpanded}
            onClick={() => { setAdvancedExpanded(!advancedExpanded); }}
            aria-expanded={advancedExpanded}
            aria-label="Advanced Options"
          >
            <ExpandMoreIcon />
          </Expandable>
        </CardActions>

        <Collapse in={advancedExpanded} timeout="auto" unmountOnExit>
          <CardContent>
            <AdvancedOptions />
          </CardContent>
        </Collapse>
        
        <TriggerBtn text="TLDW" runTldw={runTldw} />
        {isTLDWing && (<LinearProgress />)}
      </Card>

      <div className="tldw-result">
        {tldwResult !== NO_RESULT && (<TLDW {...tldwResult}/>)}
      </div>

    </div>
  );
}
