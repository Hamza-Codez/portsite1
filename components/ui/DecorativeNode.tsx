"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Html, MeshDistortMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { Settings, Cog } from "lucide-react";

// Suppress the harmless THREE.Clock deprecation warning caused by @react-three/fiber internals
// and harmless WebGL precision warnings on Windows/ANGLE
if (typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === 'string') {
      if (args[0].includes('THREE.Clock: This module has been deprecated')) return;
      if (args[0].includes('THREE.WebGLProgram: Program Info Log:')) return;
    }
    originalWarn(...args);
  };
}

function IcosahedronNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe fallback for theme colors during SSR
  const isDark = mounted ? resolvedTheme === "dark" : true;
  
  // In Dark Mode: Lighter core, visible wireframe
  const nodeColor = isDark ? "#ffffff" : "#000000";
  const emissiveColor = isDark ? "#aaaaaa" : "#222222";
  const coreColor = isDark ? "#e0e0e0" : "#111111"; // Light grayish metallic
  const wireframeOpacity = isDark ? 0.4 : 0.6;

  // Slow rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x -= delta * 0.1;
      coreRef.current.rotation.y -= delta * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.1, 0.1]}>
      {/* Outer Wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color={nodeColor}
          wireframe={true}
          emissive={emissiveColor}
          emissiveIntensity={isDark ? 0.6 : 0.3}
          transparent
          opacity={wireframeOpacity}
        />
      </mesh>
      
      {/* Inner solid core for depth */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color={coreColor}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.8}
          polygonOffset
          polygonOffsetFactor={1}
        />
        {/* Core wireframe (faint) */}
        <lineSegments>
          <edgesGeometry args={[new THREE.IcosahedronGeometry(1.2, 0)]} />
          <lineBasicMaterial color={nodeColor} transparent opacity={0.1} />
        </lineSegments>
      </mesh>
    </Float>
  );
}

