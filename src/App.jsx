import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Canvas from './Canvas';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div className="App">
				<header className="App-header">
					<h1>Picture Chat</h1>
				</header>
				<Canvas />
			</div>
		</>
	);
}

export default App;
