import "./App.css";
import { Outlet } from "react-router-dom";
import store from "@/store.js";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <div>
        <h1>App - Marvel API</h1>
        <Outlet />
      </div>
    </Provider>
  );
}

export default App;
