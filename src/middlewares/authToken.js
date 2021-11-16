const jwt = require('jsonwebtoken');
const config = require('../config')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['x-token']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)
  jwt.verify(token, config.accessToken, (err, user) => {
    if (err || user.active === false) return res.sendStatus(401)
    req.user = user
    next()
  })
}

const authenticateRefreshToken = (req, res, next) => {
  const authHeader = req.headers['x-refresh-token']
  const refreshToken = authHeader && authHeader.split(' ')[1]
  if (!refreshToken) return res.sendStatus(401)
  jwt.verify(refreshToken, config.refreshToken, (err, user) => {
    if (err || user.active === false) return res.sendStatus(401)
    req.user = {
      ...user,
      refreshToken: refreshToken
    }
    next()
  })
}

const authorization = (req, res, next, data) => {
  const { permission } = req.user
  const isAccessPermission = permission && permission?.[data.module]?.includes(req.method)
  if (!isAccessPermission) {
    res.status(403).json({
      status: 'false',
      message: 'Tài khoản không có quyền!'
    })
  }
  next()
}

const authenticateResetToken = (req, res, next) => {
  const authHeader = req.headers['x-reset-token']
  const resetToken = authHeader && authHeader.split(' ')[1]
  if (!resetToken) return res.sendStatus(401)
  jwt.verify(resetToken, config.resetToken, (err, user) => {
    if (err) return res.sendStatus(401)
    req.user = user
    next()
  })
}

module.exports = {
  authenticateToken,
  authenticateRefreshToken,
  authorization,
  authenticateResetToken
}