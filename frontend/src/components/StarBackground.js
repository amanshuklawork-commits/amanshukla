import React from 'react';
import './StarBackground.css';

const StarBackground = () => {
  return (
    <div className="star-container">
      <div className="stars"></div>
      <div className="shooting-stars">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
      </div>
    </div>
  );
};

export default StarBackground;