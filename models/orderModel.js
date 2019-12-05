const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: Number,
    pizzaDetails: {
        size: String,
        crust: String,
        toppings: [String],
        quantity: Number,
        subtotal: Number,
        tax: Number,
        total: Number,
        date: { type: Date, default: Date.now },
        deliveryTimeInMin: Number
    },
    customerInfo: {
        name: String,
        phone: String,
        address: String,
        city: String,
        postal: String
    }
});

module.exports = mongoose.model('Order', orderSchema);