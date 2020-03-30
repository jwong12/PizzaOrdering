$(function ready() {   
    const months = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    $.getJSON("/api/orders", function(data) {
        $("#orders").empty();
        $("#orders").append("<tr><th>Order Id</th><th id='th-name'>Customer Name</th><th>Phone Number</th><th id='th-address'>Address</th><th id='th-pizza'>Pizza Details</th></tr>");

        data.forEach(function (item) {
            const date = new Date(item.pizzaDetails.date);
            const formatDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()}`

            $("#orders").append(`<tr><td>${item.orderId}</td>
                                    <td>${item.customerInfo.name}</td>
                                    <td>${formatPhone(item.customerInfo.phone)}</td>
                                    <td>${item.customerInfo.address},<br/>${item.customerInfo.city},<br/><span id="postal">BC ${item.customerInfo.postal}</span></td>
                                    <td id="pizza-details">size: ${item.pizzaDetails.size}<br/>crust: ${item.pizzaDetails.crust}<br/>toppings: ${item.pizzaDetails.toppings.join(', ')}<br/>quantity: ${item.pizzaDetails.quantity}<br/>subtotal: $${item.pizzaDetails.subtotal}<br/>tax: $${item.pizzaDetails.tax}<br/>total: $${item.pizzaDetails.total}<br/>date ordered: ${formatDate}<br/>delivery time: ${item.pizzaDetails.deliveryTimeInMin} min</td></tr>`)
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
            $("#orders").append("<tr><th>Order Id</th><th id='th-name'>Customer Name</th><th>Phone Number</th><th id='th-address'>Address</th><th id='th-pizza'>Pizza Details</th></tr>");

            data.forEach(function (item) {
                const date = new Date(item.pizzaDetails.date);
                const formatDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()}`

                $("#orders").append(`<tr><td>${item.orderId}</td>
                                        <td>${item.customerInfo.name}</td>
                                        <td>${formatPhone(item.customerInfo.phone)}</td>
                                        <td>${item.customerInfo.address},<br/>${item.customerInfo.city},<br/><span id="postal">BC ${item.customerInfo.postal}</span></td>
                                        <td id="pizza-details">size: ${item.pizzaDetails.size}<br/>crust: ${item.pizzaDetails.crust}<br/>toppings: ${item.pizzaDetails.toppings.join(', ')}<br/>quantity: ${item.pizzaDetails.quantity}<br/>subtotal: $${item.pizzaDetails.subtotal}<br/>tax: $${item.pizzaDetails.tax}<br/>total: $${item.pizzaDetails.total}<br/>date ordered: ${formatDate}<br/>delivery time: ${item.pizzaDetails.deliveryTimeInMin} min</td></tr>`)
            });
        });
    });
});

function formatPhone(phone) {
    if(phone.length === 11) {
        return phone.slice(1,4) + '-' + phone.slice(4,7) + '-' + phone.slice(7);
    } 

    return phone.slice(0,3) + '-' + phone.slice(3,6) + '-' + phone.slice(6);
}