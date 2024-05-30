import React, { useRef, useState, useEffect } from 'react';

const Canvas = () => {
	const canvasRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [context, setContext] = useState(null);
	const [color, setColor] = useState('#000000');
	const [lineWidth, setLineWidth] = useState(5);
	const [history, setHistory] = useState([]);
	const [historyStep, setHistoryStep] = useState(-1);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.lineCap = 'round';
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		setContext(ctx);

		saveState(canvas);
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
		if (isDrawing) {
			context.closePath();
			setIsDrawing(false);
			saveState(canvasRef.current);
		}
	};

	const saveDrawing = () => {
		const canvas = canvasRef.current;
		const dataURL = canvas.toDataURL('image/jpeg');
		const link = document.createElement('a');
		link.download = 'drawing.jpg';
		link.href = dataURL;
		link.click();
	};

	const saveState = (canvas) => {
		const canvasState = canvas.toDataURL();
		setHistory((prevHistory) => {
			const newHistory = [
				...prevHistory.slice(0, historyStep + 1),
				canvasState,
			];
			return newHistory;
		});
		setHistoryStep((prevStep) => prevStep + 1);
	};

	const undo = () => {
		if (historyStep > 0) {
			const newStep = historyStep - 1;
			setHistoryStep(newStep);
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			const prevImage = new Image();
			prevImage.src = history[newStep];
			prevImage.onload = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(prevImage, 0, 0);
			};
		}
	};

	const redo = () => {
		if (historyStep < history.length - 1) {
			const newStep = historyStep + 1;
			setHistoryStep(newStep);
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			const nextImage = new Image();
			nextImage.src = history[newStep];
			nextImage.onload = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(nextImage, 0, 0);
			};
		}
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
			<button onClick={undo} disabled={historyStep <= 0}>
				Undo
			</button>
			<button onClick={redo} disabled={historyStep >= history.length - 1}>
				Redo
			</button>
			<button onClick={saveDrawing}>Save as JPEG</button>
		</div>
	);
};

export default Canvas;
