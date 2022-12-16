// creates a button that is a rectangle with semi-circle rounded edges and says "TLDW" in all caps

import * as React from "react";
import "./TriggerBtn.css";

interface TriggerBtnProps {
  runTldw: () => void;
  text: string;
}

function TriggerBtn(props: TriggerBtnProps) {
  const runTldw: () => void = props.runTldw;
  const text: string = props.text;

  return (
    <button className="trigger-btn" onClick={runTldw}>{text}</button>
  );
};

export default TriggerBtn;