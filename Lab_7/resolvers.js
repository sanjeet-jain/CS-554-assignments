import { GraphQLError } from "graphql";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);
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
function isValidAuthorName(name) {
  if (name.trim() !== "") return /^[A-Za-z]+$/.test(name);
  return false;
}
function isValidDate(dateString) {
  const dateFormatsToCheck = [
    "MM/DD/YYYY",
    "M/D/YYYY",
    "MM-DD-YYYY",
    "M-D-YYYY",
    "D-M-YYYY",
    "DD-MM-YYYY",
  ];
  for (const format of dateFormatsToCheck) {
    const date = dayjs(dateString, { format, strict: true });
    if (
      dayjs(dateString, format).format(format) === dateString &&
      date.isValid()
    ) {
      return true;
    }
  }
  return false;
}

function isValidStateAbbreviation(state) {
  const validStateAbbreviations = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  return validStateAbbreviations.includes(state);
}

const isValidHometownCity = (city) => {
  // Implement your hometownCity validation logic
  // For example, check if it's not an empty string or a specific invalid value
  return typeof city === "string" && city.trim() !== "1";
};

function isAuthorValidNew(author) {
  let isValid = false;
  if (
    isUUIDValid(author._id) &&
    isValidAuthorName(author.first_name.trim()) &&
    isValidAuthorName(author.last_name.trim()) &&
    isValidDate(author.date_of_birth.trim()) &&
    isValidStateAbbreviation(author.hometownState.trim()) &&
    isValidHometownCity(author.hometownCity) &&
    author.hometownCity.trim() !== ""
  ) {
    author._id = author._id.trim();
    author.first_name = author.first_name.trim();
    author.last_name = author.last_name.trim();
    author.hometownCity = author.hometownCity.trim();
    author.hometownState = author.hometownState.trim();
    isValid = true;
  }
  return { author, isValid };
}
function isAuthorValidEdit(inputAuthor) {
  let isValid = true; // Assume it's valid by default
  const author = {};
  author._id = inputAuthor._id.trim();
  isValid = isValid && isUUIDValid(inputAuthor._id);

  if (inputAuthor.first_name && isValid) {
    author.first_name = inputAuthor.first_name.trim();
    isValid = isValid && isValidAuthorName(inputAuthor.first_name);
  }

  if (inputAuthor.last_name && isValid) {
    author.last_name = inputAuthor.last_name.trim();
    isValid = isValid && isValidAuthorName(inputAuthor.last_name);
  }

  if (inputAuthor.date_of_birth && isValid) {
    author.date_of_birth = inputAuthor.date_of_birth.trim();
    isValid = isValid && isValidDate(inputAuthor.date_of_birth);
  }

  if (inputAuthor.hometownState && isValid) {
    author.hometownState = inputAuthor.hometownState.trim();
    isValidDate;
    isValid = isValid && isValidStateAbbreviation(inputAuthor.hometownState);
  }

  if (inputAuthor.hometownCity && isValid) {
    author.hometownCity = inputAuthor.hometownCity.trim();
    isValid = isValid && inputAuthor.hometownCity !== "";
  }

  return { author, isValid };
}

const isPublicationDateValid = async (publicationDate, authorId) => {
  const authors = await authorsCollection();
  const author = await authors.findOne({ _id: authorId });

  if (!isValidDate(author.date_of_birth) || !isValidDate(publicationDate)) {
    return false;
  }

  const authorDOB = dayjs(author.date_of_birth);
  const bookPublicationDate = dayjs(publicationDate);

  return (
    bookPublicationDate.isSame(authorDOB, "day") ||
    bookPublicationDate.isAfter(authorDOB)
  );
};

//https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s13.html
function isValidISBN(isbn) {
  const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
  return isbnRegex.test(isbn);
}

