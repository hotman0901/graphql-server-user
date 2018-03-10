const express = require('express');
const expressGraphQL = require('express-graphql');
const routes = require('./routes/index');
const schema = require('./schema/schema');

const app = express();

// 如果進入點是graphQL都要使用expressGraphQL
// use middleware
// 使用expressGraphQL，必須增加schema
app.use('/graphql', expressGraphQL({
  schema,
  graphiql:true
}));

// 自定義router
app.use('/', routes);

app.listen(4000, () => {
  console.log('server start 4000')
})