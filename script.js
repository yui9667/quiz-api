//https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
let correctAnswer = '',
  correctScore = (askedCount = 0),
  totalQuestion = 10;

//answer checking

async function landQuestion() {
  const APIUrl =
    'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple';
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  _result.innerHTML = '';
  showQuestion(data.results[0]);
  //console.log(data.results[0]);
}
function eventListeners() {
  _checkBtn.addEventListener('click', checkAnswer);
  _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', () => {
  landQuestion();
  eventListeners();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

//Display question and options
function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  console.log(correctAnswer);
  let incorrectAnswer = data.incorrect_answers;
  console.log(incorrectAnswer);
  let optionsList = incorrectAnswer;
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  ); //Inserting correct asnwer in random position in the options list
  //console.log(optionsList);
  // console.log(correctAnswer);
  _question.innerHTML = `${data.question}`;
  _options.innerHTML = `<ul>${optionsList
    .map(
      (option, index) => `<li> ${index + 1}. <span> ${option} </span> </li>
    `
    )
    .join('')}
  </ul>`;
  selectOption();
}
//options selection
function selectOption() {
  _options.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', () => {
      if (_options.querySelector('.selected')) {
        const activeOption = _options.querySelector('.selected');
        activeOption.classList.remove('selected');
      }
      option.classList.add('selected');
    });
  });
  console.log(correctAnswer);
}

function checkAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector('.selected')) {
    let selectedAnswer = _options.querySelector('.selected span').textContent;
    // console.log(selectedAnswer);
    if (selectedAnswer.trim() === HTMLDecode(correctAnswer)) {
      correctScore++;
      _result.innerHTML = `<p> <i class = "fas fa-check"></i>Correct Answer!</p>`;
    } else {
      _result.innerHTML = `<p> <i class = "fas fa-times"></i>Incorrect Answer!</p><p><small><b>Correct Answer:</b>${correctAnswer}</small> </p>`;
    }
    checkCount();
  } else {
    _result.innerHTML = `<p> <i class = "fas fa-question"></i>Please selecte an option!</p>`;
    _checkBtn.disabled = false;
  }
}
//To convent html entities into normal text of correct answer id threre is any.
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, 'text/html');
  return doc.documentElement.textContent;
}

function checkCount() {
  askedCount++;
  setCount();
  if (askedCount === totalQuestion) {
    _result.innerHTML = `<p>Your score is ${correctScore}. </p>`;
    _playAgainBtn.style.display = 'block';
    _checkBtn.style.display = 'none';
  } else {
    setTimeout(() => {
      landQuestion();
    }, 300);
  }
}

function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

function restartQuiz() {
  correctScore = askedCount = 0;
  _playAgainBtn.style.display = 'none';
  _checkBtn.style.display = 'block';
  _checkBtn.disabled = false;
  setCount();
}
