const express = require('express');
const validator = require('validator');
const pizzaData = require('../pizzadetails.json');
const PizzaPrice = require('../price-calculator');
const Order = require('../models/orderModel');
const router = express.Router();

const crustTypes = pizzaData.crustTypes;

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
    if(!req.body.customerInfo || !req.body.customerInfo.name || !req.body.customerInfo.phone || !req.body.customerInfo.address || !req.body.customerInfo.city || !req.body.customerInfo.postal) {
        return res.status(400).json({
            msg: "Invalid order information"
        });
    }

    const name = req.body.customerInfo.name.trim();
    const phone = req.body.customerInfo.phone.trim().replace(/-/g, '');
    const address = req.body.customerInfo.address.trim();
    const city = req.body.customerInfo.city.trim();
    const postal = req.body.customerInfo.postal.trim();   
    const addressPattern = /\d+\s[\d\w]+\s(.*)/mg;
    const addressResult = addressPattern.test(address);
    let invalidInputMessage = '';

    if (!validator.isAlpha(name.replace(/ /g, ''))) {
        invalidInputMessage = "You entered an invalid name.";

    } else if (!validator.isMobilePhone(phone, 'en-CA')) {
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
    order.customerInfo.phone = phone;
    order.customerInfo.postal= postal.charAt(3) !== ' ' ? postal.slice(0, 3) + ' ' + postal.slice(3) : postal;
    console.log(order.customerInfo.postal);
    const pizzaPrice = new PizzaPrice(order.pizzaDetails.size, order.pizzaDetails.toppings, order.pizzaDetails.quantity);
    const subtotal = pizzaPrice.calculateSubtotal();
    const tax = pizzaPrice.calculateTax();
    const total = parseFloat((subtotal + tax).toFixed(2));
    const deliveryDelay = Math.floor((Math.random() * 25) + 30);

    Order.estimatedDocumentCount((err, count) => {
        if(err) {
            res.status(500).json({status: "Error getting the documents count"});
            return;
        }
        
        order.orderId = 101 + count;
        order.pizzaDetails.subtotal = subtotal;
        order.pizzaDetails.tax = tax;
        order.pizzaDetails.total = total;
        order.pizzaDetails.deliveryTimeInMin = deliveryDelay;

        order.save((err) => {
            if(err) {
                res.status(500).json({status: "Error adding the order information"});
                return;
            }
    
            res.json({status: "Added an order"});
        });
    });
});

router.get('/api/orders', (req, res) => {
    let query;

    if(req.query.searchQuery) {
        const searchQueryJS = JSON.parse(req.query.searchQuery);
        const fname = searchQueryJS.fname;
        const lname = searchQueryJS.lname;
        const phone = searchQueryJS.phone;
        const name = fname.toLowerCase() + ' ' + lname.toLowerCase();    

        if(fname !== '' && lname !== '' && phone !== '') {     
            query = Order.find({ "customerInfo.name": { $regex: new RegExp('^' + name, 'i') }, "customerInfo.phone": phone }).sort({ orderId: -1 });

        } else if(fname !== '' && lname !== '') {     
            query = Order.find({ "customerInfo.name": { $regex: new RegExp('^' + name, 'i') } }).sort({ orderId: -1 });

        } else if(fname !== '' && phone !== '') {        
            query = Order.find({ "customerInfo.name": { $regex: new RegExp('^' + fname.toLowerCase(), 'i') }, "customerInfo.phone": phone }).sort({ orderId: -1 });

        } else if(lname !== '' && phone !== '') {        
            query = Order.find({ "customerInfo.name": { $regex: new RegExp(lname.toLowerCase() + '$', 'i') }, "customerInfo.phone": phone }).sort({ orderId: -1 });

        } else if(fname !== '') {    
            query = Order.find({ "customerInfo.name": { $regex: new RegExp('^' + fname.toLowerCase(), 'i') }}).sort({ orderId: -1 });

        } else if(lname !== '') {    
            query = Order.find({ "customerInfo.name": { $regex: new RegExp(lname.toLowerCase() + '$', 'i') }}).sort({ orderId: -1 });

        } else if(phone !== '') {            
            query = Order.find({ "customerInfo.phone": phone }).sort({ orderId: -1 });

        } else {
            query = Order.find({}).sort({ orderId: -1 });
        }        

    } else {
        query = Order.find({}).sort({ orderId: -1 });

    }    

    query.limit(10);

    query.exec((err, orders) => {
        if(err) {
            res.status(500).json({status: "Error retrieveing orders"});
            return;            
        }

        res.json(orders);
    });
});

module.exports = router;