// creates a button that is a rectangle with semi-circle rounded edges and says "TLDW" in all caps

import * as React from "react";
import "./TriggerBtn.css";

interface TriggerBtnProps {
  runTldw: () => void;
}

function TriggerBtn(props: TriggerBtnProps) {
  const runTldw = () => {
    // code to run tldw.py file goes here
  }

  return (
    <button className="trigger-btn" onClick={runTldw}>TLDW</button>
  );
};

export default TriggerBtn;