import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1><b style={{color:'white'}}>"</b>Welcome to Crypto World<b style={{color:'white'}}>"</b></h1>
        <p>Explore the future of finance with us</p>
        <button className="cta-button">Get Started</button>
      </div>
      <div className="hero-images">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/2048px-Bitcoin.svg.png" alt="Crypto Image 1" className="crypto-image" />
      </div>
    </div>
  );
}

export default HeroSection;
