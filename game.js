// Palabras clave con sus símbolos únicos
const keyWords = {
    // De "ÉXITO"
    "É": "★",
    "X": "✦",
    "I": "✧",
    "T": "✪",
    "O": "✫",
    // De "MADRE"
    "M": "◆",
    "A": "◇",
    "D": "◈",
    "R": "◉",
    // De "LUNES"
    "L": "⬟",
    "U": "⬡",
    "N": "⬢",
    "E": "⬣",
    "S": "⬤",
    // De "JUNCO"
    "J": "❖",
    "C": "❍",
    // De "VÍA"
    "V": "❂",
    "Í": "❉"
};

// Obtener letras únicas ordenadas
function getUniqueLetters() {
    return Object.keys(keyWords);
}

// Crear secuencia de símbolos para una palabra
function createSymbolSequence(word) {
    let sequence = "";
    for (let char of word.toUpperCase()) {
        if (keyWords[char]) {
            sequence += keyWords[char] + " ";
        }
    }
    return sequence.trim();
}

// Niveles del juego - mensajes secretos con solo símbolos
const levels = [
    {
        encoded: "◆◇◈◆◉ ★✧✪✫ ◇◉✧✪✫",
        answer: "MADRE ES MUY BUENA",
        hint: "La primera palabra es MADRE"
    },
    {
        encoded: "✦✧✪✫ ★✧✪✫ ✪✧◆◇",
        answer: "EXITO EN EL TRABAJO",
        hint: "Comienza con EXITO"
    },
    {
        encoded: "⬟⬢⬣◆◇ ❖⬢⬤⬢◉",
        answer: "LUNES EN JUNIO",
        hint: "LUNES aparece primero"
    },
    {
        encoded: "❂❉◇ ✦✧✪✫ ◆◇◈◉",
        answer: "VÁYANSE A CASA",
        hint: "VÍA se convierte en VÁYANSE"
    },
    {
        encoded: "◆◇◈◆◉ ✦✧✪✫ ⬟⬢⬣◆◇ ❖⬢⬤⬢◉ ✪✧◆◇",
        answer: "MADRE LUNES EN JUNIO",
        hint: "MADRE y LUNES son palabras clave"
    }
];

let currentLevel = 0;
let startTime = null;
let timerInterval = null;
let mistakes = 0;
let hintsUsed = 0;
let playerName = "";

// Elementos del DOM
const encodedEl = document.getElementById("encoded");
const answerEl = document.getElementById("answer");
const checkBtn = document.getElementById("check");
const feedback = document.getElementById("feedback");
const progress = document.getElementById("progress");
const hintBtn = document.getElementById("hint");

// Renderizar palabras clave con texto y símbolos
function renderKeyWords() {
    const container = document.getElementById("keyWords");
    container.innerHTML = "";
    
    const keywords = ["ÉXITO", "MADRE", "LUNES", "JUNCO", "VÍA"];
    
    keywords.forEach(word => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "key";
        const symbolSeq = createSymbolSequence(word);
        wordDiv.innerHTML = `
            <strong>${word}</strong>
            <span class="symbol-seq">${symbolSeq}</span>
        `;
        container.appendChild(wordDiv);
    });
}

// Renderizar selector de letras (solo letras únicas)
function renderLetterSelector() {
    const container = document.getElementById("letterSelector");
    container.innerHTML = "";
    
    const letters = getUniqueLetters();
    letters.forEach(letter => {
        const btn = document.createElement("button");
        btn.className = "letter-btn";
        btn.textContent = letter;
        btn.addEventListener("click", () => {
            // Agregar letra al input
            answerEl.value += letter;
            answerEl.focus();
        });
        container.appendChild(btn);
    });
}

// Verificar respuesta
function checkAnswer() {
    const userAnswer = answerEl.value.trim().toUpperCase();
    const correctAnswer = levels[currentLevel].answer.toUpperCase();
    
    if (userAnswer === correctAnswer) {
        // Respuesta correcta - mostrar felicitaciones por 10 segundos
        showFeedback("🎉 ¡Correcto! Cargando siguiente nivel...", "feedback-success");
        
        // Mostrar animación de celebración en el área del mensaje
        encodedEl.innerHTML = `
            <div class="celebration fade-in" style="text-align: center; width: 100%;">
                <h2 style="font-size: 2em; margin-bottom: 10px;">🎊 ¡Excelente!</h2>
                <p style="font-size: 1.3em;">¡Has descifrado el código!</p>
                <p style="font-size: 1em; margin-top: 15px; opacity: 0.8;">Siguiente nivel en <span id="countdown">10</span> segundos...</p>
            </div>
        `;
        
        // Contador regresivo
        let countdown = 10;
        const countdownEl = document.getElementById("countdown");
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownEl) {
                countdownEl.textContent = countdown;
            }
            if (countdown <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
        
        setTimeout(() => {
            currentLevel++;
            if (currentLevel < levels.length) {
                loadLevel();
            } else {
                endGame();
            }
        }, 10000);
    } else {
        // Respuesta incorrecta
        mistakes++;
        
        // Resaltar errores
        answerEl.classList.add("wrong");
        showFeedback(`✖ Incorrecto. ${mistakes} error(s)`, "feedback-error");
        
        setTimeout(() => {
            answerEl.classList.remove("wrong");
        }, 500);
    }
}

