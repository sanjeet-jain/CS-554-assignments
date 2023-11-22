import { createClient } from "redis";

let _client;

export const redisConnection = () => {
  if (!_client) {
    _client = createClient();

    _client.on("error", (err) => {
      console.log("Unable to connect to redis.");
      process.exit(1);
    });

    _client.on("connect", async (args) => {
      console.log("Connected to redis successfully.");
    });
  }

  return _client;
};
