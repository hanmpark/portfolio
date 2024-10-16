import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './sections/Navbar.jsx'
import Footer from './sections/Footer.jsx'
import Home from './pages/Home.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'

const App = () => {
	return (
		<Router>
			<main className="mx-auto relative bg-page">
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/privacy-policy" element={<PrivacyPolicy />} />
				</Routes>
				<Footer />
			</main>
		</Router>
	)
}

export default App;
