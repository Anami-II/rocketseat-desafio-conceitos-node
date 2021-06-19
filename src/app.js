const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', (request, response, next) => (
  isUuid(request.params.id) 
    ? next() 
    : response.status(400).send()
))

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title='', url='', techs=[] } = request.body
  
  const repository = {
    id: uuid(),
    title,
    url,
    techs: Array.isArray(techs) ? techs : [],
    likes: 0
  }

  repositories.push(repository)

  return response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params
    
  let repository = repositories.find(item => item.id == id)
  
  if ( ! repository) {
    return response.status(400).json({ error: 'Repository not found.' })
  }
  
  const { title='', url='', techs=[] } = request.body
  
  repository = {
    ...repository,
    title,
    url,
    techs: Array.isArray(techs) ? techs : []
  }
  
  return response.status(200).json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params  

  const indice = repositories.findIndex(item => item.id == id)

  if ( ! indice) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(indice, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params  

  const repository = repositories.find(item => item.id == id)

  if ( ! repository) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repository.likes++

  return response.status(200).json(repository)
});

module.exports = app;
