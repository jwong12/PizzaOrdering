const express = require('express');
const pizzaData = require('../pizzadetails.json');
const PizzaPrice = require('../price-calculator');
const Order = require('../models/orderModel');
const router = express.Router();

const crustTypes = pizzaData.crustTypes;
let orderIDCounter = 101;

router.get('/', function(req, res, next) {
    const large = pizzaData.sizes.large.description;
    const medium = pizzaData.sizes.medium.description;
    const small = pizzaData.sizes.small.description;
    const personal = pizzaData.sizes.personal.description;
    const largePrice = pizzaData.sizes.large.price;
    const mediumPrice = pizzaData.sizes.medium.price;
    const smallPrice = pizzaData.sizes.small.price;
    const personalPrice = pizzaData.sizes.personal.price;
    const toppingTypes = pizzaData.toppingTypes;
    const toppingPrice = pizzaData.toppingPriceAfterFirstTwo.toFixed(2);

    res.render('index', { title: 'Order Pizza', large, largePrice, medium, mediumPrice, small, smallPrice, personal, personalPrice, crustTypes, toppingTypes, toppingPrice });
});
  
router.get('/orders', function(req, res, next) {
    res.render('orders', { title: 'Order listing' });
});

router.post('/api/orders', (req, res) => {
    console.log('Received a body ', req.body);
    let valid = true;

    if (valid) 
    {
        const order = new Order(req.body);
        const pizzaPrice = new PizzaPrice(order.pizzaDetails.size, order.pizzaDetails.toppings, order.pizzaDetails.quantity);
        const subtotal = pizzaPrice.calculateSubtotal();
        const tax = pizzaPrice.calculateTax();
        const total = parseFloat((subtotal + tax).toFixed(2));
        const deliveryDelay = Math.floor((Math.random() * 25) + 30);

        order.orderId = orderIDCounter++;
        order.pizzaDetails.subtotal = subtotal;
        order.pizzaDetails.tax = tax;
        order.pizzaDetails.total = total;
        order.pizzaDetails.deliveryTimeInMin = deliveryDelay;
        console.log(order);
    }
});

module.exports = router;