
//Fade in dashboard box
$(document).ready(function(){
    $('.box').hide().fadeIn(1000);
    });

//Form validation
$(function() {
        // cache references to input controls
        var password = $('#password');
        var confirmPassword = $('#confirm-password');
        var email = $('#email');
        var username = $('#username');
        var fname = $('#fname');
        var lname = $('#lname');

        //need names and username validation
        var validator = $("#register-form").kendoValidator({

            rules: {

            passwordMatch: function(input) {

                // passwords must match
                if (input.is('#confirm-password')) {
                return $.trim(password.val()) === $.trim(confirmPassword.val());
                }

                return true;

            },

            passwordLength: function(input) {

                // passwords must be 6 chars
                if (input.is('#password')) {
                    return $.trim(password.val()).length >= 6;
                }

                return true;

            },

            emailMatch: function(input) {

                // email must be valid
                if (input.is('#email')) {
                    var str = $.trim(email.val());
                    var patt = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    var res = patt.test(str);
                    return res;
                }
                return true;

            },

            userAlphanumeric: function(input) {

                // username must be alphanumeric
                if (input.is('#username')) {
                    var str = $.trim(username.val());
                    var patt = /^[a-z0-9_-]+$/i;
                    var res = patt.test(str);
                    return res;
                }
                return true;
            }
            },
            messages: {

            // custom error messages. email gets picked up 
            // automatically for any inputs of that type
            passwordMatch: 'The passwords don\'t match',
            passwordLength: 'Must be at least 6 characters',
            userAlphanumeric: 'Letters, numbers, -, _ only',
            emailMatch: 'Must be a valid email'
            }

        }).getKendoValidator(); 


        //ON SUBMIT FORM VALIDATION
        $('#register-form').on("submit", function(event) {
            if (!validator.validate()) {
                // If the form is valid, the Validator will return true
                //do stuff
                event.preventDefault();
            }
        });

        });