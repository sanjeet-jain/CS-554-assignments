import { gql } from "@apollo/client";

export const GET_COMICS = gql`
  query Query($test: Int) {
    test(test: $test)
  }
`;

// At minimum, every comic's individual page should show its title, an Image, the description, their onSaleDate, and their printPrice.
