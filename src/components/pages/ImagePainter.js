// import React, { useState, useRef, useEffect } from 'react';

// const ImagePainter = () => {
//   const [image, setImage] = useState(null);
//   const [color, setColor] = useState('#ff9999');
//   const canvasRef = useRef(null);
//   const imgRef = useRef(new Image());

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImage(reader.result); // Set image data URL
//     };
//     reader.readAsDataURL(file);
//   };

//   const applyColorFilter = (ctx, width, height) => {
//     ctx.fillStyle = color;
//     ctx.globalAlpha = 0.4; // Adjust opacity to simulate wall color
//     ctx.fillRect(0, 0, width, height);
//     ctx.globalAlpha = 1.0; // Reset opacity
//   };

//   const handleImageLoad = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     imgRef.current.onload = () => {
//       canvas.width = imgRef.current.width;
//       canvas.height = imgRef.current.height;

//       // Draw image to canvas
//       ctx.drawImage(imgRef.current, 0, 0);

//       // Apply color filter on top
//       applyColorFilter(ctx, canvas.width, canvas.height);
//     };
//     imgRef.current.src = image;
//   };

//   useEffect(() => {
//     if (image) {
//       handleImageLoad();
//     }
//   }, [image, color]);

//   return (
//     <section className="d-flex flex-column align-items-center">
//       <div className="mb-3">
//         <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control mb-2" />
//         <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="form-control mb-2" />
//       </div>
//       <div>
//         {image && (
//           <canvas ref={canvasRef} style={{ border: '1px solid black', cursor: 'pointer', width: '500px' }} />
//         )}
//       </div>
//     </section>
//   );
// };

// export default ImagePainter;
import React, { useState, useRef, useEffect } from 'react';

const ImagePainter = () => {
  const [image, setImage] = useState(null);
  const [color, setColor] = useState('#ff9999'); // Default wall color
  const canvasRef = useRef(null);
  const imgRef = useRef(new Image());

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Set image data URL
    };
    reader.readAsDataURL(file);
  };

  // Function to draw a triangle
  const drawTriangle = (ctx, x1, y1, x2, y2, x3, y3, color) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  // Draw orderly triangles within the wall area
  const drawOrderedTriangles = (ctx, wallX, wallY, wallWidth, wallHeight, triangleSize) => {
    const colors = ['#000000', '#C75B7A', '#D9ABAB', '#FFD700']; // Color options for triangles
    let colorIndex = 0;

    for (let y = wallY; y < wallY + wallHeight; y += triangleSize) {
      for (let x = wallX; x < wallX + wallWidth; x += triangleSize) {
        // Alternating color for each triangle
        const color = colors[colorIndex % colors.length];
        colorIndex++;

        // Draw two triangles to fill the square of size `triangleSize`
        // First triangle (bottom-left)
        drawTriangle(ctx, x, y, x + triangleSize, y, x, y + triangleSize, color);
        
        // Second triangle (top-right)
        drawTriangle(ctx, x + triangleSize, y, x + triangleSize, y + triangleSize, x, y + triangleSize, color);
      }
    }
  };

  const applyColorFilter = (ctx, imageWidth, imageHeight) => {
    // Define the height of the wall area you want to color
    const wallHeight = imageHeight * 0.85; // 85% of the image height
    const wallWidth = imageWidth; // Full width for the back wall

    // Apply color to the main back wall
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, wallWidth, wallHeight); // Uniform height for the back wall

    // Triangle size (smaller value = smaller triangles)
    const triangleSize = 50; // You can adjust this size for smaller or larger triangles

    // Draw orderly triangles within the wall area
    drawOrderedTriangles(ctx, 0, 0, wallWidth, wallHeight, triangleSize);

    // Create gradients for the left and right walls to simulate corner lighting
    const leftGradient = ctx.createLinearGradient(0, 0, imageWidth / 6, 0); // Left wall gradient
    leftGradient.addColorStop(0, color); // Strong color at the corner
    leftGradient.addColorStop(1, 'rgba(255, 153, 153, 0)'); // Fade out towards the center

    const rightGradient = ctx.createLinearGradient(imageWidth, 0, imageWidth * 5 / 6, 0); // Right wall gradient
    rightGradient.addColorStop(0, color); // Strong color at the corner
    rightGradient.addColorStop(1, 'rgba(255, 153, 153, 0)'); // Fade out towards the center

    // Apply left and right wall gradients
    ctx.fillStyle = leftGradient;
    ctx.fillRect(0, 0, imageWidth / 6, wallHeight); // Apply left wall gradient

    ctx.fillStyle = rightGradient;
    ctx.fillRect(imageWidth * 5 / 6, 0, imageWidth / 6, wallHeight); // Apply right wall gradient
  };

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    imgRef.current.onload = () => {
      const imageWidth = imgRef.current.width;
      const imageHeight = imgRef.current.height;
      canvas.width = imageWidth;
      canvas.height = imageHeight;

      // Draw image to canvas
      ctx.drawImage(imgRef.current, 0, 0);

      // Apply color filter to the walls and triangles
      applyColorFilter(ctx, imageWidth, imageHeight);
    };

    imgRef.current.src = image; // Set the image source
  };

  useEffect(() => {
    if (image) {
      handleImageLoad(); // Call when image updates
    }
  }, [image, color]); // Depend on image and color

  return (
    <section className="d-flex flex-column align-items-center mt-5">
      <div className="mb-3">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control mb-2" />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="form-control mb-2" />
      </div>
      <div>
        {image && (
          <canvas ref={canvasRef} style={{ border: '1px solid black', cursor: 'pointer', width: '500px' }} />
        )}
      </div>
    </section>
  );
};

export default ImagePainter;