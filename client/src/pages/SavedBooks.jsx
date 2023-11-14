
// Import necessary dependencies from react and react-bootstrap
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// Import the REMOVE_BOOK mutation from the utils/mutations file
import { REMOVE_BOOK } from '../utils/mutations';

// Import Auth, local storage functions, and queries from utils
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

// Define the SavedBooks component
const SavedBooks = () => {
  // Use the useQuery hook to get the user's data
  const { loading, data, refetch } = useQuery(QUERY_ME);

  // Use the useMutation hook to execute the REMOVE_BOOK mutation
  const [deleteBook, { error }] = useMutation(REMOVE_BOOK);

  // Extract the user data from the query response
  const userData = data?.me || {};

  // Create a function to handle the deletion of a saved book
  const handleDeleteBook = async (bookId) => {
    // Get the user's token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    // If there is no token, return false
    if (!token) {
      return false;
    }

    try {
      // Execute the deleteBook mutation with the bookId as a variable
      const { data } = await deleteBook({
        variables: { bookId }
      });

      // Remove the bookId from local storage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  }

  // Render the SavedBooks component
  return (
    <>
      {/* Header section */}
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>

      {/* Main content section */}
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        {/* Display saved books in a row of cards */}
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {/* Button to delete a saved book */}
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

// Export the SavedBooks component
export default SavedBooks;
