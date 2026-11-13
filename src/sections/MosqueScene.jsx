import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import sandstoneDiff from '../assets/textures/sandstone_diff_1k.jpg'
import sandstoneNor from '../assets/textures/sandstone_nor_1k.jpg'
import sandstoneRough from '../assets/textures/sandstone_rough_1k.jpg'

const GOLD = { color: '#d4af37', metalness: 0.85, roughness: 0.32 }
const GOLD_BRIGHT = { color: '#f0cf7a', metalness: 0.8, roughness: 0.25 }

const chatMessages = [
  { from: 'user', text: 'hiya fi al bayt' },
  { from: 'bot', text: 'Close! 😊 After a preposition, the noun takes the -i ending → البيتِ, not البيت.\nSo: هي في البيتِ ✅' },
  { from: 'user', text: 'so it changes bc of "fi", not bc its feminine?' },
  { from: 'bot', text: 'Exactly right! 👏 The -i ending comes from the preposition — gender only decides هو vs هي.' },
  { from: 'user', text: 'ayna as-saaAtu? hiya alaa as-sareer' },
  { from: 'bot', text: 'Almost — على gives -i too: السريرِ, not السرير.\nممتاز otherwise! 🎉' },
]

export function PhoneMockup() {
  return (
    <div className="hero__phone">
      <div className="hero__phone-notch" />
      <div className="hero__phone-screen">
        <div className="hero__wa-header">
          <div className="hero__wa-back">←</div>
          <div className="hero__wa-avatar">🕌</div>
          <div className="hero__wa-info">
            <div className="hero__wa-name">LisanAI Tutor</div>
            <div className="hero__wa-status">● online</div>
          </div>
        </div>
        <div className="hero__wa-chat">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`hero__wa-msg hero__wa-msg--${msg.from}`}>
              <div className="hero__wa-bubble">
                {msg.text.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < msg.text.split('\n').length - 1 && <br />}</span>
                ))}
                <span className="hero__wa-time">
                  {['10:32', '10:32', '10:33', '10:33', '10:34', '10:34'][i]}
                  {msg.from === 'user' && ' ✓✓'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="hero__wa-input">
          <span className="hero__wa-placeholder">Type a message...</span>
          <div className="hero__wa-send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// Doorway opening: 2.4 wide, 4.2 tall, centered at x=0, facade 1 unit thick (z: -0.5 to 0.5).
const DOOR_GAP_HALF_W = 1.2
const DOOR_H = 4.1
const DOOR_W = 1.08

function useSandstone(repeatX, repeatY) {
  const [diff, nor, rough] = useTexture([sandstoneDiff, sandstoneNor, sandstoneRough])
  return useMemo(() => {
    for (const t of [diff, nor, rough]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(repeatX, repeatY)
      t.colorSpace = t === diff ? THREE.SRGBColorSpace : THREE.NoColorSpace
    }
    return { map: diff, normalMap: nor, roughnessMap: rough }
  }, [diff, nor, rough, repeatX, repeatY])
}

function Door({ hingeX, openSign, progressRef }) {
  const group = useRef(null)
  useFrame(() => {
    if (group.current) group.current.rotation.y = openSign * progressRef.current.door * (Math.PI * 0.52)
  })
  return (
    <group ref={group} position={[hingeX, 0, 0]}>
      <mesh position={[openSign * DOOR_W * 0.5, DOOR_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[DOOR_W, DOOR_H, 0.12]} />
        <meshStandardMaterial color="#2a1810" roughness={0.65} metalness={0.05} />
      </mesh>
      <mesh position={[openSign * DOOR_W * 0.5, DOOR_H / 2, 0.07]}>
        <boxGeometry args={[DOOR_W - 0.14, DOOR_H - 0.3, 0.02]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
    </group>
  )
}

function Facade({ progressRef }) {
  const wallMat = useSandstone(2.5, 2.5)
  const domeRef = useRef(null)

  useFrame(() => {
    const fadeOut = 1 - progressRef.current.zoom
    const opacity = Math.max(fadeOut, 0)
    if (domeRef.current) domeRef.current.material.opacity = opacity
  })

  return (
    <group>
      {/* Left + right facade walls, framing the doorway gap (no back wall, so the
          camera can pass straight through the gap into the interior later) */}
      <mesh position={[-(DOOR_GAP_HALF_W + 2.4), 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 6, 1]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      <mesh position={[DOOR_GAP_HALF_W + 2.4, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 6, 1]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      {/* Lintel above the doorway */}
      <mesh position={[0, DOOR_H + 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[DOOR_GAP_HALF_W * 2, 1.8, 1]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>

      {/* Minarets */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 8.4, 0, 0.3]}>
          <mesh position={[0, 6, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.65, 12, 16]} />
            <meshStandardMaterial {...wallMat} />
          </mesh>
          <mesh position={[0, 12.6, 0]} castShadow>
            <coneGeometry args={[0.7, 1.3, 16]} />
            <meshStandardMaterial {...GOLD} />
          </mesh>
        </group>
      ))}

      {/* Dome */}
      <mesh ref={domeRef} position={[0, 9.5, 0]} scale={[1, 1.25, 1]} castShadow>
        <sphereGeometry args={[3, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial {...GOLD_BRIGHT} transparent />
      </mesh>
      <mesh position={[0, 12.2, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial {...GOLD_BRIGHT} emissive="#f0cf7a" emissiveIntensity={0.4} />
      </mesh>

      <Door hingeX={-DOOR_GAP_HALF_W} openSign={1} progressRef={progressRef} />
      <Door hingeX={DOOR_GAP_HALF_W} openSign={-1} progressRef={progressRef} />
    </group>
  )
}

function Interior({ progressRef }) {
  const group = useRef(null)
  const phoneEl = useRef(null)
  useFrame(() => {
    const op = progressRef.current.inside
    if (group.current) {
      group.current.traverse((obj) => {
        if (obj.material && 'opacity' in obj.material) {
          obj.material.transparent = true
          obj.material.opacity = op
        }
      })
    }
    // The phone is DOM content (drei's Html portals it outside the WebGL
    // canvas), so the material-opacity traversal above never reaches it —
    // fade it in directly.
    if (phoneEl.current) phoneEl.current.style.opacity = op
  })

  return (
    <group ref={group} position={[0, 0, -6]}>
      <mesh position={[0, 3, -3]} receiveShadow>
        <boxGeometry args={[DOOR_GAP_HALF_W * 2.6, 6, 0.4]} />
        <meshStandardMaterial color="#1c120f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.02, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.6, 32]} />
        <meshStandardMaterial color="#7a2f2f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.5, -1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.38, 1, 16]} />
        <meshStandardMaterial color="#4a3420" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.02, -1]} castShadow>
        <boxGeometry args={[0.7, 0.06, 0.7]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <Html position={[0, 1.55, -0.98]} center distanceFactor={6} transform>
        <div className="hero__mosque-phone" ref={phoneEl} style={{ opacity: 0 }}>
          <PhoneMockup />
        </div>
      </Html>
    </group>
  )
}

function CameraRig({ progressRef }) {
  const { camera } = useThree()
  const start = useMemo(() => new THREE.Vector3(0, 6, 46), [])
  const approachEnd = useMemo(() => new THREE.Vector3(0, 2.4, 5.5), [])
  const insideEnd = useMemo(() => new THREE.Vector3(0, 1.9, -4.2), [])
  const lookStart = useMemo(() => new THREE.Vector3(0, 5, 0), [])
  const lookEnd = useMemo(() => new THREE.Vector3(0, 1.6, -6), [])
  const pos = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const { dist, zoom } = progressRef.current
    pos.copy(start).lerp(approachEnd, dist)
    if (zoom > 0) pos.lerp(insideEnd, zoom)
    camera.position.copy(pos)

    look.copy(lookStart).lerp(lookEnd, Math.max(dist, zoom))
    camera.lookAt(look)
  })

  return null
}

export default function MosqueScene({ progressRef }) {
  return (
    <>
      <CameraRig progressRef={progressRef} />
      <hemisphereLight args={['#4a3a6b', '#5a3d42', 1]} />
      <directionalLight position={[8, 10, 6]} intensity={1.4} color="#f6c983" castShadow />
      <pointLight position={[0, 1.6, -5]} intensity={1.2} color="#f0cf7a" distance={6} />
      {/* Fades distant geometry (mainly the ground, which otherwise reaches
          all the way to the horizon) into the sky's own dusk tone, instead
          of a hard seam where the flat ground color meets the CSS gradient
          sky behind the transparent canvas. A short near distance also lifts
          the foreground ground out of near-black. */}
      <fog attach="fog" args={['#79395d', 4, 70]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#5c3d45" roughness={1} />
      </mesh>

      <Facade progressRef={progressRef} />
      <Interior progressRef={progressRef} />
    </>
  )
}
