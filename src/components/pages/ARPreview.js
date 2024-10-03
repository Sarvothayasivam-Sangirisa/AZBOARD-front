// src/ARPreview.js
import React, { useState } from 'react';
import '../style/ARPreview.css'; // Create a CSS file for styling

const ARPreview = () => {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
    <div className="ar-preview-container">
      <div className="color-picker">
        {colors.map((color) => (
          <button
            key={color}
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange(color)}
            className="color-button"
          />
        ))}
      </div>
      <div className="wall-area" style={{ backgroundColor: selectedColor }}>
        <p>Click to apply {selectedColor} color!</p>
      </div>
    </div>
  );
};

export default ARPreview;
