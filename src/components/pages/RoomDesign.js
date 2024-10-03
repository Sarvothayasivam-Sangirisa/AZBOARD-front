import React, { useState, useRef, useEffect } from 'react';
import sofa from '../../icons/sofa.png';
import bed from '../../icons/bed.png';
import lamp from '../../icons/lamp.png';
import table from '../../icons/table.png';
import chair from '../../icons/chair.png';
import frame from '../../icons/frame.png';
import '../style/RoomDesign.css';

const RoomDesign = () => {
  const [roomImage, setRoomImage] = useState(null);
  const [furniture, setFurniture] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const RESIZE_HANDLE_SIZE = 8;
  const MIN_SIZE = 20;

  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  const handleRoomImageUpload = async (e) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const img = await preloadImage(reader.result);
        setRoomImage(img);
      } catch (error) {
        console.error('Failed to load room image:', error);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const addFurnitureIcon = async (iconSrc) => {
    try {
      const img = await preloadImage(iconSrc);
      const newFurniture = {
        id: Date.now(),
        img,
        x: Math.random() * (800 - img.width),
        y: Math.random() * (600 - img.height),
        width: img.width,
        height: img.height,
      };
      setFurniture((prevFurniture) => [...prevFurniture, newFurniture]);
    } catch (error) {
      console.error('Failed to load furniture image:', error);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (roomImage) {
      ctx.drawImage(roomImage, 0, 0, canvas.width, canvas.height);
    }

    furniture.forEach((item) => {
      ctx.drawImage(item.img, item.x, item.y, item.width, item.height);

      if (selectedFurniture && selectedFurniture.id === item.id) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(item.x, item.y, item.width, item.height);
        drawResizeHandles(ctx, item);
      }
    });
  };

  const drawResizeHandles = (ctx, item) => {
    const { x, y, width, height } = item;
    const handles = [
      { x: x + width - RESIZE_HANDLE_SIZE / 2, y: y + height - RESIZE_HANDLE_SIZE / 2 },
    ];

    ctx.fillStyle = 'red';
    handles.forEach((handle) => {
      ctx.fillRect(handle.x, handle.y, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
    });
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const foundFurniture = [...furniture].reverse().find((item) => (
      mouseX >= item.x &&
      mouseX <= item.x + item.width &&
      mouseY >= item.y &&
      mouseY <= item.y + item.height
    ));

    if (foundFurniture) {
      if (selectedFurniture && selectedFurniture.id === foundFurniture.id) {
        const isOnResizeHandle = (
          mouseX >= foundFurniture.x + foundFurniture.width - RESIZE_HANDLE_SIZE &&
          mouseY >= foundFurniture.y + foundFurniture.height - RESIZE_HANDLE_SIZE
        );

        if (isOnResizeHandle) {
          setIsResizing(true);
        }
        return; 
      }

      const isOnResizeHandle = (
        mouseX >= foundFurniture.x + foundFurniture.width - RESIZE_HANDLE_SIZE &&
        mouseY >= foundFurniture.y + foundFurniture.height - RESIZE_HANDLE_SIZE
      );

      setSelectedFurniture(foundFurniture);

      if (!isOnResizeHandle) {
        setOffset({ x: mouseX - foundFurniture.x, y: mouseY - foundFurniture.y });
        const handleMouseMove = (eMove) => {
          const newMouseX = eMove.clientX - rect.left;
          const newMouseY = eMove.clientY - rect.top;

          const updatedFurniture = furniture.map((item) => {
            if (item.id === foundFurniture.id) {
              return {
                ...item,
                x: newMouseX - offset.x,
                y: newMouseY - offset.y,
              };
            }
            return item;
          });

          setFurniture(updatedFurniture);
        };

        const handleMouseUp = () => {
          setIsResizing(false);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }
    } else {
      setSelectedFurniture(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isResizing || !selectedFurniture) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newWidth = Math.max(MIN_SIZE, mouseX - selectedFurniture.x);
    const newHeight = Math.max(MIN_SIZE, mouseY - selectedFurniture.y);

    const updatedFurniture = furniture.map((item) => {
      if (item.id === selectedFurniture.id) {
        return {
          ...item,
          width: newWidth,
          height: newHeight,
        };
      }
      return item;
    });

    setFurniture(updatedFurniture);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const deleteSelectedFurniture = () => {
    if (selectedFurniture) {
      setFurniture((prevFurniture) => prevFurniture.filter(item => item.id !== selectedFurniture.id));
      setSelectedFurniture(null);
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [roomImage, furniture, selectedFurniture]);

  return (
    <div className="room-design-container">
      <h2>Design Your Room</h2>

      <div className="image-upload ">
        <input type="file" onChange={handleRoomImageUpload} accept="image/*" />
      </div>

      <div
        className="canvas-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <canvas ref={canvasRef} width={800} height={600}></canvas>
      </div>

      {roomImage && (
        <div className="furniture-selection">
          <h3>Select Furniture</h3>
          <div className="icons">
            <img src={sofa} alt="Sofa" className="furniture-icon" onClick={() => addFurnitureIcon(sofa)} />
            <img src={bed} alt="Bed" className="furniture-icon" onClick={() => addFurnitureIcon(bed)} />
            <img src={table} alt="Table" className="furniture-icon" onClick={() => addFurnitureIcon(table)} />
            <img src={lamp} alt="Lamp" className="furniture-icon" onClick={() => addFurnitureIcon(lamp)} />
            <img src={chair} alt="Chair" className="furniture-icon" onClick={() => addFurnitureIcon(chair)} />
            <img src={frame} alt="Frame" className="furniture-icon" onClick={() => addFurnitureIcon(frame)} />
          </div>
        </div>
      )}

      {selectedFurniture && (
        <div className="delete-button-container">
          <button className="delete-button cs-button" onClick={deleteSelectedFurniture}>
            Delete Selected Furniture
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomDesign;
