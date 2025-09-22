import React from "react";
import './MagicQuadrant.css'; // Import the external CSS file

const MagicQuadrant = () => {
  return (
    <div className="quadrant-container">
      {/* Grid Quadrants */}
      <div className="grid-box top-left"></div>
      <div className="grid-box top-right"></div>
      <div className="grid-box bottom-left"></div>
      <div className="grid-box bottom-right"></div>

      {/* Labels */}
      <div className="label top-left">Niche Players</div>
      <div className="label top-right">Challengers</div>
      <div className="label bottom-left">Visionaries</div>
      <div className="label bottom-right">Leaders</div>

      {/* Competitors (Styled dots with names) */}

        <div className="dot" style={{ top: '5%', left: '25%' }}>Turnitin</div>
        <div className="dot" style={{ top: '9%', left: '11%' }}>Gradescope</div>
        <div className="dot" style={{ top: '25%', left: '75%' }}>TeachFX</div>
        <div className="dot" style={{ top: '95%', left: '80%' }}>Packback</div>
        <div className="dot" style={{ top: '10%', left: '90%' }}>Khanmigo</div>
        <div className="dot" style={{ top: '60%', left: '90%' }}>Microsoft Copilot</div>
        <div className="dot" style={{ top: '55%', left: '18%' }}>Edthena</div>
        <div className="dot" style={{ top: '85%', left: '8%' }}>VirtuTA</div>

    </div>
  );
};

export default MagicQuadrant;
