const express = require('express');
const router = express.Router();
const navController = require('../../controllers/navigation');

router.get('/navigations', navController.getNavigations)
router.get('/navigation', navController.getNavigation)

module.exports = router
