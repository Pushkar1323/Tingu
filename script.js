// ========================================
// 🥘 DOSA LOVE GAME - JAVASCRIPT
// Made with ❤️ by Pucchu for Cutie
// ========================================

// ========== GLOBAL VARIABLES ==========
const dosa = document.getElementById('dosa');
const dosaWrapper = document.getElementById('dosaWrapper');
const emptyPlate = document.getElementById('emptyPlate');
const fillingBadge = document.getElementById('fillingBadge');
const fillingContainer = document.getElementById('fillingContainer');
const toppingsContainer = document.getElementById('toppingsContainer');
const bowls = document.querySelectorAll('.bowl');
const bgMusic = document.getElementById('bgMusic');
const cookingDosa = document.getElementById('cookingDosa');
const cookBtn = document.getElementById('cookBtn');

let totalDips = 0;
let yummyPoints = 0;
let currentDosaType = 'plain';
let isMusicPlaying = false;
let soundEnabled = true;
let isDarkMode = false;
let loveLevel = 1;
let loveMeter = 0;
let comboCount = 0;
let bestCombo = 0;
let lastDipType = '';
let comboTimer = null;
let biteCount = 0;
let highScore = parseInt(localStorage.getItem('dosaHighScore')) || 0;
let isDosaReady = false;
let isCooking = false;
let challengeMode = false;
let challengeTimer = null;
let challengeTimeLeft = 30;
let challengeDips = 0;
let activeToppings = [];

let dipCounts = { coconut: 0, tomato: 0, pudina: 0, sambar: 0 };
let achievements = {};

// Chef messages
const chefMessages = [
    "Wah! Kya baat hai! 😋",
    "Mast dip kiya! 🔥",
    "Tera taste kamaal hai! 💕",
    "Aur khao cutie! 😘",
    "Yummy yummy! 🤤",
    "Perfect combo! ⭐",
    "Crispy dosa ready! 🥘",
    "Chef's special! 👨‍🍳",
    "Love you cutie! ❤️",
    "Best customer! 🏆"
];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    createFloatingBg();
    document.getElementById('highScore').textContent = highScore;
    
    // Show chef welcome message
    setTimeout(() => {
        showChefMessage("Welcome Cutie! 💕");
    }, 1000);
    
    // Check saved theme
    if (localStorage.getItem('dosaTheme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeBtn').textContent = '☀️';
        isDarkMode = true;
    }
});

// ========== FLOATING BACKGROUND ==========
function createFloatingBg() {
    const container = document.getElementById('floatingBg');
    const items = ['❤️', '💕', '🥘', '🥥', '🍅', '🌿', '✨', '💛', '🧡', '💖', '🌶️', '🧀'];
    
    for (let i = 0; i < 25; i++) {
        const item = document.createElement('div');
        item.className = 'floating-item';
        item.textContent = items[Math.floor(Math.random() * items.length)];
        item.style.left = Math.random() * 100 + '%';
        item.style.fontSize = (1.2 + Math.random() * 2) + 'rem';
        item.style.animationDelay = Math.random() * 20 + 's';
        item.style.animationDuration = (15 + Math.random() * 15) + 's';
        container.appendChild(item);
    }
}

// ========== CHEF AVATAR ==========
function showChefMessage(msg) {
    const speech = document.getElementById('chefSpeech');
    speech.textContent = msg;
    speech.classList.add('show');
    
    setTimeout(() => {
        speech.classList.remove('show');
    }, 3000);
}

function randomChefMessage() {
    const msg = chefMessages[Math.floor(Math.random() * chefMessages.length)];
    showChefMessage(msg);
}

