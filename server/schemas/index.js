// Add typeDefs and resolvers to the index.js file in the schemas folder so they can be exported for use in the server.js file.
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

module.exports = { typeDefs, resolvers };