// Function to set the active button
function setActive(buttonId) {
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => button.classList.remove('active'));
    document.getElementById(buttonId).classList.add('active');
}
