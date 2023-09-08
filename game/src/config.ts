/// <reference path="../../phaser.d.ts" />
/// <reference path='GameScene.ts'/>
/// <reference path='MenuScene.ts'/>
/// <reference path='MenuOverlay.ts'/>
/// <reference path='PreloadScene.ts'/>
/// <reference path='HelpScene.ts'/>
/// <reference path='consts.ts'/>

/// <reference path='../../../AAShared/AAFunctions.ts'/>
/// <reference path='../../../AAShared/AAPrefs.ts'/>
/// <reference path='../../../AAShared/AAKaiAds.ts'/>
/// <reference path='../../../AAShared/AAKaiControls.ts'/>
/// <reference path='../../../AAShared/AAControls.ts'/>
/// <reference path='../../../AAShared/AAHighScores.ts'/>
/// <reference path='../../../AAShared/AAKaiAnalytics.ts'/>

// ADD GAME RELATED GLOBALS HERE
// ******************************************************************************
// INIT GAME
// ******************************************************************************

let isKaiOS = true;
if (navigator.userAgent.toLowerCase().indexOf('kaios') > -1) {
    isKaiOS = true;
}

// This is called when preload is done.  This is new 10/16/20 so I can load the manifest nad use it's data.
function initGame() {

    manifest = game.cache.json.get('manifest')

     // because I only load kaios 2.x manifest I need to chekc for kaios 3.
    // If it is kaios 3 I append " 3" to the end of the name.  This name is used for KiaADs
   // Mozilla/5.0 (Mobile; TCL 4056W; rv:84.0) Gecko/84.0 Firefox/84.0 KAIOS/3.0

    let versionNumber = ""
    if (navigator.appVersion.indexOf("KAIOS/3") != -1){
        versionNumber = " 3";
    }
    
    gamePrefsFile = "games.taara." + gGameName.replace(/\s/g, '').toLowerCase() + ".prefs";

    // append the version number after game prefs just in case use has a lot of data stored.
    gGameName = manifest.name + versionNumber;
    gGameVersion = manifest.version;
    game.config.gameTitle = gGameName;

    //Ads
    gUseBanner = true;
    gBannerAdDuration = 1000 * 30;

    gUseFullscreenAd = true;
    gShowFullscreenAdEveryX = 5;
    gFullscreenAdCount = 4;

    // Google ID Notes
    // TEST:UA-150350318-3
    // PROD:UA-150350318-1
    // ******************************************************************************
    AAKaiAnalytics.initAnalytics(getUUID());
    setTimeout(function () { AAKaiAnalytics.sendUA(); }, 3000);

    AAKaiAds.preLoadBannerAd();

}

// NO NEED TO TOUCH ANYTHING PAST HERE ===================================
// =======================================================================


let centerGame = Phaser.Scale.CENTER_HORIZONTALLY;//CENTER_BOTH;
let myScale;

myScale = {
    parent: 'gameStage2',
    // autoCenter: Phaser.Scale.CENTER_BOTH, //Phaser.Scale.CENTER_HORIZONTALLY,
    mode: Phaser.Scale.NONE, // we will resize the game with our own code (see Boot.js)
    width: gStageWidth,
    height: gStageHeight,
    autoRound: true
}


const scenes = [PreloadScene, MenuOverlay, MenuScene, HelpScene, GameScene];

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

window.onload = () => {

    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.WEBGL,
        scene: scenes,
        banner: false,
        title: gGameName,
        backgroundColor: gameBGColor,
        url: 'https://taara.games/',
        version: gGameVersion,
        autoFocus: true,
        customEnvironment: true,
        render: {
            antialias: false,
            antialiasGL: false,
            desynchronized: true,
            roundPixels: true,
            powerPreference: 'high-performance',
            premultipliedAlpha: false,
            batchSize: 1024,
            maxLights: 1,
            maxTextures: 8
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: kDEBUG,
                gravity: { x: 0, y: 0 }
            }
        },
        scale: myScale
    }

    game = new Phaser.Game(config);

};


// emitter.on('hideAd', hideBanner);
// emitter.on('showAd', showBanner);
function hideBanner() {
    if (gUseBanner) {
        var domad = document.getElementById('sponsorad');
        var scoreDom = document.getElementById('scores');
        var sponsorBtnDom = document.getElementById('sponsorButton');

        domad.style.top = "-36px";
        domad.style.opacity = "0";
        scoreDom.style.top = "20px";

        sponsorBtnDom.style.opacity = "0";
        sponsorBtnDom.style.bottom = "-25px";
    }
}

function showBanner() {
    if (AAKaiAds.bannerAdLoaded) {
        if ((gGameState == states.kSTATE_PLAYING) || (gGameState == states.kSTATE_HELP) || (gGameState == states.kSTATE_MOREGAMES)) {
            return
        }
        if (gUseBanner) {
            var domad = document.getElementById('sponsorad');
            var scoreDom = document.getElementById('scores');
            var sponsorBtnDom = document.getElementById('sponsorButton');

            domad.style.top = "0";
            domad.style.opacity = "1";
            scoreDom.style.top = "60px";
            sponsorBtnDom.style.opacity = "1";
            sponsorBtnDom.style.bottom = "-5px";
        }
    }
}