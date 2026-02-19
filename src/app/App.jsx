import Hero from '../sections/Hero.jsx'
import Work from '../sections/Work.jsx'
import Services from '../sections/Services.jsx'
import About from '../sections/About.jsx'
import Contact from '../sections/Contact.jsx'
import Footer from '../components/Footer.jsx'

const App = () => {
  return (
    <div className="app">
      <Hero />
      <main>
        <Work />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
