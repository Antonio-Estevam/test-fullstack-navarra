const express = require('express');
const routes = require('./routes');

const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require('./swagger.json')

const app = express()
const port = 3333


app.use(express.json());

app.use(routes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.listen(port, (request, response) => {
  console.log(`Server listening on port ${port}\nhttp://localhost:${port}/`)
})
