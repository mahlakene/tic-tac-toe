// Function to set the active button
function setActive(buttonId) {
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => button.classList.remove('active'));
    document.getElementById(buttonId).classList.add('active');
    if (buttonId === 'single-player') {
        sessionStorage.setItem('gameMode', 'single');
    } else {
        sessionStorage.setItem('gameMode', 'two');
    }
    /*window.location.href = '../board/board.html';*/
}


const buttons = document.querySelectorAll('.grid-item');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        console.log(button);
        button.style.backgroundImage = 'url("../assets/max-square.png")';
    });
});
