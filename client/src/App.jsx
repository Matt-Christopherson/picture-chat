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
					<nav>
						<ul>
							<li><a href="#logout">logout</a></li>
							<li><a href="#signup">signup</a></li>
							<li><a href="#login">login</a></li>
						</ul>
            		</nav>
				</header>
				<Canvas />
			</div>
		</>
	);
}

export default App;
