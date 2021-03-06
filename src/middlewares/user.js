const UsersModel = require('../models/Users');
const { comparePermission } = require('../utils/function');

const validationEditPermission = async (req, res, next) => {
  const isAdmin = req.user.permission?.user?.includes('PUT')
  const userId = req.user.userId
  const targetUserId = req.params.id
  const targetUserPermission = req.body.permission
  const dataTargetUser = await UsersModel.findById(targetUserId)
  const targetUserActive = req.body.active
  if (userId === targetUserId) {
    const isNotChangedPermission = !targetUserPermission || comparePermission(dataTargetUser.permission, targetUserPermission)
    const isNotChangedActive = typeof targetUserActive === 'undefined' || dataTargetUser.active === targetUserActive
    if (isNotChangedPermission && isNotChangedActive) {
      next()
    } else {
      res.status(403).json({
        status: 'false',
        message: 'You can not change permissions'
      })
    }
  } else if (isAdmin) {
    next()
  } else {
    res.status(403).json({
      status: 'false',
      message: 'Your account is not allowed to access'
    })
  }
}

module.exports = {
  validationEditPermission
}