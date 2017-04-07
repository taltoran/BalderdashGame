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


    document.getElementById("words").addEventListener("click", function() {
        if (form.words.checked == false) {
          form.allCategories.checked = false;
        } 
    });

    document.getElementById("people").addEventListener("click", function() {
        if (form.people.checked == false) {
          form.allCategories.checked = false;
        } 
    });

    document.getElementById("initials").addEventListener("click", function() {
        if (form.initials.checked == false) {
          form.allCategories.checked = false;
        } 
    });

    document.getElementById("movies").addEventListener("click", function() {
        if (form.movies.checked == false) {
          form.allCategories.checked = false;
        } 
    });

    document.getElementById("laws").addEventListener("click", function() {
        if (form.laws.checked == false) {
          form.allCategories.checked = false;
        } 
    });

    document.getElementById("allCategories").addEventListener("click", function() {
        if (form.allCategories.checked == true) {
          form.words.checked = true;
          form.people.checked = true;
          form.initials.checked = true;
          form.movies.checked = true;
          form.laws.checked = true;
        } else {
          form.words.checked = false;
          form.people.checked = false;
          form.initials.checked = false;
          form.movies.checked = false;
          form.laws.checked = false;
        }
    });

    function categoryValidation()
    {
        var categoriesValid = true;
        document.querySelector('.content .invalidCategories').innerHTML = '';

        var words = form.words.checked;
        var people = form.people.checked;
        var initials = form.initials.checked;
        var movies = form.movies.checked;
        var laws = form.laws.checked;

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

        if(words == false && people == false && initials == false && movies == false && laws == false) {
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