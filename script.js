const startButton = document.getElementById("start-btn")
const nextButton = document.getElementById("next-btn")
const restartButton = document.getElementById("restart-btn")
const endButton = document.getElementById("end-btn")
const picture1 = document.getElementById("picture1")
const picture2 = document.getElementById("picture2")
const congrats = document.getElementById("congrats")
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-btns')
const scoreElement = document.getElementById('score')
const gradeElement = document.getElementById('grade')
const theme1Button = document.getElementById('theme1')
const theme2Button = document.getElementById('theme2')
const theme3Button = document.getElementById('theme3')
const theme4Button = document.getElementById('theme4')
const theme = document.getElementById('theme')

const submit = document.getElementById('submit-score')
const nameinput = document.getElementById('name-input')
const highscorescont = document.getElementById("high-scores-container")

let score = 0

let grade = ''
let shuffledQuestions, currentQuestionIndex
let selectedTheme

startButton.addEventListener('click', startPress)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})
endButton.addEventListener('click', endScreen)
restartButton.addEventListener('click', restartGame)

theme1Button.addEventListener('click', () => {
  selectedTheme = "general"
  startGame();
})

theme2Button.addEventListener('click', () => {
  selectedTheme = "maths"
  startGame();
})

theme3Button.addEventListener('click', () => {
  selectedTheme = "history"
  startGame();
})

theme4Button.addEventListener('click', () => {
  selectedTheme = "science"
  startGame();
})



const highScoresList = JSON.parse(localStorage.getItem('highScores')) || []
function saveHighScore(score, name, theme) {
  const newScore = { name, score, theme }
  highScoresList.push(newScore)
  highScoresList.sort((a, b) => b.score - a.score)
  highScoresList.splice(5) // keep only top 5 scores
  localStorage.setItem('highScores', JSON.stringify(highScoresList))
}
function displayHighScores() {
  const highScoresElement = document.getElementById('high-scores')
  highScoresElement.innerHTML = ''
  highScoresList.forEach((score) => {
    const li = document.createElement('li')
    li.textContent = `Theme: ${score.theme} - Name: ${score.name}, Score: ${score.score}`
    highScoresElement.appendChild(li)
  });
}
submit.addEventListener('click', () => {
  const nameInput = document.getElementById('name-input')
  const playerName = nameInput.value

  if (playerName.trim() !== '') {
    if (selectedTheme) {
      saveHighScore(score, playerName, selectedTheme)
      displayHighScores()
      nameInput.value = ''
    } else {
      alert('Please select a theme before submitting the high score.')
    }
  } else {
    alert('Please enter your name.')
  }
  restartButton.classList.remove('hide')
  submit.classList.add('hide')
  nameinput.classList.add('hide')
});

function startPress() {
  console.log('started')
  startButton.classList.add('hide')
  theme.classList.remove('hide')
  theme1Button.classList.remove('hide')
  theme2Button.classList.remove('hide')
  theme3Button.classList.remove('hide')
  theme4Button.classList.remove('hide')
}

function startGame() {
  let questions = questionSets[selectedTheme];
  if (!questions) {
    console.error("Questions not found for the selected theme.")
    return;
  }

  theme.classList.add('hide')
  theme1Button.classList.add('hide')
  theme2Button.classList.add('hide')
  theme3Button.classList.add('hide')
  theme4Button.classList.add('hide')

  console.log('started')
  startButton.classList.add('hide')
  picture1.classList.add('hide')
  picture2.classList.add('hide')
  scoreElement.classList.remove('hide')
  shuffledQuestions = questions.slice().sort(() => Math.random() - 0.5)
  currentQuestionIndex = 0

  score = 0
  scoreElement.innerText = `Score: ${score}`
  console.log(score)
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function restartGame() {
  console.log('ended')
  congrats.classList.add('hide')
  questionContainerElement.classList.add('hide')
  startButton.classList.remove('hide')
  restartButton.classList.add('hide')
  scoreElement.classList.add('hide')
  gradeElement.classList.add('hide')
  highscorescont.classList.add("hide")
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  if (correct) {
    score += 1
    scoreElement.innerText = `Score: ${score}`;
  }
  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
    button.removeEventListener('click', selectAnswer)
    button.disabled = true

  })
  if (10 > currentQuestionIndex + 1) {  //if (10 >  currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    endButton.classList.remove('hide')
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('incorrect')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('incorrect')
}

