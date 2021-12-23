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

const validationCategory = (req, res, next) => {
  authorization(req, res, next, {
    module: permissionModules.category
  })
}

const validationProduct = (req, res, next) => {
  authorization(req, res, next, {
    module: permissionModules.product
  })
}

const validationUpload = (req, res, next) => {
  const nameFolder = req.body.folder
  if (nameFolder === 'attachments' || nameFolder === 'messages') {
    next()
  } else {
    authorization(req, res, next, {
      module: permissionModules.upload
    })
  }
}

const validationOrder = (req, res, next) => {
  authorization(req, res, next, {
    module: permissionModules.order
  })
}

module.exports = {
  validationUser,
  validationReview,
  validationQuestion,
  validationBlog,
  validationMember,
  validationCategory,
  validationProduct,
  validationUpload,
  validationOrder
}