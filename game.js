const DelayMs = 500;
const SequenceLength = 12;
const QuickFlashMs = 200;
let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userPattern = [];
let lastPattern = [];
let longestPattern = [];
let level = 0;
let hasPlayerLost = false;
let cancelGame = false;
let isGameRunning = false;
let h1InnerHtml = "Level: 0<span></span>Best: 0";

function flashImage(color) {
  switch (color) {
    case "red":
      $("#redButton").addClass("flashImage");
      setTimeout(function () {
        $("#redButton").removeClass("flashImage");
      }, DelayMs);
      break;
    case "blue":
      $("#blueButton").addClass("flashImage");
      setTimeout(function () {
        $("#blueButton").removeClass("flashImage");
      }, DelayMs);
      break;
    case "green":
      $("#greenButton").addClass("flashImage");
      setTimeout(function () {
        $("#greenButton").removeClass("flashImage");
      }, DelayMs);
      break;
    case "yellow":
      $("#yellowButton").addClass("flashImage");
      setTimeout(function () {
        $("#yellowButton").removeClass("flashImage");
      }, DelayMs);
      break;
  }
}

function gameNotRunningClickHandler() {
  var id = $(this).attr("id");
  id = id.slice(0, -6);
  gameNotRunningImageClick(id);
}

async function gameNotRunningImageClick(color) {
  flashImage(color);
  playSound(color);
}

async function handleImageClick(color) {
  if (color == "start") {
    cancelGame = true;
  } else {
    userPattern.push(color);
    if (
      userPattern[userPattern.length - 1] == gamePattern[userPattern.length - 1]
    ) {
      flashImage(color);
      playSound(color);
    } else {
      hasPlayerLost = true;
      await sleep(500);
      playSound("lose");
    }
  }
}

function nextSequence() {
  return (randomNumber = Math.floor(Math.random() * 4));
}

function playSound(sound) {
  let audio;
  switch (sound) {
    case "red":
      audio = new Audio("Audio/simon_red.mp3");
      break;
    case "blue":
      audio = new Audio("Audio/simon_blue.mp3");
      break;
    case "green":
      audio = new Audio("Audio/simon_green.mp3");
      break;
    case "yellow":
      audio = new Audio("Audio/simon_yellow.mp3");
      break;
    case "lose":
      audio = new Audio("Audio/simon_lose.mp3");
      break;
    case "start":
      audio = new Audio("Audio/simon_start.mp3");
      break;
  }
  audio.play();
}

function resetGame() {
  cancelGame = false;
  level = 0;
  gamePattern = [];
  setH1InnerHtml();
  $("h2").text("");
  hasPlayerLost = false;
  for (i = 0; i < SequenceLength; i++) {
    gamePattern.push(buttonColors[nextSequence()]);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setH1InnerHtml(hasWon, endOfGame) {
  let best = longestPattern.length;
  if (hasWon) {
    best = level;
  } else if (level - 1 > best) {
    best = level - 1;
  }
  $("h1").html("Level: " + level + "<span></span>Best: " + best);
  if (endOfGame) {
    let text =
      "Oof, I hear fatty fish and leafy greens are good for your memory...";
    if (best >= 5 && best <= 9) {
      text = "Not bad, the average person can do 5 to 9 levels";
    } else if (best > 9 && best < SequenceLength) {
      text = "The average person can do 5 to 9 levels so your above average!";
    } else if (best == SequenceLength) {
      text = "Winner! Your memory is above average!";
    }
    $("h2").text(text);
  }
}

async function startGame() {
  isGameRunning = true;
  resetGame();
  playSound("start");
  await sleep(750);
  for (i = 0; i < gamePattern.length; i++) {
    level++;
    userPattern = [];
    setH1InnerHtml(false, false);
    for (j = 0; j < level; j++) {
      flashImage(gamePattern[j]);
      playSound(gamePattern[j]);
      await sleep(600);
    }
    while (userPattern.length < level) {
      let clickedId = await waitForUserInput();
      let id = clickedId.slice(0, -6);
      handleImageClick(id);
      if (hasPlayerLost || cancelGame) {
        break;
      }
    }
    if (hasPlayerLost || cancelGame) {
      break;
    }
    await sleep(600);
  }
  if (cancelGame) {
    startGame();
  }
  setH1InnerHtml(!hasPlayerLost, true);
  if (!hasPlayerLost) {
    winnerSound();
    winnerAnimation();
  }
  lastPattern = gamePattern.slice(0, level);
  if (level > longestPattern.length) {
    if (hasPlayerLost) {
      longestPattern = gamePattern.slice(0, level - 1);
    } else {
      longestPattern = gamePattern.slice(0, level);
    }
  }
  isGameRunning = false;
  $(".image-grid img").click(gameNotRunningClickHandler);
}

function waitForUserInput() {
  return new Promise((resolve) => {
    function handler(event) {
      $(".image-grid img, #startButton").off("click", handler);
      resolve(this.id);
    }
    $(".image-grid img, #startButton").on("click", handler);
  });
}

async function winnerAnimation() {
  for (i = 0; i < 5; i++) {
    $("#redButton").addClass("flashImage");
    setTimeout(function () {
      $("#redButton").removeClass("flashImage");
    }, QuickFlashMs);
    $("#blueButton").addClass("flashImage");
    setTimeout(function () {
      $("#blueButton").removeClass("flashImage");
    }, QuickFlashMs);
    $("#greenButton").addClass("flashImage");
    setTimeout(function () {
      $("#greenButton").removeClass("flashImage");
    }, QuickFlashMs);
    $("#yellowButton").addClass("flashImage");
    setTimeout(function () {
      $("#yellowButton").removeClass("flashImage");
    }, QuickFlashMs);
    await sleep(QuickFlashMs + 50);
  }
}

async function winnerSound() {
  playSound(userPattern[userPattern.length - 1]);
  await sleep(300);
  playSound(userPattern[userPattern.length - 1]);
  await sleep(300);
  playSound(userPattern[userPattern.length - 1]);
}

$("#startButton").click(function () {
  if (!isGameRunning) {
    $(".image-grid img").off("click", gameNotRunningClickHandler);
    startGame();
  }
});

$(".image-grid img").click(gameNotRunningClickHandler);

$("#lastButton").click(async function () {
  for (j = 0; j < lastPattern.length; j++) {
    flashImage(lastPattern[j]);
    playSound(lastPattern[j]);
    await sleep(600);
  }
});

$("#longestButton").click(async function () {
  for (j = 0; j < longestPattern.length; j++) {
    flashImage(longestPattern[j]);
    playSound(longestPattern[j]);
    await sleep(600);
  }
});
