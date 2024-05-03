import { LETTERS, questions } from "./data.js";

const body = document.querySelector(".body");
let attemptsWrong = 0;
const attemptsMax = 6;
let guessedLetters = [];
let answerWord = "";
let lose = false;

const BUTTONS = {};

const createGameField = function () {
  const leftSide = document.createElement("div");
  leftSide.classList.add("left-side");
  body.append(leftSide);
  const mainTitle = document.createElement("h1");
  mainTitle.classList.add("title");
  mainTitle.innerHTML = "Hangman";
  leftSide.append(mainTitle);
  const hangmanImg = document.createElement("img");
  hangmanImg.classList.add("hangman-img");
  hangmanImg.src = "./img/hangman0.jpg";
  leftSide.append(hangmanImg);
  const rightSide = document.createElement("div");
  rightSide.classList.add("right-side");
  body.append(rightSide);
  const answerRow = document.createElement("div");
  answerRow.classList.add("answer-row");
  rightSide.append(answerRow);
  const answerText = document.createElement("p");
  answerText.classList.add("answer-text");
  answerRow.append(answerText);
  const questionRow = document.createElement("div");
  questionRow.classList.add("question-row");
  rightSide.append(questionRow);
  const questionText = document.createElement("p");
  questionText.classList.add("question-row-text");
  questionRow.append(questionText);
  const attemptsRow = document.createElement("div");
  attemptsRow.classList.add("attempts-row");
  rightSide.append(attemptsRow);
  const attemptsRowText = document.createElement("p");
  attemptsRowText.classList.add("attempts-row-text");
  attemptsRowText.innerHTML = "Incorrect guesses:";
  attemptsRow.append(attemptsRowText);
  const attemptsCurrent = document.createElement("span");
  attemptsCurrent.classList.add("attempts-current");
  attemptsRow.append(attemptsCurrent);
  attemptsCurrent.innerHTML = `${attemptsWrong}`;
  const dividingLine = document.createElement("span");
  dividingLine.classList.add("dividing-line");
  dividingLine.innerText = `/`;
  attemptsRow.append(dividingLine);
  const attemptsMaxQty = document.createElement("span");
  attemptsMaxQty.classList.add("attempts-max");
  attemptsRow.append(attemptsMaxQty);
  attemptsMaxQty.innerHTML = `${attemptsMax}`;
  const lettersField = document.createElement("div");
  lettersField.classList.add("letters-field");
  rightSide.append(lettersField);
};

createGameField();

const getRandomPair = function () {
  const questionText = document.querySelector(".question-row-text");
  let newIndex = Math.floor(Math.random() * questions.length);
  let prevIndex = Number(window.localStorage.getItem("prevIndex") || -1);
  while (newIndex === prevIndex) {
    newIndex = Math.floor(Math.random() * questions.length);
  }
  window.localStorage.setItem("prevIndex", newIndex.toString());

  const { answer, question } = questions[newIndex];
  questionText.innerText = `Hint: ${question}`;
  answerWord = answer;
  console.log(answerWord);
};

const renderAnswer = function () {
  const answerText = document.querySelector(".answer-text");
  const answerState = Array.from(answerWord)
    .map((btnQty) => (guessedLetters.includes(btnQty) ? btnQty : "_"))
    .join("");
  answerText.innerHTML = answerState;
};

const onLetterPress = function (letter) {
  if (!guessedLetters.includes(letter) && !lose) {
    guessedLetters.push(letter);
    BUTTONS[letter].setAttribute("disabled", true);
    if (Array.from(answerWord).includes(letter)) {
      BUTTONS[letter].classList.add("true");
      renderAnswer();
      checkWin();
    } else {
      BUTTONS[letter].classList.remove("true");
      BUTTONS[letter].classList.add("false");
      renderMistakes();
      renderHangman();
      checkLose();
    }
  }
};

const createLetter = function (letter) {
  const lettersField = document.querySelector(".letters-field");
  const button = document.createElement("button");
  button.classList.add("button");
  button.innerHTML = `${letter}`;
  BUTTONS[letter] = button;
  const btnQty = button.textContent;
  button.addEventListener("click", () => {
    onLetterPress(btnQty);
  });
  lettersField.append(button);
};

const renderModal = function (result) {
  const backdrop = document.createElement("div");
  backdrop.classList.add("backdrop", "is-visible");
  body.append(backdrop);
  const modal = document.createElement("div");
  modal.classList.add("modal");
  backdrop.append(modal);
  const modalText = document.createElement("p");
  modal.append(modalText);

  if (result === "win") {
    modalText.innerHTML = "YOU WIN";
    const winImg = document.createElement("img");
    winImg.classList.add("win-img");
    winImg.src = "./img/applause.gif";
    modal.append(winImg);
  }

  if (result === "lose") {
    modalText.innerHTML = "YOU LOSE";
    const loseImg = document.createElement("img");
    loseImg.classList.add("lose-img");
    loseImg.src = "./img/angry.gif";
    modal.append(loseImg);
  }
  const modalAnswerText = document.createElement("p");
  modal.append(modalAnswerText);
  modalAnswerText.innerHTML = "The correct word was:";
  const modalAnswerWord = document.createElement("p");
  modal.append(modalAnswerWord);
  modalAnswerWord.innerHTML = answerWord;
  const modalButton = document.createElement("button");
  modalButton.classList.add("modal-btn");
  modalButton.innerHTML = "PLAY AGAIN";
  modal.append(modalButton);
  modalButton.addEventListener("click", playAgain);
  setTimeout(() => {
    modalButton.focus();
  }, 100);
};

const playAgain = function () {
  const backdrop = document.querySelector(".backdrop");
  backdrop.classList.remove("is-visible");
  backdrop.classList.add("is-hidden");
  setTimeout(() => body.removeChild(backdrop), 1000);
  attemptsWrong = 0;
  guessedLetters = [];
  const attemptsCurrent = document.querySelector(".attempts-current");
  attemptsCurrent.innerHTML = `${attemptsWrong}`;
  getRandomPair();
  renderAnswer();
  renderHangman();
  const buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => (button.disabled = false));
  buttons.forEach((button) => button.classList.remove("true"));
  buttons.forEach((button) => button.classList.remove("false"));
  lose = false;
};

const renderMistakes = function () {
  const attemptsCurrent = document.querySelector(".attempts-current");
  const attemptsMaxQty = document.querySelector(".attempts-max");
  attemptsWrong++;
  attemptsCurrent.innerHTML = `${attemptsWrong}`;
  attemptsMaxQty.innerHTML = `${attemptsMax}`;
  if (attemptsWrong >= attemptsMax) {
    lose = true;
  }
};

const renderHangman = function () {
  const hangmanImg = document.querySelector(".hangman-img");
  hangmanImg.src = `./img/hangman${attemptsWrong}.jpg`;
};

const checkWin = function () {
  const answerText = document.querySelector(".answer-text");
  answerWord === answerText.textContent ? renderModal("win") : null;
};

const checkLose = function () {
  lose ? renderModal("lose") : null;
};

const generateLetters = function (letters) {
  letters.forEach((letter) => createLetter(letter));
};

document.addEventListener("keydown", (event) => {
  if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
    onLetterPress(event.key.toUpperCase());
  }
});

generateLetters(LETTERS);
getRandomPair();
renderAnswer();
