const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const roundElement = document.getElementById("current-round");
const rollsElement = document.getElementById("current-round-rolls");
const totalScoreElement = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let round = 1;
let rolls = 0;

const rollDice = () => {
  diceValuesArr = [];

  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  }

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

const updateStats = () => {
  rollsElement.textContent = rolls;
  roundElement.textContent = round;
};

const updateRadioOption = (index, score) => {
  scoreInputs[index].disabled = false;
  scoreInputs[index].value = score;
  scoreSpans[index].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
  score += parseInt(selectedValue, 10);
  totalScoreElement.textContent = score;
  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

const getHighestDuplicates = (arr) => {
  const countObj = {};
  let highestDuplicate = 0;

  arr.forEach((num) => {
    countObj[num] = (countObj[num] || 0) + 1;
  });

  Object.values(countObj).forEach((value) => {
    if (value > highestDuplicate) {
      highestDuplicate = value;
    }
  });

  const sumOfAllDice = arr.reduce((ac, a) => (ac += a), 0);

  if (highestDuplicate === 3) {
    updateRadioOption(0, sumOfAllDice);
  }
  if (highestDuplicate === 4) {
    updateRadioOption(0, sumOfAllDice);
    updateRadioOption(1, sumOfAllDice);
  }
};

const detectFullHouse = (diceValuesArr) => {
  const countObj = {};
  let highestDuplicate = 0;
  let secondHighest = 0;

  diceValuesArr.forEach((num) => {
    countObj[num] = (countObj[num] || 0) + 1;
  });

  Object.values(countObj).forEach((value) => {
    if (value > highestDuplicate) {
      highestDuplicate = value;
      secondHighest = highestDuplicate;
    } else if (secondHighest > value) {
      secondHighest = value;
    }
  });

  if (highestDuplicate === 3 && secondHighest === 2) {
    updateRadioOption(2, 25);
  }
};

const resetRadioOptions = () => {
  scoreInputs.forEach((input, i) => {
    input.disabled = true;
    input.checked = false;
    input.value = 0;
    scoreSpans[i].textContent = "";
  });
};

const resetRolls = () => {
  rolls = 0;
  rollsElement.textContent = rolls;
};

const resetGame = () => {
  listOfAllDice.forEach((die) => {
    die.textContent = 0;
  });
  score = rolls = 0;
  round = 1;
  totalScoreElement.textContent = score;
  scoreHistory.innerHTML = ``;
  rollsElement.textContent = rolls;
  roundElement.textContent = round;
};

const checkForStraights = (arr) => {
  const uniqueNums = [...new Set(arr)].sort((a, b) => a - b);
  const sequence = uniqueNums.join("");
  let isLargeStraight =
    sequence.includes("12345") || sequence.includes("23456");
  let isSmallStraight =
    sequence.includes("1234") ||
    sequence.includes("2345") ||
    sequence.includes("3456");

  console.log(diceValuesArr, sequence, isSmallStraight, isLargeStraight);
  if (isSmallStraight) {
    updateRadioOption(3, 30);
  }
  if (isLargeStraight) {
    updateRadioOption(4, 40);
  }
};

rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You have made three rolls this round. Please select a score.");
  } else {
    resetRadioOptions();
    rolls++;
    rollDice();
    updateStats();
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr);
    checkForStraights(diceValuesArr);
    updateRadioOption(5, 0);
  }
});

rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;

  if (isModalShowing) {
    rulesBtn.textContent = "Hide rules";
    rulesContainer.style.display = "block";
  } else {
    rulesBtn.textContent = "Show rules";
    rulesContainer.style.display = "none";
  }
});

keepScoreBtn.addEventListener("click", () => {
  let isChecked = false;
  scoreInputs.forEach((input) => {
    if (input.checked) {
      isChecked = true;
      updateScore(input.value, input.id);
    }
  });
  if (isChecked) {
    if (round === 6) {
      setTimeout(() => {
        alert(`Final score: ${score}`);
        resetGame();
      }, 500);
    } else {
      resetRolls();
      round++;
      roundElement.textContent = round;
    }
    resetRadioOptions();
  } else {
    alert("Please select an option.");
  }
});
