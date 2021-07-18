function notify(text, type) {
    return $.notify(text, {
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
        type: type
    })
}

function addClass(size) {
    document.getElementById("content").className = "card-body font-size-" + size;
    notify("Font size has been changed.", "info")
}

function addToFav(url) {
    $.ajax({
        url: url,
        type: "POST",
        dataType: "Text",
        success: function (result) {
            if (result === "add") {
                notify("This article has been added to your favourite articles.", "success")
                document.getElementById("fav").classList.remove("btn-light-success")
                document.getElementById("fav").classList.add("btn-light-danger")
                $('#fav').attr("data-original-title", "Remove from favourite articles")
                document.getElementById("favourite_icon").className = "flaticon2-cross"
            } else if (result === "remove") {
                notify("This article has been removed from your favourite article.", "danger")
                document.getElementById("fav").classList.remove("btn-light-danger")
                document.getElementById("fav").classList.add("btn-light-success")
                $('#fav').attr("data-original-title", "Save as favourite articles")
                document.getElementById("favourite_icon").className = "flaticon2-add-1"
            }
        }
    })
}

function loadFav(url) {
    KTApp.block("#favouriteArticles .modal-content", {
        overlayColor: '#000000',
        state: 'primary',
        opacity: 0.1,
        message: 'Loading...'
    });
    $.ajax({
        url: url,
        dataType: "json",
        type: "POST",
        success: function (result) {
            KTApp.unblock('#favouriteArticles .modal-content');
            let element = document.getElementById("favourite_articles_list")
            //clear previous html code first
            element.innerHTML = ""
            if (result.length > 0) {
                //not empty favourite list
                for (let i = 0; i < result.length; i++) {
                    element.innerHTML += "<div class='d-flex flex-column flex-grow-1 mb-4 mt-4'><a href='/article/get/" + result[i][0] + "' class='text-dark-75 font-weight-bold text-hover-success font-size-lg mb-2'>" + (i + 1) + ". " + result[i][1] + "</a><span class=\"text-muted\"><span class=\"label label-success label-inline mr-2\">" + result[i][2] + "</span></span></div>"
                    if (i !== result.length - 1) {
                        element.innerHTML += "<div class=\"separator separator-dashed separator-border-3\"></div>\n"
                    }
                }
            } else {
                element.innerHTML = "<div class='d-flex flex-column flex-grow-1 mb-4 mt-4'><p class='font-size-h5 text-center font-weight-bolder'>There is no article you like for now.</p></div>"
            }
        }
    })
}

function goto(per_page, url) {
    window.location.href = url+"&per_page=" + per_page;
}