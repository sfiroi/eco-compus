// Fonction globale pour générer ou rafraîchir le CAPTCHA
function genererCaptcha() {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    
    const label = document.getElementById("captchaLabel");
    if (label) {
        // Utilise la fonction de traduction t() définie dans i18n.js
        label.textContent = typeof t === "function" ? t("captcha_txt", { a: n1, b: n2 }) : `Combien font ${n1} + ${n2} ?`;
    }
    
    const correctInput = document.getElementById('captchaCorrect');
    if (correctInput) {
        correctInput.value = n1 + n2;
    }
}

// Exécuter au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    genererCaptcha();
});