import { useState } from 'react';
import Canvas from './components/Canvas';
import SignUp from './components/Signup';
import Login from './components/Login';


function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const toggleSignUp = () => setShowSignUp(!showSignUp);
  const toggleLogin = () => setShowLogin(!showLogin);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Picture Chat</h1>
          <nav>
            <ul>
              <li><a href="#logout">logout</a></li>
              <li><a href="#signup" onClick={toggleSignUp}>signup</a></li>
              <li><a href="#login" onClick={toggleLogin}>login</a></li>
            </ul>
          </nav>
        </header>
        <Canvas />
        {showSignUp && <SignUp onClose={toggleSignUp} />}
        {showLogin && <Login onClose={toggleLogin} />}
      </div>
    </>
  );
}

export default App;
