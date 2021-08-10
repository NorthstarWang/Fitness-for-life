function loadTrendingArticle(getUrl) {
    $.ajax({
        url: getUrl,
        type: "POST",
        dataType: "json",
        success: function (result) {
            console.log(result)
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
                    "                                                <a href=\"#\" class=\"text-dark-75 font-weight-bold text-hover-primary font-size-lg mb-1\">"+ result[i]["name"] +"</a>\n" +
                    "                                                <!--end::Title-->\n" +
                    "                                            </div>\n" +
                    "                                            <!--end::Info-->\n" +
                    "                                            <!--begin::Label-->\n" +
                    "                                            <span class=\"label label-lg label-light-"+ color +" label-inline font-weight-bold py-4\">"+ label +"</span>\n" +
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