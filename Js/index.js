/**
 *  Index Javascript file representing the whole game global context
 *  @file index.js
 *  @author Leandro De Araujo
 */

/** 
 * Global variables 
 */

 const $board = $('#board');
 const $container = $('#container');
 const $splash = $('#splash');
 const $playButton = $('#play');
 const $quitButton = $('#quit');
 const $restartButton = $('#restart');
 const $saveButton = $('#save');
 const $gamePanel = $('#gamePanel');
 const $menuPanel = $('#menuPanel');
 const allCards = [];
 
 let cards = [];
 
 
 /** Function to initialize game context */
 function init() {
     // Initialize context DOM elements with jQuery
     // Reset game panels
     // Attach events to context DOM elements
 }
 
 /** JQuery detects state of readiness and call initilize */
 $(document).ready(init);