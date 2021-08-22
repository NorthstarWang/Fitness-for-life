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

function loadBMIWeekChart(weekChartUrl, targetWeight) {
    KTApp.block('#BMIChartCard', {
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
            const apexChart = "#week_chart_BMI";
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

            KTApp.unblock('#BMIChartCard')
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

function getBMIMonth(retreiveUrl, recordUrl) {
    //retreive months that user had updated their weight
    KTApp.block("#monthList_BMI", {
        overlayColor: '#000000',
        state: 'primary',
        opacity: 0.3
    })
    $.ajax({
        url: retreiveUrl,
        dataType: "json",
        type: "POST",
        success: function (data) {
            document.getElementById("monthList_BMI").innerHTML = ""
            //return month in list
            if (data.length === 0) {
                $('#monthList_BMI').append('<p class="text-center">No record</p>')
            }
            for (let i = 0; i < data.length; i++) {
                //append to month list dropdown
                $('#monthList_BMI').append('<a class="dropdown-item" data-toggle="tab" onclick="getBMIMonthRecord(\'' + data[i] + '\',\'' + recordUrl + '\')" href="#stat_month_BMI">' + data[i].toString() + '</a>')
            }
            KTApp.unblock("#monthList_BMI")
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
            document.getElementById("month_chart").innerHTML = ''
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

function getBMIMonthRecord(data, retreiveUrl) {
    KTApp.block("#BMIChartCard", {
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
            document.getElementById("month_chart_BMI").innerHTML = ''
            const apexChart = "#month_chart_BMI";
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

            KTApp.unblock('#BMIChartCard')
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
                document.getElementById("beginner_table").innerHTML += "<tr><td class=\"pl-0\"><p class=\"text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg\">" + result[0][i]["name"] + "</p></td><td class=\"text-right\"><span class=\"text-dark-75 font-weight-bolder d-block font-size-lg\">" + result[0][i]["calorie"] + "Kcal/30 mins</span></td><td class=\"text-right\"><span class=\"text-muted font-weight-500\">" + sortSportCategory(result[0][i]["category"]) + "</span></td></tr>"
                document.getElementById("intermediate_table").innerHTML += "<tr><td class=\"pl-0\"><p class=\"text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg\">" + result[1][i]["name"] + "</p></td><td class=\"text-right\"><span class=\"text-dark-75 font-weight-bolder d-block font-size-lg\">" + result[1][i]["calorie"] + "Kcal/30 mins</span></td><td class=\"text-right\"><span class=\"text-muted font-weight-500\">" + sortSportCategory(result[1][i]["category"]) + "</span></td></tr>"
                document.getElementById("advance_table").innerHTML += "<tr><td class=\"pl-0\"><p class=\"text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg\">" + result[2][i]["name"] + "</p></td><td class=\"text-right\"><span class=\"text-dark-75 font-weight-bolder d-block font-size-lg\">" + result[2][i]["calorie"] + "Kcal/30 mins</span></td><td class=\"text-right\"><span class=\"text-muted font-weight-500\">" + sortSportCategory(result[2][i]["category"]) + "</span></td></tr>"
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

function update_weight(userId, url) {
    var new_weight = document.getElementById("update_weight").value
    KTApp.blockPage({
        overlayColor: '#000000',
        state: 'success',
        opacity: 0.1,
        message: 'Updating...'
    })
    $.ajax({
        url: url,
        type: "POST",
        data: {
            userId: userId,
            weight: new_weight
        },
        success: function () {
            window.location.reload()
        }
    })
}

function change_height(userId, url) {
    var height = document.getElementById("change_height").value
    KTApp.blockPage({
        overlayColor: '#000000',
        state: 'success',
        opacity: 0.1,
        message: 'Changing...'
    })
    $.ajax({
        url: url,
        type: "POST",
        data: {
            userId: userId,
            height: height
        },
        success: function (result) {
            if (result === 'success') {
                window.location.reload()
            } else {
                $.notify("Error Occurred, please try again later!", {
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    delay: 500,
                    timer: 2500,
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

function chart(calorie_limit, calorie_taken) {
    const apexChart = "#calorie_chart";
    var options = {
        chart: {
            height: 420,
            type: "radialBar",
        },

        series: [(parseInt(calorie_taken) / parseInt(calorie_limit)).toFixed(1)],
        colors: [function ({value, seriesIndex, w}) {
            if (value < 90) {
                return '#00FF40'
            } else if (value < 95) {
                return '#FFBF00'
            } else {
                return '#DF3A01'
            }
        }],
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: "75%",
                    background: "#9A2EFE"
                },
                track: {
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        blur: 4,
                        opacity: 0.15
                    }
                },
                dataLabels: {
                    name: {
                        offsetY: -10,
                        color: "#fff",
                        fontSize: "13px"
                    },
                    value: {
                        color: "#fff",
                        fontSize: "30px",
                        show: true
                    }
                }
            }
        },
        stroke: {
            lineCap: "round"
        },
        labels: ["Total Consumption Monitor"]
    };

    var chart = new ApexCharts(document.querySelector(apexChart), options);
    chart.render();
}

function kanban() {
    new jKanban({
        element: '#meal_kanban',
        responsivePercentage: false,
        gutter: "10px",
        widthBoard: "300px",
        boards: [{
            'id': '_breakfast',
            'title': 'Breakfast',
            'class': 'light-success',
            'item': []
        },
            {
                'id': '_lunch',
                'title': 'Lunch',
                'class': 'light-warning',
                'item': []
            },
            {
                'id': '_dinner',
                'title': 'Dinner',
                'class': 'light-primary',
                'item': []
            }
        ]
    });
}

function loadTable() {
    var options = {
        translate: {
            records: {
                noRecords: 'No food currently, please search foods using search bar.'
            }
        },
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    method: "GET",
                    contentType: 'application/json',
                    url: 'https://healthier-recipe-api.azurewebsites.net/api/HttpTrigger?code=qxBTuTf8B0GadfnmRkWNWdTsLCuaWguAuMLc5BAqdka74r2wfvemFA==',
                    map: function (raw) {
                        // sample data mapping
                        var dataSet = raw;
                        if (typeof raw.data !== 'undefined') {
                            dataSet = raw.data;
                        }
                        return dataSet["hits"]
                    }
                },
            }
        },

        // layout definition
        layout: {
            scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
            height: 400, // datatable's body's fixed height
            footer: true, // display/hide footer
        },

        pagination: false,

        // columns definition
        columns: [
            {
                field: 'Image',
                title: '',
                sortable: false,
                overflow: 'visible',
                width: 150,
                template: function (row) {
                    var type_color;
                    if (row["recipe"]["dietLabels"].length === 0) {
                        type_color = "warning"
                    } else {
                        type_color = "success"
                    }
                    return `
                    <a class="btn btn-light-` + type_color + ` d-inline-flex align-items-center btn-lg mr-5" role="button" data-toggle="popover" data-content="View recipe" href="` + row["recipe"]["url"] + `">
                        <span class="symbol symbol-80">
                            <img alt="Pic" src="` + row["recipe"]["image"] + `"/>
                        </span>
                    </a>
                    `
                },
            }, {
                field: 'Name',
                title: "Food Name",
                overflow: 'visible',
                sortable: false,
                width: 200,
                template: function (row) {
                    return `
                            <a href="` + row["recipe"]["url"] + `" class="btn btn-pill btn-link btn-hover-success text-left text-dark-75 font-weight-bold font-size-lg" name="food_name" role="button" data-toggle="popover" data-content="View recipe">` + row["recipe"]["label"] + `</a>
                        `
                }
            }, {
                field: 'Calorie',
                title: "Calorie Per 100 grams",
                sortable: true,
                sortCallback: function (data, sort) {
                    return $(data).sort(function (a, b) {
                        var aField = ((parseFloat(a["recipe"]["calories"]) / parseFloat(a["recipe"]["totalWeight"])) * 100).toFixed(0)
                        var bField = ((parseFloat(b["recipe"]["calories"]) / parseFloat(b["recipe"]["totalWeight"])) * 100).toFixed(0)
                        if (sort === 'asc') {
                            return aField > bField
                                ? 1 : aField < bField
                                    ? -1
                                    : 0;
                        } else {
                            return aField < bField
                                ? 1 : aField > bField
                                    ? -1
                                    : 0;
                        }
                    });
                },
                overflow: 'visible',
                width: 150,
                template: function (row) {
                    var calorie_per_hundreds = ((parseFloat(row["recipe"]["calories"]) / parseFloat(row["recipe"]["totalWeight"])) * 100).toFixed(0)
                    return `
                            <p class="text-dark-75 font-weight-bold font-size-lg">` + calorie_per_hundreds + `Kcal/100g</p>
                        `
                }
            }, {
                field: 'mealType',
                title: "Recommend to consume on",
                width: 150,
                sortable: false,
                template: function (row) {
                    var html = ``
                    for (let i = 0; i < row["recipe"]["mealType"].length; i++) {
                        if (row["recipe"]["mealType"][i] === "breakfast") {
                            html += `<span class="label label-inline label-light-success font-weight-bold">Breakfast</span>`
                        } else if (row["recipe"]["mealType"][i] === "lunch/dinner") {
                            html += `<span class="label label-inline label-light-info font-weight-bold">Lunch/Dinner</span>`
                        } else {
                            html += `<span class="label label-inline label-light-primary font-weight-bold">` + row["recipe"]["mealType"][i] + `</span>`
                        }
                    }
                    return html
                }
            }, {
                field: 'Add',
                title: 'Add',
                sortable: false,
                width: 125,
                overflow: 'visible',
                autoHide: false,
                template: function () {
                    return `
							<div class="dropdown dropdown-inline">
								<button type="button" data-toggle="dropdown" class="btn btn-light-success btn-lg btn-circle btn-icon dropdown-btn">
	                                <i class="la la-plus"></i>
	                            </button>
							  	<div class="dropdown-menu dropdown-menu-lg">
									    <div class="form-group px-8 py-8">
                                            <label>Food taken at</label>
                                            <form>
                                                <div class="radio-inline">
                                                    <label class="radio">
                                                        <input type="radio" onclick="checkMeal(this)" name="meal" value="breakfast"/>
                                                        <span></span>
                                                        Breakfast
                                                    </label>
                                                    <label class="radio">
                                                        <input type="radio" onclick="checkMeal(this)" name="meal" value="lunch"/>
                                                        <span></span>
                                                        Lunch
                                                    </label>
                                                    <label class="radio">
                                                        <input type="radio" onclick="checkMeal(this)" name="meal" value="dinner"/>
                                                        <span></span>
                                                        Dinner
                                                    </label>
                                                </div>
                                            </form>
                                        </div>
							  	</div>
							</div>
						`;
                },
            }],

    };

    var datatable = $('#food_datatable').KTDatatable(options);

    $('#search_food').on("click", function () {
        datatable.setDataSourceParam('name', $('#food_datatable_search_query').val().toLowerCase());
        datatable.load()
    })
}

function checkMeal(btn) {
    var column = $(btn).parents(".datatable-row")
    var img = column.find('img').attr('src')
    var name = column.find('[name="food_name"]')[0].innerText
    if($(btn).val()==="breakfast"){
        $('#meal_kanban>div.kanban-container>div[data-id="_breakfast"]>.kanban-drag')[0].innerHTML += `
                    <div class="kanban-item">
                        <div class="d-flex align-items-center">
                            <div class="symbol symbol-light-primary mr-3">
                                <img alt="Pic" src="`+ img +`" />
                            </div>
                            <div class="d-flex flex-column align-items-start">
                                <span class="text-dark-50 font-weight-bold mb-1">`+ name +`</span>
                                <span class="label label-inline label-light-success font-weight-bold">Not Set</span>
                            </div>
                        </div>
                    </div>
        `
    }else if($(btn).val()==="lunch"){
        $('#meal_kanban>div.kanban-container>div[data-id="_lunch"]>.kanban-drag')[0].innerHTML += `
                    <div class="kanban-item">
                        <div class="d-flex align-items-center">
                            <div class="symbol symbol-light-primary mr-3">
                                <img alt="Pic" src="`+ img +`" />
                            </div>
                            <div class="d-flex flex-column align-items-start">
                                <span class="text-dark-50 font-weight-bold mb-1">`+ name +`</span>
                                <span class="label label-inline label-light-success font-weight-bold">Not Set</span>
                            </div>
                        </div>
                    </div>
        `
    }else{
        $('#meal_kanban>div.kanban-container>div[data-id="_dinner"]>.kanban-drag')[0].innerHTML += `
                    <div class="kanban-item">
                        <div class="d-flex align-items-center">
                            <div class="symbol symbol-light-primary mr-3">
                                <img alt="Pic" src="`+ img +`" />
                            </div>
                            <div class="d-flex flex-column align-items-start">
                                <span class="text-dark-50 font-weight-bold mb-1">`+ name +`</span>
                                <span class="label label-inline label-light-success font-weight-bold">Not Set</span>
                            </div>
                        </div>
                    </div>
        `
    }
}