// Manejo de pista
hintBtn.onclick = () => {
    if (hintsUsed >= 3) {
        showFeedback("⚠️ Ya usaste todas las pistas", "feedback-error");
        return;
    }
    
    hintsUsed++;
    const level = levels[currentLevel];
    showFeedback(`💡 ${level.hint} (Pistas: ${hintsUsed}/3)`, "feedback-info");
};

// Iniciar temporizador
function startTimer() {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// Actualizar temporizador
function updateTimer() {
    if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        const timerEl = document.getElementById("timer");
        if (timerEl) {
            timerEl.textContent = `⏱ ${timeStr}`;
        }
    }
}

// Cargar nivel
function loadLevel() {
    if (currentLevel < levels.length) {
        const level = levels[currentLevel];
        
        // Crear elementos de símbolos
        let encodedHTML = "";
        let charIndex = 0;
        
        for (let i = 0; i < level.encoded.length; i++) {
            const char = level.encoded[i];
            if (char.trim() === "") {
                encodedHTML += `<span class="space"></span>`;
            } else if (Object.values(keyWords).includes(char)) {
                encodedHTML += `<span class="symbol" data-index="${charIndex}" data-symbol="${char}">${char}</span>`;
                charIndex++;
            } else {
                encodedHTML += `<span class="space">${char}</span>`;
            }
        }
        
        encodedEl.innerHTML = encodedHTML;
        
        // Limpiar input
        answerEl.value = "";
        answerEl.className = "";
        
        feedback.textContent = "";
        feedback.className = "";
        
        progress.innerHTML = `
            <span id="levelInfo">Nivel ${currentLevel + 1} de ${levels.length}</span>
            <span id="timer">⏱ 00:00</span>
        `;
        
        // Efecto de aparición
        encodedEl.classList.add('fade-in');
        setTimeout(() => {
            encodedEl.classList.remove('fade-in');
        }, 500);
        
        // Enfocar input
        answerEl.focus();
        
        startTimer();
    }
}

// Mostrar feedback
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = type;
}

// Finalizar juego
function endGame() {
    clearInterval(timerInterval);
    const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
    // Calcular puntuación
    const maxScore = levels.length * 100;
    const score = Math.max(0, maxScore - (mistakes * 5) - (hintsUsed * 10));
    const percentage = Math.round((score / maxScore) * 100);
    
    let message = "";
    if (percentage >= 90) {
        message = "🏆 ¡EXCELENTE! Dominas el código perfectamente";
    } else if (percentage >= 70) {
        message = "👏 ¡MUY BIEN! Tu capacidad de razonamiento es notable";
    } else if (percentage >= 50) {
        message = "👍 ¡BIEN! Sigue practicando para mejorar";
    } else {
        message = "💪 ¡ÁNIMO! La práctica hace al maestro";
    }
    
    encodedEl.innerHTML = `
        <div style="text-align: center;" class="celebration fade-in">
            <h2 style="font-size: 2em; margin-bottom: 20px;" class="glow-text">🎊 ¡Juego Completado!</h2>
            <p style="font-size: 1.5em;" class="glow-text">Puntuación Final: <strong>${score}</strong></p>
            <p style="font-size: 1.2em; margin-top: 10px;">${message}</p>
            <p style="font-size: 1em; margin-top: 20px; opacity: 0.8;">
                Errores: ${mistakes} | Pistas: ${hintsUsed} | Tiempo: ${timeStr}
            </p>
        </div>
    `;
    
    // Ocultar elementos innecesarios
    answerEl.style.display = "none";
    checkBtn.style.display = "none";
    hintBtn.style.display = "none";
    
    feedback.textContent = "";
    progress.innerHTML = `<span>¡Felicidades por completar todos los niveles!</span>`;
    
    // Guardar puntuación
    saveGameData(score, elapsed, mistakes, hintsUsed);
}

// Guardar datos del juego en la base de datos
async function saveGameData(score, time, errors, hints) {
    try {
        const response = await fetch('/api/guardar-puntuacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: playerName,
                puntuacion: score,
                nivel: levels.length,
                tiempo: time,
                errores: errors,
                pistasUsadas: hints
            })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('Datos guardados correctamente:', result.data);
        } else {
            console.error('Error al guardar:', result.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Inicializar juego
function init() {
    const startScreen = document.getElementById("startScreen");
    const startBtn = document.getElementById("startBtn");
    const studentName = document.getElementById("studentName");
    const studentInfo = document.getElementById("studentInfo");
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    
    // Manejar pantalla completa
    fullscreenBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error al activar pantalla completa: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    // Evento del botón verificar
    checkBtn.addEventListener("click", checkAnswer);
    
    // Enter en el input para verificar
    answerEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            checkAnswer();
        }
    });
    
    // Manejar clic en comenzar
    startBtn.addEventListener("click", () => {
        const name = studentName.value.trim();
        if (name) {
            playerName = name;
            studentInfo.textContent = `¡Bienvenido, ${name}!`;
            
            startScreen.style.opacity = "0";
            startScreen.style.transition = "opacity 0.5s ease";
            setTimeout(() => {
                startScreen.style.display = "none";
                header.classList.add("active");
                main.classList.add("active");
                renderKeyWords();
                loadLevel();
            }, 500);
        } else {
            studentName.focus();
            studentName.style.borderColor = "#fca5a5";
            setTimeout(() => {
                studentName.style.borderColor = "rgba(103, 232, 249, 0.3)";
            }, 2000);
        }
    });
    
    // Enter en el nombre
    studentName.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            startBtn.click();
        }
    });
    
    studentName.focus();
}

// Arrancar
init();
