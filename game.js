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
  document.getElementById("difficultyScreen").classList.add("hidden")
  document.getElementById("gameScreen").classList.remove("hidden")

  const list = words[category][difficulty]
  solution = list[Math.floor(Math.random() * list.length)].toLowerCase()

  document.getElementById("wordLength").innerText = solution.length
  updateDashboard()
}

function submitGuess() {
  const input = document.getElementById("guessInput")
  const guess = input.value.toLowerCase().trim()
  if (!guess) return
  if (guesses.includes(guess)) return

  guesses.push(guess)
  tries--
  document.getElementById("tries").innerText = tries

  const heat = calculateHeat(guess)
  updateThermometer(heat)
  flashEmoji(heat)
  updateGuessList(guess, heat)

  input.value = ""

  if (guess === solution) {
    wins++
    updateDashboard()
    alert("You win")
  }

  if (tries === 0) {
    alert("Game over. Word was " + solution)
  }
}

function calculateHeat(guess) {
  let matches = 0
  for (let i = 0; i < guess.length; i++) {
    if (solution.includes(guess[i])) matches++
    if (solution[i] === guess[i]) matches += 1
  }
  return Math.min(100, Math.floor((matches / solution.length) * 25))
}

function updateThermometer(value) {
  document.getElementById("thermoFill").style.width = value + "%"
}

function flashEmoji(value) {
  const el = document.getElementById("emojiFlash")
  let emoji = "🧊"
  if (value > 20) emoji = "❄️"
  if (value > 40) emoji = "☀️"
  if (value > 60) emoji = "🌶️"
  if (value > 80) emoji = "🔥"
  el.innerText = emoji
  setTimeout(() => el.innerText = "", 500)
}

function updateGuessList(guess, heat) {
  const list = document.getElementById("guessList")
  const item = document.createElement("li")
  item.innerText = guess + " - " + heat + "%"
  list.prepend(item)
  while (list.children.length > 3) {
    list.removeChild(list.lastChild)
  }
}

function updateDashboard() {
  document.getElementById("coins").innerText = coins
  document.getElementById("wins").innerText = wins
}