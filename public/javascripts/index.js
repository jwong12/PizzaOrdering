$(function ready() {  
    $('#clearForm').click(function() {
        $('#name').val('');
        $('#phone').val('');
        $('#address').val('');
        $('#city').val('');
        $('#postal').val('');
    });

    $("#submitForm").submit(function (event) {
        event.preventDefault();

        const confirmBox = new jBox('Confirm', {
            title: 'Order Confirmation',
            content: 'Do you want to submit this order?',
            confirmButton: 'Yes',
            cancelButton: 'No',
            cancel: () => { 
                $('#statusMsg').removeClass(); 
                $('#statusMsg').empty(); 
            },
            confirm: () => {
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

        confirmBox.open();      
    });
});
