const {dogRouter} = require('./routes/dogs');

const express = require('express');
require('express-async-errors');

const app = express();
app.use('/static', express.static('assets'));
app.use(express.json());

//logger function
const logger = (req, res, next) => {
  console.log(req.method);
  console.log(req.url);
  res.on('finish', () => {
    console.log(res.statusCode);
  })
  next();
}

//Put the very top so any method or route will be using logger middleware function
app.use(logger);

app.use('/dogs', dogRouter);

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  console.log(req.body);
  res.status(200).json(req.body);
  // next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

//Resource Not Found middleware
const notFound = (req, res) => {
  const error = new Error("The requested resource couldn't be found.");
  error.statusCode = 404;
  throw error;
}

app.use(notFound);

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
