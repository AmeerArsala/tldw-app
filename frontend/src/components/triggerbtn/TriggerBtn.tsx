// creates a button that is a rectangle with semi-circle rounded edges and says "TLDW" in all caps

import * as React from "react";
import "./TriggerBtn.css";

interface TriggerBtnProps {
  id: string;
  text: string;
  runTldw: () => void;
}

function TriggerBtn(props: TriggerBtnProps) {
  const id: string = props.id;
  const text: string = props.text;
  const runTldw: () => void = props.runTldw;
  

  return (
    <button id={id} className="trigger-btn" onClick={runTldw}>{text}</button>
  );
};

export default TriggerBtn;