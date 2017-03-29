function init() {

    function checkInput() {

        var answer = document.getElementById("editAnswer");
        var submitOk = true;

        if (answer.value === "") {
            submitOk = false;
            answer.style = "background-color:#99ff99";
            answer.placeholder = "Required";
        }

        if (submitOk) {
            editQuestion();
        }
    }
    
    function modalDisplay(){
        var modal = document.getElementById('myModal');
        //var span = document.getElementsByClassName("close")[0];
        var delayMillis = 1250; //2 second
        
        //open the modal 
        modal.style.display = "block";
        setTimeout(function(){window.location = '../createQuestion'}, delayMillis);    

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
        

    function editQuestion(event) {

        //var categoryInput = $('#category').val();
        //var questionInput = $('#question').val();
        //var answerInput = $('#answer').val();
        var answerElement = document.getElementById("editAnswer");
        var answerInput = answerElement.value;
        var idInput = document.getElementById("answerId").value;
        var postData = {
                answer: answerInput
            };
        console.log(postData);
        $.ajax({
            url: '/questions/' + idInput,
            type: 'PATCH',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(postData),
            success: function(data, textStatus, jqXHR) {
                modalDisplay();
                console.log("created");
            },
            /*error: function(err) { //On Error will need to popup banner that there was an error.
                if(err.responseJSON.message == "Username Taken"){
                    document.getElementById("uName").value = "";
                    document.getElementById("uName").style = "background-color:#99ff99";
                    document.getElementById("uName").placeholder = "Username Unavailable";
                }
            }*/
        });
    }

    $('#editQuestionFinal').on('click', checkInput);
}
$(document).on('ready', init);

/*function editQuestion(event) {
    var answerInput = document.getElementById("editAnswer").value;
    
    Question.findByIdAndUpdate("editAnswer", { $set: { answer: answerInput }}, { new: true }, function (err, question) {
            if (err) return handleError(err);
            res.send(question);
    })
}
$('#editQuestionFinal').on('click', editQuestion);

$(document).on('ready', init);*/