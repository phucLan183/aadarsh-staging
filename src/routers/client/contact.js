const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contact');
const navigationController = require('../../controllers/navigation');

router.get('/navigation', navigationController)
router.post('/contact', contactController)

module.exports = router