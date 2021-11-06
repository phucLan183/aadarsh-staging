const express = require('express');
const router = express.Router();
const userRoute = require('./v1/user');
const reviewRoute = require('./v1/review');
const feedbackRoute = require('./v1/feedback');
const authRoute = require('./v1/auth');
const questionRoute = require('./v1/question');
const blog = require('./v1/blog');
const tags = require('./v1/tag');

const defaultRoutes = [
  authRoute,
  userRoute,
  reviewRoute,
  feedbackRoute,
  questionRoute,
  blog,
  tags
]

defaultRoutes.forEach((route) => {
  router.use(route)
})

module.exports = router
