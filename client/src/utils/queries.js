import { gql } from '@apollo/client';

// Define a GraphQL query to fetch the user's information and saved books
export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;
