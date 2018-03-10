const graphql = require('graphql');

// 不使用假資料了
// const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
}  = graphql;

const axios = require('axios');


// 先做假的
// const users = [
//   { id: '1', firstName: 'a', age: 1},
//   { id: '2', firstName: 'b', age: 2},
//   { id: '3', firstName: 'c', age: 3},
//   { id: '4', firstName: 'd', age: 4},
//   { id: '5', firstName: 'e', age: 5},
// ]

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
        // resolve是我們要符合才要回傳的資料用

        // hard code做法
        // 這個args 就是上面傳進來的args的參數，
        // return _.find(users, { id: args.id });

        // 使用call api 做法json-server，因為是promise要用then
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data)
      }
    }
  }
});



module.exports = new GraphQLSchema({
  query: RootQuery
})