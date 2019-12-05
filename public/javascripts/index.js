$(function ready() {
    $("#submitForm").submit(function (event) {
        event.preventDefault();

        const toppingsSelected = [];
        $('.topping :checked').each(function() {
            toppingsSelected.push($(this).val());
        });

        const orderDetails = JSON.stringify({
            pizzaDetails: {
                size: $('input[name="size"]:checked').val(),
                crust: $('input[name="crust"]:checked').val(),
                toppings: toppingsSelected,
                quantity: $('select[name="quantity"] :selected').val()
            },
            customerInfo: {
                name: $('#name').val(),
                phone: $('#phone').val(),
                address: $('#address').val(),
                city: $('#city').val(),
                postal: $('#postal').val()    
            }                
        });

        $.ajax({
            url: '/api/orders',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: orderDetails,
            success: function (json, status, request) {
                // $('#statusMsg').removeClass();
                // $('#statusMsg').addClass('alert alert-success');
                // $('#statusMsg').html('Added the course!!!!');
                console.log('Request succeeded');
            },
            error: function (request, status) {
                // $('#statusMsg').removeClass();
                // $('#statusMsg').addClass('alert alert-danger');
                // $('#statusMsg').html('Error adding the course');
                console.log('Request failed : ', status);
            }
        });
    });
});
