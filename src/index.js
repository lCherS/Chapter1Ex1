const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } =  request.headers;
  
  const UserExists = users.find(us => us.username === username);
  if(!UserExists) {
    return response.status(404).json({ error: "User not exists!" });
  }
  request.user = UserExists;
  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } =  request.body;

  const AlreadExists = users.find(us => us.username === username);
  if(AlreadExists) return response.status(400).json({ error: "user alread exists!"})

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const NewTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(NewTodo);

  return response.status(201).json(NewTodo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request; 
  const { title, deadline } = request.body;
  const { id } = request.params;

  const AlterTodo = user.todos.find((uid) => uid.id === id)

  if(!AlterTodo) return response.status(404).json({ error: "Todo Not Exists!"});

  AlterTodo.title = title;
  AlterTodo.deadline = new Date(deadline);

  return response.json(AlterTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const AlterTodo = user.todos.find((uid) => uid.id === id)

  if(!AlterTodo) return response.status(404).json({ error: "Todo Not Exists!"});

  AlterTodo.done = true;

  return response.json(AlterTodo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const AlterTodo = user.todos.findIndex(uid => uid.id === id)

  if(AlterTodo === -1) response.status(404).json({ error: "todo Not Exists"});
  
  user.todos.splice(AlterTodo, 1);
    

  return response.status(204).json(user);
});

module.exports = app;