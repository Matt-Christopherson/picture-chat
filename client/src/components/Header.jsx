import "../App.css";
const Header = () => {
  return (
    <header className="App-header">
      <h1>Picture Chat</h1>
      <nav>
        <ul>
          <li>
            <a href="#logout">logout</a>
          </li>
          <li>
            <a href="#signup">signup</a>
          </li>
          <li>
            <a href="#login">login</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
