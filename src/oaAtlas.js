import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";

// 🌌 Sterrenachtergrond (Melkweg)
const GalaxyBackground = () => {
  const texture = useLoader(THREE.TextureLoader, "/textures/milkyway.png");
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 60]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

// ☀️ Zon (Met controle over lichtintensiteit)
const Sun = React.forwardRef(({ intensity, position }, ref) => {
    const sunTexture = useLoader(THREE.TextureLoader, "/textures/sun.jpg");
  
    return (
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive={new THREE.Color(0xffff00)}
          emissiveIntensity={intensity * 2}
        />
      </mesh>
    );
  });
  
  const SunLight = ({ sunRef }) => {
    const lightRef = useRef();
  
    useFrame(() => {
      if (sunRef.current && lightRef.current) {
        // Zorg dat het target van de light op de zon staat
        lightRef.current.target.position.copy(sunRef.current.position);
        lightRef.current.target.updateMatrixWorld();
      }
    });
  
    // Als de zon bijvoorbeeld op [50,30,50] staat, positioneer dan de light ver daarvandaan.
    // Dit simuleert parallelle zonnestralen.
    return (
      <directionalLight
        ref={lightRef}
        position={[50 + 100, 30 + 100, 50 + 100]} // licht komt uit de richting (100,100,100) t.o.v. de zon
        intensity={3}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={1000}
        shadow-bias={-0.001}
      />
    );
  };
  
  
  

// 🛑 Banen van de planeten
const OrbitPath = ({ radius }) => {
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }

  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="white" linewidth={1} />
    </line>
  );
};

// 🪐 Planeten laten bewegen
const Planet = ({ texturePath, size, distance, speed, children }) => {
    const planetRef = useRef();
    const texture = useLoader(THREE.TextureLoader, texturePath);
  
    // Zorg dat de texture herhaalbaar is zodat offsetten werkt
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  
    useFrame(({ clock }) => {
      const elapsedTime = clock.getElapsedTime();
  
      // De groep beweegt in een baan
      planetRef.current.position.x = distance * Math.cos(elapsedTime * speed);
      planetRef.current.position.z = distance * Math.sin(elapsedTime * speed);
  
      // In plaats van de hele mesh te roteren, verschuiven we de texture offset.
      // Dit simuleert een rotatie van de zichtbare oppervlakte zonder de geometrie (en dus de schaduw) te beïnvloeden.
      texture.offset.x = (elapsedTime * 0.1) % 1;
    });
  
    return (
      <group ref={planetRef}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={texture} />
        </mesh>
        {children}
      </group>
    );
  };
  
  
  

  const Saturn = ({ texturePath, size, distance, speed }) => {
    const saturnRef = useRef();
    const texture = useLoader(THREE.TextureLoader, texturePath);
    const ringTexture = useLoader(THREE.TextureLoader, "/textures/saturn-rings.png");
  
    useFrame(({ clock }) => {
      const elapsedTime = clock.getElapsedTime();
      saturnRef.current.position.x = distance * Math.cos(elapsedTime * speed);
      saturnRef.current.position.z = distance * Math.sin(elapsedTime * speed);
      saturnRef.current.rotation.y += 0.002;
    });
  
    // ✅ Ring Geometry met correcte UV Mapping
    const createRingGeometry = () => {
      const geometry = new THREE.RingGeometry(size * 1.0, size * 2.5, 64);
      const pos = geometry.attributes.position;
      const v3 = new THREE.Vector3();
  
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        geometry.attributes.uv.setXY(i, v3.length() < (size * 2.15) ? 0 : 1, 1);
      }
  
      return geometry;
    };
  
    return (
      <group ref={saturnRef}>
        {/* 🌑 Saturnus zelf */}
        <mesh castShadow receiveShadow> {/* ✅ Schaduwen inschakelen */}
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={texture} />
        </mesh>
  
        {/* 💍 Correcte Saturnus-ringen */}
        <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>

          <bufferGeometry attach="geometry" {...createRingGeometry()} />
          <meshStandardMaterial 
            map={ringTexture} 
            transparent={true} 
            side={THREE.DoubleSide}
            alphaTest={0.5} 
          />
        </mesh>
      </group>
    );
  };
  
  



