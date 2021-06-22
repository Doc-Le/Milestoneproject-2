/**
 *  Index Javascript file representing the whole game global context
 *  @file index.js
 *  @author Leandro De Araujo
 */

/** Global variables */
const $board = $('#board');
const $live1 = $('#live1');
const $live2 = $('#live2');
const $live3 = $('#live3');
const $main = $('#main');
const $moves = $('#moves');
const $splash = $('#splash');
const $score = $('#score');
const $timer = $('#timer');
const $topScores = $('#topScores');
const $playButton = $('#play');
const $quitButton = $('#quit');
const $restartButton = $('#restart');
const $saveButton = $('#save');
const $gamePanel = $('#gamePanel');
const $menuPanel = $('#menuPanel');
const numberOfAvailableCards = 50;
const numberOfUniqueCards = 8;
const cardsAvailable = 50;
/** All 50 card objects available */
const allCards = getArrayFrom(numberOfAvailableCards).map(function (_, index) {
    // Return card object
    return {
        id: index,
        // Card image source path
        src: `images/${index}.jpg`
    };
});
/** 2s timeout transition for splash screen */
const splashScreenTimeout = 2000;
/** Game time interval 3 minutes in seconds */
const gameTimeInterval = 180;
const defaultCardImageSource = 'images/logo.svg';
/** Default game context object */
const defaultGameContext = { player: 'N/A', moves: 0, lives: 6, time: gameTimeInterval, score: 0, matched: 0 };
/** Board has 8 duplicated shuffled cards */
let board = [];
/** Cached data object from local storage */
let cacheData = {};
/** Cards has 8 random cards */
let cards = [];
/** Game context object */
let gameContext = defaultGameContext;
/** Game time interval object */
let gameTimeIntervalId;


/** Function to initialize game context */
function init() {
    showSplashScreen();
    attachEvents();
}

/** Function to attach event to all DOM elements */
function attachEvents() {
    $playButton.on('click', play);
    $quitButton.on('click', quit);
    $restartButton.on('click', restart);
    $saveButton.on('click', savePlayerName);
}

/** Function to show splash and transition to main screen */
function showSplashScreen() {
    $splash.show();
    $main.hide();
    const hideSplashScreenTimeout = setTimeout(function () {
        showMainScreen();
        clearTimeout(hideSplashScreenTimeout);
    }, splashScreenTimeout);
}

/** Function to show main and hide splash screen */
function showMainScreen() {
    $splash.hide();
    $main.show();
    showMenuPanel();
}

/** Function to show menu and hide game panel */
function showMenuPanel() {
    loadTopScores();
    // Show/hide panels
    $gamePanel.hide();
    $menuPanel.show();
    // Hide header action buttoms when menu visible
    $restartButton.hide();
    $quitButton.hide();
}

/** Function to show game and hide menu panel */
function showGamePanel() {
    // Show/hide panels
    $gamePanel.show();
    $menuPanel.hide();
    // Show header action buttoms when menu visible
    $restartButton.show();
    $quitButton.show();
}

/** Function to start playing game */
function play() {
    // show popup modal to save player name
    startBoard();
    showGamePanel();
}

/** Function to quit game and return to menu panel */
function quit() {
    showMenuPanel();
    // clean all DOM elements
    $board.empty();
    $live1.removeClass();
    $live2.removeClass();
    $live3.removeClass();
    $moves.text('0');
    $score.text('0');
    $timer.text('3m 00s');
    // clean all variables
    board = [];
    cards = [];
    gameContext = defaultGameContext;
    //clear time interval if exists
    if (gameTimeIntervalId) {
        clearInterval(gameTimeIntervalId);
    }
}

/** Function to restart game */
function restart() {
    // start lives
    // start moves
    // start score
}

/** Function to save player name from form in cache */
function savePlayerName() {
    // save form input player name in local storage players
    // clear form input player name
}

/** Function to start card board */
function startBoard() {
    getNewCards();
    shuffleBoard();
    loadBoardElemets();
    startCounters();
    startTimer();
}

/** Function to start counters */
function startCounters() {
    //set icon lives class
    $live1.addClass('on');
    $live2.addClass('on');
    $live3.addClass('on');
    //set moves counter
    $moves.text('0');
    //set initial scores counter
    $score.text('0');
}

/** Function to start game timer */
function startTimer() {
    //set initial timer counter
    $timer.text('3m 00s');
    //set timer 3 minutes interval
    let interval = gameTimeInterval;
    gameTimeIntervalId = setInterval(function () {
        interval--;
        if (interval < 0) {
            gameOver(true);
            clearInterval(gameTimeIntervalId);
            return;
        }
        if (interval >= 0) {
            //update game context time
            gameContext.time = interval;
            const minutes = Math.floor(interval / 60);
            const seconds = interval % 60;
            //update game timer DOM
            $timer.text(`${minutes}m ${seconds}s`);
            //update game score
            updateScore();
        }
    }, 1000);
}

/** Function to get new random 8 unique cards and duplicate */
function getNewCards() {
    while (cards.length < numberOfUniqueCards) {
        const card = getNewCard();
        // Original card object
        cards.push(card);
    }
    // duplicate unique 8 cards to be matched
    cards = cards.concat(cards);
}

