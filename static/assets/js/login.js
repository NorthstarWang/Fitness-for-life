// Class Definition
function KTLogin(login_validation, notify_url, account_check_url, login_insert_url, mail_url) {
    var _login;

    var _showForm = function (form) {
        var cls = 'login-' + form + '-on';
        var new_form = 'kt_login_' + form + '_form';

        _login.removeClass('login-forgot-on');
        _login.removeClass('login-signin-on');
        _login.removeClass('login-signup-on');

        _login.addClass(cls);

        KTUtil.animateClass(KTUtil.getById(new_form), 'animate__animated animate__backInUp');
    }

    var _handleSignInForm = function () {
        var validation;

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            KTUtil.getById('kt_login_signin_form'),
            {
                fields: {
                    username: {
                        validators: {
                            notEmpty: {
                                message: 'Username is required'
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: 'Password is required'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    //defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
                    bootstrap: new FormValidation.plugins.Bootstrap(),
                }
            }
        );

        $('#kt_login_signin_submit').on('click', function (e) {
            e.preventDefault();

            validation.validate().then(function (status) {
                if (status === 'Valid') {
                    $.ajax({
                        url: login_validation,
                        type: 'POST',
                        data: {
                            username: $('#username_sign_in').val(),
                            password: $('#password_sign_in').val()
                        },
                        success: function (data) {
                            if (data === '0') {
                                swal.fire({
                                    text: 'You are now signed in!',
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn font-weight-bold btn-light-primary"
                                    }
                                }).then(function () {
                                    window.location.href = notify_url
                                })
                            } else if (data === '1') {
                                swal.fire({
                                    text: 'Wrong username/password, please try again.',
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn font-weight-bold btn-light-primary"
                                    }
                                })
                            }

                        }
                    }).then(function () {
                        KTUtil.scrollTop();
                    });
                } else {
                    swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light-primary"
                        }
                    }).then(function () {
                        KTUtil.scrollTop();
                    });
                }
            });
        });

        // Handle forgot button
        $('#kt_login_forgot').on('click', function (e) {
            e.preventDefault();
            _showForm('forgot');
        });

        // Handle signup
        $('#kt_login_signup').on('click', function (e) {
            e.preventDefault();
            _showForm('signup');
        });
    }

    var _handleSignUpForm = function () {
        var validation;
        var form = KTUtil.getById('kt_login_signup_form');

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            form,
            {
                fields: {
                    username: {
                        validators: {
                            notEmpty: {
                                message: 'Username is required'
                            },
                            callback: {
                                callback: function () {
                                    return $.ajax({
                                        url: account_check_url,
                                        type: 'POST',
                                        data: {
                                            username: $('#username').val(),
                                        }
                                    })
                                }
                            }
                        }
                    },
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Email address is required'
                            },
                            emailAddress: {
                                message: 'The value is not a valid email address'
                            }
                        }
                    },
                    cpassword: {
                        validators: {
                            notEmpty: {
                                message: 'The password confirmation is required'
                            },
                            identical: {
                                compare: function () {
                                    return form.querySelector('[name="password"]').value;
                                },
                                message: 'The password and its confirm are not the same'
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: 'The password is required'
                            }
                        }
                    },
                    age: {
                        validators: {
                            notEmpty: {
                                message: 'Your age is required'
                            }
                        }
                    },
                    height: {
                        validators: {
                            notEmpty: {
                                message: 'Your height is required'
                            }
                        }
                    },
                    weight: {
                        validators: {
                            notEmpty: {
                                message: 'Your weight is required'
                            }
                        }
                    },
                    agree: {
                        validators: {
                            notEmpty: {
                                message: 'You must accept the terms and conditions'
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        // Revalidate the confirmation password when changing the password
        form.querySelector('[name="password"]').addEventListener('input', function () {
            validation.revalidateField('cpassword');
        });

        $('#kt_login_signup_submit').on('click', function (e) {
            e.preventDefault();

            validation.validate().then(function (status) {
                if (status === 'Valid') {
                    KTApp.blockPage({
                        overlayColor: '#000000',
                        state: 'success',
                        opacity: 0.1,
                        message: 'Signing up...'
                    });
                    $.ajax({
                        url: login_insert_url,
                        type: 'POST',
                        data: {
                            username: $('#username').val(),
                            email: $('#email').val(),
                            password: $('#password').val(),
                            age: $('#age').val(),
                            height: $('#height').val(),
                            weight: $('#weight').val(),
                        },
                        success: function (data) {
                            $.ajax({
                                url: mail_url,
                                type: 'POST',
                                data: {
                                    email: $('#email').val(),
                                    username: $('#username').val()
                                },
                                success: function (data_new) {
                                    if (data_new === '0') {
                                        swal.fire({
                                            text: data,
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn font-weight-bold btn-light-primary"
                                            }
                                        })
                                    } else {
                                        swal.fire({
                                            text: 'The account is successfully registered, but error occurred when we attempt to send confirmation mail',
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn font-weight-bold btn-light-primary"
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }).then(function () {
                        KTUtil.scrollTop();
                    });
                } else {
                    swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light-primary"
                        }
                    }).then(function () {
                        KTUtil.scrollTop();
                    });
                }
            });
        });

        // Handle cancel button
        $('#kt_login_signup_cancel').on('click', function (e) {
            e.preventDefault();

            _showForm('signin');
        });
    }

    var _handleForgotForm = function () {
        var validation;

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            KTUtil.getById('kt_login_forgot_form'),
            {
                fields: {
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Email address is required'
                            },
                            emailAddress: {
                                message: 'The value is not a valid email address'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        // Handle submit button
        $('#kt_login_forgot_submit').on('click', function (e) {
            e.preventDefault();

            validation.validate().then(function (status) {
                if (status === 'Valid') {
                    // Submit form
                    KTUtil.scrollTop();
                } else {
                    swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light-primary"
                        }
                    }).then(function () {
                        KTUtil.scrollTop();
                    });
                }
            });
        });

        // Handle cancel button
        $('#kt_login_forgot_cancel').on('click', function (e) {
            e.preventDefault();

            _showForm('signin');
        });
    }

    _login = $('#kt_login');

    _handleSignInForm();
    _handleSignUpForm();
    _handleForgotForm();
};
