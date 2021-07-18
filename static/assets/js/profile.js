// Class definition
var KTWidgets = function () {

    var _initChartsWidget4 = function () {
        var element = document.getElementById("kt_charts_widget_4_chart");

        if (!element) {
            return;
        }

        var options = {
            series: [{
                name: 'Net Profit',
                data: [60, 50, 80, 40, 100, 60]
            }, {
                name: 'Revenue',
                data: [70, 60, 110, 40, 50, 70]
            }],
            chart: {
                type: 'area',
                height: 350,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {},
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: 'solid',
                opacity: 1
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                },
                crosshairs: {
                    position: 'front',
                    stroke: {
                        color: KTApp.getSettings()['colors']['theme']['light']['primary'],
                        width: 1,
                        dashArray: 3
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: undefined,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                }
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '12px',
                    fontFamily: KTApp.getSettings()['font-family']
                },
                y: {
                    formatter: function (val) {
                        return "$" + val + " thousands"
                    }
                }
            },
            colors: [KTApp.getSettings()['colors']['theme']['light']['primary'], KTApp.getSettings()['colors']['theme']['light']['success']],
            grid: {
                borderColor: KTApp.getSettings()['colors']['gray']['gray-200'],
                strokeDashArray: 4,
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            markers: {
                colors: [KTApp.getSettings()['colors']['theme']['light']['primary'], KTApp.getSettings()['colors']['theme']['light']['success']],
                strokeColor: [KTApp.getSettings()['colors']['theme']['light']['primary'], KTApp.getSettings()['colors']['theme']['light']['success']],
                strokeWidth: 3
            }
        };

        var chart = new ApexCharts(element, options);
        chart.render();
    }

    // Public functions
    return {
        init: function () {
            _initChartsWidget4();
        }
    }
}();

function edit_profile(isCurrentUser, iconExist, delete_avatar_url, edit_url, userID, check_username_url) {
    if (isCurrentUser === "True") {
        var avatar1 = new KTImageInput('kt_image');

        avatar1.on('cancel', function () {
            swal.fire({
                title: 'Image successfully canceled !',
                type: 'success',
                buttonsStyling: false,
                confirmButtonText: 'Awesome!',
                confirmButtonClass: 'btn btn-primary font-weight-bold'
            });
        });

        avatar1.on('change', function () {
            $('#edit_avatar').trigger('submit')
        });
        if (iconExist === "True") {
            avatar1.on('remove', function () {
                $.ajax({
                    type: 'POST',
                    url: delete_avatar_url,
                    success: function (data) {
                        if (data === 'success') {
                            swal.fire({
                                title: 'Image successfully removed !',
                                type: 'error',
                                buttonsStyling: false,
                                confirmButtonText: 'Got it!',
                                confirmButtonClass: 'btn btn-primary font-weight-bold'
                            }).then(function () {
                                window.location.reload();
                            })
                        } else if (data === 'failure') {
                            swal.fire({
                                text: "Cancel Failure! Error Occur!",
                                icon: "warning",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light-primary"
                                }
                            })
                        }
                    },
                    error: function () {
                        swal.fire({
                            text: "Error Occurred!",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        })
                    }
                })
            });
        }
        $('#edit_submit').on("click", function () {
            var description = $('#description_edit').val().trim()
            var username = $('#username_edit').val().trim()
            if (description !== "" || username !== "") {
                $.ajax({
                    url: edit_url,
                    type:"POST",
                    data: {
                        id: userID,
                        description: description,
                        username: username
                    },
                    success: function (data) {
                        if (data === 'success') {
                            swal.fire({
                                text: "Edit Successful!",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light-primary"
                                }
                            }).then(function () {
                                window.location.reload();
                            })
                        } else if (data === 'failure') {
                            swal.fire({
                                text: "Edit Failure! Too many characters for description! Maximum characters is 200!",
                                icon: "warning",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light-primary"
                                }
                            })
                        }
                    },
                    error: function () {
                        swal.fire({
                            text: "Error Occurred!",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        })
                    }
                })
            }
        })

        FormValidation.formValidation(
            document.getElementById('edit'),
            {
                fields: {
                    username: {
                        validators: {
                            callback: {
                                callback: function () {
                                    return $.ajax({
                                        url: check_username_url,
                                        type: 'POST',
                                        data: {
                                            username: $('#username_edit').val(),
                                        }
                                    })
                                }
                            }
                        }
                    }
                },
                plugins: { //Learn more: https://formvalidation.io/guide/plugins
                    trigger: new FormValidation.plugins.Trigger(),
                    fieldStatus: new FormValidation.plugins.FieldStatus({
                        onStatusChanged: function (areFieldsValid) {
                            // areFieldsValid is true if all fields are valid
                            areFieldsValid ? document.getElementById("edit_submit").disabled = false : document.getElementById("edit_submit").disabled = true
                        }
                    }),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap(),
                }
            });
    }
}

