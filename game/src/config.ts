/// <reference path="../../phaser.d.ts" />
/// <reference path='GameScene.ts'/>
/// <reference path='MenuScene.ts'/>
/// <reference path='MenuOverlay.ts'/>
/// <reference path='PreloadScene.ts'/>
/// <reference path='HelpScene.ts'/>
/// <reference path='MoreGamesScene.ts'/>
/// <reference path='SettingsScene.ts'/>
/// <reference path='Sponsor.ts'/>

/// <reference path='../../../AAShared/AAFunctions.ts'/>
/// <reference path='../../../AAShared/AAPrefs.ts'/>
/// <reference path='../../../AAShared/AAKaiAds.ts'/>
/// <reference path='../../../AAShared/AAKaiControls.ts'/>
/// <reference path='../../../AAShared/AAHighScores.ts'/>
/// <reference path='../../../AAShared/AAKaiAnalytics.ts'/>

// This is needed so I can use the KaiAds SDK
declare var _paq: any;
declare var getKaiAd: any;

const kTESTMODE = 1; /* set to 0 for real ads */
const gGameName = "_TEMPLATE_";
const gGameVersion = "1.0.0";
const gamePrefsFile = "_TEMPLATE_001";
const gameBGColor = 0x333333;
let gStageWidth = 240*2;  // I'm leaving it as a multiple to remind me of org size
let gStageHeight = 320*2;  //228 * 2; //web is 228

// Display length of Taara games Logo
const gLogoDisplayLength = 2000;

// SPONSOR
let gTween; //sponsor tween
let kUSESPONSOR = true;

let gIsKaiOSAppMode = (window.location.protocol == 'app:');

// Display certain buttons if needed.  There are only two that are shown or not
const kSHOW_SETTINGS_BUTTON = false;
const kSHOW_FULLSCREEN_BUTTON = !gIsKaiOSAppMode;


let isKaiOS = true;
if (navigator.userAgent.toLowerCase().indexOf('kaios') > -1) {
    isKaiOS = true;
}

// I need to check if I'm running in the built in browser or as an app
// Check for app: is easy but that's only if the app is packaged.  IF it's a hosted
// app then it looks the same as if you're in the browser.  THe ONLY difference
// I can find is the innerWidth height is shorter as at 228px.  But I have to check
// this height at start up before the user clikcs fullscreen.  If they do click
// fullscreen then with and height are 320x240 like normal. :/
let gRunnngInBrowser = false; //(window.innerHeight <= 228)

if (window.innerHeight <= 228) {
    gRunnngInBrowser = true;
}

let centerGame = Phaser.Scale.CENTER_HORIZONTALLY;//CENTER_BOTH;
let myScale;
if (gRunnngInBrowser) {
    // Phaser.Scale.CENTER_HORIZONTALLY;

    myScale = {
        parent: 'gameStage',
        // autoCenter: Phaser.Scale.CENTER_BOTH, //Phaser.Scale.CENTER_HORIZONTALLY,
        mode: Phaser.Scale.NONE, // we will resize the game with our own code (see Boot.js)
        width: gStageWidth,
        height: gStageHeight
    }
} else {
    myScale = {
        parent: 'gameStage',
        autoCenter: Phaser.Scale.CENTER_BOTH, //Phaser.Scale.CENTER_HORIZONTALLY,
        mode: Phaser.Scale.FIT, // we will resize the game with our own code (see Boot.js)
        width: gStageWidth,
        height: gStageHeight
    }
}

const scenes = [BootScene, PreloadScene, MenuOverlay, SponsorOverlay, MenuScene, HelpScene, GameScene,MoreGamesScene,SettingsScene];

enum states {
    kSTATE_NOTHING = 0,
    kSTATE_START,
    kSTATE_MENU,
    kSTATE_HELP,
    kSTATE_PLAYING,
    kSTATE_LEVEL_ENDED,
    kSTATE_LEVEL_END_COUNTSCORE,
    kSTATE_LEVEL_END_COUNTBONUS,
    kSTATE_START_LEVEL_END_COUNTBONUS,
    kSTATE_LEVEL_END_COMPLETE,
    kSTATE_GAMEOVER_DELAY,
    kSTATE_GAMEOVER,
    kSTATE_PAUSED,
    kSTATE_SHOWING_AD,
    kSTATE_ADSELECTED,
    kSTATE_MOREGAMES,
    kSTATE_SETTINGS
}

let game;
let gGameState = states.kSTATE_NOTHING;
let emitter = new Phaser.Events.EventEmitter();


const kGOOGLE = 1;
const kMATOMO = 2;
const kFIREBASE = 3;
// gAnalytic is any one of the three above.  Future version will only have 
//kGOOGLE and maybe kFIREBASE if supported it next revision of kaios
let gAnalytic = 1;

// ******************************************************************************
// ******************************************************************************
// NOTE ******* 
//
// If using Matomo the init is in the index.html file 
// DON"T USE MATOMO FOR ONLINE GAMES. USE GOOGLE.
//
// Firebase does not work on KaiOS.  Period.
// 
// Using Google Analytics //////////////////////////////////////////////////////
// TEST:UA-150350318-3
// PROD:UA-150350318-1
// ******************************************************************************
AAKaiAnalytics.initAnalytics('UA-150350318-3', gGameName);
AAKaiAnalytics.getDeviceData();

function resize() {

    if (gRunnngInBrowser) {
        let game_ratio = 1;//(9 * 32) / (15 * 32);

        // Make div full height of browser and keep the ratio of game resolution
        let div = document.getElementById('gameStage');
        div.style.width = (window.innerHeight * game_ratio) + 'px';
        div.style.height = window.innerHeight + 'px';

        // Check if device DPI messes up the width-height-ratio
        let canvas = document.getElementsByTagName('canvas')[0];

        let dpi_w = (parseInt(div.style.width) / canvas.width);
        let dpi_h = (parseInt(div.style.height) / canvas.height);

        gStageHeight = window.innerHeight;// * (dpi_w / dpi_h);
        gStageWidth = window.innerWidth;// height* 0.6;

        game.canvas.style.width = gStageWidth + 'px';
        game.canvas.style.height = gStageHeight + 'px';

    }

}

window.onload = () => {

    let config = {
        type: Phaser.WEBGL,
        renderType: Phaser.WEBGL,
        scene: scenes,
        banner: false,
        title: gGameName,
        backgroundColor: gameBGColor,
        url: 'https://taaragames.com/',
        version: gGameVersion,
        autoFocus: true,
        autoRound: true,
        powerPreference: 'high-performance',
        dom: {
            createContainer: true
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: { x: 0, y: 0 }
            }
        },
        scale: myScale
        // scale: {
        //     parent: 'gameStage',
        //     // autoCenter: Phaser.Scale.CENTER_BOTH, //Phaser.Scale.CENTER_HORIZONTALLY,
        //     mode: Phaser.Scale.NONE, // we will resize the game with our own code (see Boot.js)
        //     width: gStageWidth,
        //     height: gStageHeight
        // },
    }


    game = new Phaser.Game(config);
    game.canvas.mozOpaque = true;

    window.addEventListener('resize', function (event) {
        resize();
    }, false);

    resize();
  
    document.addEventListener('fullscreenchange', (event) => {
        // document.fullscreenElement will point to the element that
        // is in fullscreen mode if there is one. If there isn't one,
        // the value of the property is null.
        if (document.fullscreenElement) {
            emitter.emit('fullscreen', [2.5]);
        } else {
            emitter.emit('fullscreen', [1]);

        }
    });

};
