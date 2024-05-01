const {createServer} = require('node:http')
const {  createSchema, createYoga } = require('graphql-yoga');
const todos = require('./todolist');


const yoga = createYoga({
    schema: createSchema({
   typeDefs :`
    type Todo {
      id: ID!
      title: String!
      done: Boolean!
    }
  
    type Query {
      allTodos: [Todo!]!
    }
  
    type Mutation {
      createTodo(title: String!, done: Boolean!): Todo!
      updateTodo(id: ID!, done: Boolean!): Todo!
      deleteTodo(id: ID!): Todo!
    }
  `,
  
  resolvers : {
    Query: {
      allTodos: () => todos,
    },
    Mutation: {
      createTodo: (_, { title, done }) => {
        const todo = {
          id: todos.length,
          title,
          done
        };
        todos.push(todo);
        return todo;
      },
      updateTodo: (_, { id, done }) => {
        const todo = todos.find(todo => todo.id == id);
        todo.done = done;
        return todo;
      },
      deleteTodo: (_, { id }) => {
        const todoIndex = todos.findIndex(todo => todo.id == id);
        const todo = todos[todoIndex];
        todos.splice(todoIndex, 1);
        return todo;
      }
    }
  }
})
})

const server = createServer(yoga)

server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql')
  })