document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username") || "Player";
        const userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
        const timeTaken = parseInt(localStorage.getItem("timeTaken")) || 0;
        const questions = JSON.parse(localStorage.getItem("questions")) || [];
        const totalScore = questions.length || 10;
    
        let score = calculateScore(userAnswers, questions);
        document.getElementById("user-name").textContent = username;
        document.getElementById("score").textContent = `${score}/${totalScore}`;

        setMotivationMessage(score);
        generateChart(score);
        displayAchievements(score);
        reviewAnswers(userAnswers, questions);
        updateLeaderboard(username, score, timeTaken);
        renderLeaderboard("daily"); 
});

function calculateScore(userAnswers, questions) {
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correct) correctCount++;
    });
    return correctCount;
}

function generateChart(score) {
    const ctx = document.getElementById("performanceChart").getContext("2d");
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Correct", "Incorrect"],
            datasets: [{
                data: [score, 10 - score],
                backgroundColor: ["#2ecc71", "#e74c3c"]
            }]
        }
    });
}

function setMotivationMessage(score) {
    let message;
    if (score === 10) {
        message = "🔥 Perfect Score! You're a genius!";
    } else if (score >= 8) {
        message = "⚡ Great job! Almost there!";
    } else if (score >= 5) {
        message = "💡 Keep learning! You're improving!";
    } else {
        message = "📚 Keep practicing! You can do it!";
    }
    document.getElementById("motivation-message").textContent = message;
}

function displayAchievements(score) {
    const achievements = [
        { minScore: 10, badge: "🏆 Cyber Master", description: "Perfect score! Well done! ⭐⭐⭐" },
        { minScore: 8, badge: "🥇 Expert", description: "Great job! Keep it up! ⭐⭐" },
        { minScore: 5, badge: "🥈 Enthusiast", description: "You're getting better! ⭐" },
        { minScore: 0, badge: "🥉 Rookie", description: "Keep practicing and learning!" }
    ];

    let achievement = achievements.find(a => score >= a.minScore) || achievements[3];

    document.getElementById("achievement-badge").textContent = achievement.badge;
    document.getElementById("achievement-description").textContent = achievement.description;
}


