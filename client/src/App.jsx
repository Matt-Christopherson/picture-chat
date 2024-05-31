import { useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';

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
