import { PersistGate } from "redux-persist/integration/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

import store from "@/store.js";
import "./App.css";
import { Link, Outlet } from "react-router-dom";
import { Button } from "./components/ui/button";

const persistor = persistStore(store);

// Configuring Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ApolloProvider client={client}>
          <div>
            <h1>App - Marvel API</h1>
            <br></br>
            <div>
              <Button>
                <Link to="/marvel-comics/page/1">ComicList</Link>
              </Button>
              {/* <Button>
                <Link to="/marvel-comics/">Comic by id</Link>
              </Button> */}
              <Button>
                <Link to="/marvel-comics/collections">Collections</Link>
              </Button>
            </div>
            <br></br>
            <div className="gap-3">
              <Outlet />
            </div>
          </div>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
