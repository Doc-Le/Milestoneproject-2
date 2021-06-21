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
/** All 50 card indexes */
const allCardIndexes = Array.from(new Array(50)).map(function (value, index) {
    return index;
});
/** All 50 card objects available */
const allCards = allCardIndexes.map(function (index) {
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
/** Board has 8 duplicated shuffled cards */
let board = [];
/** Cached data object from local storage */
let cacheData = {};
/** Cards has 8 random cards */
let cards = [];
/** Game context object */
let gameContext = {};
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
    $timer.text('03:00');
    // clean all variables
    board = [];
    cards = [];
    gameContext = {};
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
    shuffleBoardCards();
    startCounters();
    startTimer();
    // clear form input player name
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
        if (interval <= 0) {
            // call game over
            clearInterval(gameTimeIntervalId);
            return;
        }
        if (interval > 0) {
            const minutes = Math.floor(interval / 60);
            const seconds = interval % 60;
            $timer.text(`${minutes}m ${seconds}`);
        } else {
            $timer.text('0m 00s');
        }
    }, 1000);
}

/** Function to get new random cards */
function getNewCards() {
    getArrayFrom(8).map(function () {
        const index = allCardIndexes[allCardIndexes.length * Math.random() | 0];
        const card = {
            id: index,
            // Card image source path
            src: `images/${index}.jpg`
        };
        // Original card object
        cards.push(card);
        // Duplicated card object
        cards.push(Object.assign({}, card));
    });
}

/** Function to shuffle board cards random */
function shuffleBoardCards() {
    board = cards.reduce(function (acc, cur) {
        const newIndex = cards[cards.length * Math.random() | 0];
        acc[newIndex] = Object.assign({}, cur);
        return acc;
    }, []);
}

/** 
 * Function to get array from  
 * @param size number
 * @returns array with provided size
*/
function getArrayFrom(size) {
    return Array.from(new Array(size));
}

/** Function to load top 3 player from cache */
function loadTopScores() {
    // get cached scores
    // $topScores append elements to each score
}



/** JQuery detects state of readiness and call initilize */
$(document).ready(init);