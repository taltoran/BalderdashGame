window.onload=function(){
    var form = document.getElementById("myForm");

    function playersValidation() 
    {
        //console.log("I'm in playersvalidation");

        var playersValid = true;
        document.querySelector('.content .invalidPlayers').innerHTML = '';


        var playersExp = "^[1-9]$";
	    if(!form.players.value.match(playersExp))
        {
            document.querySelector('.content .invalidPlayers').innerHTML = 'Number of players cannot be blank, 0, or greater than 9.';
            playersValid = false;
        }


        return playersValid;
    }

    function roundsValidation() 
    {
        //console.log("I'm in roundsvalidation");
        
        var roundsValid = true;
        document.querySelector('.content .invalidRounds').innerHTML = '';

        var roundsExp = "^[1-9]$";
	    if(!form.rounds.value.match(roundsExp))
        {
            document.querySelector('.content .invalidRounds').innerHTML = 'Number of rounds cannot be blank, 0, or greater than 9.';
            roundsValid = false;
        }

        return roundsValid;
    }


    function gameNameValidation() 
    {
       // console.log("I'm in gameNamevalidation");
        
        var gameNameValid = true;
        document.querySelector('.content .invalidGameName').innerHTML = '';

	    if(form.gameName.value == "")
        {
            form.gameName.value = makeid();
            //console.log("my new game name is: " + form.gameName.value);
        }

        return gameNameValid;
    }

    function makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    form.addEventListener('submit', function(evt){
        isValid = true;
        //console.log("I'm In event listener validation.js");

        isValid = playersValidation();
        isValid = roundsValidation() && isValid;
        isValid = gameNameValidation() && isValid;


        if (!isValid)
        {
            evt.preventDefault();
        }	
    });
}