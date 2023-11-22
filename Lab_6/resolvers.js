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
      return {
        comics: response.data.data.results,
        total: response.data.data.total,
      };
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
    comics: async (_, { pageNum, searchQuery }) => {
      if (parseInt(pageNum, 10)) {
        if (await client.exists(`pageNum:${pageNum}`)) {
          // Data found in the cache, parse and return it
          const unflatData = JSON.parse(await client.get(`pageNum:${pageNum}`));
          // use searchQuery to filter the results
          if (searchQuery) {
            const filteredComics = unflatData.comics.filter((comic) =>
              comic.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return { comics: filteredComics, total: filteredComics.length };
          }
          if (!unflatData) {
            throw new GraphQLError(`500 : Internal Server Error`, {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: {
                  status: 500,
                },
              },
            });
          }
          return unflatData;
        } else {
          const { comics, total } = await callMarvelUrl(
            generateUrl(`/comics`, pageNum * 20)
          );
          if (!comics || !Array.isArray(comics) || comics.length === 0) {
            // No more comics 404 status
            throw new GraphQLError(`404 : No more comics`, {
              extensions: {
                code: "NOT_FOUND",
                http: {
                  status: 404,
                },
              },
            });
          }
          // use searchQuery to filter the results
          if (searchQuery) {
            const filteredComics = comics.filter((comic) =>
              comic.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (
              !filteredComics ||
              !Array.isArray(filteredComics) ||
              filteredComics.length === 0
            ) {
              // No more comics 404 status
              throw new GraphQLError(`404 : No more comics`, {
                extensions: {
                  code: "NOT_FOUND",
                  http: {
                    status: 404,
                  },
                },
              });
            }
            return { comics: filteredComics, total: filteredComics.length };
          }

          await client.set(
            `pageNum:${pageNum}`,
            JSON.stringify({ comics, total })
          );
          return { comics, total };
        }
      } else {
        throw new GraphQLError(`400 : incorrect id`, {
          extensions: {
            code: "BAD_REQUEST",
            http: {
              status: 400,
            },
          },
        });
      }
    },
    comic: async (_, { id }) => {
      if (parseInt(id)) {
        if (await client.exists(`${id}`)) {
          // Data found in the cache, parse and return it
          const unflatData = JSON.parse(await client.get(`${id}`));
          if (!unflatData) {
            throw new GraphQLError(`500 : Internal Server Error`, {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: {
                  status: 500,
                },
              },
            });
          }
          return unflatData;
        } else {
          const { comics } = await callMarvelUrl(generateUrl(`/comics/${id}`));
          if (!comics || !Array.isArray(comics) || comics.length === 0) {
            // No more comics 404
            throw new GraphQLError(`404 : No comics with that id`, {
              extensions: {
                code: "NOT_FOUND",
                http: {
                  status: 404,
                },
              },
            });
          }
          await client.set(`${id}`, JSON.stringify(comics[0]));
          return comics[0];
        }
      } else {
        throw new GraphQLError(`400 : incorrect id`, {
          extensions: {
            code: "BAD_REQUEST",
            http: {
              status: 400,
            },
          },
        });
      }
    },
  },
};
