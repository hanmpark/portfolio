import { useNavigate } from "react-router-dom";

const Footer = () => {
	const navigate = useNavigate();

	return (
		<section className="c-space pt-7 pb-3 border-t border-black-300 flex justify-between items-center flex-wrap gap-5 relative min-h-[120px]">
			<p className="hover:cursor-pointer text-white-500" onClick={() => navigate("/privacy-policy")}>Privacy Policy</p>

			<div className="flex gap-3 absolute left-1/2 transform -translate-x-1/2">
				<a className="social-icon hover:cursor-pointer hover:bg-black-500 transition-all" href="https://github.com/hanmpark" target="_blank" rel="noreferrer">
					<img src="/assets/github.svg" alt="github" className="w-1/2 h-1/2" />
				</a>
				<a className="social-icon hover:cursor-pointer hover:bg-black-500 transition-all" href="https://www.instagram.com/hanmin.prk" target="_blank" rel="noreferrer">
					<img src="/assets/instagram.svg" alt="instagram" className="w-1/2 h-1/2" />
				</a>
				<a className="social-icon hover:cursor-pointer hover:bg-black-500 transition-all" href="https://www.linkedin.com/in/hanmin-park-83239718b/" target="_blank" rel="noreferrer">
					<img src="/assets/linkedinlogo.png" alt="instagram" className="w-1/2 h-1/2" />
				</a>
			</div>

			<p className="text-white-500">&copy; 2024 Hanmin. All rights reserved.</p>
		</section>
	)
}

export default Footer;
