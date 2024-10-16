import { PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import CanvasLoader from "../components/CanvasLoader"
import { Suspense } from "react"
import { useMediaQuery } from "react-responsive"
import { calculateSizes } from "../constants"
import HeroCamera from "../components/HeroCamera"
import Button from "../components/Button"
import HollowKnight from "../components/HollowKnight"

const Hero = () => {
	const isSmall = useMediaQuery({ maxWidth: 440 })
	const isMobile = useMediaQuery({ maxWidth: 768 })

	const sizes = calculateSizes(isSmall, isMobile)

	return (
		<section className="min-h-screen w-full flex flex-col relative" id="home">
			<div className="w-full mx-auto flex flex-col sm:mt-36 mt-20 c-space gap-3">
				<p className="sm:text-3xl text-xl font-medium text-white text-center font-generalsans">Hi, I am Hanmin <span className="waving-hand">👋</span></p>
				<p className="hero_tag text-gray_gradient">Coding my path forward</p>
			</div>

			<div className="w-full h-full absolute inset-0">
				<Canvas className="w-full h-full">
					<Suspense fallback={<CanvasLoader />}>
						<PerspectiveCamera makeDefault position={[0, 0, 30]} />

						<HeroCamera isMobile={isMobile}>
							<HollowKnight scale={sizes.deskScale} position={sizes.deskPosition} rotation={[-Math.PI / 2, 0, 5.5]} />
						</HeroCamera>

						<ambientLight intensity={1} />
						<directionalLight position={[10, 10, 10]} intensity={0.5} />
					</Suspense>
				</Canvas>
			</div>

			<div className="absolute bottom-7 left-0 right-0 w-full z-10 c-space">
				<a href="#about" className="w-fit">
					<Button name="Let's work together" isBeam containerClass="sm:w-fit w-full sm:min-w-96 hover:bg-black-500" />
				</a>
			</div>
		</section>
	)
}

export default Hero
