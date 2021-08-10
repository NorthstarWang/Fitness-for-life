function loadTrendingArticle(getUrl) {
    $.ajax({
        url:getUrl,
        type:"POST",
        dataType:"json",
        success:function (result) {
            console.log(result)
            for (let i = 0; i < result.length; i++) {
                document.getElementById("trending_articles").innerHTML += "<div class=\"d-flex align-items-center pb-9\">\n" +
                "                                    <!--begin::Symbol-->\n" +
                "                                    <div class=\"symbol symbol-70 symbol-2by3 flex-shrink-0 mr-6\">\n" +
                "                                        <div class=\"symbol-label\" style=\"background-image: url('static/assets/media/stock/"+ result[i]["img"] +".jpg')\"></div>\n" +
                "                                    </div>\n" +
                "                                    <!--end::Symbol-->\n" +
                "                                    <!--begin::Section-->\n" +
                "                                    <div class=\"d-flex flex-column flex-grow-1\">\n" +
                "                                        <!--begin::Title-->\n" +
                "                                        <a href=\"/article/get/"+ result[i]["id"] +"\" class=\"text-dark-75 font-weight-bolder text-hover-primary font-size-lg mb-1\">"+ result[i]["title"] +"</a>" +
                "                                        <!--end::Title-->\n" +
                "                                        <!--begin::Desc-->\n" +
                "                                        <span class=\"text-muted font-weight-bold\">"+ result[i]["tag"] +"</span>\n" +
                "                                        <!--begin::Desc-->\n" +
                "                                    </div>\n" +
                "                                    <!--end::Section-->\n" +
                "                                </div>"
        }
            }

    })
}