function reviewAnswers(userAnswers, questions) {
    const reviewContainer = document.getElementById("answer-review");
    reviewContainer.innerHTML = "";

    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = q.correct;
        const isCorrect = userAnswer === correctAnswer;

        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>Q${index + 1}: ${q.question}</strong><br>
            <span class="correct-answer">✅ Correct Answer: ${q.options[correctAnswer]}</span><br>
            <span class="${isCorrect ? 'user-correct' : 'user-wrong'}">
                ${isCorrect ? "✔️" : "❌"} Your Answer: ${q.options[userAnswer] || "No Answer"}
            </span>
        `;
        reviewContainer.appendChild(listItem);
    });
}


function getLeaderboardData(type) {
    let data = JSON.parse(localStorage.getItem(`leaderboard-${type}`)) || [];

    let today = new Date().toISOString().split('T')[0]; 
    let currentWeek = new Date().toISOString().slice(0, 7); 

    if (type === "daily" && localStorage.getItem("last-daily-update") !== today) {
        localStorage.setItem("last-daily-update", today);
        return [];
    }

    if (type === "weekly" && localStorage.getItem("last-weekly-update") !== currentWeek) {
        localStorage.setItem("last-weekly-update", currentWeek);
        return [];
    }

    return data;
}

function updateLeaderboard(username, score, timeTaken) {
    const leaderboardTypes = ["daily", "weekly", "all-time"];

    leaderboardTypes.forEach((type) => {
        let leaderboard = getLeaderboardData(type);

        let existingUserIndex = leaderboard.findIndex(entry => entry.username === username);

        if (existingUserIndex !== -1) {

            if (score > leaderboard[existingUserIndex].score || 
               (score === leaderboard[existingUserIndex].score && timeTaken < leaderboard[existingUserIndex].timeTaken)) {
                leaderboard[existingUserIndex].score = score;
                leaderboard[existingUserIndex].timeTaken = timeTaken;
            }
        } else {

            leaderboard.push({ username, score, timeTaken });
        }

        leaderboard.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);

        leaderboard = leaderboard.slice(0, 16);

        localStorage.setItem(`leaderboard-${type}`, JSON.stringify(leaderboard));
    });

    renderLeaderboard("daily");
}

function renderLeaderboard(type) {
    const leaderboardBody = document.getElementById("leaderboard-body");
    if (!leaderboardBody) {
        console.error("Leaderboard body element not found!");
        return;
    }

    let leaderboard = getLeaderboardData(type);
    leaderboardBody.innerHTML = ""; 

    if (leaderboard.length === 0) {
        leaderboardBody.innerHTML = "<tr><td colspan='4'>No records available</td></tr>";
        return;
    }

    leaderboard.forEach((entry, index) => {
        let badge;
        if (entry.score === 10) {
            badge = "🏆";
        } else if (entry.score >= 8) {
            badge = "🥇";
        } else if (entry.score >= 5) {
            badge = "🥈";
        } else {
            badge = "🥉";
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1} ${badge}</td>
            <td>${entry.username}</td>
            <td>${entry.score}/10</td>
            <td>${entry.timeTaken} sec</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

function showTab(type) {
    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });

    document.querySelector(`button[onclick="showTab('${type}')"]`).classList.add("active");

    renderLeaderboard(type);
}

document.addEventListener("DOMContentLoaded", () => {

    const score = localStorage.getItem("userScore") ? parseInt(localStorage.getItem("userScore")) : 0;
    const totalScore = 10; 
    const badge = document.getElementById("achievement-badge")?.textContent || "🏅";
    const timeTaken = localStorage.getItem("timeTaken") ? parseInt(localStorage.getItem("timeTaken")) : 0;
    const websiteLink = "https://HackerZGuide.com/quiz";

    let difficultyLevel;
    if (timeTaken < 60) {
        difficultyLevel = "Beginner";
    } else if (timeTaken < 120) {
        difficultyLevel = "Intermediate";
    } else {
        difficultyLevel = "Expert";
    }

    const shareMessage = `🚀 I just took the ultimate hacking quiz on HackerXGuide and scored ${score} out of ${totalScore}! 🔥  

🕵️‍♂️💻 Think you're smarter than a hacker?  

🏆 My Badge: ${badge}  
⚡ Challenge Level: ${difficultyLevel}  
😏 Can you beat my score?  

🔗 Take the challenge now: ${websiteLink}  

🔥 Test your cybersecurity skills, outsmart the competition, and claim your spot on the leaderboard! 🎯🔥  
#HackerZGuide #CyberChallenge #ThinkLikeAHacker #HackerRank`;

    const encodedMessage = encodeURIComponent(shareMessage);

    document.getElementById("share-whatsapp").addEventListener("click", () => {
        window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    });

    document.getElementById("share-facebook").addEventListener("click", () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteLink)}&quote=${encodedMessage}`, "_blank");
    });

    document.getElementById("share-twitter").addEventListener("click", () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}`, "_blank");
    });

    document.getElementById("share-linkedin").addEventListener("click", () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteLink)}&summary=${encodedMessage}`, "_blank");
    });

    document.getElementById("share-instagram").addEventListener("click", () => {
        alert("Instagram does not support direct link sharing. You can copy the text and paste it into your Instagram Story or Post.");
        navigator.clipboard.writeText(shareMessage);
    });
});

function restartQuiz() { window.location.href = "quizq.html"; }
function goToMainMenu() { window.location.href = "quiz.html"; }

function changeLanguage() {
    let selectedLanguage = document.getElementById("language-selector").value;

    const translations = {
        "en": {
            "about": "ABOUT HACKERZGUIDE",
            "quickLinks": "QUICK LINKS",
            "customerSupport": "CUSTOMER SUPPORT",
            "followUs": "FOLLOW US",
            "newsletter": "NEWSLETTER",
            "subscribe": "Subscribe to get the latest updates and exclusive content."
        },
        "fr": {
            "about": "À PROPOS DE HACKERZGUIDE",
            "quickLinks": "LIENS RAPIDES",
            "customerSupport": "SUPPORT CLIENT",
            "followUs": "SUIVEZ-NOUS",
            "newsletter": "BULLETIN",
            "subscribe": "Abonnez-vous pour recevoir les dernières mises à jour et du contenu exclusif."
        },
        "es": {
            "about": "SOBRE HACKERZGUIDE",
            "quickLinks": "ENLACES RÁPIDOS",
            "customerSupport": "SOPORTE AL CLIENTE",
            "followUs": "SÍGUENOS",
            "newsletter": "BOLETÍN",
            "subscribe": "Suscríbete para recibir las últimas actualizaciones y contenido exclusivo."
        },
        "de": {
            "about": "ÜBER HACKERZGUIDE",
            "quickLinks": "SCHNELLE LINKS",
            "customerSupport": "KUNDENUNTERSTÜTZUNG",
            "followUs": "FOLGEN SIE UNS",
            "newsletter": "NEWSLETTER",
            "subscribe": "Abonnieren Sie, um die neuesten Updates und exklusiven Inhalte zu erhalten."
        }
    };

    document.getElementById("about-hackerzguide").textContent = translations[selectedLanguage].about;
    document.getElementById("quick-links-title").textContent = translations[selectedLanguage].quickLinks;
    document.getElementById("customer-support-title").textContent = translations[selectedLanguage].customerSupport;
    document.getElementById("follow-us-title").textContent = translations[selectedLanguage].followUs;
    document.getElementById("newsletter-title").textContent = translations[selectedLanguage].newsletter;
    document.getElementById("subscribe-text").textContent = translations[selectedLanguage].subscribe;

    alert(`Language changed to: ${selectedLanguage}`);
}

function subscribeNewsletter() {
    let email = document.getElementById("newsletter-email").value.trim();
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email === "") {
        alert("Please enter a valid email.");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Invalid email format. Please enter a correct email.");
        return;
    }

    alert(`Thank you for subscribing, ${email}!`);
}




window.onscroll = function () {
    let backToTop = document.getElementById("back-to-top");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleChatbot() {
    let chatbotWindow = document.getElementById("chatbot-window");
    chatbotWindow.classList.toggle("active");
    displayCategories(); 
}

const categories = {
    "General": [
        "What is HackerZGuide?",
        "What features does this website have?",
        "How do I take a quiz?"
    ],
    "Website & Navigation": [
        "what is hackerzguide",
        "what is this website about",
        "where can i find resources",
         "how to take a quiz",
         "where is the faq page",
         "who created this website",
          "how to contribute",
         "where can i contact support",
         "back to top",
          "chatbot"
    ],
    "Website Features & Sections": [
        "what are the features of this website",
        "where can i find the latest updates",
         "does this website have a newsletter",
         "is this website free",
         "do i need an account",
         "is there a dark mode"
    ],
    "Categories & Topics": [
        "what categories are available",
         "tell me about hacking",
         "tell me about coding",
         "tell me about cybersecurity",
         "tell me about ai",
         "tell me about cloud computing",
          "what is ethical hacking",
          "what is the best programming language",
          "how can i start learning cybersecurity"
    ],
    "Quizzes & Learning": [
        "how can i prepare for a quiz",
        "how many questions are in a quiz",
        "is there a time limit for quizzes",
        "can i retake a quiz",
        "how can i see my quiz results"
    ],
    "Technical Support": [
        "the website is not loading",
        "i found a bug",
        "how can i reset my password",
        "where can i find the privacy policy"
    ],
    "Fun & Easter Eggs": [
        "do you know any jokes",
        "tell me a tech joke",
        "who is your creator",
        "what is your favorite programming language"
    ],

    "Miscellaneous": [
        "what is the latest tech trend",
        "how can i improve my coding skills",
        "what is the best cybersecurity certification"
    ],
    "Cybersecurity": [
        "What is ethical hacking",
        "How can I start learning cybersecurity",
        "What is the best cybersecurity certification"
    ],
    "Programming": [
        "What is the best programming language",
        "How can I improve my coding skills",
        "Tell me about AI"
    ],
    "Tech Trends": [
        "What is the latest tech trend",
        "What is blockchain",
        "What is cloud computing"
    ]
};

const responses = {

    "hello": "Hello! How can I assist you today?",
    "hi": "Hi there! Need any help?",
    "hey": "Hey! How's it going?",
    "how are you": "I'm just a chatbot, but I'm here to assist you!",

    "what is hackerzguide": "HackerZGuide is a platform providing cyber-related resources, quizzes, and tutorials.",
    "what is this website about": "This website provides knowledge on cybersecurity, coding, hacking, and tech trends.",
    "where can i find resources": "You can check the 'Resources' section in the navigation bar.",
    "how to take a quiz": "You can take a quiz by clicking the 'Quiz' section in the navigation bar.",
    "where is the faq page": "You can visit the FAQ page by clicking on 'FAQs' in the navigation menu.",
    "who created this website": "This website was created by the HackerZGuide team to provide knowledge and resources.",
    "how to contribute": "You can contribute by clicking the 'Contribute' button in the navbar.",
    "where can i contact support": "You can contact support via email at support@hackerzguide.com or visit the footer section.",
    "back to top": "Click the 'Back to Top' button to scroll up.",
    "chatbot": "I am here to assist you! Ask me anything about this website.",

    "what are the features of this website": "Our website includes interactive quizzes, cybersecurity guides, coding tutorials, and the latest tech trends.",
    "where can i find the latest updates": "You can find the latest updates in the 'Resources' section or follow us on social media.",
    "does this website have a newsletter": "Yes! You can subscribe to our newsletter in the footer section.",
    "is this website free": "Yes! All resources, quizzes, and guides on HackerZGuide are completely free.",
    "do i need an account": "No, you can access most of the content without an account. However, contributing may require registration.",
    "is there a dark mode": "Currently, we don't have a dark mode, but we might add it in future updates!",

    "what categories are available": "The available categories are Hacking, Coding, Tech Trends, Cybersecurity, AI, and Cloud Computing.",
    "tell me about hacking": "Hacking involves finding vulnerabilities in systems, either ethically (white hat) or maliciously (black hat).",
    "tell me about coding": "Coding is the process of writing instructions for computers using programming languages like Python, JavaScript, and C++.",
    "tell me about cybersecurity": "Cybersecurity focuses on protecting systems, networks, and data from cyber threats and attacks.",
    "tell me about ai": "Artificial Intelligence (AI) refers to machines simulating human intelligence, including machine learning and deep learning.",
    "tell me about cloud computing": "Cloud computing provides on-demand computing services like storage, databases, and networking over the internet.",
    "what is ethical hacking": "Ethical hacking is legally testing systems for vulnerabilities to improve security, often done by penetration testers.",
    "what is the best programming language": "The best language depends on your goals. Python is great for AI, JavaScript for web, and C++ for performance.",
    "how can i start learning cybersecurity": "Start with networking basics, learn ethical hacking tools like Kali Linux, and study cybersecurity certifications like CEH.",
    
    "how can i prepare for a quiz": "Review the topics in the Resources section, take practice quizzes, and apply real-world examples.",
    "how many questions are in a quiz": "Each quiz contains 10 multiple-choice questions based on the selected topic.",
    "is there a time limit for quizzes": "Yes, most quizzes have a 3-minute timer to test your quick thinking skills.",
    "can i retake a quiz": "Yes! You can retake quizzes as many times as you want to improve your score.",
    "how can i see my quiz results": "Your quiz results will be shown after submission, along with correct answers for review.",

    "the website is not loading": "Try refreshing the page or clearing your browser cache. If the problem persists, contact support.",
    "i found a bug": "We appreciate your feedback! You can report bugs via the 'Contact Support' section.",
    "how can i reset my password": "Currently, we don’t have user accounts, but if we add them, password reset options will be available.",
    "where can i find the privacy policy": "You can find our Privacy Policy linked at the bottom of the website in the footer.",
    
    "do you know any jokes": "Sure! Why do programmers prefer dark mode? Because light attracts bugs!",
    "tell me a tech joke": "Why do Java developers wear glasses? Because they don’t C#!",
    "who is your creator": "I was developed by the HackerZGuide team to assist visitors like you!",
    "what is your favorite programming language": "I like all languages, but JavaScript runs me, so I have a soft spot for it!",
    
    "what is the latest tech trend": "AI, blockchain, and quantum computing are among the top trends in 2025.",
    "how can i improve my coding skills": "Practice regularly, build projects, contribute to open-source, and join coding communities.",
    "what is the best cybersecurity certification": "Popular certifications include CEH (Certified Ethical Hacker), CISSP, and CompTIA Security+.",
    "what features does this website have": "Our website includes interactive quizzes, cybersecurity guides, coding tutorials, and tech trends.",
    "how do i take a quiz": "Click the 'Quiz' section in the navbar to start a quiz.",
    "what is blockchain": "Blockchain is a decentralized, secure ledger technology used in cryptocurrencies and secure transactions.",
    "what is cloud computing": "Cloud computing provides internet-based computing services like storage, networking, and databases.",
    



    "default": "I'm not sure about that. Try asking about the website, navbar, footer, quizzes, or tech topics!"
}; 

function displayCategories() {
    let categoryDiv = document.getElementById("chatbot-categories");
    categoryDiv.innerHTML = ""; // Clear previous categories

    for (let category in categories) {
        let btn = document.createElement("button");
        btn.className = "category-btn";
        btn.textContent = category;
        btn.onclick = () => displayQuestions(category);
        categoryDiv.appendChild(btn);
    }
}

function displayQuestions(category) {
    let questionDiv = document.getElementById("chatbot-questions");
    questionDiv.innerHTML = ""; 

    categories[category].forEach(question => {
        let btn = document.createElement("button");
        btn.className = "question-btn";
        btn.textContent = question;
        btn.onclick = () => sendPredefinedMessage(question);
        questionDiv.appendChild(btn);
    });
}
















function sendPredefinedMessage(question) {
    let chatbotMessages = document.getElementById("chatbot-messages");

    let userMsg = document.createElement("p");
    userMsg.className = "user-msg";
    userMsg.textContent = question;
    chatbotMessages.appendChild(userMsg);

    let responseKey = question.toLowerCase();
    let response = responses[responseKey] || responses["default"];

    setTimeout(() => {
        let botMsg = document.createElement("p");
        botMsg.className = "bot-msg";
        botMsg.textContent = response;
        chatbotMessages.appendChild(botMsg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll down
    }, 500);
}



function sendMessage() {
    let inputField = document.getElementById("chatbot-input");
    let input = inputField.value.toLowerCase().trim();
    if (input === "") return;

    let chatbotMessages = document.getElementById("chatbot-messages");
    let chatbotBody = document.querySelector(".chatbot-body");

    let userMsg = document.createElement("p");
    userMsg.className = "user-msg";
    userMsg.textContent = input;
    chatbotMessages.appendChild(userMsg);

    let response = responses[input] || responses["default"];

    setTimeout(() => {
        let botMsg = document.createElement("p");
        botMsg.className = "bot-msg";
        botMsg.textContent = response;
        chatbotMessages.appendChild(botMsg);

        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }, 500);

    inputField.value = ""; 
}


function startVoiceRecognition() {
    if (!("webkitSpeechRecognition" in window)) {
        alert("Sorry, your browser doesn't support voice recognition.");
        return;
    }

    let recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(event) {
        let voiceInput = event.results[0][0].transcript.toLowerCase();
        document.getElementById("chatbot-input").value = voiceInput;
        sendMessage();
    };

    recognition.onerror = function(event) {
        alert("Voice recognition error. Please try again.");
    };
}




document.addEventListener("DOMContentLoaded", () => {
    const mobileNav = document.getElementById("mobileNav");
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const closeButton = document.querySelector(".close-btn");
    const searchInput = document.querySelector(".search-bar input");
    const contributeBtn = document.querySelector(".contribute-btn");
    const body = document.body;

    // Toggle Mobile Menu
    function toggleMenu() {
        mobileNav.classList.toggle("active");
        body.classList.toggle("no-scroll"); // Prevent scrolling when menu is open
    }

    // Open Mobile Menu
    hamburgerMenu.addEventListener("click", () => {
        mobileNav.classList.add("active");
        body.classList.add("no-scroll");
    });

    // Close Mobile Menu
    closeButton.addEventListener("click", () => {
        mobileNav.classList.remove("active");
        body.classList.remove("no-scroll");
    });

    // Hide contribute button when search bar is active
    searchInput.addEventListener("focus", () => {
        contributeBtn.style.display = "none";
    });

    searchInput.addEventListener("blur", () => {
        contributeBtn.style.display = "inline-block";
    });

    // Close menu when clicking outside (on overlay)
    document.addEventListener("click", (event) => {
        if (!mobileNav.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            mobileNav.classList.remove("active");
            body.classList.remove("no-scroll");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let searchInput = document.querySelector(".search-bar input");
    if (searchInput) {
        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                let searchQuery = searchInput.value.trim().toLowerCase();
                let pages = {
                    "home": "index.html",
                    "about": "about.html",
                    "resources": "resources.html",
                    "faq": "faq.html",
                    "faqs": "faq.html",
                    "quiz": "quiz.html",
                    "contact": "contact.html",
                    "contribute": "resources.html",
                    "cybersecurity": "cs.html",
                    "androiddevelopment": "ad.html",
                    "gamedevelopment": "gd.html",
                    "webdevelopment": "wd.html",
                    "artificialintelligence": "ai.html",
                    "cloudcomputing": "cc.html",
                    "cyber": "cs.html",
                    "androiddeveloper": "ad.html",
                    "gamedeveloper": "gd.html",
                    "web developer": "wd.html",
                    "artificial-intelligence": "ai.html",
                    "cloud-computing": "cc.html",
                    "security": "cs.html",
                    "android development": "ad.html",
                    "game development": "gd.html",
                    "web development": "wd.html",
                    "artificial intelligence": "ai.html",
                    "cloud computing": "cc.html",
                    "cloud": "cs.html",
                    "android": "ad.html",
                    "game": "gd.html",
                    "web": "wd.html",
                    "artificial": "wd.html",
                    "intelligence": "ai.html",
                    "computing": "cc.html",
                    "cs": "cs.html",
                    "ad": "ad.html",
                    "gd": "gd.html",
                    "wd": "wd.html",
                    "ai": "ai.html",
                    "cc": "cc.html",
                };
                if (pages[searchQuery]) {
                    window.location.href = pages[searchQuery]; 
                } else {
                    alert("No matching page found! Try searching for Home, About, Resources, FAQs, Quiz, or Contact.");
                }
            }
        });
    }
});
function toggleMenu() {
    let mobileNav = document.getElementById("mobileNav");
    mobileNav.classList.toggle("open");
}