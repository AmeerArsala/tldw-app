import React from "react";
import "./Main.css";

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingPage from "../pages/landing/LandingPage";
import AboutPage from "../pages/about/AboutPage";
import Navbar from "../navbar/Navbar";

//main activity
export default function Main() {
    return (
        <div id="main">
            <BrowserRouter>
                <Navbar />

                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}