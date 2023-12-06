import { GraphQLError } from "graphql";

import * as redis from "redis";
const client = redis.createClient();
client.on("error", (err) => {
  console.log("Redis Client Error", err);
});
client.connect().then(() => {});

export const resolvers = {
  Query: {
    test: async (_, { test }) => {
      return test;
    },
  },
};
