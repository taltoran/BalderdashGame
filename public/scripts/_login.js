
//Fade in dashboard box
$(document).ready(function(){
    $('.box').hide().fadeIn(1000);
    });

//Form validation
$(function() {
        // cache references to input controls
        var password = $('#password');
        var username = $('#username');

        //need names and username validation
        var validator = $("#register-form").kendoValidator({

            rules: {

            passwordLength: function(input) {

                // passwords must be 6 chars
                if (input.is('#password')) {
                    return $.trim(password.val()).length >= 6;
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
            passwordLength: 'Must be at least 6 characters',
            userAlphanumeric: 'Letters, numbers, -, _ only'
            }

        }).getKendoValidator(); //.data('kendoValidator');


        //ON SUBMIT FORM VALIDATION
        $('#login-form').on("submit", function(event) {
            if (!validator.validate()) {
                // If the form is valid, the Validator will return true
                //do stuff
                event.preventDefault();
            }
        });

        });