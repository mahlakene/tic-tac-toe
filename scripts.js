/**
 * Set the button active so player sees the option that is currently selected.
 * @param buttonId
 */
function setActive(buttonId) {
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => button.classList.remove('active'));
    document.getElementById(buttonId).classList.add('active');
    const player2Input = document.getElementById('player2-input');
    if (buttonId === 'single-player') {
        sessionStorage.setItem('gameMode', 'single');
        player2Input.style.display = 'none';
    } else {
        sessionStorage.setItem('gameMode', 'two');
        player2Input.style.display = 'block';
    }
    const randomString = Math.random() < 0.5 ? 'max' : 'lewis';
    sessionStorage.setItem('playerToMove', randomString)
}


document.addEventListener('DOMContentLoaded', function () {
    const playButton = document.getElementById('play-button');
    const randomString = '';
    if (playButton) {
        playButton.addEventListener('click', function (event) {
            event.preventDefault();
            if (sessionStorage.getItem('gameMode') === null) {
                console.error('Choose a game mode!');
                alert('Please choose a game mode!');
                return; // Stop further execution if no game mode is selected
            }

            const player1Name = document.getElementById('player1-name').value;
            sessionStorage.setItem('player1Name', player1Name);
            if (sessionStorage.getItem('gameMode') === 'two') {
                const player2Name = document.getElementById('player2-name').value;
                sessionStorage.setItem('player2Name', player2Name);
            } else {
                sessionStorage.setItem('player2Name', 'Bot Michael');
            }
            window.location.href = '../board/board.html'

        });
    } else {
        const randomString = Math.random() < 0.5 ? sessionStorage.getItem('player1Name') :
            sessionStorage.getItem('player2Name');
        sessionStorage.setItem('playerNameToMove', randomString)
        const boardText = document.querySelector(".board-text");
        boardText.textContent = `Player ${randomString}, choose a square!`;
    }
});



/**
 * Add a listener to each button so that it registers the square if a player clicks it.
 */
const buttons = document.querySelectorAll('.grid-item');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const player = sessionStorage.getItem('playerToMove');
        const playerName = sessionStorage.getItem('playerNameToMove');
        if (!sessionStorage.getItem(button.id)) {
            button.style.backgroundImage = `url("../assets/${player}-square.png")`;
            sessionStorage.setItem(button.id, player)
        }
        if (checkWin()) {
            showWinnerPopup(playerName)
            return 'game over';
        }

        sessionStorage.setItem('playerToMove', player === 'max' ? 'lewis' : 'max');
        const boardText = document.querySelector(".board-text");
        const nextMove = playerName === sessionStorage.getItem('player1Name')
            ? sessionStorage.getItem('player2Name') : sessionStorage.getItem('player1Name');
        sessionStorage.setItem('playerNameToMove', nextMove)
        boardText.textContent = `Player ${nextMove}, choose a square!`;
    });
});

/**
 * Clear board when refreshing/loading a page.
 */
window.addEventListener('load', function() {
    clearData()
});

function clearData() {
    for (const square of ['square1', 'square2', 'square3', 'square4', 'square5', 'square6',
        'square7', 'square8', 'square9']) {
        sessionStorage.removeItem(square);
    }
}

/**
 * Check if some player has won.
 * @returns {boolean}
 */
function checkWin() {
    const winningCombinations = [
        ['square1', 'square2', 'square3'],
        ['square4', 'square5', 'square6'],
        ['square7', 'square8', 'square9'],
        ['square1', 'square4', 'square7'],
        ['square2', 'square5', 'square8'],
        ['square3', 'square6', 'square9'],
        ['square1', 'square5', 'square9'],
        ['square3', 'square5', 'square7'],
        ]
    for (const combination of winningCombinations) {
        if (sessionStorage.getItem(combination.at(0)) !== null &&
            sessionStorage.getItem(combination.at(0)) === sessionStorage.getItem(combination.at(1))
            && sessionStorage.getItem(combination.at(1)) === sessionStorage.getItem(combination.at(2))) {
            clearData();
            //alert("Game over.")
            return true;
        }
    }
    return false;
}

function showWinnerPopup(winner) {
    const modal = document.getElementById('winnerModal');
    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.textContent = `Player ${winner} has won!`;
    modal.style.display = 'block';

    // Add event listener to close the modal when the "x" is clicked
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('winnerModal').style.display = 'none';
    });
}