// ========== COOKING SYSTEM ==========
function cookDosa() {
    if (isCooking) return;
    
    isCooking = true;
    cookBtn.disabled = true;
    cookBtn.textContent = '🔥 Cooking...';
    
    // Show cooking animation
    cookingDosa.classList.add('cooking');
    
    // Play sizzle sound concept
    if (soundEnabled) {
        playSound('sizzle');
    }
    
    showChefMessage("Dosa ban raha hai! 🔥");
    
    // Cooking time
    setTimeout(() => {
        // Hide cooking, show ready dosa
        cookingDosa.classList.remove('cooking');
        emptyPlate.style.display = 'none';
        dosaWrapper.style.display = 'block';
        
        // Reset dosa state
        biteCount = 0;
        document.querySelectorAll('.bite-mark').forEach(b => b.classList.remove('show'));
        
        // Update filling
        updateDosaFilling(currentDosaType);
        updateToppings();
        
        isDosaReady = true;
        isCooking = false;
        cookBtn.disabled = false;
        cookBtn.textContent = '🍳 Cook Fresh Dosa!';
        
        showChefMessage("Garam dosa ready! 🥘");
        
        // Add entrance animation
        dosaWrapper.style.animation = 'none';
        dosaWrapper.offsetHeight; // Trigger reflow
        dosaWrapper.style.animation = 'dosaAppear 0.5s ease';
        
    }, 3000);
}

// Add dosa appear animation to CSS via JS
const dosaAppearStyle = document.createElement('style');
dosaAppearStyle.textContent = `
    @keyframes dosaAppear {
        0% { transform: scale(0) rotate(-10deg); opacity: 0; }
        50% { transform: scale(1.1) rotate(5deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
`;
document.head.appendChild(dosaAppearStyle);

// ========== DOSA TYPE SELECTOR ==========
document.querySelectorAll('.dosa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.dosa-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDosaType = btn.dataset.type;
        fillingBadge.textContent = btn.dataset.name;
        
        if (isDosaReady) {
            updateDosaFilling(currentDosaType);
            
            // Bounce effect
            dosa.style.transform = 'scale(1.15)';
            setTimeout(() => dosa.style.transform = '', 200);
        }
        
        showChefMessage(btn.dataset.name + " selected! 👨‍🍳");
    });
});

// ========== TOPPINGS SYSTEM ==========
function toggleTopping(topping) {
    const btn = document.querySelector(`[data-topping="${topping}"]`);
    
    if (activeToppings.includes(topping)) {
        activeToppings = activeToppings.filter(t => t !== topping);
        btn.classList.remove('active');
    } else {
        activeToppings.push(topping);
        btn.classList.add('active');
    }
    
    if (isDosaReady) {
        updateToppings();
    }
}

function updateToppings() {
    toppingsContainer.innerHTML = '';
    
    const toppingEmojis = {
        butter: '🧈',
        ghee: '✨',
        cheese: '🧀',
        podi: '🌶️',
        coriander: '🌿',
        onion: '🧅'
    };
    
    activeToppings.forEach((topping, index) => {
        const item = document.createElement('span');
        item.className = 'topping-item';
        item.textContent = toppingEmojis[topping];
        
        // Random position
        item.style.top = (20 + Math.random() * 50) + '%';
        item.style.left = (15 + Math.random() * 60) + '%';
        item.style.animationDelay = (index * 0.1) + 's';
        
        toppingsContainer.appendChild(item);
    });
}

// ========== UPDATE DOSA FILLING ==========
function updateDosaFilling(type) {
    // Reset all layers
    fillingContainer.innerHTML = '';
    fillingContainer.classList.remove('show');
    document.getElementById('ravaTexture').classList.remove('show');
    document.getElementById('mysoreLayer').classList.remove('show');
    document.getElementById('cheeseLayer').classList.remove('show');
    document.getElementById('eggLayer').classList.remove('show');
    document.getElementById('masalaFold').classList.remove('show');
    dosa.classList.remove('paper-style');

    switch(type) {
        case 'aloo':
            createAlooPieces(8);
            document.getElementById('masalaFold').classList.add('show');
            fillingContainer.classList.add('show');
            break;

        case 'paneer':
            createPaneerCubes(5);
            createAlooPieces(4);
            document.getElementById('masalaFold').classList.add('show');
            fillingContainer.classList.add('show');
            break;

        case 'cheese':
            document.getElementById('cheeseLayer').classList.add('show');
            break;

        case 'mysore':
            document.getElementById('mysoreLayer').classList.add('show');
            createAlooPieces(6);
            document.getElementById('masalaFold').classList.add('show');
            fillingContainer.classList.add('show');
            break;

        case 'paper':
            dosa.classList.add('paper-style');
            break;

        case 'rava':
            document.getElementById('ravaTexture').classList.add('show');
            break;

        case 'egg':
            document.getElementById('eggLayer').classList.add('show');
            break;

        case 'onion':
            createOnionPieces(12);
            fillingContainer.classList.add('show');
            break;
    }
}

