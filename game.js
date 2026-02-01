let gameActive = false
let category = ""
let difficulty = ""
let solution = ""
let tries = 8
let guesses = []
let coins = 50
let wins = 0

const words = {
  Food: {
    Beginner: ["apple", "bread", "cheese", "onion", "pizza"],
    Novice: ["lasagna", "avocado", "pancakes"],
    Expert: ["pomegranate", "artichokes"]
  }
}

function selectCategory(cat) {
  category = cat
  document.getElementById("categoryScreen").classList.add("hidden")
  document.getElementById("difficultyScreen").classList.remove("hidden")
}

function selectDifficulty(diff) {
  difficulty = diff
  startGame()
}

function startGame() {
  gameActive = true
  tries = 8
  guesses = []

  document.getElementById("guessList").innerHTML = ""
  document.getElementById("difficultyScreen").classList.add("hidden")
  document.getElementById("gameScreen").classList.remove("hidden")
  document.getElementById("winOverlay").classList.add("hidden")

  const list = words[category][difficulty]
  solution = list[Math.floor(Math.random() * list.length)].toLowerCase()

  document.getElementById("wordLength").innerText = solution.length
  document.getElementById("tries").innerText = tries

  updateDashboard()
}

function submitGuess() {
  if (!gameActive) return

  const input = document.getElementById("guessInput")
  const guess = input.value.toLowerCase().trim()
  if (!guess) return
  if (guesses.includes(guess)) return

  guesses.push(guess)
  tries--
  document.getElementById("tries").innerText = tries

  input.value = ""

  if (guess === solution) {
    gameActive = false
    wins++
    updateDashboard()
    showWinScreen()
    return
  }

  if (tries === 0) {
    gameActive = false
    alert("Game over. Word was " + solution)
  }
}

function updateDashboard() {
  document.getElementById("coins").innerText = coins
  document.getElementById("wins").innerText = wins
}

function showWinScreen() {
  document.getElementById("winWord").innerText = solution
  document.getElementById("winOverlay").classList.remove("hidden")
}

function playAgain() {
  document.getElementById("winOverlay").classList.add("hidden")
  document.getElementById("gameScreen").classList.add("hidden")
  document.getElementById("categoryScreen").classList.remove("hidden")
}
