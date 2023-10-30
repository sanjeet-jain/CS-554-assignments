import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./components/Home";
import { Route, Link, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={viteLogo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the TV Maze API</h1>
          <Link className="showlink" to="/">
            Home
          </Link>
        </header>
        <br />
        <br />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
