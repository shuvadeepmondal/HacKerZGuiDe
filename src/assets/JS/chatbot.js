function toggleTheme() {
    const chatbot = document.getElementById("chatbot-window");
    const themeToggle = document.getElementById("theme-toggle");

    chatbot.classList.toggle("dark-mode");
    chatbot.classList.toggle("light-mode");

    if (chatbot.classList.contains("dark-mode")) {
        localStorage.setItem("chatbot-theme", "dark");
        themeToggle.textContent = "☀️";
    } else {
        localStorage.setItem("chatbot-theme", "light");
        themeToggle.textContent = "🌙";
    }
}

window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("chatbot-theme") || "light";
    const chatbot = document.getElementById("chatbot-window");
    const themeToggle = document.getElementById("theme-toggle");

    chatbot.classList.remove("dark-mode", "light-mode");
    chatbot.classList.add(savedTheme + "-mode");
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
});


