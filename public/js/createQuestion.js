function init() {

    function checkInput() {

        var question = document.getElementById("question");
        var answer = document.getElementById("answer");
        var submitOk = true;

        if (question.value === "") {
            submitOk = false;
            question.style = "background-color:#99ff99";
            question.placeholder = "Required";
        }
        if (answer.value === "") {
            submitOk = false;
            answer.style = "background-color:#99ff99";
            answer.placeholder = "Required";
        }

        if (submitOk) {
            submitQuestion();
        }

    }
    function modalDisplay(){
        var modal = document.getElementById('myModal');
        //var span = document.getElementsByClassName("close")[0];
        var delayMillis = 2000; //2 second
        
        //open the modal 
        modal.style.display = "block";
        setTimeout(function(){window.location = '../Game/questions'}, delayMillis);    

        // // When the user clicks on <span> (x), close the modal
        // span.onclick = function() {
        //     modal.style.display = "none";
        // }

        // // When the user clicks anywhere outside of the modal, close it
        // window.onclick = function(event) {
        //     if (event.target == modal) {
        //         modal.style.display = "none";
        //     }
        // }
    }

    function submitQuestion(event) {

        //var categoryInput = $('#category').val();
        //var questionInput = $('#question').val();
        //var answerInput = $('#answer').val();
        var categoryInput = document.getElementById("category").value;
        var questionInput = document.getElementById("question").value.toLowerCase();
        var answerInput = document.getElementById("answer").value;
        var postData = {
                question: questionInput,
                category: categoryInput,
                answer: answerInput
            };
        console.log(postData);
        $.ajax({
            url: '../Game/questions',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(postData),
            success: function(data, textStatus, jqXHR) {
                modalDisplay();
                console.log("created");
                //window.location = '../createQuestion';
            },
            error: function(err) { //On Error will need to popup banner that there was an error.
                if(err.responseJSON.message == "Question already exists"){
                    document.getElementById("question").value = "";
                    document.getElementById("question").style = "background-color:#99ff99";
                    document.getElementById("question").placeholder = "Question already exists";
                }
            }
        });
    }

    $('#submitQuestionFinal').on('click', checkInput);
}
$(document).on('ready', init);
    //$('#register').on('click', registerUser);

    /*function modalDisplay(){
        var modal = document.getElementById('myModal');
        var span = document.getElementsByClassName("close")[0];
        var delayMillis = 3000; //3 second
        
        //open the modal 
        modal.style.display = "block";
        setTimeout(function(){window.location = '../Users/Login'}, delayMillis);  */  

        // // When the user clicks on <span> (x), close the modal
        // span.onclick = function() {
        //     modal.style.display = "none";
        // }

        // // When the user clicks anywhere outside of the modal, close it
        // window.onclick = function(event) {
        //     if (event.target == modal) {
        //         modal.style.display = "none";
        //     }
        // }

    /*function handleEnterKey(event) {
        if (event.keyCode == 13) {
            submitQuestion();
        }
    }*/


    /*$('#btnRegister').on('click', validateRegister);
    $('#fName').on('focus', clearFnameErr);
    $('#lName').on('focus', clearLnameErr);
    $('#uName').on('focus', clearUnameErr);
    $('#email').on('focus', clearEmailErr);
    $('#pwd').on('focus', clearPwdErr);
    $('#rPwd').on('focus', clearRpwdErr);*/
    // $('#fName').on('keydown', handleEnterKey); 
    // $('#lName').on('keydown', handleEnterKey); 
    
