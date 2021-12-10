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

// Client
const contactRoute = require('./client/contact');
const navRoute = require('./client/navigation');

const defaultRoutes = [
  authRoute,
  userRoute,
  reviewRoute,
  feedbackRoute,
  questionRoute,
  blogRoute,
  tagRoute,
  contactRoute,
  memberRoute,
  uploadRoute,
  categoryRoute,
  settingRoute,
  navRoute
]

defaultRoutes.forEach((route) => {
  router.use(route)
})

module.exports = router
