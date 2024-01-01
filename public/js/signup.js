// add action listner to the form
document.getElementById('signup_form').addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    // Check Email
    $.ajax({
        url: '/check-email-customer',
        type: 'POST',
        async: false,
        data: {
            email: $('#email').val()
        },
        success: function (data) {
            if (data.taken == true) {
                valid = false;
                alertify.alert("Email already exists, try to signin.").set('frameless', true);
            }
        }
    });
    // Check SSN
    $.ajax({
        url: '/check-ssn-customer',
        type: 'POST',
        async: false,
        data: {
            ssn: $('#ssn').val()
        },
        success: function (data) {
            if (data.taken == true) {
                valid = false;
                alertify.alert("SSN already exists, try to signin.").set('frameless', true);
            }
        }
    });
    // Check phone_no
    $.ajax({
        url: '/check-phone_no-customer',
        type: 'POST',
        async: false,
        data: {
            phone_no: $('#phone_no').val()
        },
        success: function (data) {
            if (data.taken == true) {
                valid = false;
                alertify.alert("phone_no already exists.").set('frameless', true);
            }
        }
    });
    // Check Password
    if ($('#pass1').val() != $('#pass2').val()) {
        valid = false;
        alertify.alert("Passwords do not match.").set('frameless', true);
    }
    // If all valid signUp
    if (valid === true) {
        $.ajax({
            url: "/signup",
            type: 'post',
            async: false,
            data: $("#signup_form").serialize(),
            success: function (data) {
                console.log(data.success);
                if (data.success == true)
                    alertify.notify('Signed up successfully, redirecting to signin page...', 'success', 3, function () { window.location.href = "/signin"; });
                else
                    alertify.notify('Error happenend, please contact the adminstrator', 'error');
            }
        });
    }
});