const {gql} =require('apollo-server-express');

const typeDefs = gql`
    
    type User {
        _id: ID
        username: String
        email: String
        // password?
        bookCount: Int
        savedBooks: [Book]!
    }
    type Book {
        bookId: ID
        bookTitle: String
        bookAuthor: [String]
        bookDescription: String
        bookImage: String
        bookLink: String

    }
    input saveBookToUser {
        bookId: String
        bookTitle: String
        bookAuthor: [String]
        bookDescription: String
        bookImage: String
        bookLink: String
    }
    type Auth{
        token: ID!
        user: User
    }
    
    type Query{
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: saveBookToUser): User
        removeBook(bookId: ID!): User
    }
`