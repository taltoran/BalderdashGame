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

    
    document.getElementById("ludicrousLaws").addEventListener("click", function() {
        if (form.ludicrousLaws.checked == false) {
          form.allCategories.checked = false;
        } 
    });

    document.getElementById("definitions").addEventListener("click", function() {
        if (form.definitions.checked == false) {
          form.allCategories.checked = false;
        } 
    });

    document.getElementById("famousPeople").addEventListener("click", function() {
        if (form.famousPeople.checked == false) {
          form.allCategories.checked = false;
        } 
    });

    document.getElementById("acronyms").addEventListener("click", function() {
        if (form.acronyms.checked == false) {
          form.allCategories.checked = false;
        } 
    });

    document.getElementById("movieHeadlines").addEventListener("click", function() {
        if (form.movieHeadlines.checked == false) {
          form.allCategories.checked = false;
        } 
    });

    document.getElementById("allCategories").addEventListener("click", function() {
        if (form.allCategories.checked == true) {
          form.ludicrousLaws.checked = true;
          form.definitions.checked = true;
          form.famousPeople.checked = true;
          form.acronyms.checked = true;
          form.movieHeadlines.checked = true;
        } else {
          form.ludicrousLaws.checked = false;
          form.definitions.checked = false;
          form.famousPeople.checked = false;
          form.acronyms.checked = false;
          form.movieHeadlines.checked = false;
        }
    });

    function categoryValidation()
    {
        var categoriesValid = true;
        document.querySelector('.content .invalidCategories').innerHTML = '';

        var ludicrousLaws = form.ludicrousLaws.checked;
        var definitions = form.definitions.checked;
        var famousPeople = form.famousPeople.checked;
        var acronyms = form.acronyms.checked;
        var movieHeadlines = form.movieHeadlines.checked;

        /*if (ludicrousLaws == true) {
            category: req.body.ludicrousLaws;
        } 

        if (definitions == true) {
            category: req.body.definitions;
        } 
        
        if (famousPeople == true) {
            category: req.body.famousPeople;
        } 
        
        if (acronyms == true) {
            category: req.body.acronyms;
        } 
        
        if (movieHeadlines == true) {
            category: req.body.movieHeadlines;
        } */

        if(ludicrousLaws == false && definitions == false && famousPeople == false && acronyms == false && movieHeadlines == false) {
            document.querySelector('.content .invalidCategories').innerHTML = 'Must select at least 1 category.';
            categoriesValid = false;
        }

        return categoriesValid;
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
        isValid = categoryValidation() && isValid;


        if (!isValid)
        {
            evt.preventDefault();
        }	
    });
}