import { useEffect, useState } from "react"
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { navLinks } from "../constants/index.js"
import { useLocation } from "react-router-dom";

const NavItems = ({ onClick = () => {}, isHome }) => {
	return (
		<ul className="nav-ul">
			{navLinks.map(({ id, href, name }) => (
				<li key={id} className="nav-li">
					<HashLink
						to={`${isHome ? href : '/' + href}`}
						className="nav-li_a"
						onClick={onClick}>
						{name}
					</HashLink>
				</li>
			))}
		</ul>
	)
}

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [isHome, setIsHome] = useState(true)
	const location = useLocation();

	useEffect(() => {
		if (location.pathname !== '/') {
			setIsHome(false);
		} else {
			setIsHome(true);
		}
	}, [location.pathname])

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-black/90 header">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center py-5 mx-auto c-space">
					<Link to="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
						Hanmin
					</Link>

					<button onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)} className="text-neutral-400 hover:text-white focus:outline-none sm:hidden flex" aria-label="Toggle menu">
						<img src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"} alt="toggle" className="w-6 h-6"/>
					</button>

					<nav className="sm:flex hidden">
						<NavItems isHome={isHome} />
					</nav>
				</div>
			</div>

			<div className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
				<nav className="p-5">
					<NavItems onClick={() => setIsOpen(false)} isHome={isHome} />
				</nav>
			</div>
		</header>
	)
}

export default Navbar
