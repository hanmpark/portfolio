import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";

const Contact = () => {
	const formRef = useRef();

	const { alert, showAlert, hideAlert } = useAlert();
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: ""
	});

	const handleChange = ({ target: { name, value }}) => {
		setForm({ ...form, [name]: value });
	}

	// service_4133enl

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		emailjs.send(
			import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
			import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
			{
				from_name: form.name,
				to_name: 'Hanmin',
				from_email: form.email,
				to_email: 'hanmin.01.park@gmail.com',
				message: form.message
			},
			import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
		)
		.then(() => {
			setLoading(false);
			showAlert({
				show: true,
				text: 'Thank you for your message 😊',
				type: 'success'
			})

			setTimeout(() => {
				hideAlert(false);
				setForm({
					name: "",
					email: "",
					message: ""
				});
			}, [3000]);
		}, (error) => {
			setLoading(false);
			console.error(error);

			showAlert({
				show: true,
				text: "I didn't receive your message 😢",
				type: 'danger'
			});
		});
	}

	return (
		<section className="c-space my-20" id="contact">
			{alert.show && <Alert {...alert} />}

			<div className="relative min-h-screen flex items-center justify-center flex-col">
				<div className="contact-container">
					<h3 className="head-text">Let's talk</h3>
					<p className="text-lg text-white-600 mt-3">Whether you are looking to build a new website, improve your existing platform, or bring a unique project to life, I'm here to help.</p>

					<form ref={formRef} onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-6">
						<label className="space-y-3">
							<span className="field-label">Full Name</span>
							<input
								type="text"
								name="name"
								value={form.name}
								onChange={handleChange}
								required
								className="field-input"
								placeholder="John Doe"
							/>
						</label>

						<label className="space-y-3">
							<span className="field-label">Email</span>
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								required
								className="field-input"
								placeholder="johndoe@gmail.com"
							/>
						</label>

						<label className="space-y-3">
							<span className="field-label">Your message</span>
							<textarea
								name="message"
								value={form.message}
								onChange={handleChange}
								required
								rows={5}
								className="field-input"
								placeholder="Hi, I'm interested in..."
							/>
						</label>

						<button className="field-btn" type="submit" disabled={loading}>
							{loading ? "Sending..." : "Send Message"}

							<img src="/assets/arrow-up.png" alt="arrow-up" className="field-btn_arrow"/>
						</button>
					</form>
				</div>
			</div>
		</section>
	)
}

export default Contact;
