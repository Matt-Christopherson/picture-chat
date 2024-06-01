import React, { useRef, useState, useEffect } from 'react';

const Canvas = () => {
	const canvasRef = useRef(null); // Reference to the canvas element
	const [isDrawing, setIsDrawing] = useState(false); // State to track drawing status
	const [context, setContext] = useState(null); // State to store canvas context
	const [color, setColor] = useState('#000000'); // State to store selected color
	const [lineWidth, setLineWidth] = useState(5); // State to store selected line width
	const [history, setHistory] = useState([]); // State to store history of canvas states
	const [redoStack, setRedoStack] = useState([]); // State to store redo stack
	const [isEraserActive, setIsEraserActive] = useState(false); // State to track eraser mode
	const [isPaintBucketActive, setIsPaintBucketActive] = useState(false); // State to track paint bucket mode
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Track mouse position
	const [clearConfirmation, setClearConfirmation] = useState(false); // State to track clear canvas confirmation
	const [isPosted, setIsPosted] = useState(false); // State to track if an image is posted

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
			context.strokeStyle = isEraserActive ? '#FFFFFF' : color;
			context.lineWidth = isEraserActive ? lineWidth * 5 : lineWidth;
		}
	}, [color, lineWidth, context, isEraserActive]); // Run when color, lineWidth, context, or isEraserActive changes

	const startDrawing = (event) => {
		// If paint bucket tool is active, fill the area instead of starting to draw
		if (isPaintBucketActive) {
			fillArea(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
			return;
		}

		// Begin a new drawing path when the user starts drawing
		const { offsetX, offsetY } = event.nativeEvent;
		context.beginPath();
		context.moveTo(offsetX, offsetY);
		setIsDrawing(true);
		setMousePosition({ x: offsetX, y: offsetY });
	};

	const draw = (event) => {
		// Draw a line to the current mouse position if drawing is active
		if (!isDrawing) return;
		const { offsetX, offsetY } = event.nativeEvent;
		context.lineTo(offsetX, offsetY);
		context.stroke();
	};

	const stopDrawing = (event) => {
		// Finish the current drawing path when the user stops drawing
		if (!isDrawing) return; // Only proceed if currently drawing
		context.closePath();
		setIsDrawing(false);

		const { offsetX, offsetY } = event.nativeEvent;

		// Check if the mouse position hasn't changed
		if (mousePosition.x === offsetX && mousePosition.y === offsetY) {
			// Draw a dot
			context.beginPath();
			context.arc(offsetX, offsetY, context.lineWidth / 2, 0, Math.PI * 2);
			context.fillStyle = isEraserActive ? '#FFFFFF' : color;
			context.fill();
			context.closePath();
		}

		// Save the current state of the canvas to history
		saveCanvasState();
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
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
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

	const clearDrawing = () => {
		if (!clearConfirmation) {
			// If confirmation is not yet received, set confirmation state to true
			setClearConfirmation(true);
			return;
		}

		// Clear the canvas and reset confirmation state
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		setHistory([]);
		setRedoStack([]);
		setClearConfirmation(false);
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

	const postDrawing = () => {
		const canvas = canvasRef.current;
		const dataURL = canvas.toDataURL('image/jpeg');
		const img = document.createElement('img');
		img.src = dataURL;
		img.alt = 'Posted drawing';
	
		// Append the image to the container
		document.getElementById('posted-images').appendChild(img);
	
		// Update isPosted state to true
		setIsPosted(true);
	};

	const switchToPen = () => {
		setIsEraserActive(false);
		setIsPaintBucketActive(false);
	};

	const toggleEraser = () => {
		setIsEraserActive(true);
		setIsPaintBucketActive(false);
	};

	const togglePaintBucket = () => {
		setIsPaintBucketActive(true);
		setIsEraserActive(false);
	};

	const saveCanvasState = () => {
		const canvas = canvasRef.current;
		const dataURL = canvas.toDataURL();
		setHistory([...history, dataURL]);
		setRedoStack([]); // Clear the redo stack
	};

	const fillArea = (startX, startY) => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const pixelStack = [[startX, startY]];
		const startColor = getPixelColor(imageData, startX, startY);
		const fillColor = hexToRgb(color);

		if (colorsMatch(startColor, fillColor)) return;

		while (pixelStack.length) {
			const newPos = pixelStack.pop();
			const x = newPos[0];
			let y = newPos[1];
			let pixelPos = (y * canvas.width + x) * 4;

			while (
				y >= 0 &&
				colorsMatch(getPixelColor(imageData, x, y), startColor)
			) {
				y--;
				pixelPos -= canvas.width * 4;
			}

			pixelPos += canvas.width * 4;
			y++;
			let reachLeft = false;
			let reachRight = false;

			while (
				y < canvas.height &&
				colorsMatch(getPixelColor(imageData, x, y), startColor)
			) {
				setPixelColor(imageData, pixelPos, fillColor);

				if (x > 0) {
					if (colorsMatch(getPixelColor(imageData, x - 1, y), startColor)) {
						if (!reachLeft) {
							pixelStack.push([x - 1, y]);
							reachLeft = true;
						}
					} else if (reachLeft) {
						reachLeft = false;
					}
				}

				if (x < canvas.width - 1) {
					if (colorsMatch(getPixelColor(imageData, x + 1, y), startColor)) {
						if (!reachRight) {
							pixelStack.push([x + 1, y]);
							reachRight = true;
						}
					} else if (reachRight) {
						reachRight = false;
					}
				}

				y++;
				pixelPos += canvas.width * 4;
			}
		}

		ctx.putImageData(imageData, 0, 0);
		saveCanvasState();
	};

	const getPixelColor = (imageData, x, y) => {
		const pixelPos = (y * imageData.width + x) * 4;
		return [
			imageData.data[pixelPos],
			imageData.data[pixelPos + 1],
			imageData.data[pixelPos + 2],
			imageData.data[pixelPos + 3],
		];
	};

	const setPixelColor = (imageData, pixelPos, color) => {
		imageData.data[pixelPos] = color[0];
		imageData.data[pixelPos + 1] = color[1];
		imageData.data[pixelPos + 2] = color[2];
		imageData.data[pixelPos + 3] = 255;
	};

	const colorsMatch = (color1, color2) => {
		return (
			color1[0] === color2[0] &&
			color1[1] === color2[1] &&
			color1[2] === color2[2] &&
			color1[3] === color2[3]
		);
	};

	const hexToRgb = (hex) => {
		const bigint = parseInt(hex.slice(1), 16);
		const r = (bigint >> 16) & 255;
		const g = (bigint >> 8) & 255;
		const b = bigint & 255;
		return [r, g, b, 255];
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
			<div>
				<button
					onClick={clearDrawing}
					style={{ backgroundColor: clearConfirmation ? 'red' : 'initial' }}
				>
					{clearConfirmation ? 'Confirm?' : 'Clear Canvas'}
				</button> {/* Clear Canvas button */}
				<button onClick={undo}>Undo</button> {/* Undo button */}
				<button onClick={redo}>Redo</button> {/* Redo button */}
				<button onClick={switchToPen}>Pen</button> {/* Pen button */}
				<button onClick={toggleEraser}>Eraser</button> {/* Eraser button */}
				<button onClick={togglePaintBucket}>Paint Bucket</button>{' '} {/* Paint Bucket button */}
				<button onClick={saveDrawing}>Save as JPEG</button> {/* Save button */}
				<button onClick={postDrawing}>Post</button> {/* Post button */}
				<div id="posted-images" className="scroll-container" style={{ marginTop: '20px' }}>
          			{!isPosted && <p>No posts yet. New posts will appear here.</p>}
        		</div>
			</div>
		</div>
	);
};

export default Canvas;