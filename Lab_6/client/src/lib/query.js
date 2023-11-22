import { gql } from "@apollo/client";

export const GET_COMICS = gql`
  query GetComics($pageNum: Int!) {
    comics(pageNum: $pageNum) {
      id
      title
      images {
        path
        extension
      }
      description
      dates {
        type
        date
      }
      prices {
        type
        price
      }
    }
  }
`;

export const GET_COMIC = gql`
  query GetComic($id: Int) {
    comic(id: $id) {
      id
      title
      id
      title
      images {
        path
        extension
      }
      description
      dates {
        type
        date
      }
      prices {
        type
        price
      }
    }
  }
`;

// At minimum, every comic's individual page should show its title, an Image, the description, their onSaleDate, and their printPrice.
