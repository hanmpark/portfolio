import About from "../sections/About";
import Contact from "../sections/Contact";
import Experience from "../sections/Experience";
import Hero from "../sections/Hero";
import Projects from "../sections/Projects";

const Home = () => {
	return (
		<>
			<Hero />
			<div className='max-w-7xl mx-auto relative'>
				<About />
				<Projects />
				<Experience />
				<Contact />
			</div>
		</>
	)
}

export default Home;
