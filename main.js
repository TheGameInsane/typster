// Document Elements
let input = document.getElementById('input')
let textcont = document.getElementById('textcont')
let textcontRect = textcont.getBoundingClientRect()
let timeContents = document.getElementById('timeContents')
let timeElement = document.getElementById('timer')
let wordCountElement = document.getElementById('wordCount')
let outOfWordsElement = document.getElementById('outOfWords')
let modeSelectors = document.getElementById('mode-selectors')
let resetElement = document.getElementById('reset')
let resultElement = document.getElementById('results')
let blinker = document.getElementById('blinker')
let blinkerRect = blinker.getBoundingClientRect()

let url = `https://random-word-api.vercel.app/api?words=250&length=5` //&length=5 length  applied 

// Timer Classes
class wordTimer {
    constructor() {
        this._duration = null
        this.totalTime = 0
        this.started = false
    }

    start() {
        if (this._duration) {
            clearInterval(this._duration)
        }
        let time = 0
        timeElement.textContent = time
        this.started = true
        this._duration = setInterval(() => {
            time += 1
            timeElement.textContent = time
            this.totalTime = time
        }, 1000)
    }
    stop() {
        if (this._duration) {
            clearInterval(this._duration)
        }
        return this.totalTime
    }
    reset() {
        if (this._duration) {
            clearInterval(this._duration)
        }
        this._duration = null
        this.startTime = 0
    }

    get isStarted() {
        return this.started
    }
}
class timeTimer {
    constructor() {
        this.started = false
        this.countdown = null
    }

    reset() {
        if (this.countdown) {
            clearInterval(this.countdown)
            let timeLeft = duration;
            timeElement.textContent = timeLeft;
        }
        this.started = false
    }

    start(duration, finish) {
        if (this.countdown) {
            clearInterval(this.countdown)
        }
        let timeLeft = duration;
        timeElement.textContent = timeLeft;
        this.started = true
        this.countdown = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(this.countdown);
                finish()
            }
        }, 1000);
    }

    get isStarted() {
        return this.started;
    }
}

// All Important Variables
let scrollAmount, currentWordIndex, lastIndex, wordCount = 0, completed = false, words = [], noWords = 25, duration = 30, mode = 'words', modeValue = 25, wTimer = new wordTimer(), tTimer = new timeTimer()

// Display an overlay element on focus lost
let inputFocused = false
const setFocus = (condition) => {
    if (!completed) {
        if (condition) {
            input.focus()
            inputFocused = true
            textcont.style.filter = 'none'
            let overlay = document.getElementById('overlay')
            if (overlay) {
                overlay.classList.add('invisible')
            }
        } else {
            textcont.style.filter = 'blur(5px)'
            let rect = textcont.parentElement.getBoundingClientRect()
            let overlay = document.getElementById('overlay')
            overlay.classList.remove('invisible')
            overlay.style.left = `${rect.left}px`
            overlay.style.top = `${rect.top}px`
            overlay.style.width = `${rect.width}px`
            overlay.style.height = `${rect.height}px`
            overlay.style.zIndex = '1000'
            document.body.appendChild(overlay)
            overlay.addEventListener('click', () => {
                input.focus()
                overlay.classList.add('invisible')
            })
            inputFocused = false
        }
    }
}

