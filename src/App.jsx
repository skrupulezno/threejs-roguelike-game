import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Vector3 } from "three";
import { Ground } from "./Ground.jsx";
import { Player } from "./Player.jsx";
import { Cubes } from "./Cube.jsx";

const styles = ["ancient", "modern", "sci-fi", "medieval"];

const Enemy = ({ type, position }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial
        color={type === "mage" ? "purple" : type === "archer" ? "green" : "red"}
      />
    </mesh>
  );
};

const Room = ({ size, style, enemies, position }) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[size.width, 3, size.height]} />
        <meshStandardMaterial
          color={
            style === "ancient"
              ? "brown"
              : style === "modern"
              ? "grey"
              : style === "sci-fi"
              ? "blue"
              : "darkred"
          }
        />
      </mesh>
      {enemies.map((enemy, index) => (
        <Enemy key={index} {...enemy} />
      ))}
    </group>
  );
};

const Corridor = ({ position, length }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[3, 2, length]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
};

export const App = () => {
  const [rooms, setRooms] = useState([]);
  const [corridors, setCorridors] = useState([]);

  useEffect(() => {
    generateLevel();
  }, []);

  const generateLevel = () => {
    let newRooms = [];
    let newCorridors = [];
    const numberOfRooms = 4 + Math.floor(Math.random() * 4);
    let lastPosition = new Vector3(0, 0, 0);

    for (let i = 0; i < numberOfRooms; i++) {
      const size = {
        width: 10 + Math.random() * 20,
        height: 10 + Math.random() * 20,
      };
      const style = styles[Math.floor(Math.random() * 4)];
      const position = lastPosition
        .clone()
        .add(new Vector3(size.width / 2 + 5, 0, 0)); // Сдвигаем каждую следующую комнату
      const enemies = generateEnemies(style);

      newRooms.push({ id: i, size, style, enemies, position });
      lastPosition = position;

      if (i < numberOfRooms - 1) {
        const corridorLength = 10;
        const corridorPosition = lastPosition
          .clone()
          .add(new Vector3(size.width / 2 + corridorLength / 2, 0, 0));
        newCorridors.push({
          id: i,
          position: corridorPosition,
          length: corridorLength,
        });
        lastPosition = corridorPosition
          .clone()
          .add(new Vector3(corridorLength / 2 + 5, 0, 0));
      }
    }

    setRooms(newRooms);
    setCorridors(newCorridors);
  };

  const generateEnemies = (style) => {
    const number = Math.floor(Math.random() * 5) + 1; // От 1 до 5 противников
    return Array.from({ length: number }, (_, index) => ({
      type: ["mage", "archer", "warrior"][Math.floor(Math.random() * 3)],
      position: new Vector3((index - number / 2) * 3, 1, 0),
    }));
  };

  return (
    <Canvas
      camera={{ fov: 45, position: [0, 9, 20], rotation: [-Math.PI / 3, 0, 0] }}
    >
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={1.5} />
      <Physics gravity={[0, -20, 0]}>
        <Ground />
        {rooms.map((room) => (
          <Room key={room.id} {...room} />
        ))}
        {corridors.map((corridor) => (
          <Corridor key={corridor.id} {...corridor} />
        ))}
        <Player />
        <Cubes />
      </Physics>
    </Canvas>
  );
};

export default App;
