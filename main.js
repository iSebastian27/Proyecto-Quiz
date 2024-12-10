const questions = [
    { text: "¿Cuál es tu nombre?", label: "Escribe tu respuesta:", type: "text" },
    {
        text: "Si solo se puede cargar 10.000 Litros y se hacen 3 viajes, ¿cuantos Litros se está dejando en el estado Monagas?",
        label: "Selecciona una opción:",
        type: "choice",
        options: ["30.000 Litros", "50.000 Litros", "12.500 Litros"]
    },
    {
        text: "¿Cuántos km recorrería en 3 viajes retornando a su lugar de origen?",
        label: "Selecciona una opción:",
        type: "choice",
        options: ["1200 km", "930 km", "550 km"]
    },
    {
        text: "Si en 2 viajes que se realizaron con el transporte de Anzoategui a Monagas se debe reemplazar 8 neumaticos. ¿Cuantos neumaticos se deben reemplazar para hacer 6 viajes?",
        label: "Selecciona una opción:",
        type: "choice",
        options: ["16 neumaticos", "48 neumaticos", "24 neumaticos"]
    },
    {
        text: "Si la capacidad del transporte es de 10.000 gramos, y un Litro de gasolina equivale a 740 gramos ¿Cuantos gramos puede transportar?",
        label: "Selecciona una opción:",
        type: "choice",
        options: ["12.300.000 gramos", "7.400.000 gramos", "7.200.000 gramos"]
    },
    {
        text: "Entre 1 Litro de gasolina, 1 Litro de agua y 1 Litro de aceite ¿Cual tiene menos peso?",
        label: "Selecciona una opción:",
        type: "choice",
        options: ["Agua", "Gasolina", "Aceite"]
    },
];

let alertTimeout;

// Respuestas correctas
const correctAnswers = [
    null, // No aplica para la primera pregunta (es texto libre)
    "30.000 Litros", // Respuesta correcta para la pregunta 2
    "930 km",        // Respuesta correcta para la pregunta 3
    "24 neumaticos", // Respuesta correcta para la pregunta 4
    "7.400.000 gramos", // Respuesta correcta para la pregunta 5
    "Gasolina" // Respuesta correcta para la pregunta 6
];

// Selecciona los elementos de la alerta
const alertCard = document.getElementById("alert-card");
const alertMessage = document.getElementById("alert-message");
const closeAlertButton = document.getElementById("close-alert");

// Función para mostrar la alerta
function showAlert(message) {
    alertMessage.textContent = message;
    alertCard.classList.remove("hidden");
    alertCard.classList.add("visible");

    // Limpia cualquier temporizador existente
    clearTimeout(alertTimeout);

    // Configura el temporizador para ocultar la alerta después de 5 segundos
    alertTimeout = setTimeout(hideAlert, 5000);
}

// Función para ocultar la alerta
function hideAlert() {
    alertCard.classList.remove("visible");
    alertCard.classList.add("hidden");

    // Limpia el temporizador para evitar conflictos
    clearTimeout(alertTimeout);
}

// Maneja el evento de cerrar la alerta
closeAlertButton.addEventListener("click", hideAlert);

let currentQuestionIndex = 0;
let userName = "";
const questionTextElement = document.getElementById("question-text");
const answerLabelElement = document.getElementById("answer-label");
const answerInputElement = document.getElementById("answer-input");
const nextButton = document.getElementById("next-button");
const optionsContainer = document.createElement("div");
optionsContainer.classList.add("options-container");
answerLabelElement.insertAdjacentElement("afterend", optionsContainer);

const progressBar = document.querySelector(".progress-fill");
const progressCounter = document.querySelector(".progress-counter");

// Función para barajar un arreglo
function shuffleArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

// Actualiza el contenido de la pregunta
function loadQuestion() {
    const { text, label, type, options } = questions[currentQuestionIndex];
    questionTextElement.textContent = text;
    answerLabelElement.textContent = currentQuestionIndex === 0 ? label : `${userName}, ${label}`;

    // Alternar entre campo de texto u opciones
    answerInputElement.style.display = type === "text" ? "block" : "none";

    // Barajar las opciones antes de mostrarlas si son de tipo "choice"
    const shuffledOptions = type === "choice" ? shuffleArray(options) : options;

    // Generar las opciones como tarjetas si son de tipo "choice"
    optionsContainer.innerHTML = type === "choice"
        ? shuffledOptions.map(option => `
            <div class="option-card" data-value="${option}">
                ${option}
            </div>
        `).join("")
        : "";

    if (type === "text") answerInputElement.value = "";

    // Añadir evento de clic a las tarjetas para seleccionar
    if (type === "choice") {
        const optionCards = optionsContainer.querySelectorAll(".option-card");
        optionCards.forEach(card => {
            card.addEventListener("click", () => {
                // Quitar selección de otras tarjetas
                optionCards.forEach(c => c.classList.remove("selected"));
                // Marcar la tarjeta seleccionada
                card.classList.add("selected");
            });
        });
    }
}

// Actualiza la barra de progreso
function updateProgress() {
    if (currentQuestionIndex > 0) {
        const completed = currentQuestionIndex;
        const progressPercentage = ((completed - 1) / (questions.length - 1)) * 100;

        // Actualiza el ancho de la barra de progreso
        progressBar.style.width = `${progressPercentage}%`;

        // Mueve el camión en sincronía con el progreso
        const truck = document.querySelector(".progress-truck");
        // Asegura que el camión se mueva correctamente dentro del contenedor de la barra
        truck.style.left = `calc(${progressPercentage}% - 30px)`; // Ajusta la posición durante las preguntas

        // Actualiza el contador
        progressCounter.textContent = `${completed - 1}/${questions.length - 1}`;
    } else {
        progressBar.style.width = `0%`;
        progressCounter.textContent = `0/${questions.length - 1}`;

        // Reinicia la posición del camión
        const truck = document.querySelector(".progress-truck");
        truck.style.left = `0`;
    }
}

// Maneja el clic en el botón "Siguiente"
nextButton.addEventListener("click", () => {
    let userAnswer;

    if (questions[currentQuestionIndex].type === "text") {
        userAnswer = answerInputElement.value.trim();
        if (!userAnswer) {
            showAlert("Por favor, responde antes de continuar.");
            return;
        }
        if (currentQuestionIndex === 0) userName = userAnswer; // Guardar el nombre
    } else {
        const selectedCard = optionsContainer.querySelector(".option-card.selected");
        if (!selectedCard) {
            showAlert("Por favor, selecciona una opción.");
            return;
        }
        userAnswer = selectedCard.getAttribute("data-value");

        // Validar si la respuesta es correcta
        if (userAnswer !== correctAnswers[currentQuestionIndex]) {
            showAlert("Respuesta incorrecta. Intenta de nuevo.");
            return;
        }
    }

    // Avanzar a la siguiente pregunta
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        updateProgress();
    } else {
        finishQuiz();
    }
});

// Muestra el mensaje final
function finishQuiz() {
    questionTextElement.textContent = `¡Gracias, ${userName}! Has llegado a tu destino.`;
    answerLabelElement.textContent = "";
    answerInputElement.style.display = "none";
    optionsContainer.style.display = "none";
    nextButton.style.display = "none";
    progressCounter.textContent = `${questions.length - 1}/${questions.length - 1}`;
    progressBar.style.width = "100%";
    const truck = document.querySelector(".progress-truck");
    truck.style.left = `calc(100% - 30px)`;
}

// Inicializar la aplicación
loadQuestion();
