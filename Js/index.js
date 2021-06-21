/**
 *  Index Javascript file representing the whole game global context
 *  @file index.js
 *  @author Leandro De Araujo
 */

/** Global variables */
const $board = $('#board');
const $main = $('#main');
const $splash = $('#splash');
const $topScores = $('#topScores');
const $playButton = $('#play');
const $quitButton = $('#quit');
const $restartButton = $('#restart');
const $saveButton = $('#save');
const $gamePanel = $('#gamePanel');
const $menuPanel = $('#menuPanel');
/** All 50 cards images available */
const allCards = [];
/** 2s timeout transition for splash screen */
const splashScreenTimeout = 2000;
/** Board has 8 duplicated shuffled cards */
let board = [];
/** Cards has 8 random cards */
let cards = [];
/** Players has all available players on the device */
let players = [];


/** Function to initialize game context */
function init() {
    showSplashScreen();
    attachEvents();
}

/** Function to attach event to all DOM elements */
function attachEvents () {
    $playButton.on('click', play);
    $quitButton.on('click', quit);
    $restartButton.on('click', restart);
    $saveButton.on('click', savePlayerName);
}

/** Function to show splash and transition to main screen */
function showSplashScreen () {
    $splash.show();
    $main.hide();
    const hideSplashScreenTimeout = setTimeout(function () {
        showMainScreen();
        clearTimeout(hideSplashScreenTimeout);
    }, splashScreenTimeout);    
}

/** Function to show main and hide splash screen */
function showMainScreen () {
    $splash.hide();
    $main.show();
    showMenuPanel();
}

/** Function to show menu and hide game panel */
function showMenuPanel () {
    $gamePanel.hide();
    $menuPanel.show();
    // Hide header action buttoms when menu visible
    $restartButton.hide();
    $quitButton.hide();
    loadTopScores();
}

/** Function to show game and hide menu panel */
function showGamePanel () {
    $gamePanel.show();
    $menuPanel.hide();
    // Show header action buttoms when menu visible
    $restartButton.show();
    $quitButton.show();
}

/** Function to start playing game */
function play() {
    // show popup modal to save player name
    // start board
    showGamePanel();
}

/** Function to quit game and return to menu panel */
function quit() {
    showMenuPanel();
    // clean all
}

/** Function to restart game */
function restart() {
    // start lives
    // start moves
    // start score
}

/** Function to save player name from form in cache */
function savePlayerName () {
    // save form input player name in local storage players
    // clear form input player name
}

/** Function to load top 3 player from cache */
function loadTopScores () {
    // get cached scores
    // $topScores append elements to each score
}

/** JQuery detects state of readiness and call initilize */
$(document).ready(init);