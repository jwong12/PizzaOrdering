const express = require('express');
const validator = require('validator');
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
    // console.log('Received a body ', req.body);
    const name = req.body.customerInfo.name.trim();
    const phone = req.body.customerInfo.phone.trim();
    const address = req.body.customerInfo.address.trim();
    const city = req.body.customerInfo.city.trim();
    const postal = req.body.customerInfo.postal.trim();   
    const addressPattern = /\d+\s[\d\w]+\s(.*)/mg;
    const addressResult = addressPattern.test(address);
    let invalidInputMessage = '';
    // console.log(name, phone, address, city, postal, addressResult);

    if (!validator.isAlpha(name.replace(/ /g, ''))) {
        invalidInputMessage = "You entered an invalid name.";

    } else if (!validator.isMobilePhone(phone.replace(/-/g, ''), 'en-CA')) {
        invalidInputMessage = "You entered an invalid phone number.";

    } else if (!addressResult){
        invalidInputMessage = "You entered an invalid address.";

    } else if (!validator.isAlpha(city.replace(/ /g, ''))) {
        invalidInputMessage = "You entered an invalid city.";

    } else if (!validator.isPostalCode(postal, "CA")) {
        invalidInputMessage = "You entered an invalid postal code.";
    }

    if (invalidInputMessage !== '') 
    {
        return res.status(400).json({status: "Invalid customer information", msg : invalidInputMessage});
    }

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
    // console.log(order);

    order.save((err) => {
        if(err) {
            res.status(500).json({status: "Error adding the order information"});
            return;
        }

        res.json({status: "Added an order"});
    });
});

router.get('/api/orders', (req, res) => {
    let query;

    if(req.query.searchQuery !== null && req.query.searchQuery !== undefined) {
        const searchQueryJS = JSON.parse(req.query.searchQuery);
        const name = searchQueryJS.name;
        const phone = searchQueryJS.phone;

        if(name !== '' && phone !== '') {            
            query = Order.find({ "customerInfo.name": { $regex: new RegExp('^' + name.toLowerCase(), 'i') }, "customerInfo.phone": phone });

        } else if(name !== '') {            
            query = Order.find({ "customerInfo.name": { $regex: new RegExp('^' + name.toLowerCase(), 'i') }});

        } else if(phone !== '') {            
            query = Order.find({ "customerInfo.phone": phone });

        } else {
            query = Order.find({});

        }        

    } else {
        query = Order.find({});

    }    

    query.limit(10);
    query.exec((err, orders) => {
        if(err) {
            res.status(500).json({status: "Error retrieveing orders"});
            return;            
        }
        console.log(orders);
        res.json(orders);
    });
})


module.exports = router;