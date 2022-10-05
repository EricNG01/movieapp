const path = require('path')
const express = require('express')
require("dotenv").config()
const app = express()

// const hostname = '127.0.0.1';
const port = process.env.PORT
const hostname = process.env.ADDRESS

// Serve out any static assets correctly
app.use(express.static('../client/build'))

// New api routes should be added here.
// It's important for them to be before the `app.use()` call below as that will match all routes.
const TMDbRouter = require('./routes/TMDb');
app.use('/default/', TMDbRouter)
app.use('/keyword/', TMDbRouter)

const youtubeRouter = require('./routes/youtube_search')
app.use('/preview/', youtubeRouter)

const movieReviewRouter = require('./routes/movieReview')
app.use('/review/', movieReviewRouter)

const counterRouter = require('./routes/counter')
app.use('/counter/', counterRouter)


// Any routes that don't match on our static assets or api should be sent to the React Application
// This allows for the use of things like React Router
app.get((req, res) => {
  res.sendFile(path.resolve('../client/build/index.html'));
  // res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
})


app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`)
})
