const n1 = Math.floor(Math.random() * 9) + 1;
const n2 = Math.floor(Math.random() * 9) + 1;
document.getElementById('captchaLabel').innerText = `Combien font ${n1} + ${n2} ?`;
document.getElementById('captchaCorrect').value = n1 + n2;