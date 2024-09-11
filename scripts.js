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
        if (sessionStorage.getItem('startingPlayer') === null) {
            const randomString = Math.random() < 0.5 ? sessionStorage.getItem('player1Name') :
                sessionStorage.getItem('player2Name');
            sessionStorage.setItem('playerNameToMove', randomString)
            sessionStorage.setItem('startingPlayer', randomString);
            const boardText = document.querySelector(".board-text");
            boardText.textContent = `Player ${randomString}, choose a square!`;
            // Check if AI is the starting player and make the first move
            if (sessionStorage.getItem('gameMode') === 'single' && sessionStorage.getItem('startingPlayer') === 'Bot Michael') {
                setTimeout(aiMove, 500); // Delay AI move slightly for a better user experience
                sessionStorage.setItem('playerNameToMove', sessionStorage.getItem('player1Name'))
            }
        }
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

        // Prevent consecutive moves: Check if it's the correct player's turn
        if ((sessionStorage.getItem('gameMode') === 'single' && playerName === 'Bot Michael') ||
            (sessionStorage.getItem('gameMode') === 'two' && playerName !== sessionStorage.getItem('player1Name') && playerName !== sessionStorage.getItem('player2Name'))) {
            return; // Ignore clicks if it's not the correct player's turn
        }

        if (!sessionStorage.getItem(button.id)) {
            button.style.backgroundImage = `url("../assets/${player}-square.png")`;
            sessionStorage.setItem(button.id, player)
        }
        if (checkWin()) {
            showWinnerPopup(playerName)
            return 'game over';
        }
        if (checkDraw()) {
            showDrawPopup();
            return 'game over';
        }

        // Change turns: If it's single-player mode, let AI play after the player
        if (sessionStorage.getItem('gameMode') === 'single') {
            sessionStorage.setItem('playerToMove', 'max');
            const boardText = document.querySelector(".board-text");
            boardText.textContent = `Bot Michael is making a move...`;
            setTimeout(aiMove, 1000); // Delay AI move slightly for a better user experience
        } else {
            // In two-player mode, switch the turn to the other player
            const nextMove = playerName === sessionStorage.getItem('player1Name')
                ? sessionStorage.getItem('player2Name') : sessionStorage.getItem('player1Name');
            sessionStorage.setItem('playerNameToMove', nextMove);
            sessionStorage.setItem('playerToMove', player === 'max' ? 'lewis' : 'max');
            const boardText = document.querySelector(".board-text");
            boardText.textContent = `Player ${nextMove}, choose a square!`;
        }
    });
});

/**
 * Make a move for the AI in single-player mode.
 */
function aiMove() {
    const availableSquares = [];
    const squares = ['square1', 'square2', 'square3', 'square4', 'square5', 'square6',
        'square7', 'square8', 'square9'];

    squares.forEach(square => {
        if (!sessionStorage.getItem(square)) {
            availableSquares.push(square);
        }
    });
    if (availableSquares.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableSquares.length);
    const chosenSquare = availableSquares[randomIndex];
    const button = document.getElementById(chosenSquare);

    const aiPlayer = 'max'; // You can change this to AI’s identifier (e.g., 'max')
    button.style.backgroundImage = `url("../assets/${aiPlayer}-square.png")`;
    sessionStorage.setItem(chosenSquare, aiPlayer);

    if (checkWin()) {
        showWinnerPopup('Bot Michael'); // Assuming the AI is named 'Bot Michael'
        return 'game over';
    }
    if (checkDraw()) {
        showDrawPopup();
        return 'game over';
    }

    sessionStorage.setItem('playerToMove', 'lewis'); // Set to player's turn
    const boardText = document.querySelector(".board-text");
    boardText.textContent = `Player ${sessionStorage.getItem('player1Name')}, choose a square!`;
}

/**
 * Clear board when refreshing/loading a page.
 */
window.addEventListener('load', function() {
    clearData()
});

/**
 * Clear the game data to start the new game from an empty board.
 */
function clearData() {
    for (const square of ['square1', 'square2', 'square3', 'square4', 'square5', 'square6',
        'square7', 'square8', 'square9']) {
        sessionStorage.removeItem(square);
    }
    const playerToMove = sessionStorage.getItem('startingPlayer') === sessionStorage.getItem('player1Name') ?
        sessionStorage.getItem('player2Name') : sessionStorage.getItem('player1Name');
    sessionStorage.setItem('startingPlayer', playerToMove);
    sessionStorage.setItem('playerNameToMove', playerToMove);
    const boardText = document.querySelector(".board-text");
    boardText.textContent = `Player ${playerToMove}, choose a square!`;

    // Check if AI is the starting player and make the first move
    if (sessionStorage.getItem('gameMode') === 'single' && playerToMove === 'Bot Michael') {
        setTimeout(aiMove, 100); // Delay AI move slightly for a better user experience
        sessionStorage.setItem('playerNameToMove', sessionStorage.getItem('player1Name'))
    }
}

/**
 * Check if the game has ended in a draw (check if all squares have been placed).
 * @returns {boolean}
 */
function checkDraw() {
    const squares = ['square1', 'square2', 'square3', 'square4', 'square5', 'square6', 'square7', 'square8', 'square9', ]
    for (const square of squares) {
        if (sessionStorage.getItem(square) === null) {
            return false;
        }
    }
    return true;
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
            return true;
        }
    }
    return false;
}

/**
 * Show winner popup if someone has won.
 * @param winner
 */
function showWinnerPopup(winner) {
    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.textContent = `Player ${winner} has won!`;
    showPopup();
}

/**
 * Show draw popup if the game has ended in a draw.
 */
function showDrawPopup() {
    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.textContent = `The game has ended in a draw.`;
    showPopup();
}

/**
 * Popup to be showed at the end of the game.
 * It offers to play again or exit to the open page.
 */
function showPopup() {
    const modal = document.getElementById('winnerModal');
    modal.style.display = 'block';

    // Add event listener to close the modal when the "X" is clicked
    document.querySelector('.close').addEventListener('click', function() {
        modal.style.display = 'none';
    });

    const playAgainButton = document.getElementById('playAgainButton');
    playAgainButton.addEventListener('click', function () {
        modal.style.display = 'none';
        console.log('Play Again clicked! Restarting game...');
        //clearData()
        const boardText = document.querySelector(".board-text");
        window.location.reload();
        boardText.textContent = `Player ${sessionStorage.getItem('startingPlayer')}, choose a square!`;
    });

    // Add event listener for the Exit button
    const exitButton = document.getElementById('exitButton');
    exitButton.addEventListener('click', function () {
        modal.style.display = 'none';
        console.log('Exit clicked! Exiting game...');
        sessionStorage.clear();
        window.location.href = '../index.html';
    });
}