function BrainTechNode() {
  // Bio-Tech Bug
  const brainRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  
  const nodeColor = isDark ? "#ffffff" : "#000000";
  const emissiveColor = isDark ? "#888888" : "#333333";
  const coreColor = isDark ? "#e0e0e0" : "#111111";
  
  // Tech HUD styling for the cogs
  const hudColor = isDark ? "text-white" : "text-black";
  const hudBorder = isDark ? "border-white/10" : "border-black/10";
  const hudBg = isDark ? "bg-black/20" : "bg-white/20";

  useFrame((state, delta) => {
    if (brainRef.current) {
      // Gentle hovering for the firefly
      brainRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      brainRef.current.rotation.y += delta * 0.5;
    }
    if (wingsRef.current) {
      // Rapid wing flapping
      const flapSpeed = 40;
      const flapAngle = Math.sin(state.clock.elapsedTime * flapSpeed) * 0.3;
      wingsRef.current.children[0].rotation.z = (Math.PI / 4) + flapAngle;
      wingsRef.current.children[1].rotation.z = (-Math.PI / 4) - flapAngle;
    }
    if (ringsRef.current) {
      // Rigid hexagonal tech rings spinning on separate axes
      ringsRef.current.children[0].rotation.x += delta * 0.4;
      ringsRef.current.children[1].rotation.y -= delta * 0.5;
      ringsRef.current.children[2].rotation.z += delta * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6} floatingRange={[-0.1, 0.1]}>
      
      {/* Cyber-Firefly (Bio-tech Bug) */}
      <group ref={brainRef}>
        {/* Glowing Abdomen (Firefly Tail) */}
        <mesh position={[0, -0.25, 0]} scale={[1, 1.4, 1]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial 
            color={isDark ? "#eab308" : "#ca8a04"} // Neon yellow/gold
            emissive={isDark ? "#eab308" : "#ca8a04"} 
            emissiveIntensity={1.5} 
          />
        </mesh>

        {/* Thorax (Dark Metallic) */}
        <mesh position={[0, 0.1, 0]} scale={[1.2, 1, 1]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color={coreColor} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Head (Dark Metallic) */}
        <mesh position={[0, 0.3, 0.1]} scale={[1, 0.8, 1]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color={coreColor} roughness={0.3} metalness={0.8} />
        </mesh>
        
        {/* Glowing Eyes */}
        <mesh position={[-0.05, 0.32, 0.18]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.05, 0.32, 0.18]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>

        {/* Cyber-Antennae */}
        <mesh position={[-0.06, 0.42, 0.12]} rotation={[Math.PI / 6, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
          <meshStandardMaterial color={coreColor} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.06, 0.42, 0.12]} rotation={[Math.PI / 6, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
          <meshStandardMaterial color={coreColor} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Flapping Wings on Hinges */}
        <group ref={wingsRef} position={[0, 0.15, -0.05]}>
          {/* Left Wing Hinge */}
          <group position={[-0.1, 0, 0]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <mesh position={[-0.15, 0.2, -0.1]} scale={[1, 3, 0.1]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshPhysicalMaterial 
                color={nodeColor} 
                transparent 
                opacity={0.6} 
                roughness={0.1} 
                clearcoat={1} 
                wireframe={isDark} 
              />
            </mesh>
          </group>
          {/* Right Wing Hinge */}
          <group position={[0.1, 0, 0]} rotation={[Math.PI / 4, 0, -Math.PI / 4]}>
            <mesh position={[0.15, 0.2, -0.1]} scale={[1, 3, 0.1]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshPhysicalMaterial 
                color={nodeColor} 
                transparent 
                opacity={0.6} 
                roughness={0.1} 
                clearcoat={1} 
                wireframe={isDark} 
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* Odd Tech Containment (Giant Hexagonal Rings) */}
      <group ref={ringsRef}>
        {/* Inner Thick Hexagon */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.2, 0.04, 16, 6]} />
          <meshStandardMaterial color={coreColor} roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Middle Hexagon */}
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[1.5, 0.02, 16, 6]} />
          <meshStandardMaterial color={coreColor} roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Outer Thin Hexagon */}
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[1.8, 0.01, 16, 6]} />
          <meshStandardMaterial color={coreColor} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
      
      {/* Geometric HUD Cogs */}
      <Html position={[1.4, 1.0, 0]} center transform distanceFactor={5}>
        <div className={`flex items-center justify-center p-2 rounded-xl border ${hudBorder} ${hudBg} backdrop-blur-md shadow-2xl`}>
          <Settings size={28} className={`${hudColor} opacity-90 animate-[spin_4s_linear_infinite]`} />
        </div>
      </Html>
      <Html position={[-1.4, -0.8, 0.5]} center transform distanceFactor={5}>
        <div className={`flex items-center justify-center p-3 rounded-xl border ${hudBorder} ${hudBg} backdrop-blur-md shadow-2xl`}>
          <Cog size={36} className={`${hudColor} opacity-90 animate-[spin_5s_linear_infinite_reverse]`} />
        </div>
      </Html>
    </Float>
  );
}

function DataBlockNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  
  const nodeColor = isDark ? "#ffffff" : "#000000";
  const emissiveColor = isDark ? "#aaaaaa" : "#222222";
  const coreColor = isDark ? "#e0e0e0" : "#111111";
  const wireframeOpacity = isDark ? 0.4 : 0.6;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.z -= delta * 0.2;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x -= delta * 0.1;
      coreRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1} floatingRange={[-0.1, 0.1]}>
      {/* Outer Wireframe Crystal */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.7, 0]} />
        <meshStandardMaterial
          color={nodeColor}
          wireframe={true}
          emissive={emissiveColor}
          emissiveIntensity={isDark ? 0.6 : 0.3}
          transparent
          opacity={wireframeOpacity}
        />
      </mesh>
      
      {/* Inner solid core Crystal */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color={coreColor}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.8}
          polygonOffset
          polygonOffsetFactor={1}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.OctahedronGeometry(1.1, 0)]} />
          <lineBasicMaterial color={nodeColor} transparent opacity={0.1} />
        </lineSegments>
      </mesh>
    </Float>
  );
}

