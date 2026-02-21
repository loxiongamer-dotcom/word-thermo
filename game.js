// ============================
// GAME CONFIGURATION
// ============================
let gameActive = false;
let category = "";
let difficulty = "";
let solution = "";
let tries = 8;
let guesses = [];
let coins = parseInt(localStorage.getItem("wordThermometerCoins")) || 50;
let wins = parseInt(localStorage.getItem("wordThermometerWins")) || 0;
let hintsLeft = parseInt(localStorage.getItem("boughtHints")) || 0;
let boughtHintsAvailable = hintsLeft;
let adFree = localStorage.getItem("adFree") === "true" || false;
let goldThermometer = localStorage.getItem("goldThermometer") === "true" || false;
let soundEnabled = localStorage.getItem("soundEnabled") === "true";

// ============================
// WORD DATABASE
// ============================
const words = {
  Food: {
    Beginner: ["apple", "bread", "cheese", "pizza", "pasta", "salad", "steak", "sushi", "curry", "soup", "rice", "chips", "fruit", "candy", "mango", "grape", "melon", "lemon", "olive", "onion"],
    Novice: ["lasagna", "avocado", "pancake", "burger", "taco", "sausage", "pepper", "pickle", "cookie", "brownie", "pudding", "yogurt", "toffee", "banana", "papaya", "cherry", "kiwi", "tomato", "garlic", "ginger"],
    Expert: ["pomegranate", "artichoke", "spaghetti", "cauliflower", "strawberry", "blueberry", "raspberry", "pineapple", "watermelon", "cantaloupe", "asparagus", "broccoli", "zucchini", "cucumber", "eggplant", "cinnamon", "vanilla", "chocolate", "caramel", "macaroni"]
  },
  Animals: {
    Beginner: ["cat", "dog", "bird", "fish", "frog", "lion", "bear", "wolf", "deer", "duck", "goat", "cow", "pig", "fox", "bat", "rat", "bee", "ant", "owl", "emu"],
    Novice: ["turtle", "rabbit", "monkey", "panda", "eagle", "shark", "whale", "snake", "zebra", "horse", "sheep", "goose", "moose", "otter", "lemur", "hyena", "koala", "llama", "rhino", "sloth"],
    Expert: ["elephant", "kangaroo", "crocodile", "alligator", "dolphin", "porpoise", "platypus", "armadillo", "chameleon", "porcupine", "hedgehog", "orangutan", "chimpanzee", "giraffe", "hippopotamus", "rhinoceros", "octopus", "scorpion", "butterfly", "hummingbird"]
  },
  Tech: {
    Beginner: ["code", "data", "app", "web", "html", "java", "python", "linux", "ios", "wifi", "usb", "cpu", "ram", "ssd", "hdd", "url", "api", "ui", "ux", "ai"],
    Novice: ["python", "kotlin", "server", "client", "mobile", "laptop", "tablet", "widget", "plugin", "kernel", "binary", "syntax", "github", "docker", "swift", "rust", "go", "php", "ruby", "node"],
    Expert: ["javascript", "typescript", "algorithm", "framework", "database", "firewall", "blockchain", "cryptography", "virtualization", "containerization", "authentication", "authorization", "microservices", "devops", "kubernetes", "artificial", "machine", "neural", "quantum", "robotics"]
  },
  Movies: {
    Beginner: ["avatar", "titanic", "jaws", "rocky", "alien", "gladiator", "matrix", "inception", "gravity", "casino", "scarface", "psycho", "godzilla", "rambo", "shrek", "frozen", "cars", "toys", "up", "coco"],
    Novice: ["interstellar", "parasite", "casablanca", "pulp", "goodfellas", "godfather", "shawshank", "prestige", "departed", "django", "social", "network", "finding", "nemo", "inside", "out", "zootopia", "up", "coco", "moana"],
    Expert: ["inception", "interstellar", "parasite", "casablanca", "godfather", "shawshank", "prestige", "departed", "django", "social", "network", "pulp", "goodfellas", "scarface", "psycho", "gladiator", "matrix", "gravity", "avatar", "titanic"]
  },
  Music: {
    Beginner: ["rock", "jazz", "blues", "funk", "soul", "pop", "rap", "folk", "punk", "emo", "metal", "disco", "reggae", "house", "techno", "trance", "dubstep", "grunge", "swing", "bossa"],
    Novice: ["classical", "orchestral", "symphony", "concerto", "sonata", "ballad", "melody", "harmony", "rhythm", "tempo", "acoustic", "electric", "digital", "analog", "vinyl", "stream", "playlist", "album", "single", "ep"],
    Expert: ["symphony", "concerto", "sonata", "ballad", "melody", "harmony", "rhythm", "tempo", "acoustic", "electric", "digital", "analog", "vinyl", "stream", "playlist", "album", "single", "ep", "classical", "orchestral"]
  },
  Sports: {
    Beginner: ["soccer", "tennis", "golf", "rugby", "hockey", "boxing", "skiing", "surfing", "diving", "rowing", "curling", "fencing", "archery", "bowling", "pool", "darts", "chess", "poker", "bridge", "polo"],
    Novice: ["basketball", "baseball", "football", "volleyball", "badminton", "wrestling", "marathon", "triathlon", "pentathlon", "decathlon", "weightlifting", "bodybuilding", "skateboarding", "snowboarding", "paragliding", "hang", "gliding", "bungee", "jumping", "climbing"],
    Expert: ["basketball", "baseball", "football", "volleyball", "badminton", "wrestling", "marathon", "triathlon", "pentathlon", "decathlon", "weightlifting", "bodybuilding", "skateboarding", "snowboarding", "paragliding", "hang", "gliding", "bungee", "jumping", "skydiving"]
  }
};

