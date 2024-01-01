$(document).ready(function () {
    $('#returnDate').attr("disabled", true);
    $('#pickDate').on('change', function (e) {
        $('#returnDate').attr("disabled", false);
        var pickDateValue = $('#pickDate').val();
        $('#returnDate').val(pickDateValue);
        $('#returnDate').attr("min", pickDateValue);
    });


    var selectedCar = ''
    var zoomFun = function () {
        if (this.className === 'card' || this.className === 'card_clicked') {
            if (selectedCar !== '') {
                if (selectedCar === $(this).attr('id').replace('#', ''))
                    if ($(this).attr('class').replace('.', '') === 'card_clicked') {
                        $(this).attr('class', "card")
                        selectedCar = '';
                        return
                    }
                    else
                        $(this).attr('class', "card_clicked")
                else {
                    $('#' + selectedCar).attr('class', "card")
                    $(this).attr('class', "card_clicked")
                }
            } else {
                $(this).attr('class', "card_clicked")
            }
            selectedCar = $(this).attr('id')
        }
    }

    
    $('div').click(zoomFun);


    $("#modelSelect").change(function () {
        var carModel = $('#modelSelect').find(":selected").text()
        $.ajax({
            url: '/get-all-cars-makes',
            type: 'POST',
            data: {
                model: carModel
            },
            success: function (data) {
                var dropDown = ""
                dropDown += "<option>Any</option>"
                //add data to table body
                for (var i = 0; i < data.carMakes.length; i++) {
                    var car = data.carMakes[i].make;
                    dropDown += "<option>" + car + "</option>"
                }
                $('#makeSelect').empty();
                $('#makeSelect').append(dropDown);
            }
        });

        $.ajax({
            url: '/get-all-cars-body_styles',
            type: 'POST',
            data: {
                model: carModel
            },
            success: function (data) {
                var dropDown = ""
                dropDown += "<option>Any</option>"
                //add data to table body
                for (var i = 0; i < data.carBodyStyles.length; i++) {
                    var car = data.carBodyStyles[i].body_style;
                    dropDown += "<option>" + car + "</option>"
                }
                $('#body_styleSelect').empty();
                $('#body_styleSelect').append(dropDown);
            }
        });

        $.ajax({
            url: '/get-all-cars-colors',
            type: 'POST',
            data: {
                model: carModel
            },
            success: function (data) {
                var dropDown = ""
                dropDown += "<option>Any</option>"
                //add data to table body
                for (var i = 0; i < data.carColors.length; i++) {
                    var car = data.carColors[i].color;
                    dropDown += "<option>" + car + "</option>"
                }
                $('#colorSelect').empty();
                $('#colorSelect').append(dropDown);
            }
        });

    });


    $.ajax({
        url: '/get-all-cars-models',
        type: 'POST',
        success: function (data) {
            var dropDown = ""
            dropDown += "<option>Any</option>"
            //add data to table body
            for (var i = 0; i < data.carModels.length; i++) {
                var car = data.carModels[i].model;
                dropDown += "<option>" + car + "</option>"
            }
            $('#modelSelect').empty();
            $('#modelSelect').append(dropDown);
        }
    });


    $.ajax({
        url: '/get-all-cars-colors',
        type: 'POST',
        data: {
            model: 'Any'
        },
        success: function (data) {
            var dropDown = ""
            dropDown += "<option>Any</option>"
            //add data to table body
            for (var i = 0; i < data.carColors.length; i++) {
                var car = data.carColors[i].color;
                dropDown += "<option>" + car + "</option>"
            }
            $('#colorSelect').empty();
            $('#colorSelect').append(dropDown);
        }
    });


    $.ajax({
        url: '/get-all-cars-body_styles',
        type: 'POST',
        data: {
            model: 'Any'
        },
        success: function (data) {
            var dropDown = ""
            dropDown += "<option>Any</option>"
            //add data to table body
            for (var i = 0; i < data.carBodyStyles.length; i++) {
                var car = data.carBodyStyles[i].body_style;
                dropDown += "<option>" + car + "</option>"
            }
            $('#body_styleSelect').empty();
            $('#body_styleSelect').append(dropDown);
        }
    });


    $.ajax({
        url: '/get-all-cars-makes',
        type: 'POST',
        data: {
            model: 'Any'
        },
        success: function (data) {
            var dropDown = ""
            dropDown += "<option>Any</option>"
            //add data to table body
            for (var i = 0; i < data.carMakes.length; i++) {
                var car = data.carMakes[i].make;
                dropDown += "<option>" + car + "</option>"
            }
            $('#makeSelect').empty();
            $('#makeSelect').append(dropDown);
        }
    });


    $.ajax({
        url: '/get-all-offices',
        type: 'POST',
        success: function (data) {
            var dropDown = ""
            dropDown += "<option>Any</option>"
            //add data to table body
            for (var i = 0; i < data.offices.length; i++) {
                var office = data.offices[i].name + " - " + data.offices[i].building_no + ", " + data.offices[i].city + ", " + data.offices[i].country;
                dropDown += "<option>" + office + "</option>"
            }
            $('#locationSelect').empty();
            $('#locationSelect').append(dropDown);
        }
    });


    $("#getAvailable").click(function () {
        var pickDate = $("#pickDate").val()
        var retDate = $("#returnDate").val()
        //get today in yyyy-mm-dd format
        let currentDate = new Date().toISOString().slice(0, 10);
        if (pickDate < currentDate) {
            alertify.alert("You can't travel in time!").set('frameless', true);
            return
        }
        if (pickDate === "" || retDate === "") {
            alertify.alert("Please select a pick up and return date").set('frameless', true);
            return
        }
        const x = new Date(pickDate);
        const y = new Date(retDate);
        if (x > y) {
            alertify.alert("Unavailable dates!").set('frameless', true);
            return
        }
        var loc = $('#locationSelect').find(":selected").text().toString()
        var office_name = ''
        var office_building = ''
        var office_city = ''
        var office_country = ''
        if (loc !== 'Any') {
            var office_name = loc.split(" - ")[0]
            var office_building = loc.split(" - ")[1].split(", ")[0]
            var office_city = loc.split(" - ")[1].split(", ")[1]
            var office_country = loc.split(" - ")[1].split(", ")[2]
        }
        $.ajax({
            url: '/show-avaialable-cars',
            type: 'POST',
            data: {
                make: $('#makeSelect').find(":selected").text().toString(),
                model: $('#modelSelect').find(":selected").text().toString(),
                color: $('#colorSelect').find(":selected").text().toString(),
                body_style: $('#body_styleSelect').find(":selected").text().toString(),
                pickup_date: pickDate,
                return_date: retDate,
                city: office_city,
                country: office_country,
                office_build_no: office_building,
                office_name: office_name
            },
            success: function (data) {
                var cards = "";
                //add data to table body
                if (data.cars.length > 0) {
                    for (var i = 0; i < data.cars.length; i++) {
                        var car = data.cars[i];
                        var office = car.name + " - " + car.building_no + ", " + car.city + ", " + car.country;
                        cards += "<div class=\"card\" id=\"" + car.plate_id + "\">\
                            <img src=\""+ car.photo + "\">\
                             <!--<h1>"+ car.photo + "</h1>-->\
                            <div class=\"content\">\
                                <h4>"+ car.make + " - " + car.model + ", " + car.year + "</h4>\
                                <p>"+ car.price + " $/Day" + "</p>\
                                <p>"+ office + "</p>\
                            </div>\
                        </div>";
                    }
                } else {
                    alertify.alert("No available cars.").set('frameless', true);
                }
                $('.card-container').empty();
                $('.card-container').append(cards);
                $('div').click(zoomFun);
            }
        });
    });


    document.getElementById('reserve_form').addEventListener('submit', function (e) {
        
        e.preventDefault();
        console.log("INSIDE2");
        var pickDate = $("#pickDate").val()
        var retDate = $("#returnDate").val()
        const ssn = $("#cu_ssn").val()

        const x = new Date(pickDate);
        const y = new Date(retDate);
        if (pickDate === "" || retDate === "") {
            alertify.alert("Please select a pick up and return date").set('frameless', true);
            return
        }
        if (x > y) {
            alertify.alert("Pickup must be before Return!").set('frameless', true);
            return
        }
        if (selectedCar === "") {
            alertify.alert('Please select a car').set('frameless', true);
            return
        }
        $.ajax({
            url: "/add-reservation",
            type: "POST",
            data: {
                ssn: ssn,
                plateId: selectedCar,
                pickupDate: pickDate,
                returnDate: retDate,
                payNow: $("#payNow").is(":checked")
            },
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    console.log("INSIDE THE ENCODING");
                    const fname = $('#cu_fname').val()
                    var redirectUrl = "/home_customer?ssn=" + encodeURIComponent(ssn) + "&fname=" + encodeURIComponent(fname);
                    alertify.notify('Reservation Paid successfully', 'success', 3, function () {
                        window.location.href = redirectUrl;
                    });
                }
                else
                    alertify.notify('Error happenend, please contact the adminstrator', 'error');
            }
        });
    });

});
