// ARComponent.js
import React, { useRef, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { useTexture } from '@react-three/drei';
import { ChromePicker } from 'react-color';

const ARComponent = ({ uploadedImage }) => {
  const [color, setColor] = React.useState('#ff0000'); // Default color
  const texture = useTexture(uploadedImage);

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  useEffect(() => {
    if (texture) {
      // Apply color overlay logic here if needed
    }
  }, [texture]);

  return (
    <div>
      <ChromePicker color={color} onChangeComplete={handleColorChange} />
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <planeBufferGeometry args={[5, 5]} />
          <meshBasicMaterial map={texture} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default ARComponent;
