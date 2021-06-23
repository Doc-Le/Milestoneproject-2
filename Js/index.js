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
const $exitButton = $('#exit');
const $restartButton = $('#restart');
const $saveButton = $('#save');
const $gamePanel = $('#gamePanel');
const $menuPanel = $('#menuPanel');
const baseScoreValue = 100;
const numberOfAvailableCards = 50;
const numberOfUniqueCards = 8;
const totalNumberOfLives = 6;
const cardsAvailable = 50;
const localStorageGameKey = 'cmgData';
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
const defaultCardImageSource = 'images/empty-card.png';
const cardMatchedCssClass = 'matched';
/** Default game context object */
const defaultGameContext = {
    player: 'N/A',
    moves: 0,
    lives: totalNumberOfLives,
    time: gameTimeInterval,
    extraScore: 0,
    finalScore: 0,
    score: 0,
    matched: 0
};
/** Board has 8 duplicated shuffled cards */
let board = [];
/** Cached data object from localStorage */
let cacheData = {};
/** Cards has 8 random cards */
let cards = [];
/** Game context object */
let gameContext = Object.assign({}, defaultGameContext);
/** Game time interval object */
let gameTimeIntervalId;
/** Store first card seleced before checking if matches */
let firstCardSelected;
/** Store board busy boolean */
let boardBusy = false;

/** Function to initialize game context */
function init() {
    showSplashScreen();
    attachEvents();
}

/** Function to attach event to all DOM elements */
function attachEvents() {
    $playButton.on('click', play);
    $exitButton.on('click', quit);
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
    // clean all variables
    board = [];
    cards = [];
    // restart game context
    restart();
}

/** Function to restart game */
function restart() {
    // restart game context object
    gameContext = Object.assign({}, defaultGameContext);
    // clear time interval if exists
    if (gameTimeIntervalId) {
        clearInterval(gameTimeIntervalId);
    }
    loadBoardElemets();
    updateCounters();
    startTimer();
}

/** Function to save player name from form in cache */
function savePlayerName() {
    // save form input player name in localStorage players
    // clear form input player name
}

/** Function to start card board */
function startBoard() {
    getNewCards();
    shuffleBoard();
    loadBoardElemets();
    updateCounters();
    startTimer();
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
    // duplicate unique 8 cards to be matched and set unitque ID
    const duplicatedCards = cards.reduce(function (acc, cur) {
        const card = Object.assign({}, cur, { uniqueId: `card_${cur.id}_2` });
        return acc.concat(card);
    }, []);
    // concatenate duplicated cards
    cards = cards.concat(duplicatedCards);
}

/** Function to get new random card */
function getNewCard() {
    const id = Math.floor(numberOfAvailableCards * Math.random());
    // find if card already exists in cards
    const cardExists = cards.find(function (card) {
        return card.id === id;
    });
    // if card already exists in cards, get new card again
    if (cardExists) {
        // call get new card function again
        return getNewCard();
    }
    // if card doesn't exist return new card
    return {
        // card id that matches with duplicate
        id: id,
        // card unique id
        uniqueId: `card_${id}_1`,
        // card image source path
        src: `images/${id}.jpg`,
        // card currently selected by player
        selected: false,
        // card already matched by player
        matched: false
    };
}

/** Function to shuffle board cards randomly */
function shuffleBoard() {
    let counter = cards.length;
    // while there are items in the array
    while (counter > 0) {
        // pick a random index
        const index = Math.floor(counter * Math.random());
        // decrease counter by 1
        counter--;
        // and swap the last item index with it
        const temp = cards[counter];
        cards[counter] = cards[index];
        cards[index] = temp;
    }
    // update each index property
    board = cards.map(function (card) {
        card.index = cards.indexOf(card);
        return card;
    });
}

/** 
 * Function to get array from  
 * @param size number
 * @returns array with provided size
*/
function getArrayFrom(size) {
    return Array.from(new Array(size));
}

/** Function to load board DOM element cards */
function loadBoardElemets() {
    // empty board element
    $board.empty();
    // load each board card element
    board.forEach(function (card) {
        const $cardImageDefault = $(`<img id="imgDefault${card.uniqueId}" src="${defaultCardImageSource}" class="img-fluid img-width img-thumbnail" alt="Click to select" />`);
        const $cardImage = $(`<img id="img${card.uniqueId}" src="${card.src}" class="img-fluid img-width img-thumbnail" alt="Image selected" />`).hide();
        const $card = $(`<div id="card${card.uniqueId}" class="col d-flex justify-content-center board-card"></div>`)
            .append($cardImageDefault)
            .append($cardImage);
        // click event to select and validating matched card
        $card.on('click', function () {
            cardSelect($card, $cardImageDefault, $cardImage, card);
        });
        $board.append($card);
    });
}

/** 
 * Function to select select and validating matched card when clicked 
 * @param $card card element
 * @param $cardImageDefault default card image element
 * @param $cardImage card image element
 * @param card card object
 */
