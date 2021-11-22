const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationMember } = require('../../middlewares/authValidation');
const memberController = require('../../controllers/member');

// Member
router.get('/current-member', authenticateToken, memberController.getCurrentMember)
router.get('/members', authenticateToken, validationMember, memberController.getAllMembers)
router.post('/members', authenticateToken, validationMember, memberController.createMember)
router.get('/member/:id', authenticateToken, validationMember, memberController.getOneMember)
router.put('/member/:id', authenticateToken, validationMember, memberController.updateMember)
router.delete('/member/:id', authenticateToken, validationMember, memberController.removeMember)
module.exports = router
