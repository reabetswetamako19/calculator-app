// CALCULATOR PROGRAM

const display = document.getElementById("display");

function appendToDisplay(input) {
    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function calculate() {
    try {
        const expression = display.value;
        const result = eval(expression);
        addToHistory(expression, result);
        display.value = result;
    } catch (error) {
        display.value = "Error";
    }
}

function addToHistory(expression, result) {
    const historyList = document.getElementById('history-list');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `<span>${expression}</span> = <span class="result">${result}</span>`;
    historyItem.onclick = () => {
        display.value = result;
    };
    historyList.insertBefore(historyItem, historyList.firstChild);
}

function clearHistory() {
    document.getElementById('history-list').innerHTML = '';
}

function toggleHistory() {
    const panel = document.getElementById('history-panel');
    panel.classList.toggle('hidden');
}

function toggleConverter() {
    const converter = document.getElementById('converter');
    converter.classList.toggle('hidden');
}

function toggleTheme() {
    const body = document.body;
    const toggleInput = document.getElementById('theme-toggle');
    if (body.classList.contains('light')) {
        body.classList.remove('light');
        body.classList.add('dark');
        toggleInput.checked = true;
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
        toggleInput.checked = false;
    }
}

// Snake Game
let snakeGameInterval = null;
let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 1, y: 0 };
let score = 0;
const gridSize = 20;
const tileCount = 15;

function toggleSnake() {
    const game = document.getElementById('snake-game');
    game.classList.toggle('hidden');
}

function startSnake() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    
    snake = [{ x: 7, y: 7 }];
    direction = { x: 1, y: 0 };
    score = 0;
    document.getElementById('snake-score').textContent = score;
    placeFood();
    
    if (snakeGameInterval) clearInterval(snakeGameInterval);
    snakeGameInterval = setInterval(() => updateSnake(ctx), 180);
    
    document.addEventListener('keydown', handleKey);
}

function stopSnake() {
    if (snakeGameInterval) {
        clearInterval(snakeGameInterval);
        snakeGameInterval = null;
    }
    document.removeEventListener('keydown', handleKey);
}

function handleKey(e) {
    switch(e.key) {
        case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
    }
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function updateSnake(ctx) {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        stopSnake();
        alert('Game Over! Score: ' + score);
        return;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('snake-score').textContent = score;
        placeFood();
    } else {
        snake.pop();
    }
    
    drawSnake(ctx);
}

function drawSnake(ctx) {
    const isDark = document.body.classList.contains('dark');
    ctx.fillStyle = isDark ? '#333' : '#e0e0e0';
    ctx.fillRect(0, 0, 300, 300);
    
    ctx.fillStyle = '#2E7D32';
    snake.forEach((segment, i) => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Flappy Bird Game
let flappyGameInterval = null;
let flappyBird = { x: 50, y: 200, velocity: 0 };
let flappyPipes = [];
let flappyScore = 0;
const flappyGravity = 0.5;
const flappyJump = -8;
const pipeSpeed = 3;
const pipeSpawnRate = 150;

function toggleFlappy() {
    const game = document.getElementById('flappy-game');
    game.classList.toggle('hidden');
}

function startFlappy() {
    const canvas = document.getElementById('flappy-canvas');
    const ctx = canvas.getContext('2d');
    
    flappyBird = { x: 50, y: 200, velocity: 0 };
    flappyPipes = [];
    flappyScore = 0;
    document.getElementById('flappy-score').textContent = flappyScore;
    
    if (flappyGameInterval) clearInterval(flappyGameInterval);
    flappyGameInterval = setInterval(() => updateFlappy(ctx), 30);
    
    document.addEventListener('keydown', handleFlappyKey);
    document.getElementById('flappy-canvas').addEventListener('click', flapBird);
    document.getElementById('flappy-canvas').addEventListener('touchstart', flapBird);
}

function stopFlappy() {
    if (flappyGameInterval) {
        clearInterval(flappyGameInterval);
        flappyGameInterval = null;
    }
    document.removeEventListener('keydown', handleFlappyKey);
    document.getElementById('flappy-canvas').removeEventListener('click', flapBird);
    document.getElementById('flappy-canvas').removeEventListener('touchstart', flapBird);
}

function flapBird() {
    flappyBird.velocity = flappyJump;
}

function handleFlappyKey(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        flappyBird.velocity = flappyJump;
        e.preventDefault();
    }
}

function updateFlappy(ctx) {
    const canvas = ctx.canvas;
    
    // Update bird
    flappyBird.velocity += flappyGravity;
    flappyBird.y += flappyBird.velocity;
    
    // Check collision with ground/ceiling
    if (flappyBird.y < 0 || flappyBird.y > canvas.height - 20) {
        stopFlappy();
        alert('Game Over! Score: ' + flappyScore);
        return;
    }
    
    // Spawn pipes
    if (Math.random() < 0.015) {
        const gap = 180;
        const minPipe = 60;
        const maxTop = canvas.height - gap - minPipe;
        const pipeHeight = Math.random() * (maxTop - minPipe) + minPipe;
        flappyPipes.push({
            x: canvas.width,
            topHeight: pipeHeight,
            gap: gap
        });
    }
    
    // Move pipes
    flappyPipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;
        
        // Check collision
        if (flappyBird.x + 20 > pipe.x && flappyBird.x < pipe.x + 50) {
            if (flappyBird.y < pipe.topHeight || flappyBird.y + 20 > pipe.topHeight + pipe.gap) {
                stopFlappy();
                alert('Game Over! Score: ' + flappyScore);
                return;
            }
        }
        
        // Score
        if (pipe.x + 50 < flappyBird.x && !pipe.scored) {
            flappyScore++;
            document.getElementById('flappy-score').textContent = flappyScore;
            pipe.scored = true;
        }
    });
    
    // Remove off-screen pipes
    flappyPipes = flappyPipes.filter(pipe => pipe.x > -50);
    
    drawFlappy(ctx);
}