function loadFavourtieArticles(url) {
    KTApp.block("#FavArt")
    //load favourite articles
    $.ajax({
        url: url,
        dataType: "json",
        type: "POST",
        success: function (result) {
            //unblock after loading
            KTApp.unblock('#FavArt');
            //sort the articles into two tabs
            document.getElementById("totalNumArticle").innerText = result.length + " articles"
            if (result.length > 0) {
                var Exercise = [];
                var Diet = [];
                for (let i = 0; i < result.length; i++) {
                    if (result[i][2] === "Exercise") {
                        Exercise.push([result[i][0], result[i][1]])
                    } else if (result[i][2] === "Diet") {
                        Diet.push([result[i][0], result[i][1]])
                    }
                }
                //if no favourite articles in either of the tabs, show other notification
                if (Exercise.length === 0) {
                    document.getElementById("Exercise").innerHTML = "<div class=\"d-flex align-items-center pb-9\"><h5 class='text-center'>You do not have any favourite exercise related article for now.</h5></div>"
                }
                if (Diet.length === 0) {
                    document.getElementById("Diet").innerHTML = "<div class=\"d-flex align-items-center pb-9\"><h5 class='text-center'>You do not have any favourite diet related article for now.</h5></div>"
                }
                //if there are articles, display it
                for (let i = 0; i < Exercise.length; i++) {
                    document.getElementById("Exercise").innerHTML += "<div class=\"d-flex align-items-center pb-9 mt-4 mb-4\"><div class=\"d-flex flex-column flex-grow-1\"><a href=\"/article/get/" + Exercise[i][0] + "\" class=\"text-dark-75 font-weight-bolder text-hover-primary font-size-lg mb-1\">" + Exercise[i][1] + "</a></div></div>"
                    if (i !== Exercise.length - 1) {
                        //if not the last article, add seperator
                        document.getElementById("Exercise").innerHTML += "<div class=\"separator separator-dashed separator-border-3\"></div>"
                    }
                }
                for (let i = 0; i < Diet.length; i++) {
                    document.getElementById("Diet").innerHTML += "<div class=\"d-flex align-items-center pb-9 mt-4 mb-4\"><div class=\"d-flex flex-column flex-grow-1\"><a href=\"/article/get/" + Diet[i][0] + "\" class=\"text-dark-75 font-weight-bolder text-hover-primary font-size-lg mb-1\">" + Diet[i][1] + "</a></div></div>"
                    if (i !== Diet.length - 1) {
                        //if not the last article, add seperator
                        document.getElementById("Diet").innerHTML += "<div class=\"separator separator-dashed separator-border-3\"></div>"
                    }
                }
            } else {
                document.getElementById("Exercise").innerHTML = "<div class=\"d-flex align-items-center pb-9\"><h5 class='text-center'>You do not have any favourite exercise related article for now.</h5></div>"
                document.getElementById("Diet").innerHTML = "<div class=\"d-flex align-items-center pb-9\"><h5 class='text-center'>You do not have any favourite diet related article for now.</h5></div>"
            }
        }
    })
}