var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// / <reference path='../phaser.d.ts'/>
// / <reference path='./shaders/OutlinePipeline.ts'/>
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(_scene, _x, _y, _tex, _upFrame, _callback, theName, hasRollver) {
        var _this = _super.call(this, _scene, _x, _y, _tex, _upFrame) || this;
        _this.clicked = false;
        _this.isSelected = false;
        // #UP,#DOWN or #BOTH
        _this.callWhen = 'both'; //default
        _this.rolloverColor = 0xffff99;
        _this.selectColor = 0x00FF00;
        _scene.add.existing(_this);
        _this.rollovedEnabled = hasRollver;
        _this.name = theName;
        _this.setOrigin(.5);
        _this.setInteractive();
        _this.on('pointerup', _this.pointerUp, _this);
        _this.on('pointerdown', _this.pointerDown, _this);
        _this.on('pointerover', _this.pointerOver, _this);
        _this.on('pointerout', _this.pointerOut, _this);
        _this.upFrame = _upFrame;
        _this.callback = _callback;
        _this.myScene = _scene;
        _this.clicked = false;
        _this.isSelected = false;
        _this.scene.input.on('pointerup', _this.generalPointerUp, _this);
        return _this;
    }
    Button.prototype.setMainTint = function (theTint) {
        this.mainTint = theTint;
        this.setTint(theTint);
    };
    Button.prototype.select = function (shoudAnimate) {
        if (shoudAnimate === void 0) { shoudAnimate = true; }
        //  if (kIOS_WRAPPED) {
        this.setTint(this.selectColor); //0xf6a45b);
        //}
        if (shoudAnimate) {
            var oldSclX = 1; //this.scaleX;
            var oldSclY = 1; //this.scaleY;
            this.setScale(0);
            this.myScene.tweens.add({
                targets: this,
                scaleX: oldSclX,
                scaleY: oldSclY,
                ease: 'Bounce.easeOut',
                duration: 300
            });
        }
        this.isSelected = true;
    };
    Button.prototype.deselect = function () {
        this.myClearTint();
        this.setTint(this.mainTint);
        this.isSelected = false;
    };
    Button.prototype.myClearTint = function () {
        if (this.mainTint == null) {
            this.clearTint();
        }
        else {
            this.setTint(this.mainTint);
        }
    };
    Button.prototype.bounce = function (dir, toSize) {
        var _this = this;
        if (toSize === void 0) { toSize = 1; }
        var oldSclX; // = this.scaleX;
        var oldSclY; // = this.scaleY;
        if (dir == 'in') {
            oldSclX = toSize; //this.scaleX;
            oldSclY = toSize; //this.scaleY;
            this.setScale(0);
        }
        else if (dir == 'out') {
            oldSclX = 0;
            oldSclY = 0;
        }
        this.myScene.tweens.add({
            targets: this,
            scaleX: oldSclX,
            scaleY: oldSclY,
            ease: 'Bounce.easeOut',
            duration: 300,
            onComplete: function () {
                if (dir == 'out') {
                    _this.setVisible(false);
                    _this.setScale(1);
                }
            }
        });
    };
    Button.prototype.enableRollover = function (how) {
        this.rollovedEnabled = how;
    };
    Button.prototype.pointerMove = function (pointer) {
        //  console.log(pointer.event.type);
    };
    Button.prototype.generalPointerUp = function (pointer) {
        if ((this.callWhen == 'up') || (this.callWhen == 'both')) {
            if (this.id == pointer.id) {
                var it = Phaser.Geom.Rectangle.Contains(this.getBounds(), pointer.upX, pointer.upY);
                if (!it) {
                    this.pointerUpOutside(pointer);
                }
            }
        }
    };
    Button.prototype.pointerUpOutside = function (pointer) {
        if ((this.callWhen == 'up') || (this.callWhen == 'both')) {
            //this.setFrame(this.upFrame);
            this.myClearTint(); //  setTint(0xffffff);
            // this.myScene.events.emit('screenButtonEvent', "up", this.name);
        }
    };
    Button.prototype.pointerUp = function (pointer) {
        // The reason I check for clicked is so I don't trigger the pointer up if
        // the mouse wasn't frist clicked on the button itself.
        // I check for pointer null when I send this event via keyboard control.  Null tells
        // me it's a keyup pressed custom event
        if ((this.callWhen == 'up') || (this.callWhen == 'both')) {
            if ((this.clicked == true) || (pointer == null)) {
                this.clicked = false;
                this.myClearTint(); //this.setTint(0xffffff);
                //this.setFrame(this.upFrame);
                // this.callback.call(this.myScene);
                if (this.callback) {
                    this.callback.call(this.myScene, 'up');
                }
                // this.myScene.events.emit('screenButtonEvent', "up", this.name);
            }
        }
    };
    Button.prototype.pointerDown = function (pointer) {
        if ((this.callWhen == 'down') || (this.callWhen == 'both')) {
            this.id = pointer.id;
            this.clicked = true;
            this.setTint(0x9df89d);
            // this.setFrame(this.downFrame);
            if (this.callback) {
                this.callback.call(this.myScene, 'down');
            }
            // this.myScene.events.emit('screenButtonEvent', "down", this.name);
        }
    };
    Button.prototype.pointerOver = function (pointer, x, y) {
        if (this.rollovedEnabled) {
            //this.setPipeline("Outline");
            // this.setFrame(this.overFrame);
            //  if (kIOS_WRAPPED) {
            this.setTint(this.rolloverColor);
            //  }
            // this.myScene.events.emit('rollover', this);
        }
    };
    Button.prototype.pointerOut = function (pointer) {
        if (this.rollovedEnabled) {
            //this.setFrame(this.upFrame);
            this.myClearTint(); //this.setTint(0x000000);
        }
    };
    // Leave this comment here for my reference 
    // b.setFrames('btn_sound_off.png', 'btn_sound_off.png', 'btn_sound_on.png', 'btn_sound_off.png');
    // used for switching up toggle states  
    Button.prototype.setFrames = function (_upFrame) {
        this.upFrame = _upFrame;
        this.setFrame(this.upFrame);
    };
    return Button;
}(Phaser.GameObjects.Sprite)); //end class
var PieMeter = /** @class */ (function (_super) {
    __extends(PieMeter, _super);
    // _scene:  the scene you want to display the meter in
    // _x, _y:  the position to display the meter
    // _radi:   the fadius of the meter
    // _dir:    the direction of the meter.  Value is either 1 or 0
    // _flip:   flips the meter horizontially and is used in conjunction with the _dir
    function PieMeter(_scene, _x, _y, _radi, _dir, _flip, _endValue) {
        var _this = _super.call(this, _scene, { x: _x, y: _y }) || this;
        _this.pieProgress = 0;
        _this.direction = 0;
        _this.color = 0x000000;
        _this.opacity = .5;
        _this.angle = 0;
        _this.alpha = .75;
        _this.scaleY = _flip;
        _this.setActive(true);
        _this.myRadius = _radi;
        _this.direction = _dir;
        _this.endValue = _endValue;
        _scene.add.existing(_this);
        return _this;
    }
    PieMeter.prototype.setColor = function (_color, _opacity) {
        this.color = _color;
        this.opacity = _opacity;
    };
    // constructor(_scene, _x: number, _y: number, _radi) {
    //     super(_scene, { x: _x, y: _y });
    //     // if error mode sure phaser.d.ts has Partial<GraphicsStyles> of graphicsOptions
    //     this.angle = 0;
    //     this.alpha = .15;
    //     this.scaleY = -1;
    //     this.setActive(true);
    //     this.myRadius = _radi;
    //     _scene.add.existing(this);
    // }
    PieMeter.prototype.drawPieStatic = function (amount) {
        if (this.visible == false)
            this.visible = true;
        this.pieProgress = amount;
        this.clear();
        this.fillStyle(this.color, this.opacity);
        var radius = this.myRadius;
        this.angle = -90;
        this.slice(0, 0, radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360 * this.pieProgress), true);
        this.fillPath();
        return this.pieProgress;
    };
    //return number bt 0 and 1.0
    PieMeter.prototype.getValue = function () {
        return this.pieProgress / 360.0;
    };
    // should be bt 0 and 1.0
    PieMeter.prototype.setValue = function (howMuch) {
        this.pieProgress = howMuch * 360.0;
    };
    PieMeter.prototype.drawPie = function (howMuch, increase) {
        if (this.visible == false)
            this.visible = true;
        if ((increase == true) || (increase == null)) {
            this.pieProgress += howMuch;
        }
        else {
            this.pieProgress = howMuch;
        }
        this.clear();
        this.fillStyle(this.color, this.opacity);
        var radius = this.myRadius;
        this.angle = -90;
        this.slice(0, 0, radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(this.pieProgress), true);
        this.fillPath();
        return this.pieProgress / 360.0;
        // }
    };
    PieMeter.prototype.drawPie2 = function (howMuch) {
        if (this.visible == false)
            this.visible = true;
        this.clear();
        this.fillStyle(this.color, this.opacity);
        var radius = this.myRadius;
        // Rotate to make 0 as 12 o'clock
        this.angle = -90;
        this.pieProgress = (360 / this.endValue * howMuch);
        if (this.direction == 0) {
            this.slice(0, 0, radius, 0, Phaser.Math.DegToRad(this.pieProgress), true);
        }
        else {
            this.slice(0, 0, radius, Phaser.Math.DegToRad(this.pieProgress), 0, true);
        }
        this.fillPath();
    };
    PieMeter.prototype.reset = function () {
        this.pieProgress = 0;
        // this.visible = false;
    };
    return PieMeter;
}(Phaser.GameObjects.Graphics));
var BootScene = /** @class */ (function (_super) {
    __extends(BootScene, _super);
    function BootScene() {
        return _super.call(this, { key: 'BootScene' }) || this;
    }
    BootScene.prototype.preload = function () {
        this.load.setPath('assets/images/');
        this.load.image('logo', 'taara-logo.png');
        // this.load.image('preloadBar', 'progressBar.png', null);
        // this.load.image('preloadBarMask', 'progressBarMask.png', null);
        this.load.on('complete', function () {
            this.scene.start('PreloadScene');
        }, this);
    };
    return BootScene;
}(Phaser.Scene));
var MoreGamesScene = /** @class */ (function (_super) {
    __extends(MoreGamesScene, _super);
    function MoreGamesScene() {
        return _super.call(this, { key: 'MoreGamesScene' }) || this;
    }
    MoreGamesScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor(0xFBF200);
        gGameState = states.kSTATE_MOREGAMES;
    };
    MoreGamesScene.prototype.create = function () {
        this.scene.sendToBack();
        this.bg = this.add.image(0, 0, 'logo').setOrigin(0, 0);
        // this.add.tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, 'spriteAtlas', 'bgpattern.jpg').setAlpha(.5);
        // this.bg.setOrigin(0, 0);
        var graphics = this.add.graphics();
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(this.sys.canvas.width, 0);
        graphics.lineTo(this.sys.canvas.width, this.sys.canvas.height);
        graphics.lineTo(0, this.sys.canvas.height);
        graphics.closePath();
        graphics.strokePath();
        graphics.fillStyle(0x00000, .75);
        graphics.fill();
        var mo = this.scene.get('MenuOverlay');
        mo.scoreText.setVisible(false);
        mo.highScoreText.setVisible(false);
        //this.add.image(0,0,'spriteAtlas','moreGames.png').setOrigin(0,0);
        // add the icons
        // should be in AAShared in the future!
        // and SHOULD be an html file
        var element = this.add.dom(0, 80).createFromCache('moreGamesHTML').setOrigin(0, 0);
        this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height - 70, 'spriteAtlas', 'kaiStore.png');
        if (gRunnngInBrowser) {
            //display link to website taara.games
        }
        else {
            //display KaiStore badge
        }
    };
    MoreGamesScene.prototype.update = function () {
        if (this.bg) {
            this.bg.tilePositionY = this.bg.tilePositionY + .2;
            //  this.bg2.tilePositionY = this.bg2.tilePositionY - .12;
            // ;
        }
    };
    return MoreGamesScene;
}(Phaser.Scene));
var SettingsScene = /** @class */ (function (_super) {
    __extends(SettingsScene, _super);
    function SettingsScene() {
        return _super.call(this, { key: 'SettingsScene' }) || this;
    }
    SettingsScene.prototype.preload = function () {
    };
    SettingsScene.prototype.create = function () {
        gGameState = states.kSTATE_SETTINGS;
        var mo = this.scene.get('MenuOverlay');
        mo.scoreText.setVisible(false);
        mo.highScoreText.setVisible(false);
        this.add.image(0, 0, 'spriteAtlas', 'help_en.png').setOrigin(0, 0);
    };
    return SettingsScene;
}(Phaser.Scene));
var PreloadScene = /** @class */ (function (_super) {
    __extends(PreloadScene, _super);
    function PreloadScene() {
        return _super.call(this, { key: 'PreloadScene' }) || this;
    }
    PreloadScene.prototype.preload = function () {
        // AAKaiAds.preLoadFullscreenAd();
        //    AAKaiAds.preLoadBannerAd();
        this.cameras.main.setBackgroundColor(0xFFDD18);
        var logo = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "logo").setAlpha(0);
        this.tweens.add({
            targets: logo,
            alpha: 1.0,
            duration: 100,
            ease: 'Power.easeIn'
        });
        this.loadAssets();
    };
    PreloadScene.prototype.loadAssets = function () {
        this.load.on('progress', function (it) {
            // this.meterBar.scaleX = this.load.progress;
        }, this);
        this.load.on('complete', function () {
            // this.meterBar.fillStyle(0x00A800, 1.0);
            // this.meterBar.fill();
            // this.meterBar.scaleX = 1.0;
            AAFunctions.fade(this, "out", 500, this.goToGameScene, gLogoDisplayLength);
        }, this);
        // *** LOAD ASSETS ***
        // ========================================================================
        // 3/30/20
        // commented this out as I'm trying out banner kaios ads
        // ========================================================================
        // let d = '?' + new Date().getTime();
        // this.load.text('sponsorURL', 'https://taara.games/sponsor.txt' + d);
        // this.load.image('sponsor', 'https://taara.games/sponsor.png' + d);
        // this.load.setPath("assets/");
        // let it:Phaser.Types.Loader.XHRSettingsObject = Phaser.Loader.XHRSettings();
        // it.header = "Access-Control-Allow-Origin: *";
        // it.headerValue = "Access-Control-Allow-Origin: *";
        //this.load.script('analytics', 'https://www.google-analytics.com/analytics.js');
        this.load.setPath("assets/html/");
        this.load.html('moreGamesHTML', 'moregames.html');
        this.load.html('newgameHTML', 'newgame.html');
        // Spritesheets
        this.load.setPath("assets/images/");
        this.load.atlas("spriteAtlas", "spriteAtlas.png", "spriteAtlas.json", null, null);
        // this.load.image('coverart', 'coverart.png');
        //Fonts
        this.load.image('numbersFont', 'numbers@2x.png');
        this.load.bitmapFont('sysFont', 'retroSystem.png', 'retroSystem.fnt', null, null);
        //Sound Effects
        this.load.setPath("assets/audio/");
        var ext = '.ogg';
        // These two sounds are the standard button sounds
        this.load.audio("button", "click" + ext);
        // this.load.audio("buttonNav", "chime-triad" + ext);
    };
    PreloadScene.prototype.goToGameScene = function (a, c, b, d) {
        this.scene.start('MenuScene');
        this.scene.start('MenuOverlay');
        this.scene.start('SponsorOverlay');
        var element = document.getElementsByClassName('spinner')[0];
        var op = 1; // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1) {
                clearInterval(timer);
                // (<any>element).style.opacity = 0;
                // (<any>element).style.display = 'none';
                element.remove();
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.3;
        }, 50);
        // switch (true) {
        //     // this.sys.game.device.os.chromeOS     // Is running on chromeOS?
        //     // this.sys.game.device.os.cordova      // Is the game running under Apache Cordova?
        //     // this.sys.game.device.os.crosswalk    // Is the game running under the Intel Crosswalk XDK?
        //     // this.sys.game.device.os.ejecta       // Is the game running under Ejecta?
        //     // this.sys.game.device.os.electron     // Is the game running under GitHub Electron?
        //     case this.sys.game.device.os.desktop:      // Is running on a desktop?
        //     case this.sys.game.device.os.android:     // Is running on android?
        //     case this.sys.game.device.os.iOS:         // Is running on iOS?
        //     case this.sys.game.device.os.iPad:        // Is running on iPad?
        //     case this.sys.game.device.os.iPhone:       // Is running on iPhone?
        //     case this.sys.game.device.os.kindle:      // Is running on an Amazon Kindle?
        //     case this.sys.game.device.os.linux:     // Is running on linux?
        //     case this.sys.game.device.os.macOS:    // Is running on macOS?
        //     case this.sys.game.device.os.webApp:   // Set to true if running as a WebApp, i.e. within a case WebView
        //     case this.sys.game.device.os.windows:      // Is running on windows?
        //     case this.sys.game.device.os.windowsPhone: // Is running on a Windows Phone?
        //     // this.sys.game.device.os.node         // Is the game running under Node.js?
        //     // this.sys.game.device.os.nodeWebkit   // Is the game running under Node-/Webkit?
        //     case gRunnngInBrowser:
        //         this.scene.start('SponsorOverlay');
        //         break;
        // }
        // AAKaiAds.displayFullscreenAd();
        // AAKaiAds.preLoadDisplayAd();
    };
    return PreloadScene;
}(Phaser.Scene));
var MenuOverlay = /** @class */ (function (_super) {
    __extends(MenuOverlay, _super);
    function MenuOverlay() {
        var _this = _super.call(this, { key: 'MenuOverlay' }) || this;
        // debugText;
        // debugInfo;
        _this.kHideDistance = 350;
        _this._SHOWFPS = false;
        _this.pauseEnabled = false;
        _this.currentActiveButton = 4; // start on the play button
        return _this;
    }
    MenuOverlay.prototype.preload = function () {
        // Get the Prefs & high score
        AAPrefs.initGamePrefs(gamePrefsFile);
        AAHighScores.initHighScores();
        // AAKaiAds.displayFullscreenAd();
        AAKaiAds.preLoadBannerAd();
    };
    MenuOverlay.prototype.create = function () {
        if (isKaiOS) {
            AAKaiControls.setUpInputs(this);
            emitter.on('keydown', this.keydown, this);
            emitter.on('keyup', this.keyup, this);
        }
        else {
            AAControls.setUpInputs(this);
        }
        // this.cursors = this.input.keyboard.createCursorKeys();
        this.setUpAudio();
        this.setUpUI();
        gGameState = states.kSTATE_MENU;
        this.removeAllListeners();
        this.events.on('gameover', this.gameover, this);
        this.events.on('setscore', this.setScore, this);
        this.events.on('setscorefloat', this.setScoreFloat, this);
        // IMPORTANT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // THIS IS CALLED FROM THE FIREFOX UI WHEN A USER CLICKS "EXIT"
        emitter.on('fullscreen', this.action_btnFullscreen, this);
        // var txt = [
        //     "window innerHeight: " + window.innerHeight + " ",
        //     "window innerWidth: " + window.innerWidth + " ",
        //     "document.referrer: " + document.referrer + " ",
        //     "document.fullscreenEnabled: " + document.fullscreenEnabled + " ",
        //     "document.documentElement.clientHeight: " + document.documentElement.clientHeight + " ",
        //     "document.documentElement.clientWidth: " + document.documentElement.clientWidth + " ",
        // ];
    };
    MenuOverlay.prototype.removeAllListeners = function () {
        this.events.removeListener('gameover');
        this.events.removeListener('setscore');
        this.events.removeListener('setscorefloat');
        emitter.removeListener('fullscreen');
        emitter.removeListener('keyDown');
        emitter.removeListener('keyUp');
    };
    MenuOverlay.prototype.keydown = function (theKeyEvent) {
        if ((this.transitioning) || (AAFunctions.areButtonsBouncing())) {
            return;
        }
        if (gGameState != states.kSTATE_MENU) {
            if (theKeyEvent.key == "Backspace") {
                theKeyEvent.preventDefault();
            }
        }
        switch (theKeyEvent.key) {
            case "1": //help
            case "2": //moregames 
            case "3": //sound
            case "4": //settings
            case "5": //play
            case "#": //fullscreen
            case "8": //sponsor
                theKeyEvent.preventDefault();
                break;
        }
    };
    MenuOverlay.prototype.keyup = function (theKeyEvent) {
        if ((this.transitioning) || (AAFunctions.areButtonsBouncing())) {
            return;
        }
        var theKey = theKeyEvent.key;
        switch (gGameState) {
            case states.kSTATE_MENU:
            case states.kSTATE_GAMEOVER:
                this.checkMenuControls(theKey);
                break;
            case states.kSTATE_PLAYING:
                this.checkForPause(theKey);
                break;
            case states.kSTATE_PAUSED:
                this.checkPauseControls(theKey);
                this.checkForPause(theKey);
                break;
            case states.kSTATE_MOREGAMES:
            case states.kSTATE_SETTINGS:
            case states.kSTATE_HELP:
                this.checkHelpControls(theKey);
                break;
        }
        if (theKeyEvent.key == "SoftRight") {
            // this.action_sponsorButton("up");
            this.scene.get("SponsorOverlay").action_sponsorButton("up");
        }
        if (theKeyEvent.key == "Backspace") {
            switch (gGameState) {
                case states.kSTATE_MENU:
                    // if (theKeyEvent.key == "Backspace") {
                    AAKaiAnalytics.sendEvent("exitgame");
                    window.close();
                    // }
                    break;
                case states.kSTATE_GAMEOVER:
                case states.kSTATE_PLAYING:
                    this.showButton(this.c_btnHelp, this.buttonY, this.c_btnHelp.x);
                    this.resetByBackSpace();
                    theKeyEvent.preventDefault();
                    break;
            }
        }
        switch (theKeyEvent.key) {
            case "1": //help
            case "2": //moregames 
            case "3": //sound
            case "4": //settings
            case "5": //play
            case "#": //fullscreen
            case "8": //sponsor
                theKeyEvent.preventDefault();
                break;
        }
    };
    MenuOverlay.prototype.setUpAudio = function () {
        this.sfxButton = this.sound.add('button');
    };
    MenuOverlay.prototype.resetByBackSpace = function () {
        this.playBtnSnd();
        AAKaiAnalytics.sendEvent("quitgame");
        this.resetToMenu();
    };
    //Set the game to it's initial state by initializing all the variables
    MenuOverlay.prototype.reset = function () {
        AAKaiAnalytics.sendEvent("play");
        this.gameoverSprite.setVisible(false);
        this.hideAllButtons();
        if (this.pauseEnabled) {
            this.btnPause.setVisible(true);
        }
        var restartFromAd = false;
        this.scene.get("MenuScene").scene.start("GameScene", { restartFromAd: restartFromAd });
        this.scene.get("SponsorOverlay").hideBanner();
    };
    MenuOverlay.prototype.resetFromGame = function () {
        AAKaiAnalytics.sendEvent("back-paused");
        this.resetToMenu();
        this.scene.stop('GameScene');
    };
    MenuOverlay.prototype.resetFromHelpBackButton = function (_theScene) {
        if ((this.transitioning) || (AAFunctions.areButtonsBouncing())) {
            return;
        }
        this.playBtnSnd();
        gGameState = states.kSTATE_MENU;
        this.hideTopPlaySoundButtons(this.buttonY);
        this.hideTopRowOfButtons(this.buttonY2);
        this.btnHelp.setTexture('spriteAtlas', 'btnHelp.png');
        AAFunctions.tweenBounce(this, this.c_btnHelp);
        if (false == this.scoreText.visible) {
            this.scoreText.setVisible(true);
            this.highScoreText.setVisible(true);
        }
        this.scene.get("SponsorOverlay").showBanner();
        this.scene.get(_theScene).scene.start("MenuScene");
        AAKaiAnalytics.sendEvent("back-help");
    };
    MenuOverlay.prototype.resetToMenu = function () {
        if (this.transitioning) {
            return;
        }
        gGameState = states.kSTATE_MENU;
        //hide the game over sprite
        this.gameoverSprite.setVisible(false);
        AAFunctions.tweenBounce(this, this.c_btnHelp);
        this.btnHelp.setTexture('spriteAtlas', 'btnHelp.png');
        this.hideTopPlaySoundButtons(this.buttonY);
        this.hideTopRowOfButtons(this.buttonY2);
        if (this.pauseEnabled) {
            this.btnPause.setVisible(false);
            this.pauseImage.setVisible(false);
        }
        // this.btnPause.setVisible(false);
        this.scene.get("GameScene").scene.start("MenuScene");
        this.scene.get("SponsorOverlay").showBanner();
    };
    MenuOverlay.prototype.gameover = function () {
        gGameState = states.kSTATE_GAMEOVER;
        this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
        //Show the reset button
        this.showButtons(true);
        // Hide the pause button
        if (this.pauseEnabled) {
            this.btnPause.setVisible(false);
        }
        // show the gameover image
        // I don't need to store it since I'm just restarting the scene
        this.gameoverSprite.setVisible(true);
        AAFunctions.tweenBounce(this, this.gameoverSprite);
        this.singlePress = true;
        this.scene.get("SponsorOverlay").showBanner();
    };
    MenuOverlay.prototype.checkForPause = function (theKey) {
        if (this.pauseEnabled) {
            if (!this.areButtonsTweening()) {
                // if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
                if (theKey == "*") {
                    this.singlePress = true;
                    this.action_btnPause("up");
                }
            }
        }
    };
    // This check for the center button when the help scene is displayed
    // and then take you back home to the main menu;
    MenuOverlay.prototype.checkHelpControls = function (theKey) {
        if (theKey == "1") {
            switch (gGameState) {
                case states.kSTATE_HELP:
                    this.resetFromHelpBackButton("HelpScene");
                case states.kSTATE_MOREGAMES:
                    this.resetFromHelpBackButton("MoreGamesScene");
                    break;
                case states.kSTATE_SETTINGS:
                    this.resetFromHelpBackButton("SettingsScene");
                    break;
            }
            this.singlePress = true;
        }
        if (theKey == "*") {
            this.singlePress = true;
            this._SHOWFPS = !this._SHOWFPS;
            this.fpsText.visible = !this.fpsText.visible;
        }
    };
    MenuOverlay.prototype.checkPauseControls = function (theKey) {
        if (theKey == "1") {
            this.btnHelp.pointerUp(null);
        }
    };
    MenuOverlay.prototype.checkMenuControls = function (theKey) {
        if (gFullscreenAdShowing) {
            return;
        }
        ;
        switch (theKey) {
            case "8":
                this.visitSponsor();
                break;
            case "2":
                this.btnMoreGames.pointerUp(null);
                break;
            // case "SoftRight":
            case "3":
                this.btnSound.pointerUp(null);
                break;
            //case "SoftLeft":
            case "1":
                // if (gAdShowing == false) 
                this.btnHelp.pointerUp(null);
                // }
                break;
            case "4":
                if (kSHOW_SETTINGS_BUTTON) {
                    this.btnSettings.pointerUp(null);
                }
                break;
            case "Enter":
            case "5":
                this.btnPlay.pointerUp(null);
                break;
            case "#":
                if (kSHOW_FULLSCREEN_BUTTON) {
                    this.action_btnFullscreen("up");
                }
                break;
        }
    };
    MenuOverlay.prototype.checkGameOverMenuControls = function (theKey) {
        if (gGameState == states.kSTATE_GAMEOVER_DELAY) {
            return;
        }
        switch (theKey) {
            case "Enter":
            case "=":
                this.btnPlay.pointerUp(null);
                break;
            // case "SoftRight":
            case "3":
                this.btnSound.pointerUp(null);
                break;
            // case "SoftLeft":
            case "1":
                this.btnHelp.pointerUp(null);
                break;
        }
    };
    MenuOverlay.prototype.showButton = function (who, ly, lx) {
        var scaleSpeed = 150;
        // reset the scales of the button to 1.0 to avoid weird scaling issues
        who.scaleX = 1.0;
        who.scaleY = 1.0;
        var _y = ly;
        var _x = lx;
        var theEase = 'BounceInOut';
        var xthis = this;
        this.buttonTween = this.tweens.add({
            targets: who,
            y: { value: _y, duration: scaleSpeed, ease: theEase },
            x: { value: _x, duration: scaleSpeed, ease: theEase },
        });
    };
    // **************************************************************************
    // SET UP THE UI
    // **************************************************************************
    MenuOverlay.prototype.setUpUI = function () {
        var isVis = true;
        var numBadge;
        // Play Button #######################################################################
        this.btnPlay = new Button(this, 0, 0, 'spriteAtlas', 'btnPlay.png', this.action_BtnPlay, "play", true).setVisible(isVis);
        numBadge = this.add.image(0, -25, "spriteAtlas", "tag5.png").setVisible(isKaiOS);
        this.c_btnPlay = this.add.container(0, 0, [this.btnPlay, numBadge]).setVisible(isVis);
        // Sound Button #######################################################################
        var whichButton = 'btnSoundOff.png';
        if (AAPrefs.playAudio) {
            whichButton = 'btnSoundOn.png';
        }
        this.btnSound = new Button(this, 0, 5, 'spriteAtlas', whichButton, this.action_btnSound, "sound", true).setVisible(isVis);
        numBadge = this.add.image(0, -14, "spriteAtlas", "tag3.png").setVisible(isKaiOS);
        this.c_btnSound = this.add.container(this.cameras.main.width - 10, this.cameras.main.height - 10, [this.btnSound, numBadge]).setVisible(isVis);
        // Help/Back Button #######################################################################
        whichButton = 'btnHelp.png';
        this.btnHelp = new Button(this, 0, 5, 'spriteAtlas', whichButton, this.action_BtnHelpBack, "help", true).setVisible(true);
        numBadge = this.add.image(0, -14, "spriteAtlas", "tag1.png").setVisible(isKaiOS);
        this.c_btnHelp = this.add.container(15, this.cameras.main.height - 10, [this.btnHelp, numBadge]).setVisible(true);
        // Settings Button #######################################################################
        whichButton = 'btnSettings.png';
        this.btnSettings = new Button(this, 0, 5, 'spriteAtlas', whichButton, this.action_btnSettings, "settings", true).setVisible(true);
        numBadge = this.add.image(0, -14, "spriteAtlas", "tag4.png").setVisible(isKaiOS);
        this.c_btnSettings = this.add.container(15, this.cameras.main.height - 10, [this.btnSettings, numBadge]).setVisible(kSHOW_SETTINGS_BUTTON);
        // More Games Button #######################################################################
        this.btnMoreGames = new Button(this, 0, 0, 'spriteAtlas', 'btnMoreGames.png', this.action_btnMoreGames, "more", true).setVisible(isVis);
        numBadge = this.add.image(0, -20, "spriteAtlas", "tag2.png").setVisible(isKaiOS);
        this.c_btnMoreGames = this.add.container(0, 0, [this.btnMoreGames, numBadge]).setVisible(isVis);
        // Fullscreen Button #######################################################################
        this.btnFullscreen = new Button(this, 0, 5, 'spriteAtlas', 'btnFullscreenOn.png', this.action_btnFullscreen, "fullscreen", true).setVisible(isVis);
        numBadge = this.add.image(0, -14, "spriteAtlas", "tag#.png").setVisible(isKaiOS);
        this.c_btnFullScreen = this.add.container(this.cameras.main.width - 10, this.cameras.main.height - 10, [this.btnFullscreen, numBadge]).setVisible(kSHOW_FULLSCREEN_BUTTON);
        // Pause Button #######################################################################
        whichButton = 'btnPause.png';
        this.btnPause = new Button(this, this.cameras.main.width - 35, 20, 'spriteAtlas', whichButton, this.action_btnPause, "pause", true).setVisible(false);
        // // Sponsor Button #####################################################################
        // this.btnSponsor = new Button(this, this.sys.canvas.width - 60, this.sys.canvas.height, 'spriteAtlas', "sponsor.png", this.action_sponsorButton, "sponsor", true).setVisible(true).setOrigin(.5, 1);
        // DISPLAY BUTTONS #######################################################################
        // #######################################################################################
        // HELP -- PLAY -- SOUND
        this.buttonY = (this.cameras.main.height - 45);
        AAFunctions.displayButtons([this.c_btnHelp, this.c_btnPlay, this.c_btnSound], this.cameras.main, this.buttonY, 30);
        // SETTINGS -- MORE GAMES -- FULLSCREEN
        this.buttonY2 = (this.cameras.main.height - 105);
        AAFunctions.displayButtons([this.c_btnSettings, this.c_btnMoreGames, this.c_btnFullScreen], this.cameras.main, this.buttonY2, 10);
        this.buttons = [
            this.c_btnSettings, this.c_btnMoreGames, this.c_btnFullScreen,
            this.c_btnHelp, this.c_btnPlay, this.c_btnSound
        ];
        // Pause Graphic #######################################################################
        this.createPauseGrc();
        // GameOver Sprite #######################################################################
        this.gameoverSprite = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2.5, 'spriteAtlas', 'gameover.png').setVisible(false);
        // Number Font #######################################################################
        this.makeTheNumbersFont();
        // Score Text #######################################################################
        var scoreSize = 15 * 1.5;
        this.scoreText = this.add.bitmapText(9, 6, 'numbersFont', '0', scoreSize).setDepth(999);
        this.scoreText.setOrigin(0);
        this.scoreText.setTint(0xffffff);
        // this.scoreText.scaleX = .5;
        // this.scoreText.scaleY = .5;
        // HighScore Text #######################################################################
        scoreSize = 8 * 1.5;
        this.highScoreText = this.add.bitmapText(12, 25 * 1.5, 'numbersFont', AAHighScores.highScore, scoreSize).setDepth(999);
        this.highScoreText.setOrigin(0);
        // this.highScoreText.setTint(0xcccccc);
        // this.highScoreText.scaleX = .5;
        // t5his.highScoreText.scaleY = .5;
        // FPS TEXT #######################################################################
        this.fpsText = this.add.bitmapText(9, 80, 'numbersFont', '0.0', 15).setVisible(false);
        this.fpsText.setTint(0x666666);
        // this.debugInfo = this.add.bitmapText(10, 130, 'numbersFont', '0', scoreSize).setDepth(999);
        var element = this.add.dom(10, 90).createFromCache('newgameHTML').setOrigin(0, 0);
    };
    MenuOverlay.prototype.makeTheNumbersFont = function () {
        var config = {
            image: 'numbersFont',
            width: 40,
            height: 40,
            offset: { x: 0 },
            chars: '0123456789.',
            charsPerRow: 11
        };
        // I have to put the <any> here because the typescript defs have an error
        // somewhere that won't let me use the param unless I add <any>
        var it = Phaser.GameObjects.RetroFont.Parse(this, config);
        this.cache.bitmapFont.add('numbersFont', it);
    };
    MenuOverlay.prototype.playBtnSnd = function () {
        if (AAPrefs.playAudio == true)
            this.sfxButton.play();
    };
    MenuOverlay.prototype.showButtons = function (isGameOver) {
        if (!this.areButtonsTweening()) {
            if (isGameOver) {
                this.showButton(this.c_btnSound, this.buttonY, this.c_btnSound.x);
                this.showButton(this.c_btnHelp, this.buttonY, this.c_btnHelp.x);
            }
            this.showButton(this.c_btnPlay, this.buttonY, this.c_btnPlay.x);
            // Hilight and select the button to make the keyboard work
            //this.btnPlay.select(false);
        }
    };
    MenuOverlay.prototype.areButtonsTweening = function () {
        var isATweeing = false;
        if (this.buttonTween != null) {
            isATweeing = this.buttonTween.isPlaying();
        }
        if (gTween != null) {
            isATweeing = gTween.isPlaying();
        }
        return isATweeing;
    };
    MenuOverlay.prototype.hideAllButtons = function () {
        if (!this.areButtonsTweening()) {
            var where = this.sys.game.canvas.height + 150;
            this.hideTopPlaySoundButtons(this.buttonY + where);
            this.showButton(this.c_btnHelp, this.buttonY + where, this.c_btnHelp.x);
            this.hideTopRowOfButtons(this.buttonY2 + where);
        }
    };
    // I some times won't need with either full screen or the settings button.
    // ALWAYS show HELP - PLAY - SOUND - MOREGAMES
    MenuOverlay.prototype.buttonSetVisible = function (who, how) {
        switch (who) {
            case 'settings':
                this.c_btnSettings.setVisible(how);
                break;
            case "fullscreen":
                this.c_btnFullScreen.setVisible(how);
            default:
                break;
        }
    };
    MenuOverlay.prototype.update = function (time, delta) {
        if (this._SHOWFPS) {
            this.fpsText.setText('FPS: ' + (1000 / delta).toFixed(1));
        }
        if (!isKaiOS) {
            var left = Phaser.Input.Keyboard.JustDown(AAControls.AKey) || Phaser.Input.Keyboard.JustDown(AAControls.cursors.left);
            var right = Phaser.Input.Keyboard.JustDown(AAControls.DKey) || Phaser.Input.Keyboard.JustDown(AAControls.cursors.right);
            var up = Phaser.Input.Keyboard.JustDown(AAControls.WKey) || Phaser.Input.Keyboard.JustDown(AAControls.cursors.up);
            var down = Phaser.Input.Keyboard.JustDown(AAControls.SKey) || Phaser.Input.Keyboard.JustDown(AAControls.cursors.down);
            if (right) {
                this.navigateDirectionToButton(1);
                AAControls.right = 0;
            }
            else if (left) {
                this.navigateDirectionToButton(-1);
                AAControls.left = 0;
            }
            if (down) {
                this.navigateDirectionToButton(3);
                AAControls.right = 0;
            }
            else if (up) {
                this.navigateDirectionToButton(-3);
                AAControls.left = 0;
            }
            var click = Phaser.Input.Keyboard.JustDown(AAControls.spacebar) || Phaser.Input.Keyboard.JustDown(AAControls.returnKey);
            if (click) {
                this.buttons[this.currentActiveButton].first.pointerUp(null);
            }
        }
        // if (this.debugInfo) {
        //     this.debugInfo.setText([
        //         'GameData.rockcount: ' + GameData.rockCount
        //         this.bigRocks
        //     ]);
        //     // this.debugText.text = gGameState.toString();
        // }
    };
    MenuOverlay.prototype.navigateDirectionToButton = function (dir) {
        var nextButton = Phaser.Math.Clamp(this.currentActiveButton + dir, 0, this.buttons.length - 1);
        if (this.buttons[nextButton].visible == false) {
            nextButton += dir;
        }
        nextButton = Phaser.Math.Clamp(nextButton, 0, this.buttons.length - 1);
        if (this.buttons[nextButton].visible == true) {
            this.buttons[this.currentActiveButton].first.deselect();
            this.buttons[nextButton].first.select(true);
            this.currentActiveButton = nextButton;
        }
    };
    MenuOverlay.prototype.setScore = function (data) {
        var thescore = data[0];
        this.displayScore(thescore);
    };
    MenuOverlay.prototype.setScoreFloat = function (data) {
        var thescore = data[0].toFixed(2);
        this.displayScore(thescore);
    };
    MenuOverlay.prototype.displayScore = function (thescore) {
        this.scoreText.text = thescore.toString();
        if (thescore >= AAHighScores.highScore) {
            this.highScoreText.text = this.scoreText.text;
            AAHighScores.saveScoreToLocalStorage(thescore);
        }
    };
    MenuOverlay.prototype.visitSponsor = function () {
        if (kUSESPONSOR) {
            // AAKaiAnalytics.sendSponsorEvent();
            // let txt = this.cache.text.get('sponsorURL');
            // // console.log(txt);
            // //window.location.href = txt;
            // window.open(
            //     txt,
            //     '_blank' //open in a new window.
            // );
            AAKaiAds.theBannerAd.call('click');
        }
    };
    MenuOverlay.prototype.createPauseGrc = function () {
        var graphics = this.add.graphics();
        graphics.beginPath();
        graphics.moveTo(0, 160);
        graphics.lineTo(this.sys.canvas.width, 160);
        graphics.lineTo(this.sys.canvas.width, 240);
        graphics.lineTo(0, 240);
        graphics.closePath();
        graphics.strokePath();
        graphics.fillStyle(0xff0000, .75);
        graphics.fill();
        // =======================================================
        var graphics2 = this.add.graphics();
        var startx = this.sys.canvas.width / 2 - 30;
        var starty = 170;
        var pHeight = 60;
        graphics2.moveTo(startx, starty);
        graphics2.lineTo(startx + 20, starty);
        graphics2.lineTo(startx + 20, starty + pHeight);
        graphics2.lineTo(startx, starty + pHeight);
        graphics2.closePath();
        graphics2.strokePath();
        graphics2.fillStyle(0xFFFFFF, 1);
        graphics2.fill();
        // =======================================================
        var graphics3 = this.add.graphics();
        startx = this.sys.canvas.width / 2 + 10;
        graphics3.moveTo(startx, starty);
        graphics3.lineTo(startx + 20, starty);
        graphics3.lineTo(startx + 20, starty + pHeight);
        graphics3.lineTo(startx, starty + pHeight);
        graphics3.closePath();
        graphics3.strokePath();
        graphics3.fillStyle(0xFFFFFF, 1);
        graphics3.fill();
        this.pauseImage = this.add.container(0, 0, [graphics, graphics2, graphics3]).setVisible(false);
    };
    MenuOverlay.prototype.disablePause = function () {
        this.pauseEnabled = false;
        this.btnPause.setVisible(false);
    };
    MenuOverlay.prototype.hideTopPlaySoundButtons = function (_y) {
        this.showButton(this.c_btnSound, _y, this.c_btnSound.x);
        this.showButton(this.c_btnPlay, _y, this.c_btnPlay.x);
    };
    MenuOverlay.prototype.hideTopRowOfButtons = function (_y) {
        this.showButton(this.c_btnSettings, _y, this.c_btnSettings.x);
        this.showButton(this.c_btnMoreGames, _y, this.c_btnMoreGames.x);
        this.showButton(this.c_btnFullScreen, _y, this.c_btnFullScreen.x);
    };
    // **************************************************************************
    // **************************************************************************
    // **************************************************************************
    // Button CALLBACKS
    // **************************************************************************
    MenuOverlay.prototype.action_BtnPlay = function (state) {
        if (this.areButtonsTweening()) {
            return;
        }
        if (state == 'up') {
            this.playBtnSnd();
            switch (gGameState) {
                case states.kSTATE_PAUSED:
                    this.resetFromGame();
                    break;
                case states.kSTATE_GAMEOVER:
                    this.reset();
                    break;
                case states.kSTATE_HELP:
                    this.resetFromHelpBackButton("HelpScene");
                    break;
                case states.kSTATE_MENU:
                    this.reset();
                    break;
                default:
                    this.reset();
                    break;
            }
        }
    };
    MenuOverlay.prototype.action_btnSound = function (_state) {
        if (this.areButtonsTweening()) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();
            AAPrefs.toggleAudio();
            if (AAPrefs.playAudio == true) {
                // If we playAudio we flip the frame of the button to show the ON state when up and the OFF state when pressed         
                this.btnSound.setFrames('btnSoundOn.png', 'btnSoundOff.png', 'btnSoundOn.png');
                AAKaiAnalytics.sendEvent("soundOn");
            }
            else {
                // This will display the the OFF state when up and the ON state when pressed
                this.btnSound.setFrames('btnSoundOff.png', 'btnSoundOn.png', 'btnSoundOff.png'); //, 'btn_sound_off.png');
                AAKaiAnalytics.sendEvent("soundOff");
            }
            AAFunctions.tweenBounce(this, this.c_btnSound);
        }
    };
    MenuOverlay.prototype.action_btnPause = function (_state) {
        if (this.areButtonsTweening()) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();
            if (gGameState == states.kSTATE_PLAYING) {
                this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                gGameState = states.kSTATE_PAUSED;
                this.showButton(this.c_btnHelp, this.buttonY, this.c_btnHelp.x);
                this.showButton(this.c_btnSound, this.buttonY, this.c_btnSound.x);
                this.pauseImage.setVisible(true);
                AAFunctions.tweenBounce(this, this.pauseImage);
                this.scene.get("SponsorOverlay").showBanner();
                game.scene.pause("GameScene");
                AAKaiAnalytics.sendEvent("pause");
            }
            else if (gGameState == states.kSTATE_PAUSED) {
                gGameState = states.kSTATE_PLAYING;
                this.showButton(this.c_btnHelp, this.buttonY + this.kHideDistance, this.c_btnHelp.x);
                this.showButton(this.c_btnSound, this.buttonY + this.kHideDistance, this.c_btnSound.x);
                this.pauseImage.setVisible(false);
                this.scene.get("SponsorOverlay").hideBanner();
                game.scene.resume("GameScene");
                AAKaiAnalytics.sendEvent("resume");
            }
        }
    };
    MenuOverlay.prototype.action_BtnHelpBack = function (_state) {
        if (this.areButtonsTweening()) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();
            // Just make sure that the gameover sprite is hidden in case this is called from a gameover()
            //  It's just easier this way.
            this.gameoverSprite.setVisible(false);
            switch (gGameState) {
                case states.kSTATE_MENU:
                    this.scene.get("MenuScene").scene.start("HelpScene");
                    gGameState = states.kSTATE_HELP;
                    this.hideTopPlaySoundButtons(this.buttonY + this.kHideDistance);
                    this.hideTopRowOfButtons(this.buttonY2 + this.kHideDistance);
                    this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                    this.scene.get("SponsorOverlay").hideBanner();
                    AAFunctions.tweenBounce(this, this.c_btnHelp);
                    AAKaiAnalytics.sendEvent("help");
                    break;
                case states.kSTATE_GAMEOVER:
                    this.btnHelp.setTexture('spriteAtlas', 'btnHelp.png');
                    AAFunctions.tweenBounce(this, this.c_btnPlay);
                    AAFunctions.tweenBounce(this, this.c_btnHelp);
                    this.hideTopRowOfButtons(this.buttonY2);
                    this.scene.get("GameScene").scene.start("MenuScene");
                    gGameState = states.kSTATE_MENU;
                    AAKaiAnalytics.sendEvent("back-gameover");
                    break;
                case states.kSTATE_MOREGAMES:
                    this.resetFromHelpBackButton("MoreGamesScene");
                    break;
                case states.kSTATE_SETTINGS:
                    this.resetFromHelpBackButton("SettingsScene");
                    break;
                case states.kSTATE_PAUSED:
                case states.kSTATE_HELP:
                    this.action_BtnPlay("up");
                    break;
            }
            this.scene.bringToTop();
        }
    };
    MenuOverlay.prototype.action_btnFullscreen = function (_state) {
        if (kSHOW_FULLSCREEN_BUTTON) {
            if (gGameState == states.kSTATE_MENU) {
                if (_state == 'up') {
                    this.playBtnSnd();
                    if (this.scale.isFullscreen) {
                        this.btnFullscreen.setTexture('spriteAtlas', 'btnFullscreenOn.png');
                        this.scale.stopFullscreen();
                    }
                    else {
                        this.btnFullscreen.setTexture('spriteAtlas', 'btnFullscreenOff.png');
                        this.scale.startFullscreen();
                    }
                }
            }
        }
    };
    MenuOverlay.prototype.action_btnSettings = function (_state) {
        if (gGameState == states.kSTATE_MENU) {
            if (_state == 'up') {
                this.playBtnSnd();
                this.scene.get("MenuScene").scene.start("SettingsScene");
                gGameState = states.kSTATE_SETTINGS;
                this.hideTopPlaySoundButtons(this.buttonY + this.kHideDistance);
                this.hideTopRowOfButtons(this.buttonY2 + this.kHideDistance);
                this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                this.scene.get("SponsorOverlay").hideBanner();
                AAFunctions.tweenBounce(this, this.c_btnHelp);
                AAKaiAnalytics.sendEvent("settings");
            }
        }
    };
    MenuOverlay.prototype.action_btnMoreGames = function (_state) {
        if (gGameState == states.kSTATE_MENU) {
            if (_state == 'up') {
                this.playBtnSnd();
                this.scene.get("MenuScene").scene.start("MoreGamesScene");
                gGameState = states.kSTATE_MOREGAMES;
                this.hideTopPlaySoundButtons(this.buttonY + this.kHideDistance);
                this.hideTopRowOfButtons(this.buttonY2 + this.kHideDistance);
                this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                this.scene.get("SponsorOverlay").hideBanner();
                AAFunctions.tweenBounce(this, this.c_btnHelp);
                AAKaiAnalytics.sendEvent("moregames");
            }
        }
    };
    return MenuOverlay;
}(Phaser.Scene)); //end scene
var MenuScene = /** @class */ (function (_super) {
    __extends(MenuScene, _super);
    function MenuScene() {
        return _super.call(this, { key: 'MenuScene' }) || this;
    }
    MenuScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor(0x000000);
        gGameState = states.kSTATE_MENU;
    };
    MenuScene.prototype.create = function () {
        this.scene.sendToBack();
        var element = this.add.dom(10, 140).createFromCache('newgameHTML').setOrigin(0, 0);
        this.add.text(12, this.sys.canvas.height - 17, gGameVersion);
    };
    return MenuScene;
}(Phaser.Scene));
var HelpScene = /** @class */ (function (_super) {
    __extends(HelpScene, _super);
    function HelpScene() {
        return _super.call(this, { key: 'HelpScene' }) || this;
    }
    HelpScene.prototype.preload = function () {
    };
    HelpScene.prototype.create = function () {
        gGameState = states.kSTATE_HELP;
        var mo = this.scene.get('MenuOverlay');
        mo.scoreText.setVisible(false);
        mo.highScoreText.setVisible(false);
        this.add.image(0, 0, 'spriteAtlas', 'help_en.png').setOrigin(0, 0);
    };
    return HelpScene;
}(Phaser.Scene));
var SponsorOverlay = /** @class */ (function (_super) {
    __extends(SponsorOverlay, _super);
    function SponsorOverlay() {
        var _this = _super.call(this, { key: 'SponsorOverlay' }) || this;
        _this.bottomPos = kBOTTOM_POSITION_FOR_AD * gRetinaOffset;
        return _this;
    }
    SponsorOverlay.prototype.preload = function () {
    };
    SponsorOverlay.prototype.create = function () {
        if (kUSESPONSOR == false) {
            return;
        }
        this.events.removeListener('hideAd');
        this.events.removeListener('showAd');
        emitter.on('hideAd', this.hideBanner, this);
        emitter.on('showAd', this.showBanner, this);
        this.domad = document.getElementById('sponsorad');
        this.sponsorTag = document.getElementsByClassName('tagNum')[0];
        ///////////////////////////////////////////////////
        var adFrame = this.add.image(0, 0, 'sponsor');
        adFrame.setOrigin(0, 0);
        // NOTE: 3/30/20
        // commented out the sponsor code to play with KaiAds
        // commented out setInteractive() and pointerUp
        this.btn = this.add.image(this.sys.canvas.width - 50, this.bottomPos, "spriteAtlas", "tag8.png").setVisible(false); //isKaiOS);
        this.adContainer = this.add.container(0, -this.bottomPos, [adFrame, this.btn]).setVisible(true).setVisible(false);
        ;
        // adFrame.setInteractive();
        // let xthis = this;
        // adFrame.on('pointerup', function (pointer) {
        //     (<MenuOverlay>xthis.scene.get("MenuOverlay")).visitSponsor();
        // });
        this.startyScore = this.scene.get("MenuOverlay").scoreText.y;
        this.startyHighScore = this.scene.get("MenuOverlay").highScoreText.y;
        // Sponsor Button #####################################################################
        this.btnSponsor = new Button(this, this.sys.canvas.width - 60 * gRetinaOffset, this.sys.canvas.height + 60, 'spriteAtlas', "sponsor.png", this.action_sponsorButton, "sponsor", true).setVisible(true).setOrigin(.5, 1).setVisible(isKaiOS);
        if (gRunnngInBrowser) {
            this.btnSponsor.setVisible(false);
        }
        // this.showBanner();
        this.scene.bringToTop();
        if (!isKaiOS) {
            this.showBanner();
        }
    };
    SponsorOverlay.prototype.hideBanner = function () {
        // this.adContainer.setVisible(false);
        if (kUSESPONSOR == false) {
            return;
        }
        //works
        //this.domad.style.visibility = "hidden";
        this.tweens.add({
            targets: [this.adContainer, this.btn],
            y: -110,
            ease: 'Sine.easeIn',
            onUpdate: function () {
                this.domad.style.top = this.adContainer.y + "px";
            },
            callbackScope: this,
            duration: 250
        });
        if (isKaiOS) {
            this.sponsorTag.style.visibility = "visible";
        }
        gTween = this.tweens.add({
            targets: this.btnSponsor,
            y: this.sys.game.canvas.height + 60,
            ease: 'Sine.easeIn',
            duration: 250
        });
        this.tweens.add({
            targets: this.scene.get("MenuOverlay").scoreText,
            y: this.startyScore,
            ease: 'Sine.easeIn',
            duration: 250
        });
        gTween = this.tweens.add({
            targets: this.scene.get("MenuOverlay").highScoreText,
            y: this.startyHighScore,
            ease: 'Sine.easeIn',
            duration: 250
        });
    };
    SponsorOverlay.prototype.showBanner = function () {
        this.scene.bringToTop();
        //works
        //this.domad.style.visibility = "visible";
        // if (gAdShowingBanner) {
        //     if (isKaiOS) {
        //         this.sponsorTag.style.visibility = "visible";
        //     }
        // } else {
        //     return;
        // }
        if (isKaiOS) {
            this.sponsorTag.style.visibility = "visible";
        }
        switch (true) {
            case (gGameState == states.kSTATE_PLAYING):
            case (gGameState == states.kSTATE_SETTINGS):
            case (gGameState == states.kSTATE_HELP):
            case (gGameState == states.kSTATE_MOREGAMES):
                return;
                break;
            default:
                break;
        }
        // if (gGameState == states.kSTATE_PLAYING) {
        //     return;
        // }
        // if (gGameState == states.kSTATE_SETTINGS) {
        //     return;
        // }
        // if (gGameState == states.kSTATE_HELP) {
        //     return;
        // }
        // if (gGameState == states.kSTATE_MOREGAMES) {
        //     return;
        // }
        if (kUSESPONSOR == false) {
            return;
        }
        if (gAdShowingBanner == false) {
            return;
        }
        // let newX = (window.innerWidth /2)-120 ; //150; 150 is for non kaios
        // this.domad.style.left = newX + "px";
        // this.adContainer.setVisible(true);
        this.tweens.add({
            targets: [this.adContainer, this.btn],
            y: 0,
            ease: 'Sine.easeOut',
            onUpdate: function () {
                this.domad.style.top = this.adContainer.y + "px";
            },
            callbackScope: this,
            duration: 500
        });
        this.tweens.add({
            targets: this.btn,
            y: this.bottomPos,
            ease: 'Sine.easeOut',
            duration: 500
        });
        gTween = this.tweens.add({
            targets: this.btnSponsor,
            y: this.sys.game.canvas.height,
            ease: 'Sine.easeOut',
            duration: 250
        });
        this.tweens.add({
            targets: this.scene.get("MenuOverlay").scoreText,
            y: this.startyScore + (this.bottomPos),
            ease: 'Sine.easeOut',
            duration: 500
        });
        gTween = this.tweens.add({
            targets: this.scene.get("MenuOverlay").highScoreText,
            y: this.startyHighScore + (this.bottomPos),
            ease: 'Sine.easeOut',
            duration: 500
        });
    };
    SponsorOverlay.prototype.action_sponsorButton = function (_state) {
        if (_state == 'up') {
            if (!gFullscreenAdShowing) {
                //this.playBtnSnd();
                // AAKaiAds.theBannerAd.call('click');
            }
        }
    };
    return SponsorOverlay;
}(Phaser.Scene));
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, { key: 'GameScene' }) || this;
        _this.jumps = 0; //track ad launch
        _this.poop = 0;
        return _this;
    }
    GameScene.prototype.preload = function () {
    };
    GameScene.prototype.create = function () {
        // Launch the menu scene
        //this.scene.launch("MenuOverlay");
        // this.setUpSprites();
        // this.setUpPhysics(); //if needed
        // The game starts in menu mode
        // gGameState = gGameState = states.kSTATE_MENU;
        // this.removeAllListeners();
        // this.events.on('startgame', this.startGame, this);
        this.scene.bringToTop("MenuOverlay");
        this.startGame();
    };
    // removeAllListeners() {
    //     this.events.removeListener('startgame');
    // }
    // This gets called from the menu scene when the play button is clicked
    // Init all my game data here.
    GameScene.prototype.startGame = function () {
        //I have to kill the KaiAd object because it causes stutter.
        gGameState = states.kSTATE_PLAYING;
        this.poop = 0;
        // this.add.image(this.sys.canvas.width/2,this.sys.canvas.height/2,"spriteAtlas","btnPause.png")
    };
    GameScene.prototype.update = function (time, delta) {
        switch (gGameState) {
            case states.kSTATE_PLAYING:
                this.poop = this.poop + 10;
                this.scene.get('MenuOverlay').events.emit('setscore', [this.poop]);
                if (this.poop >= 1545) {
                    gGameState = states.kSTATE_GAMEOVER;
                    this.gameover();
                }
                break;
        }
    };
    GameScene.prototype.gameover = function () {
        AAKaiAnalytics.sendEvent("gameover");
        gGameState = states.kSTATE_GAMEOVER;
        // show the game over button layout.
        this.scene.get('MenuOverlay').events.emit('gameover');
        // if (AAPrefs.playAudio == true)
        //     this.sfxEndGame.play();
        window.navigator.vibrate(300);
        this.cameras.main.shake(150);
        if (++this.jumps % 3 == 0) {
            // Display Fullscreen!
            AAKaiAds.displayFullscreenAd();
            AAKaiAds.preLoadFullscreenAd();
        }
    };
    GameScene.prototype.setUpSprites = function () {
    };
    GameScene.prototype.setUpAudio = function () {
    };
    GameScene.prototype.setUpUI = function () {
    };
    return GameScene;
}(Phaser.Scene));
var AAFunctions;
(function (AAFunctions) {
    // High Score Variables ===========================================================
    // ================================================================================
    // let highScoreObject = { player: "empty", score: 0 };
    // let highScoreList = [];
    // let maxHighScoreCount = 5;
    var bouncing = false;
    function logEvent(theEvent) {
        var textData = 'logEvent:' + theEvent;
        window.webkit.messageHandlers.observe.postMessage(textData);
    }
    AAFunctions.logEvent = logEvent;
    function fade(theScene, dir, length, callback, delayTime) {
        if (delayTime === void 0) { delayTime = 0; }
        var fadeRect;
        fadeRect = theScene.add.graphics();
        fadeRect.fillStyle(0x000000, 1);
        fadeRect.fillRect(0, 0, theScene.cameras.main.width, theScene.cameras.main.height);
        fadeRect.setDepth(9999);
        var fadeto = 1;
        fadeRect.alpha = 0;
        if (dir == 'in') {
            fadeto = 0;
            fadeRect.alpha = 1;
        }
        //delayTime = (delayTime == undefined) ? 0 : delayTime;
        theScene.tweens.add({
            targets: fadeRect,
            alpha: fadeto,
            duration: length,
            ease: 'Power.easeIn',
            delay: delayTime,
            onComplete: function (twn, targets, thisScene) {
                // targets[0].destroy();
                if (callback) {
                    theScene.time.delayedCall(250, function () { callback.call(theScene, callback); }, [], this);
                }
            }
        });
    }
    AAFunctions.fade = fade;
    function chanceRoll(chance) {
        if (chance === undefined) {
            chance = 50;
        }
        return chance > 0 && (Math.random() * 100 <= chance);
    }
    AAFunctions.chanceRoll = chanceRoll;
    function displayButtons(_buttons, _camera, _ypos, _spacer) {
        var spacer = _spacer;
        var totalButtonLength = _buttons.length; // + spacer;
        var stp = (_camera.width / _buttons.length); // + spacer;
        var startx = (stp / 2) - (spacer / 3);
        Phaser.Actions.GridAlign(_buttons, {
            width: totalButtonLength,
            height: 1,
            cellWidth: stp + _spacer / _buttons.length,
            // cellHeight: 50,
            x: startx,
            y: _ypos,
            position: Phaser.Display.Align.CENTER
        });
    }
    AAFunctions.displayButtons = displayButtons;
    var bounceTween;
    function areButtonsBouncing() {
        return bouncing;
        // if (this.bounceTween != null) {
        //     return this.bounceTween.isPlaying();
        // }
    }
    AAFunctions.areButtonsBouncing = areButtonsBouncing;
    function tweenBounce(theScene, who) {
        // if (this.game.device.desktop) {
        var scaleSpeed = 140;
        var scaleSize = 2.1;
        who.scaleX = scaleSize;
        who.scaleY = scaleSize;
        var xthis = this;
        this.bouncing = true;
        this.bounceTween = theScene.tweens.add({
            targets: who,
            scaleX: { value: 1, duration: 200, delay: 50 },
            scaleY: { value: 1, duration: 200 },
            ease: "Bounce.easeOut",
            onComplete: function () {
                xthis.bouncing = false;
            }
        });
    }
    AAFunctions.tweenBounce = tweenBounce;
})(AAFunctions || (AAFunctions = {})); //end class
var AAPrefs;
(function (AAPrefs) {
    var prefsPlayAudio;
    var prefsPlayMusic;
    AAPrefs.playAudio = false;
    AAPrefs.playMusic = false;
    function initGamePrefs(_gameName) {
        this.prefsPlayAudio = 'games.taara.' + _gameName + '.playAudio';
        this.prefsPlayMusic = 'games.taara.' + _gameName + '.playMusic';
        this.prefsHighScore = 'games.taara.' + _gameName + '.highScore';
        this.leaderboardFile = 'games.taara.' + _gameName + '.leaderboard5';
        this.gameName = _gameName;
        this.getAudioPref();
        this.getMusicPref();
    }
    AAPrefs.initGamePrefs = initGamePrefs;
    function getAudioPref() {
        // get the local saved info
        var scr = localStorage.getItem(this.prefsPlayAudio);
        // if it doens't exsist we assume true to start and save it for next time wee need to check
        if (scr == undefined) {
            localStorage.setItem(this.prefsPlayAudio, "1"); //save it
            this.playAudio = true; //set class variable
        }
        else {
            // If scr == 1 then set playAudio to true otherwise false
            this.playAudio = (scr.valueOf() == "1") ? true : false;
        }
    }
    AAPrefs.getAudioPref = getAudioPref;
    // This gets the currectly saved playAudio prefs
    function getMusicPref() {
        // get the local saved info
        var scr = localStorage.getItem(this.prefsPlayMusic);
        // if it doens't exsist we assume true to start and save it for next time wee need to check
        if (scr == undefined) {
            localStorage.setItem(this.prefsPlayMusic, "1"); //save it
            this.playMusic = true; //set class variable
        }
        else {
            // If scr == 1 then set playAudio to true otherwise false
            this.playMusic = (scr.valueOf() == "1") ? true : false;
        }
    }
    AAPrefs.getMusicPref = getMusicPref;
    function toggleAudio() {
        if (this.playAudio == true) {
            this.playAudio = false;
            localStorage.setItem(this.prefsPlayAudio, "0");
        }
        else {
            this.playAudio = true;
            localStorage.setItem(this.prefsPlayAudio, "1");
        }
    }
    AAPrefs.toggleAudio = toggleAudio;
})(AAPrefs || (AAPrefs = {}));
var aakaiads_ready = false;
var gFullscreenAdShowing = false;
var gAdShowingBanner = false;
var AAKaiAds;
(function (AAKaiAds) {
    // display ad when app is loaded
    AAKaiAds.err = 0;
    // export function getFullscreenAd() {
    //     getKaiAd({
    //         publisher: '60580691-026e-426e-8dac-a3b92289a352',
    //         app: gGameName,
    //         test: kTESTMODE,
    //         onerror: err => console.error('Custom catch:', err),
    //         onready: ad => {
    //             // Ad is ready to be displayed
    //             // calling 'display' will display the ad
    //             ad.call('display')
    //         }
    //     })
    // }
    function preLoadFullscreenAd() {
        if (!isKaiOS) {
            return;
        }
        var _this = this;
        // start off without an error
        this.err = 0;
        if (getKaiAd) {
            // display ad
            getKaiAd({
                publisher: '60580691-026e-426e-8dac-a3b92289a352',
                app: gGameName,
                test: kTESTMODE,
                timeout: 1000 * 90,
                /* error codes */
                /* https://www.kaiads.com/publishers/sdk.html#error */
                onerror: function (err) {
                    _this.err = err;
                    // console.warn("kaiads error: %d", err);
                    gFullscreenAdShowing = false;
                },
                onready: function (ad) {
                    _this.theAdFullscreen = ad;
                    // console.warn("kaiads onready: " + ad);
                    // ad.call('display');
                    ad.on('close', function () {
                        gFullscreenAdShowing = false;
                        // setTimeout(function () {
                        //     // ad.call('display');
                        //     gFullscreenAdShowing = false;
                        // }, 500); /* delayed to avoid button click on current scene */
                    });
                    // Kept here for reference ------------------------------------
                    ad.on('click', function () {
                        AAKaiAnalytics.sendSpecial("kaiads_fullscreen", "click");
                    });
                    ad.on('display', function () {
                        gFullscreenAdShowing = true;
                        // document.getElementById('kaiosad').style.visibility = "hidden";
                        // if (isKaiOS) {
                        //     document.getElementById('tag').style.visibility = "hidden";
                        // }
                        AAKaiAnalytics.sendSpecial("kaiads_fullscreen", "display");
                    });
                    // _this)
                }
            });
        }
    }
    AAKaiAds.preLoadFullscreenAd = preLoadFullscreenAd;
    function killFullscreenAd() {
        if (!isKaiOS) {
            return;
        }
        this.theAdFullscreen = null;
    }
    AAKaiAds.killFullscreenAd = killFullscreenAd;
    function getError() {
        if (!isKaiOS) {
            return;
        }
        var error = 0;
        // If the add was never inited or unable to get called I have my own error code
        // Otherwise I return 0 or the error returned by the KaiAds sdk.
        if ((this.theAdFullscreen == null) || (this.theAdFullscreen == undefined)) {
            error = -1;
        }
        else {
            // errors are positive numbers in the sdk.  
            // so anything greater than zero is an error
            if (this.err > 0) {
                error = this.err;
            }
        }
        return error;
    }
    AAKaiAds.getError = getError;
    function clickActiveAd() {
        if (gFullscreenAdShowing == false) {
            //     this.theAdFullscreen.call('click');
            // }else{
            this.theBannerAd.call('click');
        }
    }
    AAKaiAds.clickActiveAd = clickActiveAd;
    function clickAd() {
        if (!isKaiOS) {
            return;
        }
        this.theAdFullscreen.call('click');
    }
    AAKaiAds.clickAd = clickAd;
    function displayBannerAd() {
        //kaisponsor
        if (!isKaiOS) {
            return;
        }
    }
    AAKaiAds.displayBannerAd = displayBannerAd;
    function displayFullscreenAd() {
        if (!isKaiOS) {
            return;
        }
        // If the ad isn't ready theAd will be undefinded 
        // so I need to check to make sure it's valid
        if (this.theAdFullscreen) {
            if (this.err == 0) { // continue only if there isn't an error
                // gFullscreenAdShowing = true;
                this.theAdFullscreen.call('display');
            }
        }
    }
    AAKaiAds.displayFullscreenAd = displayFullscreenAd;
    // BANNER ADS
    function preLoadBannerAd() {
        if (!isKaiOS) {
            return;
        }
        var _this = this;
        // start off without an error
        this.err = 0;
        if (getKaiAd) {
            // display ad
            getKaiAd({
                publisher: '60580691-026e-426e-8dac-a3b92289a352',
                app: gGameName,
                test: kTESTMODE,
                timeout: 1000 * 90,
                // 36 or 54 height
                //36 ALWAYS tiems out and displays 23 in green
                h: 36,
                w: 216,
                container: document.getElementById('sponsorad'),
                /* error codes */
                /* https://www.kaiads.com/publishers/sdk.html#error */
                onerror: function (err) {
                    _this.err = err;
                    //AAKaiAnalytics.sendSpecial("kaisponsor", "error");
                    // console.warn('KaiAds error catch:', _this.err);
                    // if (isKaiOS) {
                    //     document.getElementById('tagNum').style.visibility = "hidden";
                    // }
                    gAdShowingBanner = false;
                    emitter.emit('hideAd');
                },
                onready: function (ad) {
                    _this.theBannerAd = ad;
                    // console.error('onready:', ad);
                    ad.call('display', {
                        // In KaiOS the app developer is responsible
                        // for user navigation, and can provide
                        // navigational className and/or a tabindex
                        tabindex: 0,
                        // if the application is using
                        // a classname to navigate
                        // this classname will be applied
                        // to the container
                        navClass: 'sponsor',
                        // display style will be applied
                        // to the container block or inline-block
                        display: 'block',
                    });
                    ad.on('close', function () {
                        // check if was fullscreen before ad clicked.
                        setTimeout(function () {
                            emitter.emit('bannerAdClosed');
                        }, 500); /* delayed to avoid button click on current scene */
                    });
                    // Kept here for reference ------------------------------------
                    ad.on('click', function () {
                        AAKaiAnalytics.sendSpecial("kaiadsbanner", "click");
                    });
                    ad.on('display', function () {
                        // if (!gFullscreenAdShowing) {
                        // console.error('display:', ad);
                        gAdShowingBanner = true;
                        emitter.emit('showAd');
                        AAKaiAnalytics.sendSpecial("kaiadsbanner", "display");
                        // }
                    });
                    // _this)
                }
            });
        }
    }
    AAKaiAds.preLoadBannerAd = preLoadBannerAd;
})(AAKaiAds || (AAKaiAds = {}));
// 1	Document body not yet ready	Please invoke getKaiAd after the DOMContentLoaded event.
// 2	Ad onready function is required	Please implement the onready function to handle the returned ad.
// 3	Ad container dimension is too small	Try increasing the width/height parameters.
// 4	Ad iframe is gone	The ad iframe may have been acidentally removed.
// 5	Ad request timed out	Try another network or adjust the timeout parameter.
// 6	Server responded 'no ad'	The specified ad dimension may not available, try adjusting the width/height.
// 7	Frequency capping in effect	Frequency capping is the limit on how often the device can request for an ad, please try again later.
// 8	Configuration error: Missing w & h	Please provide the width and height parameters for getKaiAd.
// 9	Bad server response	Server error, please contact support.
// 10, 11, 12	Internal error	SDK internal error, please contact support.
// 13	Cannot process server response	Server error, please contact support.
// 14	No server response	Server error, please contact support.
// 15	Configuration error: Invalid test parameter	The test parameter should either be 1 or 0.
// 16	ad.call('display') is not allowed to be called more than once	An ad container should only be displaying ads once.
// 17	Cannot fetch settings	Please provide the correct configurations before invoking getKaiAd.
// 18	Internal error	SDK internal error, please contact support.
// 19	Cannot load SDK	Network condition or the SDK is too old. Please check SDK doc for latest SDK version
// 20	Internal error	SDK internal error, please contact support.
var AAKaiControls;
(function (AAKaiControls) {
    AAKaiControls.NumKey1 = 0;
    AAKaiControls.NumKey2 = 0;
    AAKaiControls.NumKey3 = 0;
    AAKaiControls.NumKey4 = 0;
    AAKaiControls.NumKey5 = 0;
    AAKaiControls.NumKey6 = 0;
    AAKaiControls.NumKey7 = 0;
    AAKaiControls.NumKey8 = 0;
    AAKaiControls.NumKey9 = 0;
    AAKaiControls.NumKey0 = 0;
    AAKaiControls.StarKey = 0;
    AAKaiControls.PoundKey = 0;
    AAKaiControls.Enter = 0;
    AAKaiControls.SoftLeft = 0;
    AAKaiControls.SoftRight = 0;
    AAKaiControls.ArrowUp = 0;
    AAKaiControls.ArrowDown = 0;
    AAKaiControls.ArrowLeft = 0;
    AAKaiControls.ArrowRight = 0;
    AAKaiControls.call = 0;
    AAKaiControls.backspace = 0;
    var onKeyDown;
    var onkeyup;
    var singlePress = 0;
    var inited = 0;
    var theScene;
    function setUpInputs(_scene) {
        this.inited = 1;
        var _this = this;
        document.addEventListener('keydown', function (event) {
            _this.handleKeyDown(event);
            emitter.emit('keydown', event);
        });
        document.addEventListener('keyup', function (event) {
            _this.handleKeyUp(event);
            emitter.emit('keyup', event);
        });
        this.spacebar = _scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // Leaving this here commented until I find out if it's usable or not.
        // window.addEventListener('mozbrowserbeforekeydown', function (event) {
        //     _this.handleKeyDown(event)
        //     emitter.emit('keydown', event);
        // });
        // window.addEventListener('mozbrowserbeforekeyup', function (event) {
        //     _this.handleKeyUp(event)
        //     emitter.emit('keyup', event);
        // });
        // window.addEventListener('mozbrowserafterkeydown', function () { }); // no use
        // window.addEventListener('mozbrowserafterkeyup', function () { }); // no use
    }
    AAKaiControls.setUpInputs = setUpInputs;
    function useTouchInput(_scene) {
        this.theScene = _scene;
        this.theScene.input.addPointer(5);
        this.theScene.input.on('pointerup', this.pointerUp, this);
        this.theScene.input.on('pointerdown', this.pointerDown, this);
    }
    AAKaiControls.useTouchInput = useTouchInput;
    function pointerUp(pointer) {
        if (pointer.id == 1) {
            this.Enter = 0;
        }
    }
    AAKaiControls.pointerUp = pointerUp;
    function pointerDown(pointer) {
        if (pointer.id == 1) {
            this.Enter = 1;
        }
    }
    AAKaiControls.pointerDown = pointerDown;
    function handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowUp':
                this.ArrowUp = 1;
                break;
            case 'ArrowDown':
                this.ArrowDown = 1;
                break;
            case 'ArrowRight':
                this.ArrowRight = 1;
                break;
            case 'ArrowLeft':
                this.ArrowLeft = 1;
                break;
            case '1':
                this.NumKey1 = 1;
                break;
            case '2':
                this.NumKey2 = 1;
                break;
            case '3':
                this.NumKey3 = 1;
                break;
            case '4':
                this.NumKey4 = 1;
                break;
            case '5':
                this.NumKey5 = 1;
                break;
            case '6':
                this.NumKey6 = 1;
                break;
            case '7':
                this.NumKey7 = 1;
                break;
            case '8':
                this.NumKey8 = 1;
                break;
            case '9':
                this.NumKey9 = 1;
                break;
            case '0':
                this.NumKey0 = 1;
                break;
            case '*':
                this.StarKey = 1;
                break;
            case '#':
                this.PoundKey = 1;
                break;
            case 'SoftLeft':
            case '[':
                this.SoftLeft = 1;
                break;
            case 'SoftRight':
            case ']':
                this.SoftRight = 1;
                break;
            case 'Enter':
            case '=':
                this.Enter = 1;
                // e.preventDefault();
                break;
        }
        // e.preventDefault();
    }
    AAKaiControls.handleKeyDown = handleKeyDown;
    function handleKeyUp(e) {
        switch (e.key) {
            case 'ArrowUp':
                this.ArrowUp = 0;
                break;
            case 'ArrowDown':
                this.ArrowDown = 0;
                break;
            case 'ArrowRight':
                this.ArrowRight = 0;
                break;
            case 'ArrowLeft':
                this.ArrowLeft = 0;
                break;
            case '1':
                this.NumKey1 = 0;
                break;
            case '2':
                this.NumKey2 = 0;
                break;
            case '3':
                this.NumKey3 = 0;
                break;
            case '4':
                this.NumKey4 = 0;
                break;
            case '5':
                this.NumKey5 = 0;
                break;
            case '6':
                this.NumKey6 = 0;
                break;
            case '7':
                this.NumKey7 = 0;
                break;
            case '8':
                this.NumKey8 = 0;
                break;
            case '9':
                this.NumKey9 = 0;
                break;
            case '0':
                this.NumKey0 = 0;
                break;
            case '*':
                this.StarKey = 0;
                break;
            case '#':
                this.PoundKey = 0;
                break;
            case 'SoftLeft':
            case '[':
                this.SoftLeft = 0;
                break;
            case 'SoftRight':
            case ']':
                this.SoftRight = 0;
                break;
            case 'Enter':
            case '=':
                this.Enter = 0;
                //  e.preventDefault();
                break;
        }
        // e.preventDefault();
    }
    AAKaiControls.handleKeyUp = handleKeyUp;
    function deSeclectAllButtons(theList) {
        for (var i = 0; i < theList.length; i++) {
            theList[i].deselect();
        }
    }
    AAKaiControls.deSeclectAllButtons = deSeclectAllButtons;
})(AAKaiControls || (AAKaiControls = {}));
// / <reference path='../phaser.d.ts'/>
var AAControls;
(function (AAControls) {
    AAControls.leftShoulder = false;
    AAControls.rightShoulder = false;
    AAControls.leftTrigger = 0.0;
    AAControls.rightTrigger = 0.0;
    AAControls.axis1 = { x: 0, y: 0, right: 0, left: 0, up: 0, down: 0 };
    AAControls.axis2 = { x: 0, y: 0, right: 0, left: 0, up: 0, down: 0 };
    //export let pointer;
    var singlePress = false;
    var inited = false;
    function setUpInputs(theScene) {
        this.cursors = theScene.input.keyboard.createCursorKeys();
        this.WKey = theScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.AKey = theScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.SKey = theScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.DKey = theScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.PKey = theScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.spacebar = theScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.returnKey = theScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.inited = true;
        //  this.pointer = theScene.input.activePointer;
    }
    AAControls.setUpInputs = setUpInputs;
    function poll() {
        if (this.inited) {
            this.left = 0;
            this.right = 0;
            this.up = 0;
            this.down = 0;
            this.a = 0;
            this.p = 0;
            this.menu = 0;
            this.changeView = 0;
            var gamepads = navigator.getGamepads();
            if (this.gamepad) {
                this.left = gamepads[this.gamepad.index].buttons[14].pressed; // || this.WKey.isDown || this.cursors.left.isDown;
                this.right = gamepads[this.gamepad.index].buttons[15].pressed; // || this.AKey.isDown || this.cursors.right.isDown;
                this.up = gamepads[this.gamepad.index].buttons[12].pressed; // || this.WKey.isDown || this.cursors.up.isDown;
                this.down = gamepads[this.gamepad.index].buttons[13].pressed; // || this.SKey.isDown || this.cursors.down.isDown;
                this.a = gamepads[this.gamepad.index].buttons[0].pressed || this.spacebar.isDown || this.returnKey.isDown;
                this.changeView = gamepads[this.gamepad.index].buttons[8].pressed;
                this.p = gamepads[this.gamepad.index].buttons[9].pressed;
                this.menu = gamepads[this.gamepad.index].buttons[9].pressed;
                this.b = gamepads[this.gamepad.index].buttons[0].pressed;
                this.x = gamepads[this.gamepad.index].buttons[0].pressed;
                this.y = gamepads[this.gamepad.index].buttons[0].pressed;
                this.leftShoulder = gamepads[this.gamepad.index].buttons[4].pressed;
                this.rightShoulder = gamepads[this.gamepad.index].buttons[5].pressed;
                this.leftTrigger = gamepads[this.gamepad.index].buttons[6].pressed;
                this.leftTrigger = gamepads[this.gamepad.index].buttons[7].pressed;
                this.axis1.x = gamepads[this.gamepad.index].axes[0];
                this.axis1.y = gamepads[this.gamepad.index].axes[1];
                this.axis1.right = gamepads[this.gamepad.index].axes[0] > .5 ? 1 : 0;
                this.axis1.left = gamepads[this.gamepad.index].axes[0] < -.5 ? 1 : 0;
                this.axis1.up = gamepads[this.gamepad.index].axes[1] < -.5 ? 1 : 0;
                this.axis1.down = gamepads[this.gamepad.index].axes[1] > .5 ? 1 : 0;
                this.axis2.x = gamepads[this.gamepad.index].axes[2];
                this.axis2.y = gamepads[this.gamepad.index].axes[3];
                this.axis2.right = gamepads[this.gamepad.index].axes[2] > .5 ? 1 : 0;
                this.axis2.left = gamepads[this.gamepad.index].axes[2] < -.5 ? 1 : 0;
                this.axis2.up = gamepads[this.gamepad.index].axes[3] < -.5 ? 1 : 0;
                this.axis2.down = gamepads[this.gamepad.index].axes[3] > .5 ? 1 : 0;
            }
            if (this.cursors) {
                this.up |= this.WKey.isDown;
                this.left |= this.cursors.left.isDown;
                this.left |= this.AKey.isDown;
                this.right |= this.cursors.right.isDown;
                this.right |= this.DKey.isDown;
                this.up |= this.WKey.isDown || this.cursors.up.isDown;
                this.down |= this.SKey.isDown || this.cursors.down.isDown;
            }
            this.a |= this.spacebar.isDown || this.returnKey.isDown;
            this.p |= this.PKey.isDown;
        }
    }
    AAControls.poll = poll;
    function deSeclectAllButtons(theList) {
        for (var i = 0; i < theList.length; i++) {
            theList[i].deselect();
        }
    }
    AAControls.deSeclectAllButtons = deSeclectAllButtons;
})(AAControls || (AAControls = {}));
var AAHighScores;
(function (AAHighScores) {
    // High Score Variables ===========================================================
    // ================================================================================
    AAHighScores.highScoreObject = { player: "empty", score: 0 };
    AAHighScores.highScoreList = [];
    AAHighScores.maxHighScoreCount = 5;
    function initHighScores() {
        this.highScoreList = [];
        this.checkForHighScoreList();
        this.getScoreFromLocalStorage();
    }
    AAHighScores.initHighScores = initHighScores;
    function checkForHighScoreList() {
        var scr = localStorage.getItem(AAPrefs.leaderboardFile);
        if (scr == undefined) {
            this.createDummyHighScores();
        }
    }
    AAHighScores.checkForHighScoreList = checkForHighScoreList;
    function createDummyHighScores() {
        this.saveHighScoreToLeaderboard("Mark", Phaser.Math.RND.integerInRange(1, 10), true);
        this.saveHighScoreToLeaderboard("Lori", Phaser.Math.RND.integerInRange(1, 10), true);
        this.saveHighScoreToLeaderboard("Reese", Phaser.Math.RND.integerInRange(1, 10), true);
        this.saveHighScoreToLeaderboard("Sophia", Phaser.Math.RND.integerInRange(1, 10), true);
        this.saveHighScoreToLeaderboard("Loki", Phaser.Math.RND.integerInRange(1, 10), true);
        this.getHighScoreList();
    }
    AAHighScores.createDummyHighScores = createDummyHighScores;
    function saveHighScoreToLeaderboard(theName, theScoreToSave, save) {
        //add the highscore and name to the array
        var newScoreObj = { player: theName, score: theScoreToSave };
        this.highScoreList.push(newScoreObj);
        var byScore = this.highScoreList.sort(AAHighScores.compareDESC);
        // remove the last element in the array
        // since i only want 10 items
        if (byScore.length > this.maxHighScoreCount) {
            byScore.pop(); //slice(byScore.length);
        }
        if (save == true) {
            localStorage.setItem(AAPrefs.leaderboardFile, JSON.stringify(this.highScoreList));
        }
    }
    AAHighScores.saveHighScoreToLeaderboard = saveHighScoreToLeaderboard;
    //Sort low to high -> 1,2,3,4,5,6,7,8,9,10
    function compareASC(scoreA, scoreB) {
        return parseFloat(scoreA.score) - parseFloat(scoreB.score);
    }
    AAHighScores.compareASC = compareASC;
    //sort high to low -> 10,9,8,7,6,5,4,3,2,1
    function compareDESC(scoreA, scoreB) {
        return parseFloat(scoreB.score) - parseFloat(scoreA.score);
    }
    AAHighScores.compareDESC = compareDESC;
    function postScoreToGameCenter(theScoreToSave) {
        var textData = 'saveHighScore:' + theScoreToSave.toString();
        window.webkit.messageHandlers.observe.postMessage(textData);
    }
    AAHighScores.postScoreToGameCenter = postScoreToGameCenter;
    function openGameCenter() {
        window.webkit.messageHandlers.observe.postMessage('showGameCenter:0');
    }
    AAHighScores.openGameCenter = openGameCenter;
    function getScoreFromLocalStorage() {
        var scr = localStorage.getItem(AAPrefs.prefsHighScore);
        if (scr == undefined) {
            localStorage.setItem(AAPrefs.prefsHighScore, "0");
            this.highScore = 0;
        }
        else {
            this.highScore = parseInt(scr);
        }
        return this.highScore;
    }
    AAHighScores.getScoreFromLocalStorage = getScoreFromLocalStorage;
    function saveScoreToLocalStorage(theScoreToSave) {
        if (theScoreToSave >= this.highScore) {
            this.highScore = theScoreToSave;
            localStorage.setItem(AAPrefs.prefsHighScore, theScoreToSave.toString());
        }
        return this.highScore;
    }
    AAHighScores.saveScoreToLocalStorage = saveScoreToLocalStorage;
    function checkIfMadeItIntoHighscoreList(theNewScore) {
        var isGoodEnough = false;
        if (theNewScore == 0) {
            return false;
        }
        //Double check I loaded the highscore list
        if (this.highScoreList.length <= 0) {
            this.getHighScoreList();
        }
        // See if the score table is still less than maxHighScoreCount
        if (this.highScoreList.length < this.maxHighScoreCount) {
            isGoodEnough = true;
        }
        for (var i = 0; i < this.highScoreList.length; i++) {
            var oldScore = this.highScoreList[i].score;
            if (theNewScore >= oldScore) {
                isGoodEnough = true;
                break;
            }
        }
        return isGoodEnough;
    }
    AAHighScores.checkIfMadeItIntoHighscoreList = checkIfMadeItIntoHighscoreList;
    function getHighScoreList() {
        //console.log("getHighScore()")
        var scr = localStorage.getItem(AAPrefs.leaderboardFile);
        if (scr == undefined) {
            for (var i = 0; i < this.maxHighScoreCount; i++) {
                this.highScoreList[i] = this.highScoreObject;
            }
            localStorage.setItem(AAPrefs.leaderboardFile, JSON.stringify(this.highScoreList));
            // this.highScore = 0;
        }
        else {
            this.highScoreList = JSON.parse(scr);
        }
    }
    AAHighScores.getHighScoreList = getHighScoreList;
    function insertNameIntoHighScoreList(theName, theScoreToSave) {
        // public static getHighScoreList(theName, theScoreToSave) {
        var tempScoreList = this.highScoreList.slice(0);
        //add the higscore and name to the array
        var newScoreObj = { player: theName, score: theScoreToSave };
        tempScoreList.push(newScoreObj);
        var byScore = tempScoreList.sort(AAHighScores.compareDESC);
        // the last element in the array
        // since i only want maxHighScoreCount items
        if (byScore.length > AAHighScores.maxHighScoreCount) {
            byScore.pop(); //slice(byScore.length);
        }
        return tempScoreList;
    }
    AAHighScores.insertNameIntoHighScoreList = insertNameIntoHighScoreList;
})(AAHighScores || (AAHighScores = {}));
// Google analytics engine to anon track user engagment
//
// Events show up in real time.
// !IMPORTANT --> Events can take up to 48 hours to show up in the behaviors section
//
// This code was modified from definityTyped.org typscript repo
//
// It's best to create a new property per game.
//
var AAKaiAnalytics;
(function (AAKaiAnalytics) {
    AAKaiAnalytics.gaNewElem = {};
    AAKaiAnalytics.gaElems = {};
    AAKaiAnalytics.gameName = '';
    var _googleID;
    // export function getDeviceData() {
    //   var myOwnRegex = [[/(kaios)\/([\w\.]+)/i], [(<any>window).UAParser.BROWSER.NAME, (<any>window).UAParser.BROWSER.VERSION]];
    //   var parser = new (<any>window).UAParser({ browser: myOwnRegex });
    //   var vendor = parser.getDevice().vendor;
    //   var model = parser.getDevice().model;
    //   var os;
    //   os = parser.getBrowser();
    //   if (vendor == null) {
    //     vendor = 'unknown';
    //   }
    //   if (os == null) {
    //     os = 'unknown';
    //   }
    //   if (model == null) {
    //     model = 'unknown';
    //   }
    //   AAKaiAnalytics.sendSpecial("vendor", vendor + " " + model);
    //   AAKaiAnalytics.sendSpecial("KaiOS", os.version);
    // }
    function sendUA() {
        var ua = escape(window.navigator.userAgent);
        var pageName = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        var data = 'v=1&t=event&tid=' + this._googleID + '&cid=' + escape(this.cid) + '&ec=' + escape("User Agent") + '&ea=' + escape(window.navigator.userAgent) + "&dp=" + escape(pageName);
        var http = new window.XMLHttpRequest();
        http.mozAnon = true;
        http.mozSystem = true;
        var url = 'https://www.google-analytics.com/collect?';
        var params = data;
        http.open('POST', url, true);
        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function () {
            // if (http.readyState == 4 && http.status == 200) {
            //   console.log(http.responseText);
            // }else{
            //   console.error(http.responseText);
            // }
        };
        http.send(params);
    }
    AAKaiAnalytics.sendUA = sendUA;
    function initAnalytics(googleID, _uid) {
        this._googleID = googleID;
        this.cid = _uid;
        var http = new window.XMLHttpRequest();
        http.mozAnon = true;
        http.mozSystem = true;
        var url = 'https://www.google-analytics.com/collect?';
        // var params = 'v=1&t=pageview&tid='+ googleID +'&cid='+this.cid+'&dh=taara.games&dp='+ gGameName +'&dt='+gGameState;
        var pageName = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        var params = 'v=1&t=pageview&tid=' + googleID + '&cid=' + escape(this.cid) + '&dt=' + escape(gGameName) + '&an=' + escape(gGameName) + '&av=' + escape(gGameVersion) + "&dp=" + pageName + "&cn=kaiosapp";
        http.open('POST', url, true);
        //console.log(url + params);
        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                //alert(http.responseText);
            }
        };
        http.send(params);
    }
    AAKaiAnalytics.initAnalytics = initAnalytics;
    function sendEvent(_action, _value) {
        if (_value === void 0) { _value = 0; }
        var pageName = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        var data = 'v=1&t=event&tid=' + this._googleID + '&cid=' + escape(this.cid) + '&ec=' + escape(gGameName) + '&ea=' + escape(_action) + '&an=' + escape(gGameName) + '&av=' + escape(gGameVersion) + "&dp=" + escape(pageName) + "&cn=kaiosapp";
        //'&ev='+_value+
        //'&el='+gGameVersion
        var http = new window.XMLHttpRequest();
        http.mozAnon = true;
        http.mozSystem = true;
        var url = 'https://www.google-analytics.com/collect?';
        var params = data;
        http.open('POST', url, true);
        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.send(params);
    }
    AAKaiAnalytics.sendEvent = sendEvent;
    // non interact is implied here.
    function sendSpecial(_action, _label, _value) {
        if (_value === void 0) { _value = 0; }
        var pageName = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        var data = 'v=1&t=event&ni=1&tid=' + this._googleID + '&cid=' + this.cid + '&ec=' + escape(gGameName) + '&ea=' + _action + '&el=' + _label + '&ev=' + _value + '&an=' + escape(gGameName) + '&av=' + gGameVersion + "&dp=" + pageName + "&cn=kaiosapp";
        var http = new window.XMLHttpRequest();
        http.mozAnon = true;
        http.mozSystem = true;
        var url = 'https://www.google-analytics.com/collect?';
        var params = data;
        http.open('POST', url, true);
        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.send(params);
    }
    AAKaiAnalytics.sendSpecial = sendSpecial;
})(AAKaiAnalytics || (AAKaiAnalytics = {})); //end module
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
/// <reference path='../../../AAShared/AAControls.ts'/>
/// <reference path='../../../AAShared/AAHighScores.ts'/>
/// <reference path='../../../AAShared/AAKaiAnalytics.ts'/>
var kTESTMODE = 1; /* set to 0 for real ads */
var kBOTTOM_POSITION_FOR_AD = 65;
var gGameName = "_TEMPLATE_";
var gGameVersion = "1.0.0";
var gamePrefsFile = "games.taara._template_.prefs";
var gameBGColor = 0x333333;
var gStageWidth = 240; // I'm leaving it as a multiple to remind me of org size
var gStageHeight = 320; //228 * 2; //web is 228
var gRetinaOffset = .5;
var gShowNewGame = 0;
// Display length of Taara games Logo
var gLogoDisplayLength = 2000;
// SPONSOR
var gTween; //sponsor tween
var kUSESPONSOR = true;
var gChangeBackToFullscreenFromAdView = false;
var gIsKaiOSAppMode = (window.location.protocol == 'app:');
// Display certain buttons if needed.  There are only two that are shown or not
var kSHOW_SETTINGS_BUTTON = false;
var kSHOW_FULLSCREEN_BUTTON = !gIsKaiOSAppMode;
var isKaiOS = true;
if (navigator.userAgent.toLowerCase().indexOf('kaios') > -1) {
    isKaiOS = true;
}
// I need to check if I'm running in the built in browser or as an app
// Check for app: is easy but that's only if the app is packaged.  IF it's a hosted
// app then it looks the same as if you're in the browser.  THe ONLY difference
// I can find is the innerWidth height is shorter as at 228px.  But I have to check
// this height at start up before the user clikcs fullscreen.  If they do click
// fullscreen then with and height are 320x240 like normal. :/
var gRunnngInBrowser = false; //(window.innerHeight <= 228)
if (window.innerHeight <= 228) {
    gRunnngInBrowser = true;
}
var centerGame = Phaser.Scale.CENTER_HORIZONTALLY; //CENTER_BOTH;
var myScale;
myScale = {
    parent: 'gameStage',
    // autoCenter: Phaser.Scale.CENTER_BOTH, //Phaser.Scale.CENTER_HORIZONTALLY,
    mode: Phaser.Scale.NONE,
    width: gStageWidth,
    height: gStageHeight
};
var scenes = [BootScene, PreloadScene, MenuOverlay, SponsorOverlay, MenuScene, HelpScene, GameScene, MoreGamesScene, SettingsScene];
var states;
(function (states) {
    states[states["kSTATE_NOTHING"] = 0] = "kSTATE_NOTHING";
    states[states["kSTATE_START"] = 1] = "kSTATE_START";
    states[states["kSTATE_MENU"] = 2] = "kSTATE_MENU";
    states[states["kSTATE_HELP"] = 3] = "kSTATE_HELP";
    states[states["kSTATE_PLAYING"] = 4] = "kSTATE_PLAYING";
    states[states["kSTATE_LEVEL_ENDED"] = 5] = "kSTATE_LEVEL_ENDED";
    states[states["kSTATE_LEVEL_END_COUNTSCORE"] = 6] = "kSTATE_LEVEL_END_COUNTSCORE";
    states[states["kSTATE_LEVEL_END_COUNTBONUS"] = 7] = "kSTATE_LEVEL_END_COUNTBONUS";
    states[states["kSTATE_START_LEVEL_END_COUNTBONUS"] = 8] = "kSTATE_START_LEVEL_END_COUNTBONUS";
    states[states["kSTATE_LEVEL_END_COMPLETE"] = 9] = "kSTATE_LEVEL_END_COMPLETE";
    states[states["kSTATE_GAMEOVER_DELAY"] = 10] = "kSTATE_GAMEOVER_DELAY";
    states[states["kSTATE_GAMEOVER"] = 11] = "kSTATE_GAMEOVER";
    states[states["kSTATE_PAUSED"] = 12] = "kSTATE_PAUSED";
    states[states["kSTATE_SHOWING_AD"] = 13] = "kSTATE_SHOWING_AD";
    states[states["kSTATE_ADSELECTED"] = 14] = "kSTATE_ADSELECTED";
    states[states["kSTATE_MOREGAMES"] = 15] = "kSTATE_MOREGAMES";
    states[states["kSTATE_SETTINGS"] = 16] = "kSTATE_SETTINGS";
})(states || (states = {}));
var game;
var gGameState = states.kSTATE_NOTHING;
var emitter = new Phaser.Events.EventEmitter();
// ******************************************************************************
// ******************************************************************************
// NOTE ******* 
// Firebase does not work on KaiOS.  Period.
// 
// Using Google Analytics //////////////////////////////////////////////////////
// TEST:UA-150350318-3
// PROD:UA-150350318-1
// ******************************************************************************
//AAKaiAnalytics.initAnalytics('UA-150350318-3', gGameName);
var _uuid = getUUID();
AAKaiAnalytics.initAnalytics('UA-150350318-3', _uuid);
setTimeout(function () { AAKaiAnalytics.sendUA(); }, 1000);
function getUUID() {
    var lsID = 'games.taara.uuid';
    var uuid = Phaser.Utils.String.UUID();
    var scr = localStorage.getItem(lsID);
    if (scr == undefined) {
        localStorage.setItem(lsID, uuid);
    }
    else {
        uuid = scr;
    }
    return uuid;
}
function resize() {
    // if (gRunnngInBrowser) {
    var game_ratio = 1; //(9 * 32) / (15 * 32);
    // Make div full height of browser and keep the ratio of game resolution
    var div = document.getElementById('gameStage');
    div.style.width = (window.innerHeight * game_ratio) + 'px';
    div.style.height = window.innerHeight + 'px';
    // Check if device DPI messes up the width-height-ratio
    var canvas = document.getElementsByTagName('canvas')[0];
    var dpi_w = (parseInt(div.style.width) / canvas.width);
    var dpi_h = (parseInt(div.style.height) / canvas.height);
    gStageHeight = window.innerHeight; // * (dpi_w / dpi_h);
    gStageWidth = window.innerWidth; // height* 0.6;
    game.canvas.style.width = gStageWidth + 'px';
    game.canvas.style.height = gStageHeight + 'px';
    // }
}
window.onload = function () {
    var config = {
        type: Phaser.WEBGL,
        renderType: Phaser.WEBGL,
        scene: scenes,
        banner: false,
        title: gGameName,
        backgroundColor: gameBGColor,
        url: 'https://taaragames.com/',
        version: gGameVersion,
        autoFocus: true,
        autoRound: false,
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
    };
    game = new Phaser.Game(config);
    game.canvas.mozOpaque = true;
    window.addEventListener('resize', function (event) {
        resize();
    }, false);
    resize();
    document.addEventListener('fullscreenchange', function (event) {
        // document.fullscreenElement will point to the element that
        // is in fullscreen mode if there is one. If there isn't one,
        // the value of the property is null.
        if (document.fullscreenElement) {
            gStageHeight = window.innerHeight - 30; // * (dpi_w / dpi_h);
            game.canvas.style.height = gStageHeight + 'px';
            // emitter.emit('fullscreen', [2.5]);
        }
        else {
            // emitter.emit('fullscreen', [1]);
        }
    });
};
//# sourceMappingURL=game.js.map