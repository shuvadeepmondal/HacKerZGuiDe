const questions = [
    {
        title: "What is the capital of France?",
        text: "This city is also known as the City of Light.",
        options: ["Berlin", "Madrid", "Paris", "Lisbon"],
        correct: 2,
    },
    {
        title: "What is 2 + 2?",
        text: "Basic Math skills are key!",
        options: ["3", "4", "5", "6"],
        correct: 1,
    },
    {
        title: "Which planet is known as the Red Planet?",
        text: "It is the fourth planet from the sun.",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correct: 1,
    },
];

let score = 0;
let currentQuestionIndex = 0;
let timer;
let timeRemaining = 180;

document.getElementById("startQuiz").addEventListener("click", startQuiz);
document.getElementById("submitQuiz").addEventListener("click", endQuiz);
document.getElementById("restartQuiz").addEventListener("click", restartQuiz);
document.getElementById("submitScoreForm").addEventListener("submit", submitScore);

function startQuiz() {
    document.querySelector(".hero").classList.add("hidden");
    document.getElementById("quizContainer").classList.remove("hidden");
    startTimer();
    loadQuestion();
}

function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    timeRemaining = 180;
    document.querySelector(".hero").classList.add("hidden");
    document.getElementById("quizContainer").classList.remove("hidden");
    document.getElementById("resultSection").classList.add("hidden");
    document.getElementById("submitQuiz").classList.add("hidden");

    startTimer();
    loadQuestion();
}

function startTimer() {
    timer = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById("timeRemaining").innerText = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("questionTitle").innerText = question.title;
    document.getElementById("questionText").innerText = question.text;

    const answerOptions = document.getElementById("answerOptions");
    answerOptions.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("answer-btn");
        button.addEventListener("click", () => selectAnswer(index));
        answerOptions.appendChild(button);
    });
    updateProgressBar();
    document.getElementById("nextQuestion").classList.add("hidden"); // Hide next button until an answer is selected
}

function selectAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].correct;
    const buttons = document.querySelectorAll(".answer-btn");
    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === correctIndex) button.classList.add("correct-answer");
        else if (index === selectedIndex) button.classList.add("incorrect-answer");
    });
    if (selectedIndex === correctIndex) score++;
    currentQuestionIndex++;
    setTimeout(() => {
        if (currentQuestionIndex < questions.length) loadQuestion();
        else document.getElementById("submitQuiz").classList.remove("hidden");
    }, 2000);
    
}

function updateProgressBar() {
    const progressBar = document.getElementById("progressBar");
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function endQuiz() {
    clearInterval(timer);
    document.getElementById("quizContainer").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");
    document.getElementById("scoreDisplay").innerText = `You scored ${score} out of ${questions.length}`;

    const reviewList = document.getElementById("answerReview");
    reviewList.innerHTML = "";

    questions.forEach((question, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${question.title} - Correct Answer: ${question.options[question.correct]}`;
        reviewList.appendChild(li);
    });
  
  setupSocialShare();
}

function setupSocialShare() {
    const shareText = `I scored ${score} out of ${questions.length} on the Hacker Quiz! Try it out!`;

    document.getElementById("shareFacebook").href = `https://www.facebook.com/sharer/sharer.php?u=https://example.com&quote=${encodeURIComponent(shareText)}`;
    document.getElementById("shareTwitter").href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=https://example.com`;
    document.getElementById("shareWhatsApp").href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    document.getElementById("shareLinkedIn").href = `https://www.linkedin.com/shareArticle?mini=true&url=https://example.com&title=${encodeURIComponent("Hacker Quiz Results")}&summary=${encodeURIComponent(shareText)}`;
    document.getElementById("shareInstagram").href = `https://www.instagram.com/`; // No direct Instagram share link
    document.getElementById("shareGitHub").href = `https://github.com/`;

    document.getElementById("socialShare").classList.remove("hidden");
}

function submitScore(event) {
    event.preventDefault();
    document.getElementById("submitScoreForm").classList.add("hidden");
    document.getElementById("feedbackSection").classList.remove("hidden");
}