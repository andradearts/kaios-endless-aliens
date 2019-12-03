/// <reference path='GameScene.ts'/>
/// <reference path='MenuScene.ts'/>
/// <reference path='MenuOverlay.ts'/>
/// <reference path='PreloadScene.ts'/>
/// <reference path='HelpScene.ts'/>
/// <reference path='Sponsor.ts'/>

/// <reference path='../AAShared/AAFunctions.ts'/>
/// <reference path='../AAShared/AAPrefs.ts'/>
/// <reference path='../AAShared/AAKaiControls.ts'/>
/// <reference path='../AAShared/AAHighScores.ts'/>
/// <reference path='../AAShared/AAKaiAnalytics.ts'/>

// This is needed so I can use the KaiAds SDK
declare var getKaiAd: any;
const kTESTMODE = 1; /* set to 0 for real ads */
const gameName = "Template";
const gGameVersion = "1.0.0";
const gamePrefsFile = "gameTemplate_000";
const gameBGColor = 0x333333;

const stageWidth = 240;
const stageHeight = 228;

const kSHOWFPS = true;
const gLogoDisplayLength = 2000;


// gSpeedNormalize is used to make testing and working on the PC normal speed
// KaiOS Phaser runs at 30fps so I compensate and double most things.
let gSpeedNormalize = 1.0;

let isKaiOS = false;
if (navigator.userAgent.toLowerCase().indexOf('kaios') > -1) {
    isKaiOS = true;
    gSpeedNormalize = 2.0 // double things up on the device.  Could break in the future?
}

const scenes = [BootScene, PreloadScene, SponsorOverlay, MenuOverlay, MenuScene, HelpScene, GameScene];

enum states {
    kSTATE_NOTHING = 0,
    kSTATE_START,
    kSTATE_MENU,
    kSTATE_HELP,
    kSTATE_PLAYING,
    kSTATE_GAMEOVER,
    kSTATE_PAUSED,
    kSTATE_SHOWING_AD,
    kSTATE_ADSELECTED
}

let game;
let gGameState = states.kSTATE_NOTHING;
let emitter = new Phaser.Events.EventEmitter();
let gGameTimeStart;

// ******************************************************************************
// ******************************************************************************
// NOTE ******* If using Matomo the init is in the index.html file */
// Using Google Analytics //////////////////////////////////////////////////////
// TEST:UA-150350318-3
// PROD:UA-150350318-1
// ******************************************************************************
// AAKaiAnalytics.initAnalytics('UA-150350318-3', gGameName);


window.onload = () => {

    let config = {
        type: Phaser.WEBGL,
        renderType: Phaser.WEBGL,
        scene: scenes,
        banner: false,
        title: gameName,
        backgroundColor: gameBGColor,
        url: 'https://taaragames.com/',
        version: gGameVersion,
        antialias: true,
        inputTouch: false,
        autoRound: true,
        autoFocus: true,
        canvasStyle: "-moz-transform: translateZ(0) !important;",
        clearBeforeRender: false,
        customEnvironment: true,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: 'gameStage',
            width: stageWidth,
            height: stageHeight,
        }
    }


    gGameTimeStart = new Date().getMilliseconds();
    game = new Phaser.Game(config);
    game.canvas.mozOpaque = true;

    if (isKaiOS) {
        game.body.style.cursor = "none"
    }

    // Pause and resume on page becoming visible/invisible
    // function onVisibilityChanged() {
    //     if (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden)
    //       game.;
    //     else
    //         cr_setSuspended(false);
    // };

    // document.addEventListener("visibilitychange", onVisibilityChanged, false);
    // document.addEventListener("mozvisibilitychange", onVisibilityChanged, false);
    // document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
    // document.addEventListener("msvisibilitychange", onVisibilityChanged, false);

};

