export const navLinks = [
	{
	  id: 1,
	  name: 'Home',
	  href: '#home',
	},
	{
	  id: 2,
	  name: 'About',
	  href: '#about',
	},
	{
	  id: 3,
	  name: 'Work',
	  href: '#work',
	},
	{
	  id: 4,
	  name: 'Contact',
	  href: '#contact',
	},
  ];

  export const clientReviews = [
	{
	  id: 1,
	  name: 'Emily Johnson',
	  position: 'Marketing Director at GreenLeaf',
	  img: 'assets/review1.png',
	  review:
		'Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
	},
	{
	  id: 2,
	  name: 'Mark Rogers',
	  position: 'Founder of TechGear Shop',
	  img: 'assets/review2.png',
	  review:
		'Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional! Fantastic work.',
	},
	{
	  id: 3,
	  name: 'John Dohsas',
	  position: 'Project Manager at UrbanTech ',
	  img: 'assets/review3.png',
	  review:
		'I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
	},
	{
	  id: 4,
	  name: 'Ether Smith',
	  position: 'CEO of BrightStar Enterprises',
	  img: 'assets/review4.png',
	  review:
		'Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
	},
  ];

  export const myProjects = [
	{
	  title: 'scholarship time tracker',
	  desc: 'A tool designed to track and calculate cumulative hours for 42 Nice students, helping them efficiently log the required number of hours each month to meet their scholarship criteria. The tool provides an easy-to-use interface to monitor progress, ensuring students stay on track with their commitments and maintain eligibility. By automating the hour-tracking process, it reduces administrative burden and offers students a clear overview of their time management.',
	  subdesc:
		'Built with C, 42 API, and scripting',
	  href: 'https://github.com/hanmpark/scholarship_logtime',
	  texture: '/textures/project/project1.mp4',
	  logo: '/assets/project-logo1.png',
	  logoStyle: {
		backgroundColor: '#2A1816',
		border: '0.2px solid #36201D',
		boxShadow: '0px 0px 60px 0px #AA3C304D',
	  },
	  spotlight: '/assets/spotlight1.png',
	  tags: [
		{
		  id: 1,
		  name: 'C',
		  path: '/assets/C.png',
		},
	  ],
	},
	{
	  title: 'miniraytracer',
	  desc: 'This project aims to create a program that renders 3D scenes using ray tracing, a technique that simulates how light interacts with objects to produce realistic effects like shadows, reflections, and refractions. It offers a practical understanding of key computer graphics concepts, blending theory with real-world application.',
	  subdesc:
		'Built with C, miniLibX, scripting and threading',
	  href: 'https://github.com/hanmpark/miniraytracer',
	  texture: '/textures/project/project2.mp4',
	  logo: '/assets/project-logo2.png',
	  logoStyle: {
		backgroundColor: '#13202F',
		border: '0.2px solid #17293E',
		boxShadow: '0px 0px 60px 0px #2F6DB54D',
	  },
	  spotlight: '/assets/spotlight2.png',
	  tags: [
		{
		  id: 1,
		  name: 'C',
		  path: '/assets/C.png',
		},
	  ],
	},
	{
	  title: 'ft_transcendence',
	  desc: 'A full-stack web application developed as part of the 42 curriculum, featuring a multiplayer Pong game with user authentication, real-time chat, and integrated social features. This project combines interactive gameplay with social connectivity, allowing users to compete in real time, communicate, and build their profiles. The app showcases proficiency in both front-end and back-end technologies, providing an engaging, fully functional multiplayer experience',
	  subdesc:
		'As part of a group project in the 42 curriculum, I contributed to building the front-end of a full-stack web app using React.js, Three.js, styled-components, and Docker.',
	  href: 'https://github.com/okbrandon/ft_transcendence',
	  texture: '/textures/project/project3.mp4',
	  logo: '/assets/react.svg',
	  logoStyle: {
		backgroundColor: '#60f5a1',
		background:
		  'linear-gradient(0deg, #60F5A150, #60F5A150), linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(208, 213, 221, 0.8) 100%)',
		border: '0.2px solid rgba(208, 213, 221, 1)',
		boxShadow: '0px 0px 60px 0px rgba(35, 131, 96, 0.3)',
	  },
	  spotlight: '/assets/spotlight3.png',
	  tags: [
		{
		  id: 1,
		  name: 'React.js',
		  path: '/assets/react.svg',
		},
		{
		  id: 2,
		  name: 'three.js',
		  path: 'assets/threejs.png',
		},
		{
		  id: 3,
		  name: 'Docker',
		  path: '/assets/docker.png',
		},
	  ],
	},
  ];

  export const calculateSizes = (isSmall, isMobile) => {
	return {
	  deskScale: isSmall ? 0.6 : isMobile ? 0.7 : 0.9,
	  deskPosition: isMobile ? [0, -4, 0] : [0, -6,-5],
	};
  };

  export const workExperiences = [
	{
	  id: 1,
	  name: '42 Nice',
	  pos: 'Software Engineering Student',
	  duration: '2022 - Present',
	  title: "Enrolled in 42 Nice, a prestigious and innovative coding school focused on project-based learning and peer-to-peer collaboration. The program emphasizes autonomy, creativity, and hands-on experience in software development, without traditional classes or teachers.",
	  icon: '/assets/42logo.png',
	  animation: 'victory',
	},
	{
	  id: 2,
	  name: 'Université Paris 1 - Panthéon-Sorbonne',
	  pos: 'Cinema Student',
	  duration: '2019 - 2021',
	  title: "Studied at Université Paris 1 Panthéon-Sorbonne, one of France's leading institutions for humanities and social sciences, with a specialization in cinema studies. The program provided a comprehensive exploration of film theory, history, and production techniques, blending academic analysis with practical application.",
	  icon: '/assets/pantheon-sorbonne.svg',
	  animation: 'clapping',
	},
	{
	  id: 3,
	  name: 'Centre International de Valbonne',
	  pos: 'Student - English Section',
	  duration: '2012 - 2019',
	  title: "Attended the Centre International de Valbonne (CIV), an internationally recognized secondary school known for its rigorous academic standards and multicultural environment. Specialized in the Option Internationale du Baccalauréat (OIB) which emphasized bilingual education and global perspectives.",
	  icon: '/assets/civlogo.png',
	  animation: 'salute',
	},
  ];
