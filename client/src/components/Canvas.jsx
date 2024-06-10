import React, { useRef, useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_POST } from "../utils/mutations"; // Adjust the path to your mutations file
import { GET_POSTS } from "../utils/queries"; // Adjust the path to your queries file
import PostContainer from "./PostContainer";
import AuthService from "../utils/auth";

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [isPaintBucketActive, setIsPaintBucketActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clearConfirmation, setClearConfirmation] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [postList, setPostList] = useState([]);

  const [addPost] = useMutation(ADD_POST);
  const { loading, error, data } = useQuery(GET_POSTS);

  useEffect(() => {
    if (data) {
      setPostList(data.posts.map((post) => post.postImage));
    }
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (context === null) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineCap = "round";
      setContext(ctx);
    }
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = isEraserActive ? "#FFFFFF" : color;
      context.lineWidth = isEraserActive ? lineWidth * 5 : lineWidth;
    }
  }, [color, lineWidth, context, isEraserActive]);

  const startDrawing = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isPaintBucketActive) {
      fillArea(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      return;
    }

    const { offsetX, offsetY } = event.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setMousePosition({ x: offsetX, y: offsetY });
  };

  const draw = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDrawing) return;
    context.closePath();
    setIsDrawing(false);

    const { offsetX, offsetY } = event.nativeEvent;

    if (mousePosition.x === offsetX && mousePosition.y === offsetY) {
      context.beginPath();
      context.arc(offsetX, offsetY, context.lineWidth / 2, 0, Math.PI * 2);
      context.fillStyle = isEraserActive ? "#FFFFFF" : color;
      context.fill();
      context.closePath();
    }

    saveCanvasState();
  };

  const undo = () => {
    if (history.length === 0) return;

    const newHistory = [...history];
    const lastState = newHistory.pop();
    setHistory(newHistory);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (newHistory.length > 0) {
      const prevState = newHistory[newHistory.length - 1];
      const img = new Image();
      img.src = prevState;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    } else {
      ctx.fillStyle = "#FFFFFF";
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
    const ctx = canvas.getContext("2d");
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
      setClearConfirmation(true);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setHistory([]);
    setRedoStack([]);
    setClearConfirmation(false);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.download = "drawing.jpg";
    link.href = dataURL;
    link.click();
  };

  const postDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();

    // Retrieve token from local storage
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Log the token to the console

    if (token) {
      // Decode token to extract user information
      const user = AuthService.getProfile(token);
      console.log("Decoded Token:", user); // Log the decoded token to the console

      if (user && user.authenticatedPerson) {
        const { username } = user.authenticatedPerson; // Access username property from authenticatedPerson object
        console.log("Extracted Username:", username); // Log the extracted username to the console
        const dataURL = canvas.toDataURL("image/jpeg");
        ctx.fillText(`${username}`, 10, 30);

        addPost({
          variables: { postImage: dataURL, username: username },
        });
      }
    }
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx;

    ctx.fillText(`${date} ${time}`, 10, 60);

    // Clear the canvas after posting the image
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setHistory([]);
    setRedoStack([]);
    setClearConfirmation(false);
    window.location.reload();
  };

  useEffect(() => {
    if (isPosted) {
      const container = document.getElementById("posted-images");
      container.lastChild.scrollIntoView({ behavior: "smooth" });
      setIsPosted(false);
    }
  }, [isPosted]);

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
    setRedoStack([]);
  };

  const fillArea = (startX, startY) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
    <div className="page-container">
      <section className="canvas-container">
        <h2 id="canvas-message">Draw Here!</h2>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing} // Event handler for mouse down
          onMouseMove={draw} // Event handler for mouse move
          onMouseUp={stopDrawing} // Event handler for mouse up
          onMouseLeave={stopDrawing} // Event handler for mouse leave
          style={{ border: "1px solid #000" }}
        />
        <div className="color-pick-cont">
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
        <div className="btn-cont">
          {/* Clear Canvas button */}
          <button onClick={undo}>Undo</button> {/* Undo button */}
          <button onClick={redo}>Redo</button> {/* Redo button */}
          <button onClick={switchToPen}>Pen</button>
          {/* Pen button */}
          <button onClick={toggleEraser}>Eraser</button> {/* Eraser button */}
          <button onClick={togglePaintBucket}>Paint Bucket</button>{" "}
          {/* Paint Bucket button */}
          <button onClick={saveDrawing}>Save as JPEG</button>{" "}
          {/* Save button */}
          <button id="post-btn" onClick={postDrawing}>
            Post
          </button>{" "}
          {/* Post button */}
          <button
            onClick={clearDrawing}
            style={{ backgroundColor: clearConfirmation ? "red" : "initial" }}
          >
            {clearConfirmation ? "Confirm?" : "Clear Canvas"}
          </button>{" "}
        </div>
      </section>
      <PostContainer postList={postList} />
    </div>
  );
};

export default Canvas;