export const resolvers = {
  Query: {
    authors: async (_, args) => {
      if (await client.exists("authors")) {
        // Data found in the cache, parse and return it
        const unflatData = JSON.parse(await client.get("authors"));
        if (!unflatData) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
            http: {
              status: 500,
            },
          });
        }
        return unflatData.sort((a, b) =>
          a.last_name.localeCompare(b.last_name)
        );
      } else {
        const authors = await authorsCollection();
        const allauthors = await authors.find({}).toArray();
        if (!allauthors) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
            http: {
              status: 500,
            },
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
            http: {
              status: 500,
            },
          });
        }
        return unflatData;
      } else {
        const books = await booksCollection();
        const allbooks = await books.find({}).toArray();
        if (!allbooks) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
            http: {
              status: 500,
            },
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
              http: {
                status: 500,
              },
            });
          }
          return unflatData;
        } else {
          const authors = await authorsCollection();
          const author = await authors.find({ _id: args._id.trim() }).toArray();
          if (!author || author.length === 0) {
            throw new GraphQLError("Author Not Found", {
              extensions: { code: "NOT_FOUND" },
              http: {
                status: 404,
              },
            });
          }
          await client.set(`${args._id.trim()}`, JSON.stringify(author[0]));
          return author[0];
        }
      } else {
        throw new GraphQLError(`incorrect id`, {
          extensions: { code: "bad_id" },
          http: {
            status: 400,
          },
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
              http: {
                status: 500,
              },
            });
          }
          return unflatData;
        } else {
          const books = await booksCollection();
          const book = await books.find({ _id: args._id.trim() }).toArray();
          if (!book || book.length === 0) {
            throw new GraphQLError("Book Not Found", {
              extensions: { code: "NOT_FOUND" },
              http: {
                status: 404,
              },
            });
          }
          await client.set(`${args._id.trim()}`, JSON.stringify(book[0]));
          return book[0];
        }
      } else {
        throw new GraphQLError(`BAD id`, {
          extensions: { code: "BAD_USER_INPUT" },
          http: {
            status: 400,
          },
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
              http: {
                status: 500,
              },
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
                http: {
                  status: 404,
                },
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
          http: {
            status: 400,
          },
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
          http: {
            status: 400,
          },
        });
      } else {
        if (await client.exists(`booksByPriceRange:${args.min}:${args.max}`)) {
          const unflatData = JSON.parse(
            await client.get(`booksByPriceRange:${args.min}:${args.max}`)
          );
          if (!unflatData) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
              http: {
                status: 500,
              },
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
                http: {
                  status: 404,
                },
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
              http: {
                status: 500,
              },
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
                http: {
                  status: 404,
                },
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
          http: {
            status: 400,
          },
        });
      }
    },
  },
  Mutation: {
    addAuthor: async (_, args) => {
      let newAuthor = {
        _id: uuid(),
        first_name: args.first_name,
        last_name: args.last_name,
        date_of_birth: args.date_of_birth,
        hometownCity: args.hometownCity,
        hometownState: args.hometownState,
        numOfBooks: 0,
        books: [],
      };
      const result = isAuthorValidNew(newAuthor);
      if (!result.isValid) {
        throw new GraphQLError(`incorrect inputs`, {
          extensions: { code: "BAD_INPUT" },
          http: {
            status: 400,
          },
        });
      }
      newAuthor = result.author;
      const authors = await authorsCollection();
      let insertedAuthor = await authors.insertOne(newAuthor);
      if (!insertedAuthor.acknowledged || !insertedAuthor.insertedId) {
        throw new GraphQLError(`Could not Add Author`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
          http: {
            status: 500,
          },
        });
      }
      await client.set(newAuthor._id, JSON.stringify(newAuthor));
      await client.del("authors");
      await resolvers.Query.authors();
      return newAuthor;
    },
    editAuthor: async (_, args) => {
      if (!args) {
        throw new GraphQLError(`edit author needs inputs`, {
          extensions: { code: "BAD_INPUT" },
          http: {
            status: 400,
          },
        });
      }

      let newAuthor = {
        _id: args._id,
        first_name: args?.first_name ?? "",
        last_name: args?.last_name ?? "",
        date_of_birth: args?.date_of_birth ?? "",
        hometownCity: args?.hometownCity ?? "",
        hometownState: args?.hometownState ?? "",
      };
      const result = isAuthorValidEdit(newAuthor);
      if (!result.isValid) {
        throw new GraphQLError(`incorrect inputs`, {
          extensions: { code: "BAD_INPUT" },
          http: {
            status: 400,
          },
        });
      }
      newAuthor = result.author;
      const authors = await authorsCollection();
      const author = await authors
        .find({ _id: newAuthor._id.trim() })
        .toArray();
      if (!author || author.length === 0) {
        throw new GraphQLError("Author Not Found", {
          extensions: { code: "NOT_FOUND" },
          http: {
            status: 404,
          },
        });
      }
      author[0] = { ...author[0], ...newAuthor };
      const updatedAuthor = { ...author[0] };
      delete updatedAuthor._id;
      let updateResult = await authors.updateOne(
        { _id: author[0]._id },
        { $set: updatedAuthor }
      );
      if (updateResult.acknowledged && updateResult.modifiedCount === 1) {
        await client.set(author[0]._id, JSON.stringify(author[0]));
        await client.del("authors");
        await resolvers.Query.authors();
        return author[0];
      } else {
        throw new GraphQLError("Author update failed", {
          extensions: { code: "UPDATE_FAILED" },
          http: {
            status: 500,
          },
        });
      }
    },
    removeAuthor: async (_, args) => {
      if (!isUUIDValid(args?._id?.trim())) {
        throw new GraphQLError(`bad author id`, {
          extensions: { code: "BAD_INPUT" },
          http: {
            status: 400,
          },
        });
      }

      const authors = await authorsCollection();
      const deletedauthor = await authors.findOneAndDelete({
        _id: args._id.trim(),
      });

      if (!deletedauthor) {
        throw new GraphQLError(
          `Could not delete author with _id of ${args._id}`,
          {
            extensions: { code: "NOT_FOUND" },
            http: {
              status: 404,
            },
          }
        );
      }
      await client.del(args._id.trim());
      await client.del("authors");
      await resolvers.Query.authors();

      if (deletedauthor.books.length > 0) {
        const books = await booksCollection();
        let deletedBooks = await books.deleteMany({
          _id: { $in: deletedauthor.books },
        });
        if (deletedBooks.deletedCount > 0) {
          deletedauthor.books.forEach(async (bookId) => {
            await client.del(bookId);
          });
        }

        await client.del("books");
        await resolvers.Query.books();
      }
      return deletedauthor;
    },
    addBook: async (_, args) => {
      if (
        !args.title.trim() ||
        !args.genres.every((genre) => genre.trim()) ||
        !args.publicationDate.trim() ||
        !args.publisher.trim() ||
        !args.summary.trim() ||
        !args.isbn.trim() ||
        !args.language.trim() ||
        args.pageCount <= 0 ||
        args.price <= 0 ||
        args.language.match(/[\d]/) ||
        args.format.length === 0 ||
        args.format.some((format) => format.trim() === "")
      ) {
        throw new GraphQLError("Invalid input parameters", {
          extensions: { code: "BAD_USER_INPUT" },
          http: {
            status: 400,
          },
        });
      }
      if (
        !isValidDate(args.publicationDate) ||
        !(await isPublicationDateValid(args.publicationDate, args.authorId))
      ) {
        throw new GraphQLError("Invalid publication date", {
          extensions: { code: "BAD_USER_INPUT" },
          http: {
            status: 400,
          },
        });
      }
      if (isNaN(args.price)) {
        throw new GraphQLError("Price must be a number", {
          extensions: { code: "BAD_USER_INPUT" },
          http: {
            status: 400,
          },
        });
      }
      if (!isValidISBN(args.isbn)) {
        throw new GraphQLError("Invalid ISBN format", {
          extensions: { code: "BAD_USER_INPUT" },
          http: {
            status: 400,
          },
        });
      }
      if (!Number.isInteger(args.pageCount) || args.pageCount <= 0) {
        throw new GraphQLError("Invalid pageCount", {
          extensions: { code: "BAD_USER_INPUT" },
          http: {
            status: 400,
          },
        });
      }
      const authors = await authorsCollection();
      const author = await authors.findOne({ _id: args.authorId });
      if (!author) {
        throw new GraphQLError("Author not found", {
          extensions: { code: "NOT_FOUND" },
          http: {
            status: 400,
          },
        });
      }

      // Insert the new book into MongoDB
      const newBook = {
        _id: uuid(),
        title: args.title,
        genres: args.genres,
        publicationDate: args.publicationDate,
        publisher: args.publisher,
        summary: args.summary,
        isbn: args.isbn,
        language: args.language,
        pageCount: args.pageCount,
        price: args.price,
        format: args.format,
        authorId: args.authorId,
      };
      const books = await booksCollection();
      const result = await books.insertOne(newBook);

      if (result.acknowledged && result.insertedId) {
        authors.updateOne(
          { _id: args.authorId },
          { $push: { books: result.insertedId } }
        );
        await client.del(args.authorId.trim());
        await resolvers.Query.getAuthorById(_, author);
        await client.del("authors");
        await resolvers.Query.authors();
        await client.set(`${result.insertedId}`, JSON.stringify(newBook));
        await client.del("books");
        await resolvers.Query.books();
        return newBook;
      } else {
        throw new GraphQLError("Book insertion failed", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
          http: {
            status: 500,
          },
        });
      }
    },
    editBook: async (_, args) => {
      if (!isUUIDValid(args?._id?.trim())) {
        throw new GraphQLError(`bad author id`, {
          extensions: { code: "BAD_INPUT" },
          http: {
            status: 400,
          },
        });
      }

      const books = await booksCollection();
      const authors = await authorsCollection();
      const existingBook = await books.findOne({ _id: args._id });
      if (!existingBook) {
        throw new GraphQLError("Book not found", {
          extensions: { code: "NOT_FOUND" },
          http: {
            status: 404,
          },
        });
      }

      if (
        (args.title && !args.title.trim()) ||
        (args.genres && args.genres.some((genre) => !genre.trim())) ||
        (args.publicationDate && !isValidDate(args.publicationDate)) ||
        (args.price && isNaN(args.price)) ||
        (args.isbn && !isValidISBN(args.isbn)) ||
        (args.pageCount &&
          (!Number.isInteger(args.pageCount) || args.pageCount <= 0)) ||
        (args.authorId && !isUUIDValid(args.authorId.trim()))
      ) {
        throw new GraphQLError("Invalid input parameters", {
          extensions: { code: "BAD_USER_INPUT" },
          http: {
            status: 400,
          },
        });
      }

      if (args.authorId && args.authorId !== existingBook.authorId) {
        await authors.updateOne(
          { _id: existingBook.authorId },
          { $pull: { books: existingBook._id } }
        );

        await authors.updateOne(
          { _id: args.authorId },
          { $push: { books: existingBook._id } }
        );
      }

      const updatedBook = {
        ...existingBook,
        title: args.title || existingBook.title,
        genres: args.genres || existingBook.genres,
        publicationDate: args.publicationDate || existingBook.publicationDate,
        publisher: args.publisher || existingBook.publisher,
        summary: args.summary || existingBook.summary,
        isbn: args.isbn || existingBook.isbn,
        language: args.language || existingBook.language,
        pageCount: args.pageCount || existingBook.pageCount,
        price: args.price || existingBook.price,
        format: args.format || existingBook.format,
        authorId: args.authorId || existingBook.authorId,
      };

      const result = await books.updateOne(
        { _id: args._id },
        { $set: updatedBook }
      );

      if (result.modifiedCount === 1) {
        await client.del(`${args._id}`);
        await client.set(`${args._id}`, JSON.stringify(updatedBook));
        if (existingBook.authorId !== updatedBook.authorId) {
          await client.del(`${existingBook.authorId}`);
          await resolvers.Query.getAuthorById(_, {
            _id: existingBook.authorId,
          });
        }
        await client.del(`${updatedBook.authorId}`);
        await resolvers.Query.getAuthorById(_, { _id: updatedBook.authorId });

        await client.del("authors");
        await resolvers.Query.authors();
        await client.del("books");
        await resolvers.Query.books();

        return updatedBook;
      } else {
        throw new GraphQLError("Book update failed, No Changes", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
          http: {
            status: 500,
          },
        });
      }
    },
    removeBook: async (_, args) => {
      if (!isUUIDValid(args?._id?.trim())) {
        throw new GraphQLError(`bad author id`, {
          extensions: { code: "BAD_INPUT" },
          http: {
            status: 400,
          },
        });
      }
      const books = await booksCollection();
      const existingBook = await books.findOne({ _id: args._id });
      if (!existingBook) {
        throw new GraphQLError("Book not found", {
          extensions: { code: "NOT_FOUND" },
          http: {
            status: 404,
          },
        });
      }
      const deleteResult = await books.deleteOne({ _id: args._id });
      if (deleteResult.deletedCount === 1) {
        const authors = await authorsCollection();
        await client.del(`${args._id}`);
        await authors.updateOne(
          { _id: existingBook.authorId },
          { $pull: { books: existingBook._id } }
        );
        await resolvers.Query.getAuthorById(_, { _id: existingBook.authorId });
        await client.del("authors");
        await resolvers.Query.authors();
        await client.del("books");
        await resolvers.Query.books();
        return existingBook;
      } else {
        throw new GraphQLError("Book deletion failed", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
          http: {
            status: 500,
          },
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
    numOfBooks: async (_, args) => {
      const books = await booksCollection();
      const numOfBooks = await books.count({
        authorId: _._id,
      });
      return numOfBooks;
    },
  },
};
