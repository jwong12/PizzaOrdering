$(function ready() {    
    $.getJSON("/api/orders", function(data) {
        $("#orders").empty();
        $("#orders").append("<tr><th>Order Id</th><th>Customer Name</th><th>Phone Number</th><th id='th-address'>Address</th><th id='th-pizza'>Pizza Details</th></tr>");

        data.forEach(function (item) {
            $("#orders").append(`<tr><td>${item.orderId}</td>
                                    <td>${item.customerInfo.name}</td>
                                    <td>${item.customerInfo.phone}</td>
                                    <td>${item.customerInfo.address},<br/>${item.customerInfo.city},<br/><span id="postal">BC ${item.customerInfo.postal}</span></td>
                                    <td id="pizza-details">size: ${item.pizzaDetails.size}<br/>crust: ${item.pizzaDetails.crust}<br/>toppings: ${item.pizzaDetails.toppings.join(', ')}<br/>quantity: ${item.pizzaDetails.quantity}<br/>subtotal: $${item.pizzaDetails.subtotal}<br/>tax: $${item.pizzaDetails.tax}<br/>total: $${item.pizzaDetails.total}<br/>delivery time: ${item.pizzaDetails.deliveryTimeInMin} min</td></tr>`)
        });
    });

    $("#search").submit(function (event) {
        event.preventDefault();

        const searchQuery = JSON.stringify({
            fname: $('#fname').val(),
            lname: $('#lname').val(),
            phone: $('#phone').val()
        });

        $.getJSON("/api/orders", 
        {
            searchQuery
        },
        function(data) {
            $("#orders").empty();
            $("#orders").append("<tr><th>Order Id</th><th>Customer Name</th><th>Phone Number</th><th id='th-address'>Address</th><th id='th-pizza'>Pizza Details</th></tr>");

            data.forEach(function (item) {
                $("#orders").append(`<tr><td>${item.orderId}</td>
                                        <td>${item.customerInfo.name}</td>
                                        <td>${item.customerInfo.phone}</td>
                                        <td>${item.customerInfo.address},<br/>${item.customerInfo.city},<br/><span id="postal">BC ${item.customerInfo.postal}</span></td>
                                        <td id="pizza-details">size: ${item.pizzaDetails.size}<br/>crust: ${item.pizzaDetails.crust}<br/>toppings: ${item.pizzaDetails.toppings.join(', ')}<br/>quantity: ${item.pizzaDetails.quantity}<br/>subtotal: $${item.pizzaDetails.subtotal}<br/>tax: $${item.pizzaDetails.tax}<br/>total: $${item.pizzaDetails.total}<br/>delivery time: ${item.pizzaDetails.deliveryTimeInMin} min</td></tr>`)
            });
        });
    });
});