// Setup Logics
const updateText = () => {
    textcont.innerHTML = ''
    words.slice(0, noWords).forEach((word, index) => {
        word = word.toLowerCase()
        let wordElement = document.createElement('div')
        for (let i = 0; i < word.length; i++) {
            let letter = word.charAt(i)
            let letterElement = document.createElement('p')
            letterElement.textContent = letter
            letterElement.classList.add('letter')
            wordElement.appendChild(letterElement)
        }
        wordElement.classList.add('word')
        if (index == 0) {
            wordElement.classList.add('active')
        }
        textcont.appendChild(wordElement)
    })

    document.querySelectorAll('.word').forEach((wordElement) => {
        if (wordElement.offsetTop + wordElement.offsetHeight > textcont.parentElement.offsetHeight) {
            wordElement.classList.add('opacity-0')
        }
    })
}
const update = () => {
    updateText()

    //Starting Logic
    completed = false
    input.value = ''
    currentWordIndex = 0
    wordCount = 0
    scrollAmount = 0
    setFocus(true)

    wTimer.reset()
    tTimer.reset()

    modeSelectors.classList.remove('invisible')
    modeSelectors.classList.remove('animate-fade-out')
    resetElement.classList.add('invisible')

    resultElement.classList.add('invisible')
    resetElement.classList.remove('animate-fade-in')

    //Mode Updates Logic
    if (mode === 'words') {
        noWords = modeValue

        document.querySelectorAll('.duration').forEach((element) => {
            element.classList.add('hidden')
        })
        document.querySelectorAll('.words').forEach((element) => {
            element.classList.remove('hidden');
        })


        document.querySelector('.modeTime').classList.remove('activeMode')
        document.querySelector('.modeWords').classList.add('activeMode')


        document.querySelectorAll('.words').forEach((element) => {
            if (element.textContent == modeValue) {
                element.classList.add('activeMode')
            } else {
                element.classList.remove('activeMode')
            }
        })

        timeElement.innerHTML = `<p>${0}</p>`
        wordCountElement.textContent = wordCount
        outOfWordsElement.classList.remove('hidden')
        outOfWordsElement.textContent = `/${modeValue}`

    } else if (mode === 'time') {
        duration = modeValue

        document.querySelectorAll('.words').forEach((element) => {
            element.classList.add('hidden');
        })
        document.querySelectorAll('.duration').forEach((element) => {
            element.classList.remove('hidden')
        })


        document.querySelector('.modeWords').classList.remove('activeMode')
        document.querySelector('.modeTime').classList.add('activeMode')


        document.querySelectorAll('.duration').forEach((element) => {
            if (element.textContent == modeValue) {
                element.classList.add('activeMode')
            } else {
                element.classList.remove('activeMode')
            }
        })
        timeElement.innerHTML = `<p>${modeValue}</p>`
        wordCountElement.textContent = wordCount
        outOfWordsElement.classList.add('hidden')
    }

    let firstWord = document.querySelector('.word.active')
    let firstLetter = firstWord.querySelector('.letter')
    let letterRect = firstLetter.getBoundingClientRect()
    blinker.style.display = 'block';
    blinker.style.left = `${letterRect.left - blinker.offsetWidth}px`
    blinker.style.top = `${letterRect.top}px`
}

// Get some random words
const getWords = async () => {
    words = []
    textcont.innerHTML = ''
    document.body.classList.add('invisible')
    fetch(url).then(res => res.json()).then(data => {
        words = data
        document.body.classList.remove('invisible')

        update()
    }).catch(e => { console.log(e) })
}
getWords()

// Result Computation
const calculateResults = (wordsArray, totalTime) => {
    input.removeEventListener('focusout', (event) => {
        setFocus(false)
    })
    input.removeEventListener('focusin', (event) => {
        setFocus(true)
    })

    let correctLetter = 0, incorrect = 0, skipped = 0, extra = 0, totalLetters = 0, totalWords = 0, correctWord = 0
    wordsArray.forEach((word) => {
        if (word.classList.contains('completed') && !word.classList.contains('full-skipped')) {
            word.querySelectorAll('.letter').forEach((letter) => {
                if (letter.classList.contains('correct')) {
                    correctLetter += 1
                } else if (letter.classList.contains('incorrect')) {
                    incorrect += 1
                } else if (letter.classList.contains('skipped')) {
                    skipped += 1
                } else if (letter.classList.contains('extra')) {
                    extra += 1
                }

                totalLetters += 1
            })

            if (word.classList.contains('correct-word')) correctWord += 1
            totalWords += 1
        }
    })

    let wpm = totalWords / (totalTime / 60), cpm = totalLetters / (totalTime / 60), accuracy = (correctLetter / totalLetters) * 100

    completed = true
    // `<img  src="./assets/octopus.svg" alt="">`

    let wpmEl = resultElement.querySelector('#wpm')
    let cpmEl = resultElement.querySelector('#cpm')
    let crctWordEl = resultElement.querySelector('#correct-words')
    let accEl = resultElement.querySelector('#accuracy')
    let msgEl = resultElement.querySelector('#message')
    let imgEl = resultElement.querySelector('#disp-img')

    textcont.style.filter = 'blur(5px)'

    wpmEl.innerHTML = wpm.toFixed(2)
    cpmEl.innerHTML = cpm.toFixed(2)
    crctWordEl.textContent = correctWord
    accEl.textContent = `${accuracy.toFixed(2)}%`

    if (wpm <= 30) {//Snail
        msgEl.classList.add('font-snail')
        msgEl.textContent = 'Pookie baby snail'
        imgEl.innerHTML = `<img  src="./assets/snail.svg" alt="snail">`

    } else if (wpm > 30 && wpm <= 40) {//Octopus

        msgEl.classList.add('font-octopus')
        msgEl.textContent = 'You got 8 arms Octo!'
        imgEl.innerHTML = `<img  src="./assets/octopus.svg" alt="octopus">`

    } else if (wpm > 40) {//T-Rex

        msgEl.classList.add('font-rex')
        msgEl.textContent = 'Rex Ate all! Left no crumbs...'
        imgEl.innerHTML = `<img  src="./assets/trex.svg" alt="t-rex">`

    }

    resultElement.classList.remove('invisible')
    resetElement.classList.add('animate-fade-in')
    resultElement.focus()
}