/** Function to get new random card */
function getNewCard() {
    const id = Math.floor(numberOfAvailableCards * Math.random());
    // Find if card already exists in cards
    const cardExists = cards.find(function (card) {
        return card.id === id;
    });
    // If card already exists in cards, get new card again
    if (cardExists) {
        // call get new card function again
        return getNewCard();
    }
    // If card doesn't exist return new card
    return {
        id: id,
        // Card image source path
        src: `images/${id}.jpg`,
        // Card currently selected by player
        selected: false,
        // Card already matched by player
        matched: false
    };
}

/** Function to shuffle board cards randomly */
function shuffleBoard() {
    board = cards;
    let counter = board.length;
    // while there are items in the array
    while (counter > 0) {
        // pick a random index
        const index = Math.floor(counter * Math.random());
        // decrease counter by 1
        counter--;
        // and swap the last item index with it
        const temp = board[counter];
        board[counter] = board[index];
        board[index] = temp;
    }
}

/** 
 * Function to get array from  
 * @param size number
 * @returns array with provided size
*/
function getArrayFrom(size) {
    return Array.from(new Array(size));
}

/** Function to load board DOM elements */
function loadBoardElemets() {
    $board.empty();
    board.forEach(function (card) {
        const $image = $(`<img id="image${card.index}" src="${card.src}" class="img-fluid img-width" alt="Click to play" />`);
        const $card = $(`<div id="card${card.index}" class="col d-flex align-items-start"></div>`);
        // click event to select and validating matched card
        $card.on('click', function () {
            cardSelect($card, $image, card);
        });
        $board.append($card);
    });
    let revertDefaultImageTimeout = setTimeout(function () {
        $board.find(`img`, function ($image) {
            $image.attr('src', defaultCardImageSource);
        });
        clearTimeout(revertDefaultImageTimeout);
    }, 1000);
}

/** 
 * Function to select select and validating matched card when clicked 
 * @param $card card element
 * @param $image card image element
 * @param card card object
 */
function cardSelect($card, $image, card) {
    // if card matched won't do anything and exit function
    if (card.matched) {
        return;
    }
    // set image card source
    $image.attr('src', card.src);
    // seach for all selected cards in board array
    const selectedCards = board.filter(function (boardCard) {
        return boardCard.selected;
    });
    // if no selected cards
    if (selectedCards.length == 0) {
        // select current card
        card.selected = true;
        return;
    }
    const selectedCard = selectedCards[0];
    if (selectedCard.id == card.id) {
        // set both cards object matched property to true
        selectedCard.matched = true;
        card.matched = true;
        // update gamer context matched counter
        gameContext.matched++;
    }
    // update all counters after validating 
    updateCounters();
    // unselect both cards
    selectedCard.selected = false;
    card.selected = false;
}

/** Function to load top 3 player from cache */
function loadTopScores() {
    // get cached scores
    // $topScores append elements to each score
}

/** 
 * Function to end the game and notify player
 * @param timedOut optional game timed out boolean
 */
function gameOver(timedOut = false) {
    // select message to show
    let message = 'Exceeded maximun moves';
    if (timedOut) {
        message = 'Game timed out!'
    }
    // show popup modal game over message, buttons try again and leave
}

/** Function to update all counters as moves, lives, score */
function updateCounters() {
    // update gamer context data first
    updateMoves();
    updateLives();
    // calculate and update gamer context score
    updateScore();
}

/** Function to update moves counter */
function updateMoves() {
    // increment moves by 1
    const moves = gameContext.moves++;
    // update move DOM counter
    $moves.text(moves);
}

/** Function to update 6 lives and 3 element icons css class based on moves */
function updateLives() {
    const moves = gameContext.moves;
    let lives = gameContext.lives;
    switch (true) {
        // 2 1/2 hearts - Greater 10 less equal 12
        case moves > 10 && moves <= 12:
            $live3.removeClass().addClass('bi-heart-half');
            lives = 5;
            break;
        // 2 hearts - Greater 12 less equal 14
        case moves > 12 && moves <= 14:
            $live3.removeClass().addClass('bi-heart');
            lives = 4;
            break;
        // 1 1/2 hearts - Greater 14 less equal 16
        case moves > 14 && moves <= 16:
            $live2.removeClass().addClass('bi-heart-half');
            lives = 3;
            break;
        // 1 heart - Greater 16 less equal 18
        case moves > 16 && moves <= 18:
            $live2.removeClass().addClass('bi-heart');
            lives = 2;
            break;
        // 1/2 heart - Greater 18 less equal 20
        case moves > 18 && moves <= 20:
            $live1.removeClass().addClass('bi-heart-half');
            lives = 1;
            break;
        // 0 heart - Game over
        case moves > 20:
            $live1.removeClass().addClass('bi-heart');
            lives = 0;
            break;
        // 3 hearts - Less equal 10        
        default:
            lives = 6;
            break;
    }
    // update lives in game context object
    gameContext.lives = lives;
}

/** Function to update score counter based on lives, moves, time and matched cards */
function updateScore() {
    const moves = gameContext.moves;
    const lives = gameContext.lives;
    const time = gameContext.time;
    const matched = gameContext.matched;
    // calculate score value
    const score = parseInt((moves + lives + matched) * time);
    // update score DOM counter
    $score.text(score);
    // update score in game context object
    gameContext.score = score;
}

/** JQuery detects state of readiness and call initilize */
$(document).ready(init);