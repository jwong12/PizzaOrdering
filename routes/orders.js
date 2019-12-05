const express = require('express');
const Order = require('../models/orderModel');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Order Pizza' });
});
  
router.get('/orders', function(req, res, next) {
    res.render('orders', { title: 'Order listing' });
});

module.exports = router;