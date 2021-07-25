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