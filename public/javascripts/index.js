$(function ready() {  
    $("#submitForm").submit(function (event) {
        event.preventDefault();

        const result = confirm("Do you want to confirm the order?");

        if(result) {
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
                    $('#statusMsg').removeClass();
                    $('#statusMsg').addClass('alert-success');
                    $('#statusMsg').html('The order was submitted successfully.');
                },            
                error: function (request, status) {
                    $('#statusMsg').removeClass();
                    $('#statusMsg').addClass('alert-danger');
                    $('#statusMsg').html(request.responseJSON.msg);
                    console.log('Request failed : ', request.responseJSON.status);
                }
            });
        }        
    });
});
