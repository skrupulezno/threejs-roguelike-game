import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { RigidBody, useRapier, CapsuleCollider } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();

export const Player = () => {
  const playerRef = useRef();
  const rapier = useRapier();
  const { camera, scene, gl } = useThree();
  const [moveTo, setMoveTo] = useState(null);

  useFrame((state) => {
    if (!playerRef.current) return;

    const velocity = playerRef.current.linvel();

    if (moveTo) {
      // Move player towards the target position
      direction
        .subVectors(
          moveTo,
          new THREE.Vector3(
            playerRef.current.translation().x,
            playerRef.current.translation().y,
            playerRef.current.translation().z
          )
        )
        .normalize()
        .multiplyScalar(MOVE_SPEED);

      playerRef.current.wakeUp();
      playerRef.current.setLinvel({
        x: direction.x,
        y: velocity.y,
        z: direction.z,
      });

      // Check if player reached the target position
      const playerPosition = new THREE.Vector3(
        playerRef.current.translation().x,
        playerRef.current.translation().y,
        playerRef.current.translation().z
      );
      if (playerPosition.distanceTo(moveTo) < 0.5) {
        setMoveTo(null);
        playerRef.current.setLinvel({ x: 0, y: velocity.y, z: 0 });
      }
    }

    // Move and rotate camera
    const { x, y, z } = playerRef.current.translation();
    state.camera.position.set(x, 30, z + 30); // Adjust z + 50 for a tilt-back effect
    state.camera.lookAt(x, y, z); // Ensure camera looks at the player
  });

  const handleRightClick = (event) => {
    event.preventDefault();
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      setMoveTo(intersects[0].point);
    }
  };

  useEffect(() => {
    if (gl && gl.domElement) {
      const handleContextMenu = (e) => handleRightClick(e);
      gl.domElement.addEventListener("contextmenu", handleContextMenu);
      return () =>
        gl.domElement.removeEventListener("contextmenu", handleContextMenu);
    }
  }, [gl]);

  return (
    <>
      <RigidBody position={[0, 1, -2]} mass={1} ref={playerRef} lockRotations>
        <mesh>
          <capsuleGeometry args={[0.5, 0.5]} />
          <CapsuleCollider args={[0.75, 0.5]} />
        </mesh>
      </RigidBody>
    </>
  );
};
