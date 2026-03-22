const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",              // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",              // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",              // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const noMessages = [
    "No",
    "Are you sure? 🥺",
    "Busobemvelo please... 💔",
    "You're breaking my heart... 😭",
    "I will be very sad... 😢",
    "Please??? 💔",
    "Please say yes... ❤️", // Fixed the double quote error here
    "Last chance! 😭",
    "You can't catch me anyway 😜"
]

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let musicPlaying = false // Start as false since browser blocks autoplay

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Music logic: Unmute on first interaction
document.addEventListener('click', () => {
    if (!musicPlaying) {
        music.muted = false
        music.play().catch(() => {})
        musicPlaying = true
    }
}, { once: true })

function toggleMusic() {
    if (!music.paused) {
        music.pause()
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.play()
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    // If she hasn't clicked 'No' 5 times yet, tease her!
    if (noClickCount < 5) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    
    // Once she's "earned" it by trying to click No, let her say Yes
    document.querySelector('.container').innerHTML = `
        <h1 class="yes-title">Yay!!! I knew you would! 🥰</h1>
        <img src="https://media.tenor.com/gU_PbByB_KMAAAAi/mocha-and-milk-bears-flowers.gif" alt="Happy Bears" style="width:280px;">
        <p class="yes-message">You've made me the happiest person ever! ❤️</p>
    `
    document.body.classList.add('yes-container')
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.2}px` // 1.2 is a bit safer than 1.35 so it doesn't cover the whole screen too fast
    
    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
        showTeaseMessage("Now try to catch it! 😂")
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.style.position = 'fixed' // Ensure it can move
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway)
}

function runAway() {
    const margin = 50
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    
    // Calculate boundaries so it stays on screen
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.max(margin, Math.random() * maxX)
    const randomY = Math.max(margin, Math.random() * maxY)

    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
}
