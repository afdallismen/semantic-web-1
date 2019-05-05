function Hero () {
    var hero = {}
    hero = data.heroes[Math.floor(Math.random() * data.heroes.length)]
    hero.getRandomVoice = function () {
        return this.voices[Math.floor(Math.random() * this.voices.length)].filename
    }
    return hero
}

function getHeroById (id) {
    var i = 0
    var index = -1
    while (index === -1 && i < data.heroes.length) {
        if (data.heroes[i].id === id) {
            index = i
        }
        i++
    }
    return data.heroes[index]
}

function getHeroChoice (currentHero) {
    // the problem with random is it can get long before it can return a unique value from small size data
    // so i purposely remove already picked hero from list of choice
    var heroChoice = [currentHero.id]
    var selected = currentHero.id
    var heroIds = []
    for (var i = 0; i < data.heroes.length; i++) {
        if (currentHero.genre === data.heroes[i].genre) {
            heroIds.push(data.heroes[i].id)
        }
    }
    while (heroChoice.length < 3) {
        var found = false
        var i = 0
        while (!found && i < heroIds.length) {
            if (heroIds[i] === selected) {
                heroIds.splice(i, 1)
                found = true
            }
            i++
        }
        var heroId = heroIds[Math.floor(Math.random() * heroIds.length)]
        heroChoice.push(heroId)
        selected = heroId
    }
    return heroChoice
}

function takeGuess (currentHero, voicePath) {
    return function (guess) {
        var result = document.getElementsByClassName("result")[0]
        result.setAttribute("style", "display: unset;")
        if (currentHero.id === guess) {
            var successFeedback = document.getElementsByClassName("success-feedback")[0]
            successFeedback.setAttribute("style", "display: unset;")

            var quote = ""
            for (var i = 0; i < currentHero.voices.length; i++) {
                if (voicePath.indexOf(currentHero.voices[i].filename) !== -1) {
                    quote = currentHero.voices[i].subtitle
                }
            }
            document.getElementsByTagName("blockquote")[0].children[0].innerHTML = quote
            document.getElementsByTagName("blockquote")[0].children[1].innerHTML = currentHero.name

            var audio = document.getElementById("hero-voice")
            audio.play()
        } else {
            var failFeedback = document.getElementsByClassName("fail-feedback")[0]
            failFeedback.setAttribute("style", "display: unset;")
            
            setTimeout(function () {
                window.onload()
            }, 3000)
        }
    }
}

function shuffle (array) {
    var copy = []
    var n = array.length
    var i = undefined

    while (n) {
        // Pick a remaining element...
        i = Math.floor(Math.random() * n--)

        // And move it to the new array.
        copy.push(array.splice(i, 1)[0])
    }

    return copy
}

function loadVoice (path) {
    document
        .getElementById("hero-voice")
        .children["hero-voice-source"]
        .setAttribute("src", path)
    document
        .getElementById("hero-voice")
        .load()
}

function generateRadioButton (choices, onClick) {
    var radioGroup = document.getElementsByName("hero-choices")
    for (var i = 0; i < choices.length; i++) {
        var hero = window.getHeroById(choices[i])
        radioGroup[i].parentNode.lastChild.nodeValue = hero.name
        radioGroup[i].setAttribute("value", hero.id)
        radioGroup[i].setAttribute("disabled", true)
        radioGroup[i].removeAttribute("checked")
    }
    var lists = document.getElementsByTagName("li")
    for (var i = 0; i < lists.length; i++) {
        lists[i].onclick = function () {
            this.children["hero-choices"].setAttribute("selected", true)
            for (var j = 0; j < lists.length; j++) {
                lists[j].onclick = function () {}
            }
            onClick(this.children["hero-choices"].value)
        }
    }
}

function registerEventListener () {
    var playButton = document.getElementById("play-btn")
    playButton.onclick = function () {
        var radioGroup = document.getElementsByName("hero-choices")
        for (var i = 0; i < radioGroup.length; i++) {
            radioGroup[i].removeAttribute("disabled")
        }
        document.getElementById("hero-voice").play()
    }

    var nextButton = document.getElementById("next-btn")
    nextButton.onclick = function () {
        window.onload()
    }
}

window.onload = function () {
    var toBeHidden = ["result", "fail-feedback", "success-feedback"]
    for (var i = 0; i < toBeHidden.length; i++) {
        document.getElementsByClassName(toBeHidden[i])[0].setAttribute("style", "display: none;")
    }
    var currentHero = new Hero()

    if (currentHero) {
        // load hero voice
        var voicePath = "assets/audio/" + currentHero.name + "/" + currentHero.getRandomVoice()
        loadVoice(voicePath)

        // generate radio button
        var choices = getHeroChoice(currentHero)
        generateRadioButton(shuffle(choices), takeGuess(currentHero, voicePath))

        // register audio controls event
        registerEventListener()
    }
}