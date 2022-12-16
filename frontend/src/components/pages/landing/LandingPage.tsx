import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import UrlTextBox from "./urltextbox"; //maybe the ./ part will cause an error - coudl do two .. ? 
import TriggerBtn from "./triggerbtn";

export default function LandingPage() {
  return (
    <>
      <header className="landing-header">
        TLDW
      </header>
      <nav>
        <Link to="/about">About</Link>
        <Link to="/">TLDW</Link>
      </nav>
      <UrlTextBox />
      <TriggerBtn />
      <p>or drag and drop a YouTube URL anywhere below!</p>
    </>
  );
}
