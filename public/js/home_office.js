let refStatuss = ["Available", "In Maintenance", "Being Cleaned", "Rented"];

$(document).ready(function () {
    $('form').on('change', 'select', function (e) {
        var selectedStatus = $(this).val(); // Get the value of the changed select tag
        var new_status = refStatuss.indexOf(selectedStatus);
        var form = $(this).closest('form'); // Get the closest form element
        var plate_id = form.find("#plate_id").val();
        var office_id = form.find("#office_id").val();
        var officeName = form.find("#officeName").val();
        
        $.ajax({
            url: "/update_car_status",
            type: "POST",
            data: {
                plate_id: plate_id,
                status: new_status,
                office_id: office_id,
                officeName: officeName
            },
            success: function (response) {
                console.log(response);
                if (response.success == true)
                    alertify.notify("Status Updated Successfully", 'success');
            },
            error: function (response) {
                console.log(response);
            }
        });
    });

});