// ============================
// SOUND SYSTEM - TOGGLE ON/OFF WITH MEMORY
// ============================

// Initialize sound system
document.addEventListener('DOMContentLoaded', function() {
  updateDashboard();
  
  if (goldThermometer) {
    updateThermometer(0);
  }
  
  // Set initial button state
  updateSoundButton();
  
  // If sound was enabled before, turn it on
  if (soundEnabled) {
    setTimeout(() => {
      const bgMusic = document.getElementById('bgMusic');
      if (bgMusic) {
        bgMusic.volume = 0.2;
        bgMusic.play().catch(e => console.log("Music play error:", e));
      }
    }, 500);
  }
  
  const guessInput = document.getElementById('guessInput');
  if (guessInput) {
    guessInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        submitGuess();
      }
    });
  }
});

// Toggle sound on/off
function toggleSound() {
  if (soundEnabled) {
    // Turn sound OFF
    soundEnabled = false;
    localStorage.setItem("soundEnabled", "false");
    
    // Stop all sounds
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
    
    updateSoundButton();
    console.log("🔇 Sound OFF");
  } else {
    // Turn sound ON
    soundEnabled = true;
    localStorage.setItem("soundEnabled", "true");
    
    // Start background music
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
      bgMusic.volume = 0.2;
      bgMusic.play().catch(e => console.log("Music play error:", e));
    }
    
    updateSoundButton();
    console.log("🔊 Sound ON");
  }
}

// Update button appearance
function updateSoundButton() {
  const soundBtn = document.getElementById('soundToggle');
  if (soundBtn) {
    if (soundEnabled) {
      soundBtn.innerHTML = '🔊 SOUND ON - TAP TO MUTE';
      soundBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    } else {
      soundBtn.innerHTML = '🔇 SOUND OFF - TAP TO ENABLE';
      soundBtn.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    }
  }
}

// ============================
// PLAY SOUND EFFECTS - USING YOUR MP3 FILES
// ============================
function playSound(soundId) {
  // Don't play if sound is disabled
  if (!soundEnabled) return;
  
  try {
    const sound = document.getElementById(soundId);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play failed:", e));
    }
  } catch (e) {
    console.log("Sound error:", e);
  }
}

