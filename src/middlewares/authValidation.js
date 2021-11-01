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
module.exports = {
  validationUser,
  validationReview
}