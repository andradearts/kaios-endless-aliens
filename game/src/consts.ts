// CHANGE BEFORE PUBLISHING * * * * * * * * * * * * * * * * * * * * * * * * * * * 
const kTESTMODE = 1; /* set to 0 for real ads */
var gGameName = "_TEMPLATE_";
var gGameVersion = "1.0.0";

//used for arcade debug and console.logs()
const kDEBUG = false;
let gSHOW_FPS = false; // this can be dynamically set






// END CHANGE * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// ******************************************************************************
// ******************************************************************************
// ******************************************************************************
// ******************************************************************************

var manifest;

// TOUCH DEVICE ===================================
let kTOUCH: Number = 0;

// ADS ============================================
// This is needed so I can use the KaiAds SDK and not get complier errors
declare var getKaiAd: any;
// orginaly used for custom sponsor ads.  Kept here just in case I do use it in the future
let kUSESPONSOR = true;


// used to move the score down when ads are displayed
const kBOTTOM_POSITION_FOR_AD = 45;

// STAGE OPTIONS ==================================
const gameBGColor = 0x333333;
let gStageWidth = 240;  // I'm leaving it as a multiple to remind me of org size
let gStageHeight = 320;  //228 * 2; //web is 228

// If I'm on a touch device I want to stage to be larger
// This will be the default touch screen size even for a larger device.
if (kTOUCH == 1) {
    gStageWidth = 480;
    gStageHeight = 960;
}

// LOGO ============================================
// How long to stay on the Taara games Logo loading scene
const gLogoDisplayLength = 2000;


var gamePrefsFile = "games.taara." + gGameName + ".prefs";

// MAIN ATLAS
const kSPRITE_ATLAS = 'spriteAtlas';
// BUTTONS
const kBTN_BACK = 'btnBack.png';
const kBTN_PLAY = 'btnPlay.png';
const kBTN_SOUND_OFF = 'btnSoundOff.png'
const kBTN_SOUND_ON = 'btnSoundOn.png';
const kBTN_HELP = 'btnHelp.png';
const kBTN_SETTINGS = 'btnSettings.png';
const kBTN_MORE_GAMES = 'btnMoreGames.png';
const kBTN_RESET_GAME = 'btnResetGame.png';
const kBTN_FULLSCREEN_ON = 'btnFullscreenOn.png';
const kBTN_FULLSCREEN_OFF = 'btnFullscreenOff.png';
const kBTN_SPONSOR = 'btnSponsor.png';

// TAGS
const kTAG_1 = 'tag1.png'
const kTAG_2 = 'tag2.png'
const kTAG_3 = 'tag3.png'
const kTAG_4 = 'tag4.png'
const kTAG_5 = 'tag5.png'
const kTAG_6 = 'tag6.png'
const kTAG_7 = 'tag7.png'
const kTAG_8 = 'tag8.png'
const kTAG_9 = 'tag9.png'
const kTAG_0 = 'tag0.png'
const kTAG_HASH = 'tag#.png'
const kTAG_STAR = 'tag*.png'

// UI SPRITES
const kIMG_GAMEOVER = 'gameover.png';

const kIMG_HELP = 'help.png';
const kIMG_SETTINGS = 'help.png';
const kIMG_KAISTORE = 'kaiStore.png';

var debug_log;
if (kDEBUG) debug_log = console.log.bind(window.console)
else debug_log = function(){}
