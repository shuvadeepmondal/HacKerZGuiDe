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
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

document.getElementById("startQuiz").addEventListener("click", startQuiz);
document.getElementById("submitQuiz").addEventListener("click", endQuiz);
document.getElementById("restartQuiz").addEventListener("click", restartQuiz);
document.getElementById("submitScoreForm").addEventListener("submit", submitScore);
document.getElementById("filterLeaderboard").addEventListener("change", (e) => loadLeaderboard(e.target.value));
document.getElementById("copyLinkButton").addEventListener("click", copyLink);
document.getElementById("viewLeaderboard").addEventListener("click", () => {
    document.getElementById("leaderboard").scrollIntoView({ behavior: "smooth" });
});

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

    updatePerformanceFeedback();
    updateProgressTracker();
    loadAchievements();
    document.getElementById("shareableLink").value = window.location.href;
    loadLeaderboard();
    document.getElementById("socialShare").classList.remove("hidden");
}

function updatePerformanceFeedback() {
    const feedbackMessage = document.getElementById("feedbackMessage");
    if (score === questions.length) {
        feedbackMessage.innerText = "Perfect score! You're a quiz master! 🎖️";
    } else if (score >= questions.length / 2) {
        feedbackMessage.innerText = "Great job! You're on the right track! 🚀";
    } else {
        feedbackMessage.innerText = "Keep practicing! You'll get better! 💪";
    }
    performanceChart.data.datasets[0].data[0] = score;
    performanceChart.update();
}

function updateProgressTracker() {
    const progressBarFill = document.getElementById("progressBarFill");
    const progressText = document.getElementById("progressText");
    const progressPercentage = (score / questions.length) * 100;
    progressBarFill.style.width = `${progressPercentage}%`;
    progressText.innerText = `${Math.round(progressPercentage)}% Complete`;
}

function loadAchievements() {
    const achievementsList = document.getElementById("achievementsList");
    achievementsList.innerHTML = "";
    if (score === questions.length) {
        achievementsList.innerHTML += `<div class="achievement-badge">🎖️ Perfect Score</div>`;
    }
    if (currentQuestionIndex === questions.length) {
        achievementsList.innerHTML += `<div class="achievement-badge">🏁 Quiz Completed</div>`;
    }
}

function submitScore(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const date = new Date().toLocaleDateString();
    leaderboard.push({ username, score, date });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    document.getElementById("submitScoreForm").classList.add("hidden");
    document.getElementById("feedbackSection").classList.remove("hidden");
    loadLeaderboard();
}

function loadLeaderboard(filter = "all") {
    const leaderboardList = document.getElementById("leaderboardList");
    leaderboardList.innerHTML = "";
    const filteredLeaderboard = leaderboard.filter(entry => {
        const entryDate = new Date(entry.date);
        const today = new Date();
        switch (filter) {
            case "today":
                return entryDate.toDateString() === today.toDateString();
            case "week":
                {
                    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    return entryDate >= startOfWeek;
                }
            case "month":
                return entryDate.getMonth() === today.getMonth() && entryDate.getFullYear() === today.getFullYear();
            default:
                return true;
        }
    });
    filteredLeaderboard.sort((a, b) => b.score - a.score).forEach((entry, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${index + 1}. ${entry.username}</span><span>${entry.score}</span>`;
        leaderboardList.appendChild(li);
    });
}

function copyLink() {
    const shareableLink = document.getElementById("shareableLink");
    shareableLink.select();
    navigator.clipboard.writeText(shareableLink.value).then(() => {
        alert("Link copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
    alert("Link copied to clipboard!");
}

// Chart.js for performance chart
const performanceCanvas = document.getElementById("performanceCanvas");
const performanceChart = new Chart(performanceCanvas, {
    type: "bar",
    data: {
        labels: ["Your Score", "Max Score"],
        datasets: [{
            label: "Score",
            data: [0, questions.length], // Dynamically updated
            backgroundColor: ["#58a6ff", "#e0e0e0"],
            borderWidth: 1,
        }],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: questions.length,
            },
        },
    },
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value;
    alert(`Thank you for subscribing! You'll receive updates at ${email}.`);
    newsletterForm.reset();
});