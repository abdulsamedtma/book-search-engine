// Import necessary dependencies from react and react-bootstrap
import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

// Import the SAVE_BOOK mutation from the utils/mutations file
import { SAVE_BOOK } from '../utils/mutations';

// Import Auth and API functions from utils
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

// Import the useMutation hook from Apollo Client
import { useMutation } from '@apollo/client';

// Import the SavedBooks component
import SavedBooks from './SavedBooks';

// Define the SearchBooks component
const SearchBooks = () => {
  // Create state for holding returned Google API data
  const [searchedBooks, setSearchedBooks] = useState([]);

  // Create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // Create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // Use the useMutation hook to execute the SAVE_BOOK mutation
  const [saveBook, { data, error }] = useMutation(SAVE_BOOK);

  // Set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // Create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      // Call the searchGoogleBooks function to search for books
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      // Extract book data from the API response
      const { items } = await response.json();
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        link: book.volumeInfo.infoLink,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      // Update the state with the searched book data
      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // Create function to handle saving a book to the database
  const handleSaveBook = async (bookId) => {
    // Find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // Get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Execute the saveBook mutation with the bookToSave data
      const { data } = await saveBook({
        variables: { input: { ...bookToSave } },
      });

      // Log the mutation response
      console.log("Mutation Response:", data);

      // If the book successfully saves to the user's account, save the bookId to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  // Render the SearchBooks component
  return (
    <>
      {/* Header section */}
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          {/* Form for book search */}
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                {/* Button to submit search */}
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      {/* Main content section */}
      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        {/* Display searched books in a row of cards */}
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {/* Button to save a book */}
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
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

// Export the SearchBooks component
export default SearchBooks;
