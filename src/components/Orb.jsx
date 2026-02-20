import { Canvas } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import './Orb.css'

const Orb = () => {
  return (
    <Canvas
      className="orb-canvas"
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 3.4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} />
      <directionalLight position={[-3, -2, 4]} intensity={0.6} />
      <Float speed={1.4} rotationIntensity={1.1} floatIntensity={1.2}>
        <mesh scale={2.1}>
          <icosahedronGeometry args={[1.05, 1]} />
          <MeshDistortMaterial
            color="#4b74f2"
            roughness={0.15}
            metalness={0.2}
            distort={0.35}
            speed={1.6}
          />
        </mesh>
      </Float>
    </Canvas>
  )
}

export default Orb
