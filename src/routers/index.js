const express = require('express');
const router = express.Router();
// Server
const userRoute = require('./server/user');
const reviewRoute = require('./server/review');
const feedbackRoute = require('./server/feedback');
const authRoute = require('./server/auth');
const questionRoute = require('./server/question');
const blogRoute = require('./server/blog');
const tagRoute = require('./server/tag');
const memberRoute = require('./server/member');
const uploadRoute = require('./server/upload');
const categoryRoute = require('./server/category');
const settingRoute = require('./server/setting');
const productRoute = require('./server/product');

// Client
const clientRoute = require('./client');

const defaultRoutes = [
  authRoute,
  userRoute,
  reviewRoute,
  feedbackRoute,
  questionRoute,
  blogRoute,
  tagRoute,
  memberRoute,
  uploadRoute,
  categoryRoute,
  settingRoute,
  productRoute,
  clientRoute
]

defaultRoutes.forEach((route) => {
  router.use(route)
})

module.exports = router
