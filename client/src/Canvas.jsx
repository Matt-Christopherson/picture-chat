// src/Canvas.jsx
import React, { useRef, useState, useEffect } from 'react';

const Canvas = () => {
	const canvasRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [context, setContext] = useState(null);
	const [color, setColor] = useState('#000000');
	const [lineWidth, setLineWidth] = useState(5);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctx.lineCap = 'round';
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		setContext(ctx);
	}, [color, lineWidth]);

	const startDrawing = (e) => {
		context.beginPath();
		context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		setIsDrawing(true);
	};

	const draw = (e) => {
		if (!isDrawing) return;
		context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		context.stroke();
	};

	const stopDrawing = () => {
		context.closePath();
		setIsDrawing(false);
	};

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={800}
				height={600}
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseLeave={stopDrawing}
				style={{ border: '1px solid #000' }}
			/>
			<div>
				<label htmlFor="colorPicker">Color: </label>
				<input
					type="color"
					id="colorPicker"
					value={color}
					onChange={(e) => setColor(e.target.value)}
				/>
				<label htmlFor="lineWidth"> Line Width: </label>
				<input
					type="number"
					id="lineWidth"
					value={lineWidth}
					min="1"
					max="50"
					onChange={(e) => setLineWidth(e.target.value)}
				/>
			</div>
		</div>
	);
};

export default Canvas;
