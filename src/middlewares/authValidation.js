const { permissionModules } = require('../common/static');
const { authorization } = require('./authToken');

const validationUser = (req, res, next) => {
  authorization(req, res, next, {
    module: permissionModules.user
  })
}

const validationReview = (req, res, next) => {
  authorization(req, res, next, {
    module: permissionModules.review
  })
}

const validationQuestion = (req, res, next) => {
  authorization(req, res, next, {
    module: permissionModules.question
  })
}

const validationBlog = (req, res, next) => {
  authorization(req, res, next, {
    module: permissionModules.blog
  })
}

const validationMember = (req, res, next) => {
  authorization(req, res, next, {
    module: permissionModules.member
  })
}

module.exports = {
  validationUser,
  validationReview,
  validationQuestion,
  validationBlog,
  validationMember
}