function endScreen() {
  clearStatusClass(document.body)
  calculateGrade(score)
  highscorescont.classList.remove("hide")
  // if new high score, save it
  if (score > 0) {
    submit.classList.remove('hide')
    nameinput.classList.remove('hide')
    restartButton.classList.remove('hide')
  }
  if (highScoresList && highScoresList.length > 0 && score > highScoresList[0].score) {
    saveHighScore(score);
  }
  displayHighScores();
  questionContainerElement.classList.add('hide')
  picture1.classList.remove('hide')
  congrats.classList.remove('hide')
  picture2.classList.remove('hide')
  endButton.classList.add('hide')
  scoreElement.classList.add('hide');
  if (grade == 'A') {
    congrats.innerText = `Gret!
    You scored: ${score} / 10`
  } else if (grade == 'B') {
    congrats.innerText = `Well Done!
    You scored: ${score} / 10`
  } else if (grade == 'C') {
    congrats.innerText = `Bravo! 
     You scored: ${score} / 10`
  } else if (grade == 'D') {
    congrats.innerText = `Keep Going!
    You scored: ${score} / 10`
  } else {
    congrats.innerText = `Try Again!
    You scored: ${score} / 10`
  }

  gradeElement.innerText = `Grade: ${grade}`
  gradeElement.classList.remove('hide')
}

function calculateGrade(score) {
  if (score * 10 >= 90) {
    grade = "A";
  } else if (score * 10 >= 80) {
    grade = "B";
  } else if (score * 10 >= 70) {
    grade = "C";
  } else if (score * 10 >= 60) {
    grade = "D";
  } else {
    grade = "F";
  }
}

