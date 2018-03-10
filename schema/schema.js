const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
}  = graphql;


// 先做假的
const users = [
  { id: '1', firstName: 'a', age: 1},
  { id: '2', firstName: 'b', age: 2},
  { id: '3', firstName: 'c', age: 3},
  { id: '4', firstName: 'd', age: 4},
  { id: '5', firstName: 'e', age: 5},
]

// 建立一個user的schema
// 先定義這個table name
// 在定義這個table有哪些欄位（fileds）
const UserType = new GraphQLObjectType({
  name: 'User',
  fields:{
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  }
})


// 這個qeruy是尋找user功能
// 如果你給id就回傳userType這個obj
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { 
        id: { type: GraphQLString }
      },
      resolve(parentValue, args){
        // 這個args 就是上面傳進來的args的參數
        return _.find(users, { id: args.id });
      }
    }
    
  }
});



module.exports = new GraphQLSchema({
  query: RootQuery
})