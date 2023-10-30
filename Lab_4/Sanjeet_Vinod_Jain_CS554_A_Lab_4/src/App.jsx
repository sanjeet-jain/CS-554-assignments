import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./components/Home";
import CollectionList from "./components/CollectionList";
import CollectionId from "./components/CollectionId";
import { Route, Link, Routes } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={viteLogo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the TV Maze API</h1>
          <Link className="showlink" to="/collection/page/1">
            Collections
          </Link>
        </header>
        <br />
        <br />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection/page/:page" element={<CollectionList />} />
          <Route path="/collection/:id" element={<CollectionId />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