// Input Handler
const eventFunc = (event) => {
    let inputText = event.target.value.toLowerCase()
    let wordsElements = document.querySelectorAll('.word')
    let wordsArray = Array.from(wordsElements)
    let inputLetters = inputText.split('') 
    let currentWord = wordsElements[currentWordIndex]
    let letters = currentWord.querySelectorAll('.letter')
    let currentLetter = letters[inputLetters.length - 1]

    const finish = () => {
        if (mode == 'words') {
            let totalTime = wTimer.stop()
            calculateResults(wordsArray, totalTime)
        } else if (mode == 'time') {
            calculateResults(wordsArray, duration)
        }
        blinker.style.display = 'none'
        input.removeEventListener('input', eventFunc)
        textcont.parentElement.classList.remove('shadow-2xl')
    }

    const startTimer = () => {
        resetElement.classList.remove('invisible')
        resetElement.classList.add('animate-fade-in')
        modeSelectors.classList.add('animate-fade-out')

        if (mode == 'words' && wTimer.isStarted == false) {
            wTimer.start()
            console.log('Starting Words Timer')
        } else if (mode == 'time' && tTimer.isStarted == false) {
            tTimer.start(duration, finish)
            console.log('Starting Times Timer')
        }
    }

    // Start Timer Logic
    if (currentWordIndex == 0 && inputLetters.length == 1 && (wTimer.isStarted == false || tTimer.isStarted == false)) {
        startTimer()
    }

    if (currentWord && inputLetters !== '') {

        if (inputLetters[inputLetters.length - 1] === ' ') {
            console.log('Space Detected')

            if (inputLetters.length == 0) {
                currentWord.classList.add('full-skipped')
            }

            input.value = ''
            inputText = ''
            inputLetters = []
            currentLetter = null            

            lastIndex = 0

            startTimer()

            currentWord.classList.add('completed')
            wordCount += 1
            wordCountElement.textContent = wordCount

            let length = letters.length
            let correctNum = 0
            letters.forEach((letter) => {
                if (letter.classList.contains('correct')) correctNum += 1

                if (letter.classList.contains('correct') || letter.classList.contains('incorrect') || letter.classList.contains('extra')) {
                    letter.classList.remove('skipped')
                } else {
                    letter.classList.add('skipped')
                }
            })
            if (length == correctNum) {
                currentWord.classList.add('correct-word')
            }

            if (currentWordIndex < (wordsElements.length - 1)) {
                console.log('Moving to next word')
                currentWordIndex += 1
                currentWord = wordsElements[currentWordIndex]
                letters = currentWord.querySelectorAll('.letter')
                console.log(`Current Word Index: ${currentWordIndex}, Input: "${inputText}"`)
                // let letterRect = wordsElements[currentWordIndex].firstElementChild.getBoundingClientRect()
                // blinker.style.left = `${letterRect.left - blinker.offsetWidth}px`
                // blinker.style.top = `${letterRect.top}px`
            }

        } else if (lastIndex > inputLetters.length - 1) {
            // Backspace logic
            console.log('Backspace Detected')

            letters[inputLetters.length].classList.remove('correct', 'incorrect')
            if (letters[inputLetters.length].classList.contains('extra')) letters[inputLetters.length].remove()

            if (inputLetters.length == 0) {
                letters.forEach((letter) => {
                    letter.classList.remove('correct', 'incorrect', 'skipped')

                    if (letter.classList.contains('extra')) {
                        letter.remove()
                    }
                })
            }
            lastIndex = inputLetters.length - 1
        } else if (letters[inputLetters.length - 1] && inputLetters[inputLetters.length - 1] === letters[inputLetters.length - 1].textContent) {
            // Correct letter logic
            console.log('Correct Letter Detected')

            letters[inputLetters.length - 1].classList.remove('incorrect')
            letters[inputLetters.length - 1].classList.add('correct')
            lastIndex = inputLetters.length - 1
        } else if (letters[inputLetters.length - 1]) {
            //Incorrect letter logic
            console.log('Incorrect Letter Detected')

            letters[inputLetters.length - 1].classList.add('incorrect')
            letters[inputLetters.length - 1].classList.remove('correct')
            lastIndex = inputLetters.length - 1
        } else if (inputLetters.length > letters.length) {
            // Extra letters logic
            console.log('Extra Letter Detected')

            currentWord.appendChild(document.createElement('p')).textContent = inputLetters[inputLetters.length - 1]
            currentWord.lastChild.classList.add('letter', 'extra')
            let letterRect = currentWord.lastChild.getBoundingClientRect()
            blinker.style.left = `${letterRect.left - blinker.offsetWidth + letterRect.width}px`
            blinker.style.top = `${letterRect.top}px`
            lastIndex = inputLetters.length - 1
        } 
    }

    //Update active word
    wordsElements.forEach((wordElement, index) => {
        if (index == currentWordIndex) {
            wordElement.classList.add('active')
        } else {
            wordElement.classList.remove('active')
        }
    })

    // Blinker Positioning
    if (currentLetter) {
        console.log('Current Letter', currentWordIndex, currentWord, currentLetter)

        let letterRect = currentLetter.getBoundingClientRect()
        blinker.style.left = `${letterRect.left - blinker.offsetWidth + letterRect.width}px`
        blinker.style.top = `${letterRect.top}px`
    } else if (!currentLetter && inputLetters.length == 0) {
        console.log('No Current Letter', currentWord)

        let letterRect = currentWord.firstElementChild.getBoundingClientRect()
        blinker.style.left = `${letterRect.left - blinker.offsetWidth}px`
        blinker.style.top = `${letterRect.top}px`
    }
    if (currentWordIndex == wordsElements.length - 1 && letters.length == inputLetters.length) {
        currentWord.classList.add('completed')
        wordCount += 1
        wordCountElement.textContent = wordCount

        let length = letters.length
        let correctNum = 0
        letters.forEach((letter) => {
            if (letter.classList.contains('correct')) correctNum += 1

            if (letter.classList.contains('correct') || letter.classList.contains('incorrect')) {
                letter.classList.remove('skipped')
            } else {
                letter.classList.add('skipped')
            }
        })
        if (length == correctNum) {
            currentWord.classList.add('correct-word')
        }
    }

    // End Statement
    if (wordsElements[wordsElements.length - 1].classList.contains('completed')) {
        finish()
    }

    // Scrolling Effect
    let visibleWords = wordsArray.filter((word) => !word.classList.contains('opacity-0'))
    let hiddenWords = wordsArray.filter(w => w.classList.contains('opacity-0'))

    if (visibleWords.length && hiddenWords.length) {
        let firstTop = Math.min(...visibleWords.map((word) => word.offsetTop))
        let firstHiddenTop = Math.min(...hiddenWords.map((w) => w.offsetTop))

        if (blinker.offsetTop > textcont.parentElement.getBoundingClientRect().height) {
            let lineHeight = currentWord.offsetHeight
            scrollAmount += lineHeight
            textcont.style.transform = `translateY(-${scrollAmount}px)`

            let letterRect = letters[0].getBoundingClientRect()
            blinker.style.left = `${letterRect.left - blinker.offsetWidth}px`
            blinker.style.top = `${letterRect.top - lineHeight}px`

            hiddenWords.forEach((wordElement) => {
                if (wordElement.offsetTop == firstHiddenTop) {
                    wordElement.classList.remove('opacity-0')
                    wordElement.classList.add('animate-fade-in-upwards')
                }
            })
            visibleWords.forEach((wordElement) => {
                if (wordElement.offsetTop == firstTop) {
                    wordElement.classList.add('animate-fade-out-upwards')
                }
            })
        }
    }
    // }
}