// ============================
// CATEGORY & DIFFICULTY
// ============================
function selectCategory(cat) {
  category = cat;
  document.getElementById("categoryScreen").classList.add("hidden");
  document.getElementById("difficultyScreen").classList.remove("hidden");
}

function selectDifficulty(diff) {
  difficulty = diff;
  
  if (!adFree) {
    showAd("difficulty");
  }
  
  setTimeout(function() {
    document.getElementById("difficultyScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    
    document.getElementById("currentCategory").textContent = category;
    document.getElementById("currentDifficulty").textContent = difficulty;
    
    startGame();
  }, 1000);
}

// ============================
// GAME LOGIC
// ============================
function startGame() {
  gameActive = true;
  tries = 8;
  guesses = [];
  hintsLeft = boughtHintsAvailable;
  
  document.getElementById("guessList").innerHTML = "";
  document.getElementById("guessInput").value = "";
  document.getElementById("hintDisplay").textContent = "";
  document.getElementById("emojiFlash").classList.remove("show");
  document.getElementById("winOverlay").classList.add("hidden");
  
  const wordList = words[category][difficulty];
  
  if (wordList && wordList.length > 0) {
    solution = wordList[Math.floor(Math.random() * wordList.length)].toLowerCase();
  } else {
    solution = "example";
  }
  
  document.getElementById("wordLength").textContent = solution.length;
  document.getElementById("tries").textContent = tries;
  document.getElementById("hintsLeft").textContent = hintsLeft;
  document.getElementById("hintDisplay").textContent = "_ ".repeat(solution.length).trim();
  
  updateThermometer(0);
  
  setTimeout(function() {
    document.getElementById("guessInput").focus();
  }, 100);
}

function submitGuess() {
  if (!gameActive) return;

  const input = document.getElementById("guessInput");
  const guess = input.value.toLowerCase().trim();
  
  if (!guess) {
    alert("Please enter a guess!");
    return;
  }
  
  if (guesses.includes(guess)) {
    alert("You already guessed that word!");
    input.value = "";
    return;
  }
  
  if (guess.length !== solution.length) {
    alert(`Please enter a word with ${solution.length} letters!`);
    return;
  }

  playSound("guessSound");
  
  guesses.push(guess);
  tries--;
  document.getElementById("tries").textContent = tries;

  const similarity = calculateSimilarity(guess, solution);
  const emoji = getEmojiForScore(similarity);
  
  updateThermometer(similarity);
  showEmoji(emoji);

  const guessList = document.getElementById("guessList");
  const li = document.createElement("li");
  
  li.innerHTML = `
    <span>${guess}</span>
    <span style="color: ${getColorForScore(similarity)}; font-weight: bold;">
      ${similarity}% ${emoji}
    </span>
  `;
  
  guessList.appendChild(li);
  
  if (guessList.children.length > 3) {
    guessList.removeChild(guessList.firstChild);
  }

  input.value = "";
  
  if (guess === solution) {
    gameActive = false;
    wins++;
    coins += 10;
    
    playSound("winSound");
    
    localStorage.setItem("wordThermometerWins", wins);
    localStorage.setItem("wordThermometerCoins", coins);
    
    updateDashboard();
    showWinScreen();
    createConfetti();
    return;
  }

  if (tries === 0) {
    gameActive = false;
    setTimeout(function() {
      alert(`Game over! The word was: ${solution}`);
      playAgain();
    }, 1000);
  }
  
  input.focus();
}

// ============================
// HINT SYSTEM - 30 COINS
// ============================
function useHint() {
  if (!gameActive) return;
  
  if (hintsLeft > 0) {
    hintsLeft--;
    boughtHintsAvailable = hintsLeft;
    localStorage.setItem("boughtHints", hintsLeft);
    document.getElementById("hintsLeft").textContent = hintsLeft;
    giveHint();
    return;
  }
  
  if (coins >= 30) {
    const buyHint = confirm(`Buy a hint for 30 coins? You have ${coins} coins.`);
    if (buyHint) {
      coins -= 30;
      localStorage.setItem("wordThermometerCoins", coins);
      updateDashboard();
      
      giveHint();
    }
  } else {
    alert(`Not enough coins! You need 30 coins for a hint.\nYou have ${coins} coins.\nGo to Store to buy hint packs!`);
  }
}

function giveHint() {
  const hintDisplay = document.getElementById("hintDisplay");
  let currentHint = hintDisplay.textContent.replace(/ /g, "");
  
  if (currentHint.length !== solution.length) {
    currentHint = "_".repeat(solution.length);
  }
  
  const hintArray = currentHint.split("");
  const hiddenPositions = [];
  
  for (let i = 0; i < hintArray.length; i++) {
    if (hintArray[i] === "_") {
      hiddenPositions.push(i);
    }
  }
  
  if (hiddenPositions.length > 0) {
    const randomPos = hiddenPositions[Math.floor(Math.random() * hiddenPositions.length)];
    hintArray[randomPos] = solution[randomPos];
    hintDisplay.textContent = hintArray.join(" ");
  }
}

// ============================
// THERMOMETER & SCORING
// ============================
function calculateSimilarity(guess, solution) {
  let score = 0;
  
  let exactMatches = 0;
  const minLength = Math.min(guess.length, solution.length);
  
  for (let i = 0; i < minLength; i++) {
    if (guess[i] === solution[i]) {
      exactMatches++;
    }
  }
  
  score += (exactMatches / solution.length) * 40;
  
  const guessLetters = new Set(guess);
  const solutionLetters = new Set(solution);
  let commonCount = 0;
  
  for (let letter of guessLetters) {
    if (solutionLetters.has(letter)) {
      commonCount++;
    }
  }
  
  score += (commonCount / Math.max(guessLetters.size, solutionLetters.size)) * 40;
  
  const lengthDiff = Math.abs(guess.length - solution.length);
  const maxLengthDiff = Math.max(guess.length, solution.length);
  score -= (lengthDiff / maxLengthDiff) * 20;
  
  score = Math.max(0, Math.min(100, score));
  
  return Math.round(score);
}

function getEmojiForScore(score) {
  if (score < 20) return "🧊";
  if (score < 40) return "❄️";
  if (score < 60) return "🌤️";
  if (score < 80) return "🌶️";
  return "🔥";
}

function getColorForScore(score) {
  if (score < 20) return "#3b82f6";
  if (score < 40) return "#22c55e";
  if (score < 60) return "#f97316";
  return "#ef4444";
}

function updateThermometer(percentage) {
  const thermoFill = document.getElementById("thermoFill");
  thermoFill.style.width = percentage + "%";
  
  if (goldThermometer) {
    if (percentage < 33) {
      thermoFill.style.background = 'linear-gradient(to right, #FFD700, #FFA500)';
    } else if (percentage < 66) {
      thermoFill.style.background = 'linear-gradient(to right, #FFA500, #FF8C00)';
    } else {
      thermoFill.style.background = 'linear-gradient(to right, #FF8C00, #FF4500)';
    }
  } else {
    if (percentage < 33) {
      thermoFill.style.background = 'linear-gradient(to right, #3b82f6, #22c55e)';
    } else if (percentage < 66) {
      thermoFill.style.background = 'linear-gradient(to right, #22c55e, #f97316)';
    } else {
      thermoFill.style.background = 'linear-gradient(to right, #f97316, #ef4444)';
    }
  }
}

function showEmoji(emoji) {
  const emojiFlash = document.getElementById("emojiFlash");
  emojiFlash.textContent = emoji;
  emojiFlash.classList.add("show");
  
  setTimeout(function() {
    emojiFlash.classList.remove("show");
  }, 800);
}

// ============================
// SCREEN MANAGEMENT
// ============================
function showWinScreen() {
  document.getElementById("winWord").textContent = solution.toUpperCase();
  document.getElementById("winOverlay").classList.remove("hidden");
}

function playAgain() {
  if (!adFree && Math.random() < 0.33) {
    showAd("interstitial");
  }
  
  document.getElementById("winOverlay").classList.add("hidden");
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("categoryScreen").classList.remove("hidden");
}

function goBackToCategories() {
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("difficultyScreen").classList.add("hidden");
  document.getElementById("categoryScreen").classList.remove("hidden");
  document.getElementById("monetization").classList.add("hidden");
  document.getElementById("howToPlay").classList.add("hidden");
}

function toggleHowToPlay() {
  const howToPlay = document.getElementById("howToPlay");
  const categoryScreen = document.getElementById("categoryScreen");
  
  if (howToPlay.classList.contains("hidden")) {
    howToPlay.classList.remove("hidden");
    categoryScreen.classList.add("hidden");
  } else {
    howToPlay.classList.add("hidden");
    categoryScreen.classList.remove("hidden");
  }
}

// ============================
// STORE & MONETIZATION
// ============================
function toggleMonetization() {
  const monetization = document.getElementById("monetization");
  const categoryScreen = document.getElementById("categoryScreen");
  
  if (monetization.classList.contains("hidden")) {
    monetization.classList.remove("hidden");
    categoryScreen.classList.add("hidden");
  } else {
    monetization.classList.add("hidden");
    categoryScreen.classList.remove("hidden");
  }
}

function closeMonetization() {
  document.getElementById("monetization").classList.add("hidden");
  document.getElementById("categoryScreen").classList.remove("hidden");
}

function watchAdForCoins() {
  if (adFree) {
    alert("🎉 You've purchased ad-free version!");
    return;
  }
  
  showAd("reward");
  
  coins += 10;
  localStorage.setItem("wordThermometerCoins", coins);
  updateDashboard();
  
  setTimeout(function() {
    alert("✅ +10 coins added!");
  }, 1500);
}

function showAd(type) {
  console.log(`📺 Showing ${type} ad...`);
  
  if (type === "difficulty") {
    alert("📺 Quick ad before game starts...");
  } else if (type === "reward") {
    alert("📺 Thanks for watching! +10 coins!");
  } else if (type === "interstitial") {
    alert("📺 Thanks for playing! Here's an ad...");
  }
}

// ============================
// DASHBOARD & PROGRESS
// ============================
function updateDashboard() {
  document.getElementById("coins").textContent = coins;
  document.getElementById("wins").textContent = wins;
}

function resetProgress() {
  if (confirm("Reset all progress? You'll lose coins, wins, and purchases.")) {
    localStorage.removeItem("wordThermometerCoins");
    localStorage.removeItem("wordThermometerWins");
    localStorage.removeItem("boughtHints");
    localStorage.removeItem("adFree");
    localStorage.removeItem("goldThermometer");
    localStorage.removeItem("soundEnabled");
    
    coins = 50;
    wins = 0;
    boughtHintsAvailable = 0;
    adFree = false;
    goldThermometer = false;
    soundEnabled = false;
    
    updateDashboard();
    updateSoundButton();
    alert("Progress reset! Starting fresh with 50 coins.");
  }
}

// ============================
// CONFETTI EFFECT
// ============================
function createConfetti() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f97316', '#22c55e', '#3b82f6'];
  
  for (let i = 0; i < 80; i++) {
    setTimeout(function() {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.top = '-20px';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.width = (Math.random() * 10 + 5) + 'px';
      confetti.style.height = (Math.random() * 10 + 5) + 'px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confetti.style.zIndex = '9999999';
      confetti.style.pointerEvents = 'none';
      confetti.style.transition = 'transform ' + (Math.random() * 3 + 2) + 's linear, opacity 2s ease';
      
      document.body.appendChild(confetti);
      
      setTimeout(function() {
        confetti.style.transform = 'translateY(' + (window.innerHeight + 100) + 'px) rotate(' + (Math.random() * 720) + 'deg)';
        confetti.style.opacity = '0';
      }, 10);
      
      setTimeout(function() {
        if (confetti.parentNode) {
          confetti.remove();
        }
      }, 5000);
    }, i * 15);
  }
}

// ============================
// TESTING
// ============================
function cheat() {
  console.log("🎯 Solution:", solution);
  alert(`Cheat: The word is "${solution}"`);
}
