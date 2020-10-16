/// <reference path="../../phaser.d.ts" />
/// <reference path='GameScene.ts'/>
/// <reference path='MenuScene.ts'/>
/// <reference path='MenuOverlay.ts'/>
/// <reference path='PreloadScene.ts'/>
/// <reference path='HelpScene.ts'/>
/// <reference path='MoreGamesScene.ts'/>
/// <reference path='SettingsScene.ts'/>
/// <reference path='Sponsor.ts'/>
/// <reference path='consts.ts'/>

/// <reference path='../../../AAShared/AAFunctions.ts'/>
/// <reference path='../../../AAShared/AAPrefs.ts'/>
/// <reference path='../../../AAShared/AAKaiAds.ts'/>
/// <reference path='../../../AAShared/AAKaiControls.ts'/>
/// <reference path='../../../AAShared/AAControls.ts'/>
/// <reference path='../../../AAShared/AAHighScores.ts'/>
/// <reference path='../../../AAShared/AAKaiAnalytics.ts'/>


// ADD GAME RELATED GLOBALS HERE


// ***********************************************************************
// ************************************************************************
// ******************************************************************************
// INIT GAME
// ******************************************************************************


// This is called when preload is done.  This is new 10/16/20 so I can load the manifest nad use it's data.
function initGame() {

    manifest = game.cache.json.get('manifest')
    gGameName = manifest.name;
    gamePrefsFile = "games.taara." + gGameName.replace(/\s/g, '').toLowerCase() + ".prefs";
    gGameVersion = manifest.version;
    game.config.gameTitle = gGameName;

    // Google ID Notes
    // TEST:UA-150350318-3
    // PROD:UA-150350318-1
    // ******************************************************************************
    AAKaiAnalytics.initAnalytics(manifest.gid, _uuid);
    setTimeout(function () { AAKaiAnalytics.sendUA(); }, 1000);

}

// NO NEED TO TOUCH ANYTHING PAST HERE ===================================
// =======================================================================

// IF TESTING ON PC THEN IT"S ALWAYS TRUE!!!
let gIsTouchDevice = false;
// gIsTouchDevice = is_touch_device();

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

myScale = {
    parent: 'gameStage',
    // autoCenter: Phaser.Scale.CENTER_BOTH, //Phaser.Scale.CENTER_HORIZONTALLY,
    mode: Phaser.Scale.NONE, // we will resize the game with our own code (see Boot.js)
    width: gStageWidth,
    height: gStageHeight
}


const scenes = [BootScene, PreloadScene, MenuOverlay, MenuScene, HelpScene, GameScene, MoreGamesScene, SettingsScene];

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


let _uuid = getUUID();
// AAKaiAnalytics.initAnalytics(kGOOGLE_ID, _uuid);
// setTimeout(function () { AAKaiAnalytics.sendUA(); }, 1000);

function getUUID() {

    let lsID = 'games.taara.uuid';
    let uuid = Phaser.Utils.String.UUID();
    var scr = localStorage.getItem(lsID);
    if (scr == undefined) {
        localStorage.setItem(lsID, uuid);
    } else {
        uuid = scr;
    }
    return uuid;
}

var avgFPS = [];
function addToFPSArray(_fps) {
    //values.reduce(function(a, b){return a+b;})
    avgFPS.push(parseFloat(_fps));
    if (avgFPS.length > 50) {
        avgFPS.shift(); //remove the first value in array
    }
}

function calcFPSAverage() {
    let f = (avgFPS.reduce(function (a, b) { return a + b; }) / avgFPS.length).toFixed(1);
    AAKaiAnalytics.sendSpecial("fps", f.toString());
}
function resize() {

    // if (gRunnngInBrowser) {
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

    // }

}

function is_touch_device() {
    return !!('ontouchstart' in window || navigator.maxTouchPoints);
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
        pixelArt: false,
        powerPreference: 'high-performance',
        dom: {
            createContainer: true
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: kDEBUG,
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

    if ((gIsTouchDevice) && (isKaiOS)) {
        document.documentElement.requestFullscreen();
        (<any>navigator).mozAudioChannelManager.volumeControlChannel = 'normal';
    }

    document.addEventListener('fullscreenchange', (event) => {
        // document.fullscreenElement will point to the element that
        // is in fullscreen mode if there is one. If there isn't one,
        // the value of the property is null.
        if (document.fullscreenElement) {
            gStageHeight = window.innerHeight - 30;// * (dpi_w / dpi_h);
            game.canvas.style.height = gStageHeight + 'px';
            // emitter.emit('fullscreen', [2.5]);
        } else {
            // emitter.emit('fullscreen', [1]);

        }
    });

};


// emitter.on('hideAd', hideBanner);
// emitter.on('showAd', showBanner);
function hideBanner() {
    var domad = document.getElementById('sponsorad');
    var scoreDom = document.getElementById('scores');
    var sponsorBtnDom = document.getElementById('sponsorButton');

    domad.style.top = "-36px";
    domad.style.opacity = "0";
    scoreDom.style.top = "20px";

    sponsorBtnDom.style.opacity = "0";
    sponsorBtnDom.style.bottom = "-25px";
}

function showBanner() {
    var domad = document.getElementById('sponsorad');
    var scoreDom = document.getElementById('scores');
    var sponsorBtnDom = document.getElementById('sponsorButton');

    domad.style.top = "0";
    domad.style.opacity = "1";
    scoreDom.style.top = "50px";
    sponsorBtnDom.style.opacity = "1";
    sponsorBtnDom.style.bottom = "-5px";

}