import { GraphQLError } from "graphql";
import axios from "axios";
import md5 from "blueimp-md5";
import dayjs from "dayjs";
import * as redis from "redis";
const client = redis.createClient();
client.on("error", (err) => {
  console.log("Redis Client Error", err);
});
client.connect().then(() => {});

import { v4 as uuid, validate as isUUIDValid } from "uuid";

const publickey = "201a00742a8f2665b99947c66827f686";
const privatekey = "c2e2351bdd4b822d1e613d0f9b932f1fc24eabcf";
const ts = dayjs().toDate().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public";

const generateUrl = (reqPath = "", offsetParam = "") => {
  const url =
    baseUrl +
    reqPath +
    "?ts=" +
    ts +
    "&apikey=" +
    publickey +
    "&hash=" +
    hash +
    (offsetParam ? `&offset=${offsetParam}` : "");
  return url;
};
function callMarvelUrl(url) {
  return axios
    .get(url)
    .then((response) => {
      return response.data.data.results;
    })
    .catch((error) => {
      // This block is executed for network errors and custom exceptions.
      return {
        code: error.response.status,
        status:
          error.response.data.status ??
          error.response.data.message ??
          error.response.statusText,
        results: [],
      };
    });
}

export const resolvers = {
  Query: {
    comics: async (_, { pageNum }) => {
      if (parseInt(pageNum, 10)) {
        if (await client.exists(`pageNum:${pageNum}`)) {
          // Data found in the cache, parse and return it
          const unflatData = JSON.parse(await client.get(`pageNum:${pageNum}`));
          if (!unflatData) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR", status: 500 },
            });
          }
          return unflatData;
        } else {
          const comics = await callMarvelUrl(
            generateUrl(`/comics`, pageNum * 20)
          );
          if (comics.length === 0) {
            // No more comics 404 status
            throw new GraphQLError(`No more comics`, {
              extensions: { code: "NOT_FOUND", status: 404 },
            });
          }
          await client.set(`pageNum:${pageNum}`, JSON.stringify(comics));
          return comics;
        }
      } else {
        throw new GraphQLError(`incorrect id`, {
          extensions: { code: "bad_id" },
        });
      }
    },
    comic: async (_, { id }) => {
      if (parseInt(id, 10)) {
        if (await client.exists(`${id}`)) {
          // Data found in the cache, parse and return it
          const unflatData = JSON.parse(await client.get(`${id}`));
          if (!unflatData) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          return unflatData;
        } else {
          const comic = await callMarvelUrl(generateUrl(`/comics/${id}`));
          if (comic.length === 0) {
            // No more comics 404
            throw new GraphQLError(`No more comics`, {
              extensions: { code: "NOT_FOUND", status: 404 },
            });
          }
          await client.set(`${id}`, JSON.stringify(comic[0]));
          return comic[0];
        }
      } else {
        throw new GraphQLError(`incorrect id`, {
          extensions: { code: "bad_id" },
        });
      }
    },
  },
};
