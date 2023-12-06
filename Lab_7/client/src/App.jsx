import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import "./App.css";
import { Link, Outlet } from "react-router-dom";
import { Button } from "./components/ui/button";

// Configuring Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="container mx-auto p-5">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Marvel Comics App
        </h1>
        <p className="text-lg mb-4">
          Explore a vast collection of Marvel comics, create your own
          collections, and enjoy discovering the exciting world of superheroes
          and villains.
        </p>
        <div className="flex space-x-4 mb-8">
          <Button>
            <Link to="/">Home</Link>
          </Button>
          <Button>
            <Link to="/generalPage">Click me</Link>
          </Button>
        </div>

        <div className="gap-3">
          <Outlet />
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
