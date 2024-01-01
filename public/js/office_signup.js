
document.getElementById("office_signup_form").addEventListener("submit", (event) => {
    event.preventDefault();
    let vaild = true;
    // Check Email
    $.ajax({
        url: '/check-email-office',
        type: 'POST',
        async: false,
        data: {
            email: $('#email').val()
        },
        success: function (data) {
            if (data.taken == true) {
                vaild = false;
                alertify.alert("Email already exists, try to signin.").set('frameless', true);
            }
        }
    });
    // Check officephone
    $.ajax({
        url: '/check-phone-office',
        type: 'POST',
        async: false,
        data: {
            phone: $('#phone').val()
        },
        success: function (data) {
            if (data.taken == true) {
                vaild = false;
                alertify.alert("Phone already exists.").set('frameless', true);
            }
        }
    });
    // Check Password
    if ($('#pass1').val() != $('#pass2').val()) {
        vaild = false;
        alertify.alert("Passwords do not match.").set('frameless', true);
    }
    // If all valid signup
    if (vaild === true) {
        $.ajax({
            url: "/office-signup",
            type: 'POST',
            async: false,
            data: $("#office_signup_form").serialize(),
            success: function (data) {
                if (data.success == true){
                    alertify.notify('Signed up successfully, redirecting to signin page...', 'success', 3, function () { window.location.href = "/signin"; });
                }
                else{
                    alertify.notify('Error happenend, please contact the adminstrator', 'error');
                }
            }
        });
    }
});
