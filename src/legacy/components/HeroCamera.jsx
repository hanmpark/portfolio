import { useFrame } from "@react-three/fiber"
import { easing } from "maath"
import { useRef } from "react"

const HeroCamera = ({ children, isMobile }) => {
	const groupRef = useRef()

	useFrame((state, delta) => {
		easing.damp3(state.camera.position, [0, 0, 20], 0.25, delta)

		if (!isMobile) {
			easing.dampE(groupRef.current.rotation, [Math.max(Math.min(-state.pointer.y / 10, 0.1), -0.1), -state.pointer.x / 15, 0], 0.25, delta)
		}
	})

	return (
		<group ref={groupRef} scale={isMobile ? 1 : 1.3}>{children}</group>
	)
}

export default HeroCamera
