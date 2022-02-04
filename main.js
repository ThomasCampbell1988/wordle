const candidateTargetWords = [
  "roger", "abets", "rille", "gawps", "cynic", "locum", "rider",
  "ditch", "lifes", "pearl", "yikes", "faced", "mafia", "words",
  "steer", "talon", "begun", "manic", "medal", "state", "humps",
  "balsa", "banjo", "halve", "canon", "blurb", "signs", "torus",
  "plums", "tweet", "friar", "might", "index", "coder", "fiend"
]

const targetWord = candidateTargetWords[ Math.floor(Math.random() * candidateTargetWords.length) ];

// console.log(targetWord, "targetWord");

let currentRow = 0;

function onInput(event) {
  if(event.inputType === "insertText" && /^[a-zA-Z]{1}$/.test(event.data)) {
    // focus next input when we enter a letter
    event.srcElement.nextElementSibling.focus();
  } else {
    event.target.value = ""
  }
}

function onKeyDown(event) {
  let key = event.key;
  let target = event.target;
  let isSubmitButton = target.type === "submit";

  // clear error text
  target.form.querySelector("span").textContent = "";

  // if typing character and cursor at start of input, then clear any existing value
  if(
    /^[a-zA-Z]{1}$/.test(key) && 
    target.selectionStart === 0
  ) {
    target.value = "";
  }

  if(
    key === "Backspace" &&
    (target.value.length === 0 || isSubmitButton)
  ) {
    if(target.previousElementSibling) {
      target.previousElementSibling.focus();
    }
  }

  if(
    key === "Backspace" &&
    (target.selectionStart === 0)
  ) {
    target.value = "";
  }

  if(
    key === "ArrowLeft" &&
    (target.selectionStart === 0 || isSubmitButton)
  ) {
    if(target.previousElementSibling) {
      target.previousElementSibling.focus();
    }
  }

  if(
    (key === "ArrowRight" || key === " ") &&
    (target.selectionStart === target.value.length)
  ) {
    if(target.nextElementSibling) {
      target.nextElementSibling.focus();
    }
  }
}

function onSubmit(event) {
  event.preventDefault();

  const currentForm = document.querySelectorAll("form")[currentRow];
  const fieldSet = currentForm.querySelector("fieldset");
  const textInputs = fieldSet.querySelectorAll("input[type=text]");
  const errorSpan = currentForm.querySelector("span");

  let letters = [
    textInputs[0].value.toLowerCase(),
    textInputs[1].value.toLowerCase(),
    textInputs[2].value.toLowerCase(),
    textInputs[3].value.toLowerCase(),
    textInputs[4].value.toLowerCase(),
  ]
  let guess = letters.join("");

  if(validGuesses.includes(guess)) {
    updateInputs(guess, textInputs);

    fieldSet.disabled = true;

    if(guess === targetWord) {
      console.log("WIN")
      setTimeout(() => {alert(`You WON, in ${currentRow + 1} guesses`);}, 100)
    } else {
      currentRow++;
      if(currentRow >= 6) {
        setTimeout(() => {alert(`Sorry you lost, the word was ${targetWord.toUpperCase()}`);}, 100)
      } else {
        const nextFieldSet = document.querySelectorAll("form")[currentRow].querySelector("fieldset");
        nextFieldSet.disabled = false;
        nextFieldSet.querySelector("input[type=text]").focus();
      }
    }
  } else {
    errorSpan.textContent = "Word is not in valid guess list."
  }
}

function updateInputs(guess, textInputs) {
  // first go through and update any perfect matches
  // then update partial matches from left to right

  let nonPerfectGuessIndexes = [];
  let nonPerfectTargetLetters = [];

  for(let i=0; i <= 4; i++) {
    let letter = guess.charAt(i);
    let targetLetter = targetWord.charAt(i);
    if(letter === targetLetter){
      textInputs[i].classList.add("perfect-match")
    } else {
      nonPerfectGuessIndexes.push(i);
      nonPerfectTargetLetters.push(targetLetter);
    }
  }

  nonPerfectGuessIndexes.forEach( index => {
    let letter = guess.charAt(index);
    let partialIndex = nonPerfectTargetLetters.indexOf(letter);
    if(partialIndex >= 0) {
      textInputs[index].classList.add("partial-match");
      nonPerfectTargetLetters.splice(partialIndex, 1);
    }
  })
}