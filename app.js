const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
app.use(express.json());
const auth = require('./middleware/auth')
app.use(auth);
app.use("/graphql", graphqlHTTP({
  schema: require('./Graphql/schema')
  , rootValue: require('./Graphql/resolver')
  , graphiql: true
  , formatError(error) {
    //Default
    // return error;
    if (!error.originalError) {
      return error;
    }
    const data = error.originalError.data; 
    const message = error.message || ' An Error occuered';
    const code = error.originalError.code || 500;
    return { message,status:code,data}

  }
}));
app.listen(3000,()=> console.log("Port listening on 3000"))