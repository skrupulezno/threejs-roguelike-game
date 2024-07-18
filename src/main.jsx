import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Canvas } from "@react-three/fiber";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div id="container">
      <Canvas
        camera={{
          fov: 45,
          position: [0, 9, 20],
          rotation: [-Math.PI / 3, 0, 0],
        }}
      >
        <App />
      </Canvas>
    </div>
  </React.StrictMode>
);
