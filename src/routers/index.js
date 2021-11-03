const express = require('express');
const router = express.Router();
const userRoute = require('./v1/user')
const reviewRoute = require('./v1/review')
const feedbackRoute = require('./v1/feedback')
const authRoute = require('./v1/auth')
const questionRoute = require('./v1/question')

const defaultRoutes = [
  {
    route: authRoute
  },
  {
    route: userRoute
  },
  {
    route: reviewRoute
  },
  {
    route: feedbackRoute
  },
  {
    route: questionRoute
  }
]

defaultRoutes.forEach((route) => {
  router.use(route.route)
})

module.exports = router