function GadgetNode() {
  const laptopRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? resolvedTheme === "dark" : true;
  
  const laptopColor = isDark ? "#e0e0e0" : "#111111"; // Dark metallic black in light mode
  const screenGlow = isDark ? "#ffffff" : "#ffffff";
  const wireframeColor = isDark ? "#ffffff" : "#000000";

  useFrame((state, delta) => {
    if (laptopRef.current) {
      // Gentle floating/wobble for the laptop
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      laptopRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.4) * 0.05;
    }
    if (ringRef.current) {
      // Rotate the tilted planetary ring to show the balls spinning
      ringRef.current.rotation.z -= delta * 0.8; 
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[-0.05, 0.05]}>
      {/* Central Gadget (Laptop) */}
      <group ref={laptopRef} scale={1.3}>
        {/* Laptop Base (Keyboard area) */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[1.5, 0.05, 1.1]} />
          <meshStandardMaterial color={laptopColor} roughness={0.3} metalness={0.8} />
        </mesh>
        
        {/* Laptop Screen Pivot Group */}
        <group position={[0, -0.3, -0.55]} rotation={[-Math.PI / 7, 0, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.5, 1.0, 0.05]} />
            <meshStandardMaterial color={laptopColor} roughness={0.3} metalness={0.8} />
            
            {/* Glowing Screen Panel */}
            <mesh position={[0, 0, 0.026]}>
              <planeGeometry args={[1.4, 0.9]} />
              <meshStandardMaterial color={isDark ? "#c0c0c0" : "#000000"} emissive={screenGlow} emissiveIntensity={isDark ? 0.6 : 0.2} />
              
              {/* Wireframe Grid on screen */}
              <mesh position={[0, 0, 0.001]}>
                <planeGeometry args={[1.4, 0.9]} />
                <meshBasicMaterial color={wireframeColor} wireframe={true} transparent opacity={isDark ? 0.15 : 0.3} />
              </mesh>
            </mesh>
          </mesh>
        </group>
      </group>

      {/* Tilted Planetary Ring with Balls ("Italic") */}
      <group rotation={[Math.PI / 2.1, 0, -Math.PI / 3.5]}>
        <group ref={ringRef}>
          {/* The Ring */}
          <mesh>
            <torusGeometry args={[2.0, 0.015, 16, 100]} />
            <meshStandardMaterial color={wireframeColor} transparent opacity={0.4} />
          </mesh>

          {/* Orbiting Balls along the ring */}
          <mesh position={[2.0, 0, 0]}>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color={wireframeColor} emissive={wireframeColor} emissiveIntensity={isDark ? 0.8 : 0.4} />
          </mesh>
          <mesh position={[-2.0, 0, 0]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color={wireframeColor} emissive={wireframeColor} emissiveIntensity={isDark ? 0.8 : 0.4} />
          </mesh>
          <mesh position={[0, 2.0, 0]}>
            <sphereGeometry args={[0.05, 32, 32]} />
            <meshStandardMaterial color={wireframeColor} emissive={wireframeColor} emissiveIntensity={isDark ? 0.8 : 0.4} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function AgenticGraduationNode() {
  const capRef = useRef<THREE.Group>(null);
  const loop1Ref = useRef<THREE.Group>(null);
  const loop2Ref = useRef<THREE.Group>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? resolvedTheme === "dark" : true;
  
  const capColor = isDark ? "#e0e0e0" : "#111111"; // Dark metallic black in light mode
  const tasselColor = isDark ? "#ffd700" : "#d4af37"; // Golden tassel
  const wireframeColor = isDark ? "#ffffff" : "#000000";
  const glowColor = isDark ? "#ffffff" : "#444444";

  useFrame((state, delta) => {
    if (capRef.current) {
      // Gentle floating/wobble for the cap
      capRef.current.rotation.y += delta * 0.15;
      capRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
    if (loop1Ref.current) {
      // Eval loops rotating
      loop1Ref.current.rotation.x += delta * 0.5;
      loop1Ref.current.rotation.y += delta * 0.3;
    }
    if (loop2Ref.current) {
      loop2Ref.current.rotation.y -= delta * 0.6;
      loop2Ref.current.rotation.z -= delta * 0.4;
    }
  });

  return (
    <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.05, 0.05]}>
      {/* Agentic Eval Loops */}
      <group ref={loop1Ref}>
        <mesh>
          <torusGeometry args={[1.5, 0.015, 16, 100]} />
          <meshStandardMaterial color={wireframeColor} emissive={glowColor} emissiveIntensity={isDark ? 0.6 : 0.2} transparent opacity={0.5} />
        </mesh>
        {/* Tool Node (Agent Tool) */}
        <mesh position={[1.5, 0, 0]}>
          <octahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial color={wireframeColor} emissive={glowColor} emissiveIntensity={0.8} />
        </mesh>
      </group>
      
      <group ref={loop2Ref}>
        <mesh>
          <torusGeometry args={[1.7, 0.01, 16, 100]} />
          <meshStandardMaterial color={wireframeColor} transparent opacity={0.3} />
        </mesh>
        {/* Secondary Tool Node */}
        <mesh position={[0, 1.7, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial color={wireframeColor} emissive={glowColor} emissiveIntensity={0.6} wireframe />
        </mesh>
      </group>

      {/* Graduation Cap */}
      <group ref={capRef} scale={1.1}>
        {/* Skull cap (tapered cylinder) */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.45, 0.5, 0.4, 32]} />
          <meshStandardMaterial color={capColor} roughness={0.3} metalness={0.8} />
        </mesh>
        
        {/* Mortarboard (Square top) */}
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[1.6, 0.05, 1.6]} />
          <meshStandardMaterial color={capColor} roughness={0.3} metalness={0.8} />
          
          {/* Subtle wireframe grid on the cap for "tech/agentic" feel */}
          <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.5, 1.5]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.1} />
          </mesh>
        </mesh>

        {/* Tassel Button */}
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={tasselColor} roughness={0.4} metalness={0.8} />
        </mesh>
        
        {/* Tassel Assembly */}
        <group rotation={[0, Math.PI / 4, 0]}>
          {/* Tassel String across board */}
          <mesh position={[0, 0.06, 0.425]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.85, 8]} />
            <meshStandardMaterial color={tasselColor} roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Tassel Drop (hanging down over edge) */}
          <mesh position={[0, -0.1, 0.86]}>
            <cylinderGeometry args={[0.02, 0.04, 0.3, 16]} />
            <meshStandardMaterial color={tasselColor} roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

export function DecorativeNode({ type = "icosahedron" }: { type?: "icosahedron" | "brainTech" | "dataBlock" | "gadget" | "graduation" }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "200px" });

  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <div ref={containerRef} className="w-full h-[250px] flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
      <Canvas 
        frameloop={isInView ? "always" : "demand"}
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]} // limit pixel ratio for performance
        gl={{ alpha: true, antialias: true }}
      >
        <Environment preset="city" />
        <ambientLight intensity={isDark ? 0.8 : 0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, -10, -10]} intensity={0.2} />
        {type === "icosahedron" && <IcosahedronNode />}
        {type === "brainTech" && <BrainTechNode />}
        {type === "dataBlock" && <DataBlockNode />}
        {type === "gadget" && <GadgetNode />}
        {type === "graduation" && <AgenticGraduationNode />}
      </Canvas>
    </div>
  );
}
