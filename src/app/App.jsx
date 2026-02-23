import Hero from '../sections/Hero.jsx'
import TechStack from '../sections/TechStack.jsx'
import Work from '../sections/Work.jsx'
import Experience from '../sections/Experience.jsx'
import About from '../sections/About.jsx'
import Contact from '../sections/Contact.jsx'
import Footer from '../components/Footer.jsx'
import './App.css'

const App = () => {
  return (
    <div className="app">
      <Hero />
      <main>
        <Work />
        <Experience />
        <TechStack />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
