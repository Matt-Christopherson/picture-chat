import { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import SignUp from "./components/Signup";
import Login from "./components/Login";

import AuthService from './utils/auth'; 

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  

  useEffect(() => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Log the token to the console
  
    if (token) {
      // Decode token to extract user information
      const user = AuthService.getProfile(token);
      console.log('Decoded Token:', user); // Log the decoded token to the console
  
      if (user && user.authenticatedPerson) {
        const { username } = user.authenticatedPerson; // Access username property from authenticatedPerson object
        console.log('Extracted Username:', username); // Log the extracted username to the console
  
        if (username) {
          setLoggedInUser(username); 
          console.log('loggedInUser:', username);
        }
      }
    }
  }, []);
  
  
  

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
              <li>
                <a href="#logout">logout</a>
              </li>
              <li>
                <a href="#signup" onClick={toggleSignUp}>
                  signup
                </a>
              </li>
              <li>
                <a href="#login" onClick={toggleLogin}>
                  login
                </a>
              </li>
              {loggedInUser && (
                <li>
                  <p>Currently logged in as {loggedInUser}</p>
                </li>
              )}
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

