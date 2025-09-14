document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username") || "Player";
    document.getElementById("username").textContent = username;
    loadQuestions();  
    startTimer(180);  
});
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = new Array(10).fill(null);
let timer;
const quizData = {
    "Web Development": [
        { question: "Which of the following is not a programming language used in web development?", options: ["HTML", "CSS", "JavaScript", "Python"], answer: "CSS" },
        { question: "Which protocol is used for secure communication over the web?", options: ["HTTP", "FTP", "HTTPS", "TCP"], answer: "HTTPS" },
        { question: "What does the <head> section of an HTML document contain?", options: ["The main content of the webpage", "Metadata, styles, and scripts", "Visible elements like images and links", "Nothing, it is optional"], answer: "Metadata, styles, and scripts" },
        { question: "Which CSS property is used to change the text color of an element?", options: ["font-style", "text-color", "color", "background-color"], answer: "color" },
        { question: "Which JavaScript function is used to select an element by ID?", options: ["getElementByClass", "querySelectorAll", "getElementById", "findElementById"], answer: "getElementById" },
        { question: "What does REST stand for in web development?", options: ["Representational State Transfer", "Remote Execution and Service Transfer", "Readable Encoded System Transfer", "Recursive State Transfer"], answer: "Representational State Transfer" },
        { question: "Which database is commonly used with the MERN stack?", options: ["MySQL", "MongoDB", "PostgreSQL", "OracleDB"], answer: "MongoDB" },
        { question: "What is the purpose of media queries in CSS?", options: ["To query a database", "To make a website responsive", "To create animations", "To style text"], answer: "To make a website responsive" },
        { question: "Which of the following is a frontend JavaScript framework?", options: ["Django", "React", "Flask", "Laravel"], answer: "React" },
        { question: "Which of the following is NOT a valid HTTP method?", options: ["GET", "POST", "INSERT", "DELETE"], answer: "INSERT" }
    ],
    "Android Development": [
        { question: "Which programming language is primarily used for Android development?", options: ["Swift", "Java", "Ruby", "PHP"], answer: "Java" },
        { question: "What is the purpose of an APK file?", options: ["Stores Android application data", "It is the source code of an Android app", "It is the installable package of an Android app", "It is used for debugging"], answer: "It is the installable package of an Android app" },
        { question: "Which tool is used to develop Android applications?", options: ["Xcode", "Android Studio", "Visual Studio Code", "Eclipse"], answer: "Android Studio" },
        { question: "Which component is not a part of the Android architecture?", options: ["Linux Kernel", "Middleware", "File System", "Application Framework"], answer: "File System" },
        { question: "Which layout is best for creating a complex UI?", options: ["LinearLayout", "RelativeLayout", "ConstraintLayout", "FrameLayout"], answer: "ConstraintLayout" },
        { question: "Which database is commonly used in Android development?", options: ["MySQL", "SQLite", "PostgreSQL", "OracleDB"], answer: "SQLite" },
        { question: "What is an Intent in Android?", options: ["A UI component", "A background service", "A messaging object for communication between components", "A security feature"], answer: "A messaging object for communication between components" },
        { question: "What is the entry point of an Android application?", options: ["onCreate()", "onStart()", "onResume()", "main()"], answer: "onCreate()" },
        { question: "Which file contains the Android app metadata?", options: ["build.gradle", "AndroidManifest.xml", "MainActivity.java", "strings.xml"], answer: "AndroidManifest.xml" },
        { question: "What does ANR stand for in Android development?", options: ["Application Not Responding", "Android Notification Receiver", "App Navigation Route", "Android Network Request"], answer: "Application Not Responding" }
    ],
     "Game Development": [
        { question: "Which game engine is known for its ease of use and supports both 2D and 3D game development?", options: ["Unreal Engine", "Unity", "CryEngine", "Godot"], answer: "Unity" },
        { question: "Which programming language is primarily used in Unreal Engine for scripting?", options: ["Java", "Python", "C++", "C#"], answer: "C++" },
        { question: "What is the purpose of a game loop in game development?", options: ["To initialize the game", "To continuously update and render the game", "To handle multiplayer connections", "To manage user input"], answer: "To continuously update and render the game" },
        { question: "Which physics engine is used in Unity?", options: ["PhysX", "Havok", "Box2D", "Bullet"], answer: "PhysX" },
        { question: "Which of the following is NOT a game development framework?", options: ["Pygame", "Phaser", "TensorFlow", "Cocos2d"], answer: "TensorFlow" },
        { question: "Which file format is commonly used for 3D models in game development?", options: [".mp4", ".fbx", ".wav", ".csv"], answer: ".fbx" },
        { question: "Which shading technique is used for realistic lighting in games?", options: ["Flat shading", "Gouraud shading", "Phong shading", "Ray tracing"], answer: "Ray tracing" },
        { question: "Which component handles rendering in Unity?", options: ["Rigidbody", "Collider", "Camera", "Renderer"], answer: "Renderer" },
        { question: "Which tool is used to create game assets?", options: ["Blender", "Notepad++", "Visual Studio", "Wireshark"], answer: "Blender" },
        { question: "What is LOD in game development?", options: ["Level of Detail", "Line of Debugging", "Layer of Design", "Lighting Object Depth"], answer: "Level of Detail" }
    ],
    "Cloud Computing": [
        { question: "Which of the following is NOT a cloud service model?", options: ["IaaS", "PaaS", "SaaS", "FaaS"], answer: "FaaS" },
        { question: "Which company provides AWS cloud services?", options: ["Google", "Amazon", "Microsoft", "IBM"], answer: "Amazon" },
        { question: "Which cloud computing model provides a virtualized infrastructure?", options: ["IaaS", "PaaS", "SaaS", "FaaS"], answer: "IaaS" },
        { question: "What does SaaS stand for?", options: ["Software as a System", "Software as a Service", "Security as a Service", "System as a Software"], answer: "Software as a Service" },
        { question: "Which type of cloud is available for use by multiple organizations?", options: ["Private cloud", "Public cloud", "Hybrid cloud", "Community cloud"], answer: "Community cloud" },
        { question: "Which cloud provider offers Azure?", options: ["Amazon", "Microsoft", "Google", "IBM"], answer: "Microsoft" },
        { question: "What is the purpose of cloud elasticity?", options: ["To enhance security", "To automatically scale resources", "To provide storage solutions", "To enable offline access"], answer: "To automatically scale resources" },
        { question: "Which protocol is commonly used for secure cloud data transfer?", options: ["HTTP", "FTP", "SSH", "HTTPS"], answer: "HTTPS" },
        { question: "Which service allows users to run applications without managing infrastructure?", options: ["IaaS", "PaaS", "SaaS", "FaaS"], answer: "FaaS" },
        { question: "Which of the following is NOT a cloud deployment model?", options: ["Public cloud", "Private cloud", "Mixed cloud", "Hybrid cloud"], answer: "Mixed cloud" }
    ],
    "Cybersecurity": [
        { question: "What does VPN stand for?", options: ["Virtual Private Network", "Very Personal Network", "Verified Protected Network", "Variable Public Node"], answer: "Virtual Private Network" },
        { question: "Which type of attack involves overwhelming a server with traffic?", options: ["Phishing", "Man-in-the-Middle", "DDoS", "SQL Injection"], answer: "DDoS" },
        { question: "Which of the following is a strong password?", options: ["12345678", "password123", "My$ecureP@ssw0rd!", "qwerty"], answer: "My$ecureP@ssw0rd!" },
        { question: "What does HTTPS provide?", options: ["Faster browsing", "Encrypted communication", "Free internet access", "More advertisements"], answer: "Encrypted communication" },
        { question: "Which cybersecurity principle ensures that data is not altered?", options: ["Confidentiality", "Integrity", "Availability", "Encryption"], answer: "Integrity" },
        { question: "Which of the following is an example of social engineering?", options: ["Firewall attack", "Phishing email", "Malware infection", "Denial-of-service attack"], answer: "Phishing email" },
        { question: "What is the main purpose of a firewall?", options: ["To speed up internet", "To block unauthorized access", "To store passwords", "To encrypt files"], answer: "To block unauthorized access" },
        { question: "Which of these is a common method for encrypting data?", options: ["RSA", "HTTP", "DHCP", "FTP"], answer: "RSA" },
        { question: "What is two-factor authentication?", options: ["Using two different passwords", "Verifying identity using two methods", "Encrypting data twice", "Using two antivirus programs"], answer: "Verifying identity using two methods" },
        { question: "Which of the following is NOT a type of malware?", options: ["Virus", "Worm", "Trojan", "Firewall"], answer: "Firewall" }
    ],
    "Artificial Intelligence": [
        { question: "Which of the following is a subset of AI?", options: ["Machine Learning", "Cybersecurity", "Cloud Computing", "Web Development"], answer: "Machine Learning" },
        { question: "What is used to train machine learning models?", options: ["Code", "Data", "Graphics", "Algorithms only"], answer: "Data" },
        { question: "Which of the following is an example of weak AI?", options: ["Self-aware robots", "Siri or Google Assistant", "Superintelligent AI", "AI that surpasses human intelligence"], answer: "Siri or Google Assistant" },
        { question: "Which branch of AI deals with decision-making similar to human reasoning?", options: ["Machine Learning", "Natural Language Processing", "Expert Systems", "Computer Vision"], answer: "Expert Systems" },
        { question: "Which algorithm is commonly used for supervised learning?", options: ["K-Means Clustering", "Decision Trees", "Apriori Algorithm", "DBSCAN"], answer: "Decision Trees" },
        { question: "What is Natural Language Processing (NLP) used for?", options: ["Understanding human languages", "Processing images", "Optimizing network security", "Predicting stock prices"], answer: "Understanding human languages" },
        { question: "Which AI technique enables computers to learn from past data?", options: ["Rule-based programming", "Hardcoding", "Machine Learning", "Randomization"], answer: "Machine Learning" },
        { question: "Which of the following is an unsupervised learning algorithm?", options: ["Linear Regression", "Decision Tree", "K-Means Clustering", "Support Vector Machine"], answer: "K-Means Clustering" },
        { question: "Which programming language is most commonly used for AI development?", options: ["C++", "Python", "Java", "PHP"], answer: "Python" },
        { question: "Which of the following is a real-world application of AI?", options: ["Spam filters in emails", "Weather forecasting", "Self-driving cars", "All of the above"], answer: "All of the above" }
    ] 
};
function loadQuestions() {
    const selectedCategory = localStorage.getItem("category") || "Web Development";  
    if (!quizData[selectedCategory]) {
        console.error("Invalid category selected.");
        return;
    }
    questions = quizData[selectedCategory].map(q => {
        let options = [...q.options];
        options = shuffleArray(options);
        let correctIndex = options.indexOf(q.answer);
        return { question: q.question, options, correct: correctIndex };
    });
    questions = shuffleArray(questions); 
    displayQuestion();
}
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
function displayQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById("question-text").textContent = q.question;
    document.querySelectorAll(".option").forEach((btn, index) => {
        btn.textContent = q.options[index];
        btn.classList.toggle("selected", userAnswers[currentQuestionIndex] === index);
        btn.onclick = () => selectAnswer(index);
    });
    document.getElementById("progress-bar").value = currentQuestionIndex + 1;
    document.getElementById("question-number").textContent = currentQuestionIndex + 1;
    document.getElementById("prev-button").disabled = currentQuestionIndex === 0;
    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById("next-button").style.display = "none";
        document.getElementById("submit-button").style.display = "inline-block";
    } else {
        document.getElementById("next-button").style.display = "inline-block";
        document.getElementById("submit-button").style.display = "none";
    }
}
function selectAnswer(index) {
    userAnswers[currentQuestionIndex] = index;
    document.querySelectorAll(".option").forEach(btn => btn.classList.remove("selected"));
    document.querySelectorAll(".option")[index].classList.add("selected");
    displayQuestion();
}
document.getElementById("prev-button").onclick = () => { 
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--; 
        displayQuestion(); 
    }
};
document.getElementById("next-button").onclick = () => { 
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++; 
        displayQuestion(); 
    }
};
function startTimer(maxSeconds = 180) { 
    let countdownEl = document.getElementById("countdown");
    let seconds = 0; 
    timer = setInterval(() => {
        countdownEl.textContent = `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;
        if (++seconds > maxSeconds) {
            clearInterval(timer); 
            submitQuiz(); 
        }
    }, 1000);
}
function submitQuiz() {
    if (userAnswers.includes(null)) {
        alert("Please answer all questions before submitting.");
        return;
    }
    if (!confirm("Are you sure you want to submit the quiz?")) return;
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    localStorage.setItem("questions", JSON.stringify(questions));
    localStorage.setItem("timeTaken", document.getElementById("countdown").textContent);
    window.location.href = "result.html";
}
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
    categoryDiv.innerHTML = ""; 
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
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; 
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
    function toggleMenu() {
        mobileNav.classList.toggle("active");
        body.classList.toggle("no-scroll"); 
    }
    hamburgerMenu.addEventListener("click", () => {
        mobileNav.classList.add("active");
        body.classList.add("no-scroll");
    });
    closeButton.addEventListener("click", () => {
        mobileNav.classList.remove("active");
        body.classList.remove("no-scroll");
    });
    searchInput.addEventListener("focus", () => {
        contributeBtn.style.display = "none";
    });
    searchInput.addEventListener("blur", () => {
        contributeBtn.style.display = "inline-block";
    });
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