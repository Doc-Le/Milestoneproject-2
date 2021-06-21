/**
 *  Index Javascript file representing the whole game global context
 *  @file index.js
 *  @author Leandro De Araujo
 */

/** Global variables */
const $board = $('#board');
const $main = $('#main');
const $splash = $('#splash');
const $playButton = $('#play');
const $quitButton = $('#quit');
const $restartButton = $('#restart');
const $saveButton = $('#save');
const $gamePanel = $('#gamePanel');
const $menuPanel = $('#menuPanel');
const allCards = [];
/** 2s timeout transition for splash screen */
const splashScreenTimeout = 2000;
let cards = [];


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
    $saveButton.on('click', function () {});
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
    // show popup modal to save gamer name
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

}


/** JQuery detects state of readiness and call initilize */
$(document).ready(init);