const express = require('express');
const routes = require('./routes');

const app = express()
const port = 3333


app.use(express.json());

app.use(routes)

app.listen(port, (request, response) => {
  console.log(`Server listening on port ${port}\nhttp://localhost:${port}/`)
})
