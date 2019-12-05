
const pizzaData = require('./pizzadetails.json');
const PSTTax = 0.12;

module.exports = class PriceCalculator {
    constructor(sizeSelected, toppingsSelected, quantity) {
        this.size = sizeSelected;
        this.toppings = [];
        this.quantity = parseInt(quantity);

        if((typeof toppingsSelected) === 'string') {
            this.toppings[0] = toppingsSelected;

        } else {
            this.toppings = toppingsSelected;
        }
    }

    calculateSubtotal() {
        let price = 0;
        let toppingsQty = 0;

        if (pizzaData.sizes.large.description.toLowerCase().includes(this.size)) {
            price += pizzaData.sizes.large.price;

        } else if (pizzaData.sizes.medium.description.toLowerCase().includes(this.size)) {
            price += pizzaData.sizes.medium.price;

        } else if (pizzaData.sizes.small.description.toLowerCase().includes(this.size)) {
            price += pizzaData.sizes.small.price;
            
        } else if (pizzaData.sizes.personal.description.toLowerCase().includes(this.size)) {
            price += pizzaData.sizes.personal.price;
        }

        if(this.toppings !== null && this.toppings !== undefined && (toppingsQty=this.toppings.length) > 2) {
            price += ((toppingsQty - 2) * pizzaData.toppingPriceAfterFirstTwo);
        }

        return parseFloat(this.orderPrice = (price * this.quantity).toFixed(2));
    }

    calculateTax = () => parseFloat((this.orderPrice * PSTTax).toFixed(2)); 
}