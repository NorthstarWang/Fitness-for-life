function loadTrendingArticle(getUrl) {
    $.ajax({
        url: getUrl,
        type: "POST",
        dataType: "json",
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                document.getElementById("trending_articles").innerHTML += "<div class=\"d-flex align-items-center pb-9\">\n" +
                    "                                    <!--begin::Symbol-->\n" +
                    "                                    <div class=\"symbol symbol-70 symbol-2by3 flex-shrink-0 mr-6\">\n" +
                    "                                        <div class=\"symbol-label\" style=\"background-image: url('static/assets/media/stock/" + result[i]["img"] + ".jpg')\"></div>\n" +
                    "                                    </div>\n" +
                    "                                    <!--end::Symbol-->\n" +
                    "                                    <!--begin::Section-->\n" +
                    "                                    <div class=\"d-flex flex-column flex-grow-1\">\n" +
                    "                                        <!--begin::Title-->\n" +
                    "                                        <a href=\"/article/get/" + result[i]["id"] + "\" class=\"text-dark-75 font-weight-bolder text-hover-primary font-size-lg mb-1\">" + result[i]["title"] + "</a>" +
                    "                                        <!--end::Title-->\n" +
                    "                                        <!--begin::Desc-->\n" +
                    "                                        <span class=\"text-muted font-weight-bold\">" + result[i]["tag"] + "</span>\n" +
                    "                                        <!--begin::Desc-->\n" +
                    "                                    </div>\n" +
                    "                                    <!--end::Section-->\n" +
                    "                                </div>"
            }
        }
    })
}

function loadTrendingSport(getUrl) {
    $.ajax({
        url: getUrl,
        dataType: "json",
        type: "post",
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                var color
                var label
                switch (result[i]["difficulty"]) {
                    case 0:
                        color = "success"
                        label = "Easy"
                        break
                    case 1:
                        color = "warning"
                        label = "Intermediate"
                        break
                    case 2:
                        color = "danger"
                        label = "Advance"
                        break
                }
                document.getElementById("trending_sport").innerHTML += "\n" +
                    "                                <!--begin::Item-->\n" +
                    "                                <div class=\"mb-6\">\n" +
                    "                                    <!--begin::Content-->\n" +
                    "                                    <div class=\"d-flex align-items-center flex-grow-1\">\n" +
                    "                                        <!--begin::Section-->\n" +
                    "                                        <div class=\"d-flex align-items-center flex-grow-1\">\n" +
                    "                                            <!--begin::Info-->\n" +
                    "                                            <div class=\"d-flex flex-column align-items-cente py-2 pr-3 flex-grow-1\">\n" +
                    "                                                <!--begin::Title-->\n" +
                    "                                                <a href=\"#\" class=\"text-dark-75 font-weight-bold text-hover-primary font-size-lg mb-1\">" + result[i]["name"] + "</a>\n" +
                    "                                                <!--end::Title-->\n" +
                    "                                            </div>\n" +
                    "                                            <!--end::Info-->\n" +
                    "                                            <!--begin::Label-->\n" +
                    "                                            <span class=\"label label-lg label-light-" + color + " label-inline font-weight-bold py-4\">" + label + "</span>\n" +
                    "                                            <!--end::Label-->\n" +
                    "                                        </div>\n" +
                    "                                        <!--end::Section-->\n" +
                    "                                    </div>\n" +
                    "                                    <!--end::Content-->\n" +
                    "                                </div>\n" +
                    "                                <!--end::Item-->"
            }
        }
    })
}

function notify(text, type) {
    $.notify(text, {
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
        type: type
    })
}

function healthChart(retreiveUrl) {
    KTApp.block("#health_chart", {
        overlayColor: '#000000',
        state: 'primary',
        opacity: 0.3
    })
    $.ajax({
        url: retreiveUrl,
        type: "POST",
        dataType: "json",
        success: function (result) {
            document.getElementById("health_chart").innerHTML = ''
            const apexChart = "#health_chart";
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

            KTApp.unblock('#health_chart')
        }
    })
}