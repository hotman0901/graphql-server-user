/*
 * @Author: Benny 
 * @Date: 2018-03-10 20:03:55 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-11 21:16:05
 * schema 必須跟api的欄位名稱一樣
 */
const graphql = require('graphql');

// 不使用假資料了
// const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList } = graphql;

const axios = require('axios');
// 先做假的
// const users = [
//   { id: '1', firstName: 'a', age: 1},
//   { id: '2', firstName: 'b', age: 2},
//   { id: '3', firstName: 'c', age: 3},
//   { id: '4', firstName: 'd', age: 4},
//   { id: '5', firstName: 'e', age: 5},
// ]

// 建立companyType 必須宣告在userType之前
// 如果想要從company的查詢反推回去找user
// 要使用GraphQLList這個方法
// 又因為UserType的定義在這個方法之後，會導致取不到，所以fields要使用arrow function(整個文件完成之後才會被執行)
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
        .then(res => res.data);
      }
    }
  })
});

// 建立一個user的schema
// 先定義這個table name
// 在定義這個table有哪些欄位（fileds）
// 如果需要關聯到另外一個table，例如company，就在fields內加上company
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    // 再去關聯company資料
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        // 再拿users內的companyId去companies內查詢資料
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  }
});

// 這個qeruy是尋找user功能
// 如果你給id就回傳userType這個obj
// user 就是呼叫的方法，必須user(id: "10")
// args 就是傳入的查詢參數id
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // 查詢uer資料
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // resolve是我們要符合才要回傳的資料用

        // hard code做法
        // 這個args 就是上面傳進來的args的參數，
        // return _.find(users, { id: args.id });

        // 使用call api 做法json-server，因為是promise要用then
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data);
      }
    },
    // 查詢company資料
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
