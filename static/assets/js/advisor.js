function set_target(url, target_weight = 0, endpoint) {
    if (document.getElementById("stay_fit").checked) {
        $.ajax({
            url: url,
            type: "POST",
            data: {
                target: "stay_fit"
            },
            success: function (result) {
                if (result === "success") {
                    window.location.href = endpoint
                }
            }
        })
    } else if (document.getElementById("weight_loss").checked) {
        $.ajax({
            url: url,
            type: "POST",
            data: {
                target: "weight_loss",
                weight: target_weight,
            },
            success: function (result) {
                if (result === "success") {
                    window.location.href = endpoint
                }
            }
        })
    } else {
        $.notify("Please select an option before submitting.", {
            placement: {
                from: "top",
                align: "right"
            },
            delay: 1000,
            timer: 4000,
            animate: {
                enter: 'animate__animated animate__bounceInRight',
                exit: 'animate__animated animate__bounceOutRight'
            },
            type: "warning"
        })
    }
}

function weightToLose(current_weight, target_weight) {
    return (current_weight - target_weight).toFixed(2) > 0 ? (current_weight - target_weight).toFixed(2) : 0
}

function notify_set() {
    $.notify("You have successfully set your target! Now let's try out some new features.", {
        placement: {
            from: "top",
            align: "right"
        },
        delay: 500,
        timer: 1500,
        animate: {
            enter: 'animate__animated animate__bounceInRight',
            exit: 'animate__animated animate__bounceOutRight'
        },
        type: "success"
    })
}

function advisorWeightOnReady(current_weight, set_target_url, health_advisor_index_url) {
    $("#weightLossInput").on("input", function () {
        //targetWeight determine target weight, to REAL weight to loss, calculate by function weightToLoss
        targetWeight = parseInt($(this).val())
        var weightNeedToLose = weightToLose(current_weight, targetWeight)
        document.getElementById("weightToLoseText").innerText = `You need to lose ${weightNeedToLose}KG to achieve your goal.`
    })

    $("#setTargetSubmit").on("click", function () {
        if (document.getElementById("weight_loss").checked) {
            if (document.getElementById("weightLossInput").value !== "") {
                if (targetWeight >= current_weight) {
                    $.notify("Your target weight need to be smaller than your current weight!", {
                        placement: {
                            from: "top",
                            align: "right"
                        },
                        delay: 1000,
                        timer: 4000,
                        animate: {
                            enter: 'animate__animated animate__bounceInRight',
                            exit: 'animate__animated animate__bounceOutRight'
                        },
                        type: "warning"
                    })
                } else if (targetWeight <= 35) {
                    $.notify("Your target weight is too low!", {
                        placement: {
                            from: "top",
                            align: "right"
                        },
                        delay: 1000,
                        timer: 4000,
                        animate: {
                            enter: 'animate__animated animate__bounceInRight',
                            exit: 'animate__animated animate__bounceOutRight'
                        },
                        type: "warning"
                    })
                } else {
                    set_target(set_target_url, targetWeight, health_advisor_index_url)
                }
            } else {
                $.notify("Please key in value!", {
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    delay: 1000,
                    timer: 4000,
                    animate: {
                        enter: 'animate__animated animate__bounceInRight',
                        exit: 'animate__animated animate__bounceOutRight'
                    },
                    type: "danger"
                })
            }
        } else {
            console.log(true)
            set_target(set_target_url, 0, health_advisor_index_url)
        }

    })
}

function setExerciseFrequency(submitUrl, redirectUrl) {
    var exerciseFrequency = $('#exerciseFreq_dropdown').val()
    if (exerciseFrequency === "" || exerciseFrequency === null) {
        $.notify("Please select value to submit!", {
            placement: {
                from: "top",
                align: "right"
            },
            delay: 1000,
            timer: 4000,
            animate: {
                enter: 'animate__animated animate__bounceInRight',
                exit: 'animate__animated animate__bounceOutRight'
            },
            type: "danger"
        })
    } else {
        $.ajax({
            url: submitUrl,
            data: {
                frequency: exerciseFrequency
            },
            type: "POST",
            success: function (result) {
                if (result === "success") {
                    window.location.href = redirectUrl + "?notify=You have set your frequency, enjoy your journey!"
                } else {
                    $.notify("Submit Failure! Please try again later!", {
                        placement: {
                            from: "top",
                            align: "right"
                        },
                        delay: 1000,
                        timer: 4000,
                        animate: {
                            enter: 'animate__animated animate__bounceInRight',
                            exit: 'animate__animated animate__bounceOutRight'
                        },
                        type: "danger"
                    })
                }
            }
        })
    }
}

