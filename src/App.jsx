import Navbar from './sections/Navbar.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx';
import Projects from './sections/Projects.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';
import Experience from './sections/Experience.jsx';

const App = () => {
	return (
		<main className="mx-auto relative bg-page">
			<Navbar />
			<Hero />
			<div className='max-w-7xl mx-auto relative'>
				<About />
				<Projects />
				<Experience />
				<Contact />
			</div>
			<Footer />
		</main>
	)
}

export default App;