function cardSelect($card, $cardImageDefault, $cardImage, card) {
    // if card matched or board busy won't do anything and exit function
    if (card.matched || boardBusy) {
        return;
    }
    // set image card source
    $cardImageDefault.hide();
    $cardImage.show();
    // if no selected cards
    if (!firstCardSelected) {
        // set current card selected
        card.selected = true;
        firstCardSelected = Object.assign({}, card);
        return;
    }
    // increment game context moves by 1
    gameContext.moves++;
    // set jquery elements
    const $firstCard = $(`#card${firstCardSelected.uniqueId}`);
    const $firstCardImageDefault = $(`#imgDefault${firstCardSelected.uniqueId}`);
    const $firstCardImage = $(`#img${firstCardSelected.uniqueId}`);
    if (firstCardSelected.id == card.id) {
        // set both cards object matched property to true
        firstCardSelected.matched = true;
        card.matched = true;
        // set cards matched jquery element class
        $firstCard.addClass(cardMatchedCssClass);
        $card.addClass(cardMatchedCssClass);
        // update gamer context matched counter
        gameContext.matched++;
        // update game context score multiplying matched plays by base score value
        gameContext.score = parseInt(gameContext.matched * baseScoreValue);
        // unselect both cards
        firstCardSelected.selected = false;
        card.selected = false;
        // update board cards
        board[board.indexOf(firstCardSelected)] = Object.assign({}, firstCardSelected);
        board[board.indexOf(card)] = Object.assign({}, card);
        // clear first selected card variable
        firstCardSelected = undefined;
    } else {
        // set board busy
        boardBusy = true;
        const timeoutUnmatchedCards = setTimeout(function () {
            // set image card source
            $cardImage.hide();
            $firstCardImage.hide();
            $cardImageDefault.show();
            $firstCardImageDefault.show();
            // clear timeout 
            clearTimeout(timeoutUnmatchedCards);
            // unselect both cards
            firstCardSelected.selected = false;
            card.selected = false;
            // update board cards
            board[board.indexOf(firstCardSelected)] = Object.assign({}, firstCardSelected);
            board[board.indexOf(card)] = Object.assign({}, card);
            // clear first selected card variable
            firstCardSelected = undefined;
            // release board busy
            boardBusy = false;
        }, 2000);
    }
    // update all counters after validation
    updateCounters();
}

/** Function to load top 3 player from cache */
function loadTopScores() {
    // empty top scores board 
    $topScores.empty();
    // update cache data from localStorage
    updateCacheData();
    // sort scores by biggest score
    const scores = cacheData.scores.sort(function (a, b) {
        return b.score - a.score;
    });
    // set top 3 scores
    for (let i = 0; i < 3; i++) {
        if (!scores[i]) {
            break;
        }
        const item = scores[i];
        // create jquery element row
        const $row = $(`
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${item.player}</td>
            <td>${item.score}</td>
        </tr>
        `);
        // append jquery element row to top scores table body
        $topScores.append($row);
    }
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
    const moves = gameContext.moves;
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
            $live1.removeClass().addClass('bi-heart-fill');
            $live2.removeClass().addClass('bi-heart-fill');
            $live3.removeClass().addClass('bi-heart-fill');
            lives = 6;
            break;
    }
    // update lives in game context object
    gameContext.lives = lives;
}

/** Function to update score counter based on lives, moves, time and matched cards */
function updateScore() {
    // do nothing is score is zero or null
    if (!gameContext.score) {
        return;
    }
    // update score DOM counter
    $score.text(gameContext.score);
}

/** Function to calculate final game score */
function calculateFinalScore() {
    // if game matched all 8 cards it should calculate extra points
    if (gameContext.matched == numberOfUniqueCards) {
        const moves = Math.round(gameContext.moves / numberOfUniqueCards);
        const lives = gameContext.lives;
        const time = gameTimeInterval - gameContext.time;
        // calculate extra score
        gameContext.extraScore = (moves + lives + time) * baseScoreValue;
    }
    // calculate final score value
    gameContext.finalScore = parseInt(gameContext.score + gameContext.extraScore);
}

/** Function to update cache data in localStorage */
function updateCacheData() {
    if (!Object.keys(cacheData).length) {
        // default cache data object
        cacheData = {
            scores: [
                { player: 'Mark', score: 1000 },
                { player: 'Anne', score: 234 },
                { player: 'Josef', score: 2500 },
                { player: 'Rodrigo', score: 3000 },
            ],
            players: []
        };
    }
    const storage = window.localStorage;
    // initlaize localStorage if empty
    if (!storage.length || !storage.getItem(localStorageGameKey)) {
        // convert object in string
        const cacheDataString = JSON.stringify(cacheData);
        storage.setItem(localStorageGameKey, cacheDataString);
    }
}

/** JQuery detects state of readiness and call initilize */
$(document).ready(init);