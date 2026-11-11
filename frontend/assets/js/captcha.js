// Fonction globale pour générer ou rafraîchir le CAPTCHA
// CAPTCHA = a small addition (for example 4 + 7) that proves the visitor is not a robot.
// This function creates a NEW addition each time it is called.
function genererCaptcha() {
    // Two random numbers between 1 and 9.
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    
    // Write the question on the page (translated into the current language).
    const label = document.getElementById("captchaLabel");
    if (label) {
        // Utilise la fonction de traduction t() définie dans i18n.js
        label.textContent = typeof t === "function" ? t("captcha_txt", { a: n1, b: n2 }) : `Combien font ${n1} + ${n2} ?`;
    }
    
    const correctInput = document.getElementById('captchaCorrect');
    if (correctInput) {
        // The right answer is kept in a hidden field. login.js and login.php compare it with what the user typed.
        // login.js also uses it for the joke: the "Se connecter" button runs away on hover
        // until the visitor types exactly this number.
        correctInput.value = n1 + n2;
    }
}

// Exécuter au chargement de la page
// Create the first addition as soon as the page is ready.
document.addEventListener("DOMContentLoaded", () => {
    genererCaptcha();
});