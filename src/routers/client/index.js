const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contact');
const blogController = require('../../controllers/blog');
const navController = require('../../controllers/navigation');
const tagController = require('../../controllers/tag');
const settingController = require('../../controllers/setting')

router.get('/navigations', navController.getNavigations)

router.get('/navigation', navController.getNavigation)

router.post('/contact', contactController)

router.get('/client/blogs', blogController.getAllBlogInClient)

router.get('/client/tags', tagController.getAllTags)

router.get('/client/setting', settingController.getOneSetting)

module.exports = router