function loadWeekChart(weekChartUrl, targetWeight) {
    KTApp.block('#weightChartCard', {
        overlayColor: '#000000',
        state: 'primary',
        opacity: 0.3,
        message: 'Loading...'
    })
    $.ajax({
        url: weekChartUrl,
        type: "POST",
        dataType: "json",
        success: function (data) {
            console.log(data)
            const apexChart = "#week_chart";
            var options = {
                series: [{
                    name: "Weight(Kilograms)",
                    data: data
                }],
                chart: {
                    height: 400,
                    type: 'line',
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                    width: 1
                },
                plotOptions: {
                    dataLabels: {
                        enabled: true
                    }
                },
                markers: {
                    size: 7
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    type: "datetime"
                },
                colors: ["#6993FF"],
                noData: {
                    text: 'There is no weight data of you for now, update to view your statistics.'
                }
            };

            //if user choose to lose weight instead of stay fit, there is a line to state the target weight
            if (targetWeight !== 0) {
                options.annotations = {
                    yaxis: [{
                        y: targetWeight,
                        borderColor: '#00E396',
                        label: {
                            borderColor: '#B3F7CA',
                            style: {
                                fontSize: '10px',
                                color: '#fff',
                                background: '#00E396',
                            },
                            text: 'Target Weight',
                        }
                    }]
                }
            }

            //render chart
            var chart = new ApexCharts(document.querySelector(apexChart), options);
            chart.render();

            KTApp.unblock('#weightChartCard')
        }
    })
}

function getMonth(retreiveUrl, recordUrl) {
    //retreive months that user had updated their weight
    KTApp.block("#monthList", {
        overlayColor: '#000000',
        state: 'primary',
        opacity: 0.3
    })
    $.ajax({
        url: retreiveUrl,
        dataType: "json",
        type: "POST",
        success: function (data) {
            document.getElementById("monthList").innerHTML = ""
            //return month in list
            if (data.length === 0) {
                $('#monthList').append('<p class="text-center">No record</p>')
            }
            for (let i = 0; i < data.length; i++) {
                //append to month list dropdown
                $('#monthList').append('<a class="dropdown-item" data-toggle="tab" onclick="getMonthRecord(\'' + data[i] + '\',\'' + recordUrl + '\')" href="#stat_month">' + data[i].toString() + '</a>')
            }
            KTApp.unblock("#monthList")
        }
    })
}

function getMonthRecord(data, retreiveUrl) {
    KTApp.block("#weightChartCard", {
        overlayColor: '#000000',
        state: 'primary',
        opacity: 0.3
    })
    $.ajax({
        url: retreiveUrl,
        data: {
            month: data
        },
        type: "POST",
        dataType: "json",
        success: function (result) {
            const apexChart = "#month_chart";
            var options = {
                series: [{
                    name: "Weight(Kilograms)",
                    data: result
                }],
                chart: {
                    height: 400,
                    type: 'line',
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                    width: 1
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                plotOptions: {
                    dataLabels: {
                        enabled: true
                    }
                },
                xaxis: {
                    type: "datetime"
                },
                markers: {
                    size: 7
                },
                colors: ["#6993FF"],
                noData: {
                    text: 'There is no weight data of you for now, update to view your statistics.'
                }
            };

            //render chart
            var chart = new ApexCharts(document.querySelector(apexChart), options);
            chart.render();

            KTApp.unblock('#weightChartCard')
        }
    })
}

function loadExercise() {
    KTApp.block("#sportCard", {
        overlayColor: '#000000',
        state: 'primary',
        opacity: 0.3
    })
    $.ajax({
        url: "/advisor/sport/get/5",
        dataType: "JSON",
        type: "POST",
        success: function (result) {
            for (let i = 0; i < result[0].length; i++) {
                document.getElementById("beginner_table").innerHTML += "<tr><td class=\"pl-0\"><p class=\"text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg\">"+ result[0][i]["name"] +"</p></td><td class=\"text-right\"><span class=\"text-dark-75 font-weight-bolder d-block font-size-lg\">"+ result[0][i]["calorie"] +"Kcal</span></td><td class=\"text-right\"><span class=\"text-muted font-weight-500\">"+ sortSportCategory(result[0][i]["category"]) +"</span></td></tr>"
                document.getElementById("intermediate_table").innerHTML += "<tr><td class=\"pl-0\"><p class=\"text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg\">"+ result[1][i]["name"] +"</p></td><td class=\"text-right\"><span class=\"text-dark-75 font-weight-bolder d-block font-size-lg\">"+ result[1][i]["calorie"] +"Kcal</span></td><td class=\"text-right\"><span class=\"text-muted font-weight-500\">"+ sortSportCategory(result[1][i]["category"]) +"</span></td></tr>"
                document.getElementById("advance_table").innerHTML += "<tr><td class=\"pl-0\"><p class=\"text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg\">"+ result[2][i]["name"] +"</p></td><td class=\"text-right\"><span class=\"text-dark-75 font-weight-bolder d-block font-size-lg\">"+ result[2][i]["calorie"] +"Kcal</span></td><td class=\"text-right\"><span class=\"text-muted font-weight-500\">"+ sortSportCategory(result[2][i]["category"]) +"</span></td></tr>"
            }
            KTApp.unblock("#sportCard")
        }
    })
}

function sortSportCategory(array) {
    for (let i = 0; i < array.length; i++) {
        switch (array[i]) {
            case "1":
                array[i] = "Cardio"
                break
            case "2":
                array[i] = "Body Shape"
                break
            case "3":
                array[i] = "Strength"
                break
            case "4":
                array[i] = "Stamina"
                break
        }
    }
    return array.join(", ")
}

function reloadSport() {
    document.getElementById("beginner_table").innerHTML = ""
    document.getElementById("intermediate_table").innerHTML = ""
    document.getElementById("advance_table").innerHTML = ""
    loadExercise()
}