var { buildSchema } = require("graphql")
module.exports = buildSchema(`
   type Post {
    title: String!
    content: String!
    imageUrl: String!
   }
  type User {
    _id: ID
    name: String!
    email: String!
    status: String
  }
  type PostData {
    posts : [Post!]!
    totalPosts: Int!
  }
  input userInput {
    email: String!
    name: String!
    password: String!
  }
  input postInputData {
    title:String!
    content: String!
    imageUrl: String!
  }
  type AuthData {
    token: String!
    userId: String!
  }
  type RootQuery {
    login(email:String!,pasword:String!): AuthData
    getPost(page:Int!): PostData
  }

  type RootMutation {
    createUser(userInput: userInput): User!
    createPost(postInput:postInputData):Post!
    updatePost(id:ID!,postInput:postInputData):Post!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
