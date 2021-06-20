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
    // Attach events to context DOM elements
}

/** Function to show splash and transition to main screen */
function showSplashScreen () {
    $splash.show();
    $main.hide();
    const hideSplashScreenTimeout = setTimeout(function () {
        clearTimeout(hideSplashScreenTimeout);
    }, splashScreenTimeout);    
}

/** JQuery detects state of readiness and call initilize */
$(document).ready(init);