function createAlooPieces(count) {
    for (let i = 0; i < count; i++) {
        const aloo = document.createElement('div');
        aloo.className = 'aloo-piece';
        aloo.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
        fillingContainer.appendChild(aloo);
    }
}

function createPaneerCubes(count) {
    for (let i = 0; i < count; i++) {
        const paneer = document.createElement('div');
        paneer.className = 'paneer-cube';
        paneer.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        fillingContainer.appendChild(paneer);
    }
}

function createOnionPieces(count) {
    for (let i = 0; i < count; i++) {
        const onion = document.createElement('div');
        onion.className = 'onion-piece';
        onion.style.transform = `rotate(${Math.random() * 180}deg)`;
        fillingContainer.appendChild(onion);
    }
}

// ========== DRAG AND DROP ==========
let isDragging = false;
let startX, startY, initialX, initialY;

dosa.addEventListener('mousedown', startDrag);
dosa.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag, { passive: false });
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function startDrag(e) {
    if (!isDosaReady) {
        showChefMessage("Pehle dosa cook karo! 👆");
        return;
    }
    
    isDragging = true;
    dosa.classList.add('dragging');
    
    if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    } else {
        startX = e.clientX;
        startY = e.clientY;
    }
    
    const rect = dosa.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    dosa.style.position = 'fixed';
    dosa.style.left = initialX + 'px';
    dosa.style.top = initialY + 'px';
    dosa.style.zIndex = '1000';
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    let currentX, currentY;
    if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
    } else {
        currentX = e.clientX;
        currentY = e.clientY;
    }
    
    dosa.style.left = (initialX + currentX - startX) + 'px';
    dosa.style.top = (initialY + currentY - startY) + 'px';
}

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    dosa.classList.remove('dragging');
    
    const dosaRect = dosa.getBoundingClientRect();
    const centerX = dosaRect.left + dosaRect.width / 2;
    const centerY = dosaRect.top + dosaRect.height / 2;
    
    let dipped = false;
    
    bowls.forEach(bowl => {
        const bowlRect = bowl.getBoundingClientRect();
        if (centerX >= bowlRect.left && centerX <= bowlRect.right && 
            centerY >= bowlRect.top && centerY <= bowlRect.bottom) {
            handleDip(bowl);
            dipped = true;
        }
    });
    
    resetDosa();
}

function resetDosa() {
    dosa.style.position = 'relative';
    dosa.style.left = '';
    dosa.style.top = '';
    dosa.style.zIndex = '10';
  }
