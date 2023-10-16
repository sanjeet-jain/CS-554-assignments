import { GraphQLError } from "graphql";

import {
  authors as authorsCollection,
  books as booksCollection,
} from "./config/mongoCollections.js";

import * as redis from "redis";
const client = redis.createClient();
client.on("error", (err) => {
  console.log("Redis Client Error", err);
});
client.connect().then(() => {});

import { v4 as uuid, validate as isUUIDValid } from "uuid";

export const resolvers = {
  Query: {
    authors: async (_, args) => {
      if (await client.exists("authors")) {
        // Data found in the cache, parse and return it
        const unflatData = JSON.parse(await client.get("authors"));
        if (!unflatData) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return unflatData;
      } else {
        const authors = await authorsCollection();
        const allauthors = await authors.find({}).toArray();
        if (!allauthors) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        await client.set("authors", JSON.stringify(allauthors));
        await client.expire("authors", 60 * 60);
        return allauthors;
      }
    },
    books: async (_, args) => {
      if (await client.exists("books")) {
        // Data found in the cache, parse and return it
        const unflatData = JSON.parse(await client.get("books"));
        if (!unflatData) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return unflatData;
      } else {
        const books = await booksCollection();
        const allbooks = await books.find({}).toArray();
        if (!allbooks) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        await client.set("books", JSON.stringify(allbooks));
        await client.expire("books", 60 * 60);
        return allbooks;
      }
    },
    getAuthorById: async (_, args) => {
      if (isUUIDValid(args?._id?.trim())) {
        if (await client.exists(`${args._id.trim()}`)) {
          // Data found in the cache, parse and return it
          const unflatData = JSON.parse(await client.get(`${args._id.trim()}`));
          if (!unflatData) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          return unflatData;
        } else {
          const authors = await authorsCollection();
          const author = await authors.find({ _id: args._id.trim() }).toArray();
          if (!author || author.length === 0) {
            throw new GraphQLError("Author Not Found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          await client.set(`${args._id.trim()}`, JSON.stringify(author[0]));
          return author[0];
        }
      } else {
        throw new GraphQLError(`incorrect id`, {
          extensions: { code: "bad_id" },
        });
      }
    },
    getBookById: async (_, args) => {
      if (isUUIDValid(args?._id?.trim())) {
        if (await client.exists(`${args._id.trim()}`)) {
          // Data found in the cache, parse and return it
          const unflatData = JSON.parse(await client.get(`${args._id.trim()}`));
          if (!unflatData) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          return unflatData;
        } else {
          const books = await booksCollection();
          const book = await books.find({ _id: args._id.trim() }).toArray();
          if (!book || book.length === 0) {
            throw new GraphQLError("Book Not Found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          await client.set(`${args._id.trim()}`, JSON.stringify(book[0]));
          return book[0];
        }
      } else {
        throw new GraphQLError(`BAD id`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
    },
    booksByGenre: async (_, args) => {
      if (args?.genre && args.genre.trim() !== "") {
        if (await client.exists(`${args.genre.trim().toLowerCase()}`)) {
          const unflatData = JSON.parse(
            await client.get(`${args.genre.trim().toLowerCase()}`)
          );
          if (!unflatData) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          return unflatData;
        } else {
          const books = await booksCollection();
          const genreBooks = await books
            .find({
              genres: {
                $regex: new RegExp(args.genre.trim(), "i"),
              },
            })
            .toArray();
          if (!genreBooks || genreBooks.length === 0) {
            throw new GraphQLError(
              `Book with ${args.genre.trim().toLowerCase()} Not Found`,
              {
                extensions: { code: "NOT_FOUND" },
              }
            );
          }
          await client.set(
            `${args.genre.trim().toLowerCase()}`,
            JSON.stringify(genreBooks)
          );
          await client.expire(`${args.genre.trim().toLowerCase()}`, 60 * 60);
          return genreBooks;
        }
      } else {
        throw new GraphQLError(`bad genre input`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
    },
    booksByPriceRange: async (_, args) => {
      if (
        isNaN(args.min) ||
        isNaN(args.max) ||
        args.min < 0 ||
        args.min >= args.max
      ) {
        throw new GraphQLError(`bad min max values`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      } else {
        if (await client.exists(`booksByPriceRange:${args.min}:${args.max}`)) {
          const unflatData = JSON.parse(
            await client.get(`booksByPriceRange:${args.min}:${args.max}`)
          );
          if (!unflatData) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          return unflatData;
        } else {
          const books = await booksCollection();
          const booksByPriceRange = await books
            .find({
              price: { $gte: args.min, $lte: args.max },
            })
            .toArray();
          if (!booksByPriceRange || booksByPriceRange.length === 0) {
            throw new GraphQLError(
              `Book with price between ${args.min} and ${args.max} Not Found`,
              {
                extensions: { code: "NOT_FOUND" },
              }
            );
          }
          await client.set(
            `booksByPriceRange:${args.min}:${args.max}`,
            JSON.stringify(booksByPriceRange)
          );
          await client.expire(
            `booksByPriceRange:${args.min}:${args.max}`,
            60 * 60
          );
          return booksByPriceRange;
        }
      }
    },
    searchAuthorsByName: async (_, args) => {
      if (args?.searchTerm && args.searchTerm.trim() !== "") {
        if (await client.exists(`${args.searchTerm.trim().toLowerCase()}`)) {
          const unflatData = JSON.parse(
            await client.get(`${args.searchTerm.trim().toLowerCase()}`)
          );
          if (!unflatData) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          return unflatData;
        } else {
          const authors = await authorsCollection();
          const authorsBySearchTerm = await authors
            .find({
              $or: [
                {
                  first_name: {
                    $regex: new RegExp(args.searchTerm.trim(), "i"),
                  },
                },
                {
                  last_name: {
                    $regex: new RegExp(args.searchTerm.trim(), "i"),
                  },
                },
              ],
            })
            .toArray();
          if (!authorsBySearchTerm || authorsBySearchTerm.length === 0) {
            throw new GraphQLError(
              `Author with first name or last name having the search term ${args.searchTerm
                .trim()
                .toLowerCase()} Not Found`,
              {
                extensions: { code: "NOT_FOUND" },
              }
            );
          }
          await client.set(
            `${args.searchTerm.trim().toLowerCase()}`,
            JSON.stringify(authorsBySearchTerm)
          );
          await client.expire(
            `${args.searchTerm.trim().toLowerCase()}`,
            60 * 60
          );
          return authorsBySearchTerm;
        }
      } else {
        throw new GraphQLError(`bad genre input`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
    },
  },
  Book: {
    author: async (_, args) => {
      const authors = await authorsCollection();
      const author = await authors.findOne({
        _id: _.authorId,
      });
      return author;
    },
  },
  Author: {
    books: async (_, args) => {
      const books = await booksCollection();
      const written = await books.find({ authorId: _._id }).toArray();
      return written.slice(0, args.limit);
    },
  },
};
