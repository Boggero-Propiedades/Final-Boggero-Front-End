import * as THREE from 'three'
import { useRef, useReducer, useMemo, ReactNode } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody, RigidBodyApi } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'
import { GLTF } from 'three-stdlib'
import "./lusion.css"
import { UseTheme } from '../../contexts/ThemeContext'
import { UseWidth } from '../../contexts/WidthContext'

// --- Tipos para el Modelo GLTF ---
type GLTFResult = GLTF & {
  nodes: {
    connector: THREE.Mesh
  }
  materials: {
    base: THREE.MeshStandardMaterial
  }
}

interface ConnectorProps {
  position?: [number, number, number]
  children?: ReactNode
  vec?: THREE.Vector3
  scale?: number
  accent?: boolean
  color?: string
  roughness?: number
}

const accents = ['#20ffa0', '#4060ff', '#bc40ff', '#ffcc00']

const shuffle = (accent = 0) => [
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.75 },
  { color: '#444', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true }
]

export const Lusion = () => {
  const { width } = UseWidth()
  const { theme } = UseTheme()
  
  const isMobile = width <= 768;
  const wrapperHeight = isMobile ? '50vh' : '120vh'; 

  return(
    <div className="container" style={{ position: "relative", height: wrapperHeight, width: '100vw' }}>
      <Scene />
    </div>
  )
}

function Scene(props: any) { 
  const { theme } = UseTheme()
  const { width } = UseWidth()
  const [ accent, click ] = useReducer((state: number) => ++state % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])

  const bgColor = theme === "dark" ? "#050505" : "#e0e5e0" 

  const positionWidth = width <= 768 ? { position: [0, 0, 25], fov: 35.5, near: 1, far: 35 } : { position: [0, 0, 25], fov: 28.5, near: 1, far: 35 }

  return (
    <Canvas 
      style={{ 
        cursor: "grab",
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
        backgroundImage: `
          linear-gradient(${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"} 1px, transparent 1px),
          linear-gradient(90deg, ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"} 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
      onClick={click} 
      shadows 
      dpr={[1, 1.5]} 
      gl={{ antialias: false }} 
      camera={ positionWidth }
      {...props}
    >
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={theme === "dark" ? 0.6 : 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => <Connector key={i} {...props} />)}
        <Connector position={[10, 10, 5]}>
          <Model>
            <MeshTransmissionMaterial 
              clearcoat={1} 
              thickness={0.1} 
              anisotropicBlur={0.1} 
              chromaticAberration={0.1} 
              samples={8} 
              resolution={512} 
            />
          </Model>
        </Connector>
      </Physics>

      <EffectComposer disableNormalPass multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
      </EffectComposer>

      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>
    </Canvas>
  )
}

function Connector({ 
  position, 
  children, 
  vec = new THREE.Vector3(), 
  accent, 
  ...props 
}: ConnectorProps) {
  const api = useRef<RigidBodyApi>(null)
  // Generador de spread aleatorio
  const r = THREE.MathUtils.randFloatSpread
  const pos: [number, number, number] = useMemo(() => position || [r(10), r(10), r(10)], [position, r])

  useFrame((_state, delta) => {
    delta = Math.min(0.1, delta)
    if (api.current) {
      // Fuerza centrípeta para mantenerlos en el centro
      api.current.applyImpulse(
        vec.copy(api.current.translation() as THREE.Vector3).negate().multiplyScalar(0.2),
        true
      )
    }
  })

  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={pos} ref={api} colliders={false}>
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children ? children : <Model {...props} />}
      {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<RigidBodyApi>(null)
  useFrame(({ mouse, viewport }) => {
    if (ref.current) {
      ref.current.setNextKinematicTranslation(
        vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)
      )
    }
  })
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

interface ModelProps {
  children?: ReactNode
  color?: string
  roughness?: number
}

function Model({ children, color = 'white', roughness = 0 }: ModelProps) {
  const ref = useRef<THREE.Mesh>(null!)
  const { nodes, materials } = useGLTF('/c-transformed.glb') as GLTFResult
  
  useFrame((_state, delta) => {
    // @ts-ignore - DampC a veces pelea con los tipos de Three.Color pero funciona perfecto
    easing.dampC(ref.current.material.color, new THREE.Color(color), 0.2, delta)
  })

  return (
    <mesh 
      ref={ref} 
      castShadow 
      receiveShadow 
      scale={10} 
      geometry={nodes.connector.geometry}
    >
      <meshStandardMaterial 
        metalness={0.2} 
        roughness={roughness} 
        map={materials.base.map} 
      />
      {children}
    </mesh>
  )
}

useGLTF.preload('/c-transformed.glb')