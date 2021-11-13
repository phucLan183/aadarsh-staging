const express = require('express');
const router = express.Router();
const userRoute = require('./server/user');
const reviewRoute = require('./server/review');
const feedbackRoute = require('./server/feedback');
const authRoute = require('./server/auth');
const questionRoute = require('./server/question');
const blogRoute = require('./server/blog');
const tagRoute = require('./server/tag');

const contactRoute = require('./client/contact');

const defaultRoutes = [
  authRoute,
  userRoute,
  reviewRoute,
  feedbackRoute,
  questionRoute,
  blogRoute,
  tagRoute,
  contactRoute
]

defaultRoutes.forEach((route) => {
  router.use(route)
})

module.exports = router