// 🌑 Maan om de Aarde laten draaien
const Moon = ({ earthRef }) => {
  const moonRef = useRef();
  const texture = useLoader(THREE.TextureLoader, "/textures/moon.png");

  useFrame(({ clock }) => {
    if (!earthRef.current) return;
    const elapsedTime = clock.getElapsedTime();
    moonRef.current.position.x = earthRef.current.position.x + 3 * Math.cos(elapsedTime * 1.5);
    moonRef.current.position.z = earthRef.current.position.z + 3 * Math.sin(elapsedTime * 1.5);
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[0.27, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};


const LightSource = ({ sunRef }) => {
    const lightRef = useRef();
  
    useFrame(() => {
      if (sunRef.current && lightRef.current) {
        const sunPos = sunRef.current.position;
  
        // 🔥 Licht moet altijd van de zon naar de planeten stralen
        lightRef.current.position.set(
          sunPos.x + 50,  // Licht iets van de zon vandaan
          sunPos.y + 30,  // Hoogte aanpassen voor realistisch effect
          sunPos.z + 50
        );
  
        // 🔥 Target op het centrum richten (zodat alle planeten goed verlicht worden)
        lightRef.current.target.position.set(0, 0, 0);
        lightRef.current.target.updateMatrixWorld();
      }
    });
  
    return (
      <directionalLight
        ref={lightRef}
        intensity={3} // Sterkere schaduwen voor een beter effect
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={1000}
        shadow-bias={-0.001}
      />
    );
  };
  

// 🌌 Het Zonnestelsel
const Atlas = () => {
    const sunRef = useRef();
    const earthRef = useRef();
    const sunPosition = [50, 30, 50]; // Kies een vaste positie voor de zon
  
    const { 
      sunIntensity, 
      planetScale, 
      planetSpeed, 
      ambientLightIntensity, 
      starBrightness,
      shadowIntensity
    } = useControls({
      sunIntensity: { value: 5, min: 0, max: 10, step: 0.1 },
      planetScale: { value: 1, min: 0.5, max: 2, step: 0.1 },
      planetSpeed: { value: 1, min: 0.1, max: 3, step: 0.1 },
      ambientLightIntensity: { value: 0.5, min: 0, max: 2, step: 0.1 },
      starBrightness: { value: 7, min: 1, max: 20, step: 1 },
      shadowIntensity: { value: 1, min: 0, max: 2, step: 0.1 }
    });
    
    return (
      <div className="atlas-container" style={{ width: "100vw", height: "100vh" }}>
        <Canvas shadows camera={{ position: [0, 50, 250] }}>
          <OrbitControls enableZoom={true} />
          <Stars radius={300} depth={60} count={5000} factor={starBrightness} />
          <ambientLight intensity={ambientLightIntensity * (1 - shadowIntensity / 2)} />
          <GalaxyBackground />
  
          {/* De visuele zon */}
          <Sun intensity={sunIntensity} ref={sunRef} position={sunPosition} />
  
          {/* De lichtbron: deze staat op een vaste offset t.o.v. de zon en wijst steeds naar de zon */}
          <SunLight sunRef={sunRef} />
  
          {/* Planeten en hun banen: we groeperen ze zodat ze rondom de zon draaien */}
          <group position={sunPosition}>
            <OrbitPath radius={12} />
            <Planet texturePath="/textures/mercury.jpg" size={0.38 * planetScale} distance={12} speed={0.2 * planetSpeed} />
  
            <OrbitPath radius={18} />
            <Planet texturePath="/textures/venus.jpg" size={0.95 * planetScale} distance={18} speed={0.15 * planetSpeed} />
  
            <OrbitPath radius={25} />
            <Planet ref={earthRef} texturePath="/textures/earth.png" size={1 * planetScale} distance={25} speed={0.1 * planetSpeed}>
              <Moon earthRef={earthRef} />
            </Planet>
  
            <OrbitPath radius={35} />
            <Planet texturePath="/textures/mars.png" size={0.53 * planetScale} distance={35} speed={0.08 * planetSpeed} />
  
            <OrbitPath radius={75} />
            <Planet texturePath="/textures/jupiter.jpg" size={11 * planetScale} distance={75} speed={0.05 * planetSpeed} />
  
            <OrbitPath radius={110} />
            <Saturn texturePath="/textures/saturn.png" size={9 * planetScale} distance={110} speed={0.03 * planetSpeed} />
  
            <OrbitPath radius={150} />
            <Planet texturePath="/textures/uranus.jpg" size={4 * planetScale} distance={150} speed={0.02 * planetSpeed} />
  
            <OrbitPath radius={200} />
            <Planet texturePath="/textures/neptune.jpg" size={3.8 * planetScale} distance={200} speed={0.015 * planetSpeed} />
          </group>
        </Canvas>
      </div>
    );
  };
  

export default Atlas;
