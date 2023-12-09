import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";
import { redisConnection } from "./config/redisConnection.js";

// Redis connection
await redisConnection().connect();

// Apollo Server configuration
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server
const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log(`GraphQL server ready at ${url}`);
