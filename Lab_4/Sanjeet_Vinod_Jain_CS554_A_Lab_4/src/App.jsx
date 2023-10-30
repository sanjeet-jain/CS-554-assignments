import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./components/Home";
import Error from "./components/Error";
import CollectionList from "./components/CollectionList";
import CollectionIdCardList from "./components/CollectionIdCardList";
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
          <h1 className="App-title">
            Welcome to the Metropolitan Museum of Art API Single Page
            Application using React
          </h1>
          <SearchInput />
          <Link to="/">Home</Link>
          <br />
          <Link to="/collection/page/1">Collection</Link>
          <br />
        </header>
        <br />
        <br />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection/page/:page" element={<CollectionList />} />
          <Route path="/collection/:id" element={<CollectionIdCardList />} />
          <Route path="/error/:status?" element={<Error />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
