const express = require('express');
//apollo Server for graphql
const {ApolloServer} = require('apollo-server-express')
const path = require('path');
//require schemas, typeDefs & resolvers for Graphql
const {typeDefs, resolvers} = require('./schemas')
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
// routes for restful API
//const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3001;
//server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
})

//extended from true (restful) to false (graphql)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
//same as restful
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
//app no longer uses routes here
//app.use(routes);

//create a new instance of an Apollo server using graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //apply middleware
  //apply 
  server.applyMiddleware({app})

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    //graphql path
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
}
startApolloServer(typeDefs, resolvers);