// Event Listeners
// Focus Handling
textcont.addEventListener('click', (event) => {
    setFocus(true)
})
input.addEventListener('focusout', (event) => {
    setFocus(false)
})
input.addEventListener('focusin', (event) => {
    setFocus(true)
})

// Mode and Value Selection
document.querySelectorAll('#modeValues').forEach((element) => {
    element.addEventListener('click', (event) => {
        modeValue = (event.target.textContent)
        if (mode == 'words') {
            noWords = modeValue
        } else {
            duration = modeValue
            noWords = 250
        }
        update()
    })
})
document.querySelectorAll('#modes').forEach((element) => {
    element.addEventListener('click', (event) => {
        mode = event.target.textContent
        if (mode == 'words') {
            modeValue = 25
            noWords = 25
        } else {
            modeValue = 30
            noWords = 250
        }
        update()
    })
})

// Input Events
// let inputEvents = ['keydown', 'input']
// inputEvents.forEach((eventName) => {
// })
input.addEventListener('input', eventFunc)

// Window Resize
window.addEventListener('resize', () => {
    updateText()
    let firstWord = document.querySelector('.word.active')
    let firstLetter = firstWord.querySelector('.letter')
    let letterRect = firstLetter.getBoundingClientRect()
    blinker.style.display = 'block';
    blinker.style.left = `${letterRect.left - blinker.offsetWidth}px`
    blinker.style.top = `${letterRect.top}px`
})

// Reload Test
resetElement.addEventListener('click', (event) => window.location.reload())