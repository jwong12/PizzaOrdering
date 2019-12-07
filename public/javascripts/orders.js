$(function ready() {
    $.getJSON("/api/orders", function(data) {
        data.forEach(function (item) {
            $('#orders').append(`<tr><td>${item.orderId}</td>
                                    <td>${item.customerInfo.name}</td>
                                    <td>${item.customerInfo.phone}</td>
                                    <td>${item.customerInfo.address},<br/>${item.customerInfo.city},<br/><span id="postal">BC ${item.customerInfo.postal}</span></td>
                                    <td id="pizza-details">size: ${item.pizzaDetails.size}<br/>crust: ${item.pizzaDetails.crust}<br/>toppings: ${item.pizzaDetails.toppings.join(', ')}<br/>quantity: ${item.pizzaDetails.quantity}<br/>subtotal: ${item.pizzaDetails.subtotal}<br/>tax: ${item.pizzaDetails.tax}<br/>total: ${item.pizzaDetails.total}</td></tr>`)
        });
    });
});