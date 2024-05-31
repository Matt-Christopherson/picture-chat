import React, { useRef, useState, useEffect } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null); // Reference to the canvas element
  const [isDrawing, setIsDrawing] = useState(false); // State to track drawing status
  const [context, setContext] = useState(null); // State to store canvas context
  const [color, setColor] = useState('#000000'); // State to store selected color
  const [lineWidth, setLineWidth] = useState(5); // State to store selected line width
  const [history, setHistory] = useState([]); // State to store history of canvas states
  const [redoStack, setRedoStack] = useState([]); // State to store redo stack

  useEffect(() => {
    // Set up the canvas context and default background
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (context === null) {
      // Fill the canvas with a white background once
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set drawing parameters
      ctx.lineCap = 'round';
      setContext(ctx);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    if (context) {
      // Update drawing parameters when color or lineWidth changes
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
    }
  }, [color, lineWidth, context]); // Run when color, lineWidth, or context changes

  const startDrawing = (e) => {
    // Begin a new drawing path when the user starts drawing
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    // Draw a line to the current mouse position if drawing is active
    if (!isDrawing) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    // Finish the current drawing path when the user stops drawing
    if (!isDrawing) return; // Only proceed if currently drawing
    context.closePath();
    setIsDrawing(false);

    // Save the current state of the canvas to history
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    setHistory([...history, dataURL]);
    setRedoStack([]); // Clear the redo stack
  };

  const undo = () => {
    if (history.length === 0) return;
    
    const newHistory = [...history];
    const lastState = newHistory.pop();
    setHistory(newHistory);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (newHistory.length > 0) {
      const prevState = newHistory[newHistory.length - 1];
      const img = new Image();
      img.src = prevState;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setRedoStack([...redoStack, lastState]);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();
    setRedoStack(newRedoStack);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = nextState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    setHistory([...history, nextState]);
  };

  const saveDrawing = () => {
    // Save the canvas content as a JPEG file
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.download = 'drawing.jpg';
    link.href = dataURL;
    link.click();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing} // Event handler for mouse down
        onMouseMove={draw} // Event handler for mouse move
        onMouseUp={stopDrawing} // Event handler for mouse up
        onMouseLeave={stopDrawing} // Event handler for mouse leave
        style={{ border: '1px solid #000' }}
      />
      <div>
        <label htmlFor="colorPicker">Color: </label>
        <input
          type="color"
          id="colorPicker"
          value={color}
          onChange={(e) => setColor(e.target.value)} // Update color state on change
        />
        <label htmlFor="lineWidth"> Line Width: </label>
        <input
          type="number"
          id="lineWidth"
          value={lineWidth}
          min="1"
          max="50"
          onChange={(e) => setLineWidth(e.target.value)} // Update lineWidth state on change
        />
      </div>
      <button onClick={saveDrawing}>Save as JPEG</button> {/* Save button */}
      <button onClick={undo}>Undo</button> {/* Undo button */}
      <button onClick={redo}>Redo</button> {/* Redo button */}
    </div>
  );
};

export default Canvas;
