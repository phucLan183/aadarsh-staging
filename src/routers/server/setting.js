const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const settingController = require('../../controllers/setting');

router.get('/setting', settingController.getOneSetting)
router.put('/setting', authenticateToken, settingController.updateSetting)

module.exports = router