function drawFlappy(ctx) {
    const canvas = ctx.canvas;
    const isDark = document.body.classList.contains('dark');
    
    ctx.fillStyle = isDark ? '#1a1a2e' : '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(flappyBird.x + 10, flappyBird.y + 10, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(flappyBird.x + 16, flappyBird.y + 6, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw beak
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.moveTo(flappyBird.x + 20, flappyBird.y + 10);
    ctx.lineTo(flappyBird.x + 28, flappyBird.y + 13);
    ctx.lineTo(flappyBird.x + 20, flappyBird.y + 16);
    ctx.fill();
    
    // Draw pipes
    ctx.fillStyle = '#4CAF50';
    flappyPipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.topHeight + pipe.gap, 50, canvas.height - pipe.topHeight - pipe.gap);
    });
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if ((key >= '0' && key <= '9') || key === '+' || key === '-' || key === '*' || key === '/' || key === '.') {
        appendToDisplay(key);
        event.preventDefault();
    } else if (key === 'Enter') {
        calculate();
        event.preventDefault();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
        event.preventDefault();
    } else if (key === 'Backspace') {
        display.value = display.value.slice(0, -1);
        event.preventDefault();
    }
});

// Floating emoji particles
const emojis = ['⭐', '🌟', '✨', '💫', '🌈', '🎈', '🎉', '🌸', '🍀', '🦋'];
const particlesContainer = document.getElementById('particles');

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '100%';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
    particlesContainer.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 20000);
}

// Create particles periodically
setInterval(createParticle, 2000);

// Create initial particles
for (let i = 0; i < 10; i++) {
    setTimeout(createParticle, i * 500);
}

// Word to PDF Converter
async function convertToPDF() {
    const fileInput = document.getElementById('word-file');
    const preview = document.getElementById('pdf-preview');
    
    if (!fileInput.files.length) {
        preview.innerHTML = '<p style="color: red;">Please select a .docx file first!</p>';
        return;
    }
    
    const file = fileInput.files[0];
    preview.innerHTML = '<p>Converting...</p>';
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Convert Word to HTML using Mammoth
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        const htmlContent = result.value;
        
        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add content to PDF
        const lines = doc.splitTextToSize(htmlContent.replace(/<[^>]*>/g, ''), 180);
        let y = 20;
        
        for (const line of lines) {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, 15, y);
            y += 7;
        }
        
        // Save the PDF
        doc.save('converted.pdf');
        preview.innerHTML = '<p style="color: green;">✅ PDF downloaded successfully!</p>';
    } catch (error) {
        preview.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
    }
}
