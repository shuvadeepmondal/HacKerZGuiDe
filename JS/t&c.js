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