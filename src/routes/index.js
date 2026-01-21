const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const catalogController = require('../controllers/catalogController');

router.get('/', homeController.index);
router.get('/catalogo', catalogController.index);

module.exports = router;
