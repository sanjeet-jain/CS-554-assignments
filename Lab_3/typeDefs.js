//Create the type definitions for the query and our data

export const typeDefs = `#graphql
type Book {
  _id: String,
  title: String,
  genres: [String],
  publicationDate: String,
  publisher: String,
  summary: String,
  isbn: String,
  language: String,
  pageCount: Int,
  price: Float,
  format: [String],
  author: Author
}

type Author {
  _id: String,
  first_name: String,
  last_name: String,
  date_of_birth: String,
  hometownCity: String,
  hometownState: String,
  numOfBooks: Int,
  books(limit: Int): [Book] 
}
`;
