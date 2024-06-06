import { useState } from "react";
import Canvas from "./components/Canvas";
import Header from "./components/Header";

function App() {
  return (
    <>
      <div className="App">
        <Header />
        <Canvas />
      </div>
    </>
  );
}

export default App;
