module.exports = typeDefs = `
    type Query {
        me: User
    }

    type User {
        _id: ID
        username: String
        email: String
        bookcount: Int
        savedBooks: [Books]
    }

    type Auth {
        token: ID!
        user: User
    }

    type Book {
        bookId: String
        authors: [String]
        title: String
        description: String
        image: String
        link: String
    }

    input BookInput {
        bookId: String
        authors: [String]
        title: String
        description: String
        image: String
        link: String
    }

    type Mutation {
        login(email: String!, passowrd: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookData: BookInout!): User
        removeBook(bookId: ID!): User
    }
`;

