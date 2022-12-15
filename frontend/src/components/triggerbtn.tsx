// creates a button that is a rectangle with semi-circle rounded edges and says "TLDW" in all caps

import * as React from "react";
import "./triggerbtn.css";

const TriggerBtn: React.FC = () => {
  return (
    <button className="trigger-btn">TLDW</button>
  );
};

export default TriggerBtn;

