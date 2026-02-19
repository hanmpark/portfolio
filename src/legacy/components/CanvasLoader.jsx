import { Html } from '@react-three/drei';

const CanvasLoader = () => {
	return (
		<Html
			as="div"
			center
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
		<p
			style={{
			fontSize: 14,
			color: '#F1F1F1',
			fontWeight: 800,
			marginTop: 40,
			}}>
			Loading...
		</p>
		</Html>
	);
};

export default CanvasLoader;
