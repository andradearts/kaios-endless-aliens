// CHANGE BEFORE PUBLISHING * * * * * * * * * * * * * * * * * * * * * * * * * * * 
const kTESTMODE = 1; /* set to 0 for real ads */
var gGameName = "_TEMPLATE_";
var gGameVersion = "1.0.0";

//used for arcade debug and console.logs()
const kDEBUG = false;
let gSHOW_FPS = false; // this can be dynamically set

var gBannerAdDuration = 1000 * 30;
var gUseBanner = true;

var gUseFullscreenAd = false;
var gShowFullscreenAdEveryX = 5;
var gFullscreenAdCount = 0;

// END CHANGE * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// ******************************************************************************
// ******************************************************************************
// ******************************************************************************
// ******************************************************************************

var manifest;

// ADS ============================================
// This is needed so I can use the KaiAds SDK and not get complier errors
declare var getKaiAd: any;

// used to move the score down when ads are displayed
const kBOTTOM_POSITION_FOR_AD = 45;

// STAGE OPTIONS ==================================
const gameBGColor = 0x333333;
let gStageWidth = 240;  // I'm leaving it as a multiple to remind me of org size
let gStageHeight = 320;  //228 * 2; //web is 228

// LOGO ============================================
// How long to stay on the Taara games Logo loading scene
const gLogoDisplayLength = 500;

var gamePrefsFile = "games.taara." + gGameName + ".prefs";

// MAIN ATLAS
const kSPRITE_ATLAS = 'spriteatlas2';

// BUTTONS
const kBTN_BACK = 'btnBackBottom';
const kBTN_PLAY = 'btnPlay';
const kBTN_SOUND_OFF = 'btnSoundOff';
const kBTN_SOUND_ON = 'btnSoundOn';
const kBTN_HELP = 'btnHelp';
const kBTN_RESET_GAME = 'btnRestart';
const kBTN_SPONSOR = 'btnSponsor';


// UI SPRITES
const kIMG_BG = 'purpBG';
const kIMG_GAMEOVER = "gameoverSprite";
const kIMG_LOGO = "taara-logo"
const kIMG_HELP = 'help.png';

var debug_log;
if (kDEBUG) debug_log = console.log.bind(window.console)
else debug_log = function(){}
