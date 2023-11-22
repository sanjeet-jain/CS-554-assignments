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
          <div className="container mx-auto p-5">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Marvel Comics App
            </h1>
            <p className="text-lg mb-4">
              Explore a vast collection of Marvel comics, create your own
              collections, and enjoy discovering the exciting world of
              superheroes and villains.
            </p>
            <div className="flex space-x-4 mb-8">
              <Button>
                <Link to="/">Home</Link>
              </Button>
              <Button>
                <Link to="/marvel-comics/page/1">Browse Comics</Link>
              </Button>
              <Button>
                <Link to="/marvel-comics/collections">View Collections</Link>
              </Button>
            </div>

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