// ========== HANDLE DIP ==========
function handleDip(bowl) {
    const bowlType = bowl.classList[1];
    const bowlColor = bowl.dataset.color;
    
    // Play sound
    if (soundEnabled) {
        playSound('dip');
    }
    
    // Combo logic
    if (lastDipType && lastDipType !== bowlType) {
        comboCount++;
        if (comboCount > bestCombo) {
            bestCombo = comboCount;
            document.getElementById('bestCombo').textContent = bestCombo + 'x';
        }
        showCombo();
    } else if (lastDipType === bowlType) {
        comboCount = 0;
    }
    lastDipType = bowlType;
    
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => { comboCount = 0; lastDipType = ''; }, 3000);
    
    // Calculate points
    let points = bowlType === 'sambar' ? 15 : 10;
    points += comboCount * 5;
    points += activeToppings.length * 2; // Bonus for toppings
    
    // Update counts
    dipCounts[bowlType]++;
    totalDips++;
    yummyPoints += points;
    
    // Challenge mode
    if (challengeMode) {
        challengeDips++;
        document.getElementById('challengeScore').textContent = challengeDips;
    }
    
    // Love meter
    loveMeter += 3;
    if (loveMeter >= 100) {
        loveMeter = 0;
        loveLevel++;
        document.getElementById('loveLevel').textContent = loveLevel;
        showAchievement('💕', 'Love Level ' + loveLevel + '!');
        createConfetti();
    }
    document.getElementById('loveFill').style.height = loveMeter + '%';
    
    // High score
    if (yummyPoints > highScore) {
        highScore = yummyPoints;
        localStorage.setItem('dosaHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
    
    // Update UI
    document.getElementById(`${bowlType}Count`).textContent = dipCounts[bowlType];
    document.getElementById('totalDips').textContent = totalDips;
    document.getElementById('yummyPoints').textContent = yummyPoints;
    
    // Animations
    bowl.classList.add('dipping');
    setTimeout(() => bowl.classList.remove('dipping'), 700);
    
    createSplash(bowl, bowlColor);
    showYummyText(bowl, points);
    addBiteMark();
    
    // Random chef message
    if (Math.random() > 0.6) {
        randomChefMessage();
    }
    
    checkAchievements();
    
    // Show popup every 5 dips
    if (totalDips % 5 === 0 && !challengeMode) {
        const msgs = getRandomMessage(bowlType);
        setTimeout(() => showPopup(msgs.emoji, msgs.title, msgs.msg), 400);
    }
}

// Click on bowl also works
bowls.forEach(bowl => {
    bowl.addEventListener('click', () => {
        if (isDosaReady) {
            handleDip(bowl);
        } else {
            showChefMessage("Pehle dosa cook karo! 👆");
        }
    });
});

// ========== BITE MARKS ==========
function addBiteMark() {
    if (biteCount < 3) {
        biteCount++;
        document.getElementById('bite' + biteCount).classList.add('show');
    }
}

// ========== VISUAL EFFECTS ==========
function createSplash(bowl, color) {
    const rect = bowl.getBoundingClientRect();
    
    for (let i = 0; i < 15; i++) {
        const splash = document.createElement('div');
        const size = 6 + Math.random() * 8;
        
        splash.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + 35}px;
            pointer-events: none;
            z-index: 3000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: splashAnim 0.7s ease-out forwards;
            --tx: ${(Math.random() - 0.5) * 150}px;
            --ty: ${(Math.random() - 0.5) * 150}px;
        `;
        document.body.appendChild(splash);
        setTimeout(() => splash.remove(), 700);
    }
}

function showYummyText(bowl, points) {
    const texts = ['Yummy!', 'Tasty!', 'Mast!', 'Wow!', 'Nice!', '😋', '🔥', '+' + points];
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3'];
    const text = texts[Math.floor(Math.random() * texts.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const yummy = document.createElement('div');
    yummy.textContent = text;
    yummy.style.cssText = `
        position: fixed;
        left: ${bowl.getBoundingClientRect().left + 20}px;
        top: ${bowl.getBoundingClientRect().top - 10}px;
        font-size: 2.2rem;
        font-weight: 900;
        color: ${color};
        pointer-events: none;
        z-index: 3000;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        animation: yummyAnim 1.2s ease-out forwards;
    `;
    document.body.appendChild(yummy);
    setTimeout(() => yummy.remove(), 1200);
}

function showCombo() {
    const comboPopup = document.getElementById('comboPopup');
    const comboTexts = [
        '2x COMBO!',
        '3x COMBO! 🔥',
        '4x AMAZING! 🔥🔥',
        '5x INCREDIBLE! 🔥🔥🔥',
        'MEGA COMBO! 💥💥💥'
    ];
    comboPopup.textContent = '🔥 ' + comboTexts[Math.min(comboCount - 1, 4)];
    comboPopup.classList.add('show');
    setTimeout(() => comboPopup.classList.remove('show'), 2000);
}

function createConfetti() {
    const emojis = ['🎉', '🎊', '✨', '💕', '🥘', '⭐', '🌟', '💖', '🔥'];
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3', '#ffd700'];
    
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            
            if (Math.random() > 0.4) {
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                confetti.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
            } else {
                confetti.style.width = (8 + Math.random() * 8) + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            }
            
            confetti.style.cssText += `
                position: fixed;
                top: -20px;
                left: ${Math.random() * 100}%;
                pointer-events: none;
                z-index: 4000;
                animation: confettiFall ${2 + Math.random() * 2}s ease-out forwards;
            `;
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }, i * 40);
    }
}

// ========== CHALLENGE MODE ==========
function startChallenge() {
    if (challengeMode) return;
    if (!isDosaReady) {
        showChefMessage("Pehle dosa cook karo! 👆");
        return;
    }
    
    challengeMode = true;
    challengeDips = 0;
    challengeTimeLeft = 30;
    
    document.getElementById('challengeScore').textContent = '0';
    document.getElementById('challengeTimer').textContent = '30';
    document.getElementById('challengePopup').classList.add('show');
    
    showChefMessage("30 second challenge! GO! 🏃");
    
    challengeTimer = setInterval(() => {
        challengeTimeLeft--;
        document.getElementById('challengeTimer').textContent = challengeTimeLeft;
        
        if (challengeTimeLeft <= 0) {
            endChallenge();
        }
    }, 1000);
}

function endChallenge() {
    clearInterval(challengeTimer);
    challengeMode = false;
    
    document.getElementById('challengePopup').classList.remove('show');
    document.getElementById('finalScore').textContent = challengeDips;
    document.getElementById('challengeResult').classList.add('show');
    document.getElementById('popupOverlay').classList.add('show');
    
    createConfetti();
    
    if (challengeDips >= 20) {
        showChefMessage("AMAZING! Tera record! 🏆");
    } else if (challengeDips >= 10) {
        showChefMessage("Great job cutie! 👏");
    } else {
        showChefMessage("Next time aur fast! 💪");
    }
}

function closeChallengeResult() {
    document.getElementById('challengeResult').classList.remove('show');
    document.getElementById('popupOverlay').classList.remove('show');
}

// ========== ACHIEVEMENTS ==========
function checkAchievements() {
    if (totalDips === 1 && !achievements.first) {
        achievements.first = true;
        showAchievement('🎉', 'First Dip!');
    }
    if (totalDips === 10 && !achievements.ten) {
        achievements.ten = true;
        showAchievement('⭐', '10 Dips Done!');
    }
    if (totalDips === 25 && !achievements.twenty5) {
        achievements.twenty5 = true;
        showAchievement('🌟', '25 Dips! Pro!');
    }
    if (totalDips === 50 && !achievements.fifty) {
        achievements.fifty = true;
        showAchievement('👑', 'Dosa King!');
        createConfetti();
    }
    if (totalDips === 100 && !achievements.hundred) {
        achievements.hundred = true;
        showAchievement('💎', '100 Dips! Legend!');
        createConfetti();
    }
    if (bestCombo >= 5 && !achievements.combo5) {
        achievements.combo5 = true;
        showAchievement('🔥', '5x Combo Master!');
    }
    if (loveLevel >= 5 && !achievements.love5) {
        achievements.love5 = true;
        showAchievement('💕', 'Love Expert!');
    }
    if (dipCounts.sambar >= 30 && !achievements.sambar) {
        achievements.sambar = true;
        showAchievement('🥘', 'Sambar King!');
    }
}

function showAchievement(icon, text) {
    const popup = document.getElementById('achievementPopup');
    popup.querySelector('.badge-icon').textContent = icon;
    popup.querySelector('.badge-text').textContent = text;
    popup.classList.add('show');
    
    if (soundEnabled) playSound('achievement');
    
    setTimeout(() => popup.classList.remove('show'), 3500);
}

// ========== MESSAGES ==========
function getRandomMessage(type) {
    const messages = {
        coconut: [
            { emoji: "🥥", title: "Coconut Chutney!", msg: "Creamy, fresh aur tasty!" },
            { emoji: "😋", title: "Perfect Dip!", msg: "South Indian classic!" },
            { emoji: "🌴", title: "Tropical Love!", msg: "Nariyal ki khushbu!" }
        ],
        tomato: [
            { emoji: "🍅", title: "Tomato Chutney!", msg: "Tangy aur spicy!" },
            { emoji: "🔥", title: "Red Hot!", msg: "Mast laga na?" },
            { emoji: "😍", title: "Zabardast!", msg: "Perfect balance!" }
        ],
        pudina: [
            { emoji: "🌿", title: "Pudina Fresh!", msg: "Cooling mint magic!" },
            { emoji: "💚", title: "Green Power!", msg: "Healthy aur tasty!" },
            { emoji: "😎", title: "Refreshing!", msg: "Thanda thanda cool cool!" }
        ],
        sambar: [
            { emoji: "🥘", title: "Sambar Time!", msg: "Full South Indian!" },
            { emoji: "🔥", title: "Garam Sambar!", msg: "Vegetables + Masala!" },
            { emoji: "👨‍🍳", title: "Chef's Special!", msg: "Ekdum authentic!" }
        ]
    };
    const msgs = messages[type];
    return msgs[Math.floor(Math.random() * msgs.length)];
}

// ========== POPUPS ==========
function showPopup(emoji, title, msg) {
    document.getElementById('popupEmoji').textContent = emoji;
    document.getElementById('popupTitle').textContent = title;
    document.getElementById('popupMessage').textContent = msg;
    document.getElementById('popupOverlay').classList.add('show');
    document.getElementById('messagePopup').classList.add('show');
}

function closePopup() {
    document.getElementById('popupOverlay').classList.remove('show');
    document.getElementById('messagePopup').classList.remove('show');
}

// ========== CONTROLS ==========
function toggleMusic() {
    const btn = document.getElementById('musicBtn');
    if (isMusicPlaying) {
        bgMusic.pause();
        btn.textContent = '🎵';
        btn.classList.remove('active');
    } else {
        bgMusic.play().catch(() => {});
        btn.textContent = '🎶';
        btn.classList.add('active');
    }
    isMusicPlaying = !isMusicPlaying;
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('soundBtn').textContent = soundEnabled ? '🔊' : '🔇';
    showChefMessage(soundEnabled ? "Sound ON! 🔊" : "Sound OFF 🔇");
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeBtn').textContent = '☀️';
        localStorage.setItem('dosaTheme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.getElementById('themeBtn').textContent = '🌙';
        localStorage.setItem('dosaTheme', 'light');
    }
}

// ========== SOUND EFFECTS ==========
function playSound(type) {
    // Web Audio API for sound effects
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'dip':
                oscillator.frequency.value = 600;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.1;
                break;
            case 'achievement':
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.1;
                break;
            case 'sizzle':
                oscillator.frequency.value = 200;
                oscillator.type = 'sawtooth';
                gainNode.gain.value = 0.05;
                break;
        }
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch(e) {}
}

// ========== CSS ANIMATIONS VIA JS ==========
const extraStyles = document.createElement('style');
extraStyles.textContent = `
    @keyframes splashAnim {
        0% { opacity: 1; transform: scale(1) translate(0, 0); }
        100% { opacity: 0; transform: scale(0.5) translate(var(--tx), var(--ty)); }
    }
    @keyframes yummyAnim {
        0% { opacity: 1; transform: translateY(0) scale(1) rotate(-5deg); }
        100% { opacity: 0; transform: translateY(-120px) scale(1.5) rotate(5deg); }
    }
    @keyframes confettiFall {
        0% { opacity: 1; transform: translateY(0) rotate(0deg); }
        100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
    }
`;
document.head.appendChild(extraStyles);

// ========== CONSOLE MESSAGE ==========
console.log('%c🥘 Dosa Love Game 🥘', 'font-size: 35px; color: #8b4513; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%c💋 Made by Pucchu for Appuu 💋', 'font-size: 20px; color: #ff69b4; font-weight: bold;');
console.log('%cMwahhh! 😘💕', 'font-size: 18px; color: #ff1493;');
console.log('%cI Love You Appuu cutuuu! ❤️', 'font-size: 22px; color: #ff6b6b; font-weight: bold;');
