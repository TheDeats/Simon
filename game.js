buttonColors = ["red", "blue", "green", "yellow"];
randomChosenColor = buttonColors[nextSequence()];
gamePattern = [randomChosenColor];

function nextSequence(){
    return randomNumber = Math.floor(Math.random() * 4);
}

$("img").click(handleColor);

function handleColor(){
    switch(randomChosenColor){
        case "red":
            $("#redButton").css("filter", "brightness(1.5)");
            audio = new Audio("Audio/simon_red.mp3");
            audio.play();
            setTimeout(function() {$("#redButton").css("filter", "brightness(1)");}, 1111);    
            break;
        case "blue":
            $("#blueButton").css("filter", "brightness(1.5)");
            audio = new Audio("Audio/simon_blue.mp3");
            audio.play();
            setTimeout(function() {$("#blueButton").css("filter", "brightness(1)");}, 1111);      
            break;
        case "green":
            $("#greenButton").css("filter", "brightness(1.5)");
            audio = new Audio("Audio/simon_green.mp3");
            audio.play();
            setTimeout(function(){$("#greenButton").css("filter", "brightness(1)");}, 1111);    
            break;
        case "yellow":
            $("#yellowButton").css("filter", "brightness(1.5)");
            audio = new Audio("Audio/simon_yellow.mp3");
            audio.play();
            setTimeout(function(){$("#yellowButton").css("filter", "brightness(1)");}, 1111);   
            break;
    }
}

