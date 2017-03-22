window.onload=function(){
    var form = document.getElementById("myForm");

    form.addEventListener('submit', function(evt){
        isValid = true;
        //console.log("I'm In event listener validation.js");


        if (!isValid)
        {
            evt.preventDefault();
        }	
    });
}