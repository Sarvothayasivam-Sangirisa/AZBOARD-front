import React, { useState, useRef, useEffect } from 'react';

const ARPainter = () => {
  const [image, setImage] = useState(null);
  const [color, setColor] = useState('#ff9999');
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const applyColorToImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Apply color filter
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const rgbColor = hexToRgb(color);

      for (let i = 0; i < data.length; i += 4) {
        // Simple color blending
        data[i] = (data[i] + rgbColor.r) / 2;     // Red
        data[i + 1] = (data[i + 1] + rgbColor.g) / 2; // Green
        data[i + 2] = (data[i + 2] + rgbColor.b) / 2; // Blue
      }

      ctx.putImageData(imgData, 0, 0);
    };
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  return (
    <section className="d-flex flex-column align-items-center">
      <div className="mb-3">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control mb-2" />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="form-control mb-2" />
        <button onClick={applyColorToImage} className="btn btn-primary">Apply Color</button>
      </div>

      {image && (
        <div className="position-relative">
          <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
          <img ref={imgRef} src={image} alt="Uploaded" style={{ display: 'none' }} />
        </div>
      )}
    </section>
  );
};

export default ARPainter;
