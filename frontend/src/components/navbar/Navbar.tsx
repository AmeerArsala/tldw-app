import React from "react";
import "./Navbar.css";

import { Link } from "react-router-dom";

//header bar
export default function Navbar() {
    return (
        <header className="site-header">
            <Link to="/"><h1 id="site-title-text">TLDW</h1></Link>

            <nav className="site-navigator">
                
                <Link className="nav-item-text" to="/about">About</Link>
            </nav>
        </header>
    )
}