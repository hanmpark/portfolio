const PrivacyPolicy = () => {
	return (
		<section className="min-h-screen w-full flex flex-col items-center justify-center relative">
			{/* Header Section */}
			<div className="w-full mx-auto flex flex-col sm:mt-24 mt-16 px-5 gap-2 text-center">
				<h1 className="sm:text-4xl text-3xl font-bold text-white">Privacy Policy</h1>
				<p className="text-gray-400 sm:text-lg text-base">How we collect, use, and protect your data</p>
			</div>

			{/* Privacy Policy Content */}
			<div className="relative z-10 max-w-3xl mx-auto my-16 p-8 bg-black-200 rounded-lg text-gray-200">
				<h2 className="text-xl font-semibold mb-4">What Information We Collect</h2>
				<p className="text-base mb-6">
					When you submit a message through the contact form on our website, we collect the following information:
					your name, email address, and message content.
				</p>

				<h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
				<p className="text-base mb-6">
					We use the information you provide solely to respond to your inquiries and improve your experience.
					We do not share your information with third parties except for service providers necessary to deliver the service,
					such as <strong>EmailJS</strong>, which handles email delivery.
				</p>

				<h2 className="text-xl font-semibold mb-4">Use of Third-Party Services</h2>
				<p className="text-base mb-6">
					We use <strong>EmailJS</strong> to process and send emails. By submitting your information, you acknowledge that
					your data will be transferred to EmailJS for processing in accordance with their privacy policy. We encourage you to review their policy for more details.
				</p>
			</div>
		</section>
	)
}

export default PrivacyPolicy;