const questionSets = {
  general: [
    {
      question: 'What Colour is Grass?',
      answers: [
        { text: 'Green', correct: true },
        { text: 'Blue', correct: false },
        { text: 'Red', correct: false },
        { text: 'Purple', correct: false }

      ]
    },
    {
      question: 'Am I a Computer?',
      answers: [
        { text: 'Yes', correct: true },
        { text: 'No', correct: false }

      ]
    },
    {
      question: 'What is the Roman version of the Greek God, Zeus?',
      answers: [
        { text: 'Hades', correct: false },
        { text: 'Posiden', correct: false },
        { text: 'Jupiter', correct: true },
        { text: 'Mars', correct: false }

      ]
    },
    {
      question: 'How Many Days are in a Leap Year?',
      answers: [
        { text: '266', correct: false },
        { text: '366', correct: true },
        { text: '265', correct: false },
        { text: '365', correct: false }

      ]
    },
    {
      question: 'What is the Smallest Country in the World?',
      answers: [
        { text: 'Vatican City', correct: true },
        { text: 'San Marino', correct: false },
        { text: 'Liechtenstein', correct: false },
        { text: 'Luxembourg', correct: false }

      ]
    },
    {
      question: 'Where is the Largest Desert in the World Located?',
      answers: [
        { text: 'Asia', correct: false },
        { text: 'Africa', correct: false },
        { text: 'America', correct: false },
        { text: 'Antarctica', correct: true }

      ]
    },
    {
      question: 'When was Google Created',
      answers: [
        { text: '2001', correct: false },
        { text: '1999', correct: false },
        { text: '2414', correct: false },
        { text: '1998', correct: true }

      ]
    },
    {
      question: '667+567',
      answers: [
        { text: '12', correct: false },
        { text: '1233', correct: false },
        { text: '1234', correct: true },
        { text: '1236', correct: false }

      ]
    },
    {
      question: 'What is the most sold flavour of Walker’s crisps?',
      answers: [
        { text: 'Ready Salted', correct: false },
        { text: 'Salt and Vinegar', correct: false },
        { text: 'Prawn Cocktail', correct: false },
        { text: 'Cheese and Onion', correct: true }

      ]
    },
    {
      question: 'sdrawkcab noitseuq siht rewsna',
      answers: [
        { text: 'KO', correct: true },
        { text: 'Defenestration', correct: false },
        { text: 'Dolphins', correct: false },
        { text: 'no', correct: false }

      ]
    },
    {
      question: 'What country does France share its longest border with?',
      answers: [
        { text: 'Austria', correct: false },
        { text: 'Germany', correct: false },
        { text: 'Brazil', correct: true },
        { text: 'Spain', correct: false }

      ]
    },
    {
      question: 'The Answer Is Really Big',
      answers: [
        { text: '473468655', correct: false },
        { text: 'An elephant', correct: true },
        { text: "'really big'", correct: false },
        { text: 'Infinity', correct: false }

      ]
    },
    {
      question: "What's the meaning of life, the universe and everything?",
      answers: [
        { text: 'To be happy', correct: false },
        { text: '42', correct: true },
        { text: 'To not die', correct: false },
        { text: 'To not suffer', correct: false }

      ]
    },
    {
      question: "What is the capital city of Australia?",
      answers: [
        { text: 'Canberra', correct: true },
        { text: 'Melbourne', correct: false },
        { text: 'Sydney', correct: false },
        { text: 'Perth', correct: false }

      ]
    },
    {
      question: "Which planet has the most moons?",
      answers: [
        { text: 'Jupiter', correct: false },
        { text: 'Saturn', correct: true },
        { text: 'Neptune', correct: false },
        { text: 'Mars', correct: false }

      ]
    }
  ],
  maths: [
    {
      question: '1+1',
      answers: [
        { text: '1', correct: false },
        { text: '2', correct: true },
        { text: '3', correct: false },
        { text: '4', correct: false }

      ]
    },
    {
      question: '11 x 23',
      answers: [
        { text: '235', correct: false },
        { text: '325', correct: false },
        { text: '352', correct: true },
        { text: '253', correct: false }

      ]
    },
    {
      question: '8 / 4',
      answers: [
        { text: '2', correct: true },
        { text: '3', correct: false },
        { text: '1', correct: false },
        { text: '7', correct: false }

      ]
    },
    {
      question: '667+567',
      answers: [
        { text: '12', correct: false },
        { text: '1233', correct: false },
        { text: '1234', correct: true },
        { text: '1236', correct: false }

      ]
    },
    {
      question: '2 x 2',
      answers: [
        { text: '2', correct: false },
        { text: '3', correct: false },
        { text: '4', correct: true },
        { text: '5', correct: false }

      ]
    },
    {
      question: '5 + 7',
      answers: [
        { text: '12', correct: true },
        { text: '13', correct: false },
        { text: '14', correct: false },
        { text: '15', correct: false }

      ]
    },
    {
      question: '0 x 324354675634523',
      answers: [
        { text: '324566756345', correct: false },
        { text: '1', correct: false },
        { text: '2346453', correct: false },
        { text: '0', correct: true }

      ]
    },
    {
      question: '1 + 54',
      answers: [
        { text: '54', correct: false },
        { text: '1', correct: false },
        { text: '53', correct: false },
        { text: '55', correct: true }

      ]
    },
    {
      question: 'Half of 98',
      answers: [
        { text: '27', correct: false },
        { text: '49', correct: true },
        { text: '50', correct: false },
        { text: '196', correct: false }

      ]
    },
    {
      question: 'Double 34',
      answers: [
        { text: '17', correct: false },
        { text: '18', correct: false },
        { text: '67', correct: false },
        { text: '68', correct: true }

      ]
    },
  ],
  history: [
    {
      question: 'When was the Battle of Hastings?',
      answers: [
        { text: '0', correct: false },
        { text: '1066 BC', correct: false },
        { text: '2024', correct: false },
        { text: '1066', correct: true }

      ]
    },
    {
      question: 'When was WWII?',
      answers: [
        { text: '1912', correct: false },
        { text: '1945', correct: true },
        { text: '1939', correct: true },
        { text: '1918', correct: false }

      ]
    },
    {
      question: 'How many wives did Henry have?',
      answers: [
        { text: '6', correct: true },
        { text: '16', correct: false },
        { text: '2', correct: false },
        { text: '15', correct: false }

      ]
    },
    {
      question: 'When was the Queen crowned?',
      answers: [
        { text: '1939', correct: false },
        { text: '1923', correct: false },
        { text: '1908', correct: false },
        { text: '1953', correct: true }

      ]
    },
    {
      question: 'Who was the first person in the world to land on the moon?',
      answers: [
        { text: 'Buzz Aldrin', correct: false },
        { text: 'Buzz Lightyear', correct: false },
        { text: 'Neil Armstrong', correct: true },
        { text: 'Neil Lightyear', correct: false }

      ]
    },
    {
      question: 'Which Greek goddess was the Parthenon dedicated to?',
      answers: [
        { text: 'Athena', correct: true },
        { text: 'Hera', correct: false },
        { text: 'Persephone', correct: false },
        { text: 'Hades', correct: false }

      ]
    },
    {
      question: 'Who was the last Pharoah of Egypt?',
      answers: [
        { text: 'Ra', correct: false },
        { text: 'tutankhamun', correct: false },
        { text: 'Caesar', correct: false },
        { text: 'Cleopatra', correct: true }

      ]
    },
    {
      question: 'What are some of the seven wonders of the ancient world?',
      answers: [
        { text: 'Great Pyramid of Giza', correct: true },
        { text: "Parmiter's", correct: false },
        { text: 'Amazon Rainforest', correct: false },
        { text: 'Temple of Artemis', correct: true }

      ]
    },
    {
      question: 'What year did the Internet become available to the public?',
      answers: [
        { text: '1998', correct: false },
        { text: '1820', correct: false },
        { text: '2003', correct: false },
        { text: '1993', correct: true }

      ]
    },
    {
      question: 'When was Pluto downgraded to a dwarf planet?',
      answers: [
        { text: '2012', correct: false },
        { text: '2005', correct: false },
        { text: '2006', correct: true },
        { text: '2011', correct: false }

      ]
    },
    {
      question: "Which two wives did Henry VIII divorce?",
      answers: [
        { text: 'Anne Boleyn', correct: false },
        { text: 'Catherine of Aragon', correct: true },
        { text: 'Anne of Cleves', correct: true },
        { text: 'Catherine Parr', correct: false }

      ]
    }

  ],
  science: [
    {
      question: 'What did JJ Thompson discover?',
      answers: [
        { text: 'Plum Pudding Model', correct: true },
        { text: 'The electron', correct: false },
        { text: 'The neutron', correct: false },
        { text: 'The gold foil experiment', correct: false }

      ]
    },
    {
      question: 'What is the atomic mass of helium?',
      answers: [
        { text: '2', correct: false },
        { text: '4', correct: true },
        { text: '3', correct: false },
        { text: '5', correct: false }

      ]
    },
    {
      question: 'What is the most abundant element on Earth?',
      answers: [
        { text: 'Hydrogen', correct: false },
        { text: 'Helium', correct: false },
        { text: 'Nitrogen', correct: false },
        { text: 'Oxygen', correct: true }

      ]
    },
    {
      question: 'What is the most abundant element in the universe?',
      answers: [
        { text: 'Hydrogen', correct: true },
        { text: 'Helium', correct: false },
        { text: 'Nitrogen', correct: false },
        { text: 'Oxygen', correct: false }
      ]
    },
    {
      question: "What is the gravity on Earth?",
      answers: [
        { text: '9.8N', correct: true },
        { text: '1N', correct: false },
        { text: '98N', correct: false },
        { text: '100N', correct: false }
      ]
    },
    {
      question: "How many bones are in the adult human body?",
      answers: [
          { text: '102', correct: false },
        { text: '300', correct: false },
        { text: '206', correct: true },
        { text: '52', correct: false }
      ]
    },
    {
      question: "True or False: Electrons are bigger than protons.",
      answers: [
        { text: 'True', correct: false },
        { text: 'False', correct: true }
      ]
    },
    {
      question: "When are Celsius and Fahrenhei equal?",
      answers: [
        { text: '40', correct: false },
        { text: '62', correct: false },
        { text: '-40', correct: true },
        { text: '-62', correct: false }
      ]
    },
    {
      question: "Which continent is the only continent without bees?",
      answers: [
        { text: 'Asia', correct: false },
        { text: 'Africa', correct: false },
        { text: 'America', correct: false },
        { text: 'Antarctica', correct: true }
      ]
    },
    {
      question: "Can lightning strike the same place twice?",
      answers: [
        { text: 'Yes', correct: true },
        { text: 'No', correct: false }
      ]
    },
  ]
}


// un comment to reset scores, also mke highsoreslist a variable before this + remember to change it back to a constant after
// function resetHighScores() {
//   localStorage.removeItem('highScores')
//   highScoresList = []
//   displayHighScores()
// }
// resetHighScores()
