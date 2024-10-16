const Footer = () => {
	return (
		<section className="c-space pt-7 pb-3 border-t border-black-300 flex justify-between items-center flex-wrap gap-5">
			<div className="text-white-500 flex gap-2">
				<p>Terms & Conditions</p>
				<p>|</p>
				<p>Privacy Policy</p>
			</div>

			<div className="flex gap-3">
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
			<p className="text-white-500">© 2024 Hanmin. All rights reserved.</p>
		</section>
	)
}

export default Footer;
