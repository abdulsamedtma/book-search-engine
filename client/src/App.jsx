// Import necessary styles and components
import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// Import Apollo Client related dependencies
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Construct the main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql', // Your GraphQL API endpoint
});

// Construct middleware to attach the JWT token to every request
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Attach the token to the 'authorization' header
    },
  };
});

// Create an instance of the ApolloClient
const client = new ApolloClient({
  // Set up the client to execute the `authLink` middleware prior to making the request to the GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), // Use the in-memory cache for caching GraphQL data
});

// Main App component
function App() {
  return (
    // Wrap the entire application with ApolloProvider to provide the ApolloClient instance
    <ApolloProvider client={client}>
      {/* Include the Navbar component at the top of the app */}
      <Navbar />
      {/* Render the current route's component */}
      <Outlet />
    </ApolloProvider>
  );
}

// Export the App component as the default export
export default App;
