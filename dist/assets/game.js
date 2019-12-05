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
        if (this.jumps % 3 == 0) {
            // Display Sponsor Scene!
        }
        this.jumps++;
    };
    GameScene.prototype.setUpSprites = function () {
    };
    GameScene.prototype.setUpAudio = function () {
    };
    GameScene.prototype.setUpUI = function () {
    };
    return GameScene;
}(Phaser.Scene));
var HelpScene = /** @class */ (function (_super) {
    __extends(HelpScene, _super);
    function HelpScene() {
        return _super.call(this, { key: 'HelpScene' }) || this;
    }
    HelpScene.prototype.preload = function () {
        this.scene.sendToBack('HelpScene');
    };
    HelpScene.prototype.create = function () {
        //    gGameState = states.kSTATE_HELP;
        this.add.image(100, 100, 'spriteAtlas', 'btnHelp.png');
        this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'spriteAtlas', 'help_en.png');
    };
    return HelpScene;
}(Phaser.Scene));
var MenuOverlay = /** @class */ (function (_super) {
    __extends(MenuOverlay, _super);
    function MenuOverlay() {
        var _this = _super.call(this, { key: 'MenuOverlay' }) || this;
        // debugText;
        // debugInfo;
        _this.kHideDistance = 150;
        _this._SHOWFPS = false;
        _this.kHOME_BUTTON_INDEX = 1;
        return _this;
    }
    MenuOverlay.prototype.preload = function () {
        // Get the Prefs & high score
        AAPrefs.initGamePrefs(gamePrefsFile);
        AAHighScores.initHighScores();
    };
    MenuOverlay.prototype.create = function () {
        AAKaiControls.setUpInputs(this);
        this.setUpAudio();
        this.setUpUI();
        gGameState = states.kSTATE_MENU;
        this.removeAllListeners();
        this.events.on('gameover', this.gameover, this);
        this.events.on('setscore', this.setScore, this);
        this.events.on('setscorefloat', this.setScoreFloat, this);
        emitter.on('keydown', this.keydown, this);
        emitter.on('keyup', this.keyup, this);
        // this.debugInfo = this.add.text(0, 0, 'Click to add objects', { fill: '#00ff00' });
    };
    MenuOverlay.prototype.removeAllListeners = function () {
        this.events.removeListener('gameover');
        this.events.removeListener('setscore');
        this.events.removeListener('setscorefloat');
        this.events.removeListener('keyDown');
        this.events.removeListener('keyUp');
        // this.events.removeListener('showAdSceneButtons');
        // this.events.removeListener('hideAdSceneButtons');
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
            case "1":
            case "2":
            case "3":
            case "8":
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
            // case states.kSTATE_GAMEOVER:
            //     this.checkGameOverMenuControls(theKey);
            //     break;
            case states.kSTATE_PLAYING:
                this.checkForPause(theKey);
                break;
            case states.kSTATE_PAUSED:
                this.checkPauseControls(theKey);
                this.checkForPause(theKey);
                break;
            case states.kSTATE_HELP:
                this.checkHelpControls(theKey);
                break;
        }
        // Quit the game when we leave it. from back space
        if (gGameState == states.kSTATE_MENU) {
            if (theKeyEvent.key == "Backspace") {
                window.close();
            }
        }
        else {
            if (theKeyEvent.key == "Backspace") {
                theKeyEvent.preventDefault();
            }
        }
        switch (theKeyEvent.key) {
            case "1":
            case "2":
            case "3":
            case "8":
                theKeyEvent.preventDefault();
                break;
        }
    };
    MenuOverlay.prototype.setUpAudio = function () {
        this.sfxButton = this.sound.add('button');
    };
    //Set the game to it's initial state by initializing all the variables
    MenuOverlay.prototype.reset = function () {
        AAKaiAnalytics.sendEvent("play");
        this.gameoverSprite.setVisible(false);
        this.hideAllButtons();
        var restartFromAd = false;
        this.scene.get("MenuScene").scene.start("GameScene", { restartFromAd: restartFromAd });
        this.scene.get("SponsorOverlay").hideBanner();
    };
    MenuOverlay.prototype.resetFromGame = function () {
        AAKaiAnalytics.sendEvent("back-paused");
        this.resetToMenu();
        this.scene.stop('GameScene');
    };
    MenuOverlay.prototype.resetFromHelp = function () {
        if ((this.transitioning) || (AAFunctions.areButtonsBouncing())) {
            return;
        }
        gGameState = states.kSTATE_MENU;
        this.showButton(this.c_btnSound, this.buttonY, this.c_btnSound.x);
        this.showButton(this.c_btnPlay, this.buttonY, this.c_btnPlay.x);
        this.btnHelp.setTexture('spriteAtlas', 'btnHelp.png');
        AAFunctions.tweenBounce(this, this.c_btnHelp);
        this.scene.get("SponsorOverlay").showBanner();
        this.scene.get("HelpScene").scene.start("MenuScene");
        AAKaiAnalytics.sendEvent("back-help");
    };
    MenuOverlay.prototype.resetToMenu = function () {
        if (this.transitioning) {
            return;
        }
        gGameState = states.kSTATE_MENU;
        //hide the game over sprite
        this.gameoverSprite.setVisible(false);
        // AAFunctions.tweenBounce(this, this.btnPlay);
        // this.btnPlay.setTexture('spriteAtlas', 'btnPlay.png');
        AAFunctions.tweenBounce(this, this.c_btnHelp);
        this.btnHelp.setTexture('spriteAtlas', 'btnHelp.png');
        this.showButton(this.c_btnSound, this.buttonY, this.c_btnSound.x);
        this.showButton(this.c_btnPlay, this.buttonY, this.c_btnPlay.x);
        // this.btnPause.setVisible(false);
        this.pauseImage.setVisible(false);
        this.scene.get("GameScene").scene.start("MenuScene");
        this.scene.get("SponsorOverlay").showBanner();
    };
    MenuOverlay.prototype.gameover = function () {
        this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
        //Show the reset button
        this.showButtons(true);
        // Hide the pause button
        // this.btnPause.setVisible(false);
        //show the gameover image
        // I don't need to store it since I'm just restarting the scene
        this.gameoverSprite.setVisible(true);
        AAFunctions.tweenBounce(this, this.gameoverSprite);
        this.singlePress = true;
        this.scene.get("SponsorOverlay").showBanner();
    };
    MenuOverlay.prototype.checkForPause = function (theKey) {
        if (!this.areButtonsTweening()) {
            // if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            if (theKey == "*") {
                this.singlePress = true;
                this.pauseGame("up");
            }
        }
    };
    // This check for the center button when the help scene is displayed
    // and then take you back home to the main menu;
    MenuOverlay.prototype.checkHelpControls = function (theKey) {
        if (theKey == "1") {
            // this.btnHelp.pointerUp(null);
            this.btnPlay.pointerUp(null);
            this.resetFromHelp();
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
            //this.btnPlay.pointerUp(null);
            this.btnHelp.pointerUp(null);
            // this.play("up");
        }
    };
    MenuOverlay.prototype.checkMenuControls = function (theKey) {
        switch (theKey) {
            case "8":
                this.visitSponsor();
                break;
            case "Enter":
            case "2":
                this.btnPlay.pointerUp(null);
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
            case "#":
                if (this.scale.isFullscreen) {
                    document.body.style.cursor = "default";
                    this.scale.stopFullscreen();
                }
                else {
                    document.body.style.cursor = "none";
                    this.scale.startFullscreen();
                }
                break;
        }
    };
    MenuOverlay.prototype.checkGameOverMenuControls = function (theKey) {
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
        var nudge2x = 2;
        // if (isKaiOS){
        //     nudge2x = 2;
        // }
        this.btnPlay = new Button(this, 0, 0, 'spriteAtlas', 'btnPlay.png', this.play, "play", true).setVisible(isVis);
        numBadge = this.add.image(34 * nudge2x, -27 * nudge2x, "spriteAtlas", "btn2.png").setVisible(isKaiOS);
        this.c_btnPlay = this.add.container(0, 0, [this.btnPlay, numBadge]).setVisible(isVis);
        var whichButton = 'btnSoundOff.png';
        if (AAPrefs.playAudio) {
            whichButton = 'btnSoundOn.png';
        }
        this.btnSound = new Button(this, 0, 5 * nudge2x, 'spriteAtlas', whichButton, this.toggleSound, "sound", true).setVisible(isVis);
        numBadge = this.add.image(21 * nudge2x, -14 * nudge2x, "spriteAtlas", "btn3.png").setVisible(isKaiOS);
        this.c_btnSound = this.add.container(this.cameras.main.width - 10, this.cameras.main.height - 10, [this.btnSound, numBadge]).setVisible(isVis);
        whichButton = 'btnHelp.png';
        this.btnHelp = new Button(this, 0, 5 * nudge2x, 'spriteAtlas', whichButton, this.showHelp, "help", true).setVisible(true);
        numBadge = this.add.image(21 * nudge2x, -14 * nudge2x, "spriteAtlas", "btn1.png").setVisible(isKaiOS);
        this.c_btnHelp = this.add.container(15, this.cameras.main.height - 10, [this.btnHelp, numBadge]).setVisible(true);
        whichButton = 'btnPause.png';
        this.buttons = [this.c_btnHelp, this.c_btnPlay, this.c_btnSound];
        this.btnHelpIndex = 0;
        this.btnPlayIndex = 1;
        this.btnSoundIndex = 2;
        var col = 0xffde17;
        this.buttonY = (this.cameras.main.height - 20 * nudge2x);
        AAFunctions.displayButtons([this.c_btnHelp, this.c_btnPlay, this.c_btnSound], this.cameras.main, this.buttonY, 5);
        this.createPauseGrc();
        this.gameoverSprite = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 3, 'spriteAtlas', 'gameover.png').setVisible(false);
        this.makeTheNumbersFont();
        var scoreSize = 80;
        this.scoreText = this.add.bitmapText(3, 45 * nudge2x, 'numbersFont', '0', scoreSize).setDepth(999);
        this.scoreText.setOrigin(0);
        this.scoreText.setTint(0x000000);
        this.scoreText.scaleX = .5;
        this.scoreText.scaleY = .5;
        scoreSize = 40;
        this.highScoreText = this.add.bitmapText(5, 70 * nudge2x, 'numbersFont', AAHighScores.highScore, scoreSize).setDepth(999);
        this.highScoreText.setOrigin(0);
        this.highScoreText.setTint(0x000000);
        this.highScoreText.scaleX = .5;
        this.highScoreText.scaleY = .5;
        // if (gSHOWFPS) {
        this.fpsText = this.add.bitmapText(this.sys.canvas.width - 40 * nudge2x, 60 * nudge2x, 'numbersFont', '0.0', 15).setVisible(false);
        this.fpsText.setTint(0x666666);
        // }
    };
    MenuOverlay.prototype.makeTheNumbersFont = function () {
        var config = {
            image: 'numbersFont',
            width: 80,
            height: 80,
            offset: { x: 0 },
            chars: '0123456789.',
            charsPerRow: 11
        };
        // I have to put the <any> here because the typescript defs have an error
        // somewhere that won't let me use the param unless I add <any>
        var it = Phaser.GameObjects.RetroFont.Parse(this, config);
        this.cache.bitmapFont.add('numbersFont', it);
    };
    // **************************************************************************
    // Button CALLBACKS
    // **************************************************************************
    MenuOverlay.prototype.play = function (state) {
        if (this.areButtonsTweening()) {
            return;
        }
        if (state == 'up') {
            this.playBtnSnd();
            switch (gGameState) {
                case states.kSTATE_PAUSED:
                    // this.scene.restart();
                    this.resetFromGame();
                    break;
                case states.kSTATE_GAMEOVER:
                    this.reset();
                    break;
                case states.kSTATE_HELP:
                    this.resetFromHelp();
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
    MenuOverlay.prototype.toggleSound = function (_state) {
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
            //AAAnalytics.sendButtonEvent('sound', kIOS_WRAPPED);
            AAFunctions.tweenBounce(this, this.c_btnSound);
        }
    };
    MenuOverlay.prototype.playBtnSnd = function () {
        if (AAPrefs.playAudio == true)
            this.sfxButton.play();
    };
    // playNavSnd() {
    //     if (AAPrefs.playAudio == true)
    //         this.sfxButtonNav.play();
    // }
    MenuOverlay.prototype.showButtons = function (isGameOver) {
        if (!this.areButtonsTweening()) {
            if (isGameOver) {
                // this.btnPlay.setTexture('spriteAtlas', 'btnPlay.png');
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
            // this.showButton(this.btnPlay, -this.btnPlay.y, this.btnPlay.x, false);
            // this.showButton(this.btnSound, -this.btnSound.y, this.btnSound.x, false);
            // this.showButton(this.btnHelp, -this.btnHelp.y, this.btnHelp.x, false);
            this.showButton(this.c_btnPlay, this.buttonY + this.kHideDistance, this.c_btnPlay.x);
            this.showButton(this.c_btnSound, this.buttonY + this.kHideDistance, this.c_btnSound.x);
            this.showButton(this.c_btnHelp, this.buttonY + this.kHideDistance, this.c_btnHelp.x);
        }
    };
    MenuOverlay.prototype.pauseGame = function (_state) {
        if (this.areButtonsTweening()) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();
            if (gGameState == states.kSTATE_PLAYING) {
                // Change the 'play' button to the 'reset' button since the play button
                // is only used when the user first starts the game.
                // this.btnPlay.setTexture('spriteAtlas', 'btnHome.png');
                this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                gGameState = states.kSTATE_PAUSED;
                //this.showButtons(false);
                this.showButton(this.c_btnHelp, this.buttonY, this.c_btnHelp.x);
                this.showButton(this.c_btnSound, this.buttonY, this.c_btnSound.x);
                this.pauseImage.setVisible(true);
                AAFunctions.tweenBounce(this, this.pauseImage);
                // AAAds.showBannerAd_WEB(true);
                this.scene.get("SponsorOverlay").showBanner();
                game.scene.pause("GameScene");
                AAKaiAnalytics.sendEvent("pause");
            }
            else if (gGameState == states.kSTATE_PAUSED) {
                gGameState = states.kSTATE_PLAYING;
                //this.showButton(this.btnPlay, -this.btnPlay.y, this.btnPlay.x, false);
                this.showButton(this.c_btnHelp, this.buttonY + this.kHideDistance, this.c_btnHelp.x);
                this.showButton(this.c_btnSound, this.buttonY + this.kHideDistance, this.c_btnSound.x);
                this.pauseImage.setVisible(false);
                //AAAds.showBannerAd_WEB(false);
                this.scene.get("SponsorOverlay").hideBanner();
                game.scene.resume("GameScene");
                AAKaiAnalytics.sendEvent("resume");
            }
        }
    };
    MenuOverlay.prototype.showHelp = function (_state) {
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
                    this.showButton(this.c_btnSound, this.buttonY + this.kHideDistance, this.c_btnSound.x);
                    this.showButton(this.c_btnPlay, this.buttonY + this.kHideDistance, this.c_btnPlay.x);
                    this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                    this.scene.get("SponsorOverlay").hideBanner();
                    AAFunctions.tweenBounce(this, this.c_btnHelp);
                    AAKaiAnalytics.sendEvent("help");
                    break;
                case states.kSTATE_GAMEOVER:
                    // this.btnPlay.setTexture('spriteAtlas', 'btnPlay.png');
                    this.btnHelp.setTexture('spriteAtlas', 'btnHelp.png');
                    AAFunctions.tweenBounce(this, this.c_btnPlay);
                    AAFunctions.tweenBounce(this, this.c_btnHelp);
                    this.scene.get("GameScene").scene.start("MenuScene");
                    gGameState = states.kSTATE_MENU;
                    AAKaiAnalytics.sendEvent("back-gameover");
                    break;
                case states.kSTATE_PAUSED:
                case states.kSTATE_HELP:
                    this.play("up");
                    break;
            }
            this.scene.bringToTop();
        }
    };
    // **************************************************************************
    // **************************************************************************
    // **************************************************************************
    // **************************************************************************
    // ALL GAME CODE STARTS UNDER HERE
    // SET UP THE GAME
    // **************************************************************************
    MenuOverlay.prototype.update = function (time, delta) {
        if (this._SHOWFPS) {
            this.fpsText.setText('FPS: ' + (1000 / delta).toFixed(1));
        }
        // this.debugInfo.setText([
        //     'w inner height: ' + window.innerWidth,
        //     'w inner height: ' + window.innerHeight,
        //     'isKaiOS:' + isKaiOS.toString()
        // ]);
        // this.debugText.text = gGameState.toString();
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
        AAKaiAnalytics.sendSponsorEvent();
        var txt = this.cache.text.get('sponsorURL');
        console.log(txt);
        window.location.href = txt;
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
    return MenuOverlay;
}(Phaser.Scene)); //end scene
var MenuScene = /** @class */ (function (_super) {
    __extends(MenuScene, _super);
    function MenuScene() {
        return _super.call(this, { key: 'MenuScene' }) || this;
    }
    MenuScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor(0xFFE660);
        gGameState = states.kSTATE_MENU;
    };
    MenuScene.prototype.create = function () {
        this.scene.sendToBack();
    };
    return MenuScene;
}(Phaser.Scene));
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
var PreloadScene = /** @class */ (function (_super) {
    __extends(PreloadScene, _super);
    function PreloadScene() {
        return _super.call(this, { key: 'PreloadScene' }) || this;
    }
    PreloadScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor(0xFFDD18);
        var logo = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "logo").setAlpha(0);
        this.tweens.add({
            targets: logo,
            alpha: 1.0,
            duration: 500,
            ease: 'Power.easeIn'
        });
        this.meterBar = this.add.graphics();
        this.meterBar.beginPath();
        this.meterBar.moveTo(0, this.sys.game.canvas.height - 40);
        this.meterBar.lineTo(this.sys.canvas.width, this.sys.game.canvas.height - 40);
        this.meterBar.lineTo(this.sys.canvas.width, this.sys.game.canvas.height - 45);
        this.meterBar.lineTo(0, this.sys.game.canvas.height - 45);
        this.meterBar.closePath();
        this.meterBar.strokePath();
        this.meterBar.fillStyle(0xff0000, .75);
        this.meterBar.fill();
        this.meterBar.scaleX = .1;
        this.kitt = this.add.graphics();
        this.kitt.moveTo(0, this.sys.game.canvas.height - 40);
        this.kitt.lineTo(10, this.sys.game.canvas.height - 40);
        this.kitt.lineTo(10, this.sys.game.canvas.height - 45);
        this.kitt.lineTo(0, this.sys.game.canvas.height - 45);
        this.kitt.closePath();
        this.kitt.strokePath();
        this.kitt.fillStyle(0xffffff, .90);
        this.kitt.fill();
        this.tweens.add({
            targets: this.kitt,
            x: this.sys.canvas.width - 10,
            ease: 'Sine.easeInOut',
            yoyo: true,
            duration: 500,
            repeat: -1
        });
        this.loadAssets();
    };
    PreloadScene.prototype.loadAssets = function () {
        this.load.on('progress', function (it) {
            this.meterBar.scaleX = this.load.progress;
        }, this);
        this.load.on('complete', function () {
            this.meterBar.fillStyle(0x00FF00, 1.0);
            this.meterBar.scaleX = 1.0;
            AAFunctions.fade(this, "out", 500, this.goToGameScene, gLogoDisplayLength);
        }, this);
        // sponsor
        // should i load a text file with the url OR should I just
        // use a url that will redirect to
        this.load.text('sponsorURL', 'sponsor.txt');
        // *** LOAD ASSETS ***
        // Spritesheets
        this.load.setPath("assets/images/");
        this.load.image('sponsor', 'sponsor.png');
        this.load.atlas("spriteAtlas", "spriteAtlas.png", "spriteAtlas.json", null, null);
        //Fonts
        this.load.image('numbersFont', 'numbers.png');
        //Sound Effects
        this.load.setPath("assets/audio/");
        var ext = '.mp3';
        // These two sounds are the standard button sounds
        this.load.audio("button", "chime-airy" + ext);
        // this.load.audio("buttonNav", "chime-triad" + ext);
    };
    PreloadScene.prototype.goToGameScene = function (a, c, b, d) {
        this.scene.start('MenuScene');
        this.scene.start('MenuOverlay');
        this.scene.start('SponsorOverlay');
    };
    return PreloadScene;
}(Phaser.Scene));
var SponsorOverlay = /** @class */ (function (_super) {
    __extends(SponsorOverlay, _super);
    function SponsorOverlay() {
        var _this = _super.call(this, { key: 'SponsorOverlay' }) || this;
        _this.bottomPos = 80;
        return _this;
    }
    SponsorOverlay.prototype.preload = function () {
    };
    SponsorOverlay.prototype.create = function () {
        var adFrame = this.add.image(0, 0, 'sponsor');
        adFrame.setOrigin(0, 0);
        this.btn = this.add.image(this.sys.canvas.width - 50, this.bottomPos, "spriteAtlas", "btn8.png").setVisible(isKaiOS);
        this.adContainer = this.add.container(0, 0, [adFrame, this.btn]).setVisible(true);
        adFrame.setInteractive();
        var xthis = this;
        adFrame.on('pointerup', function (pointer) {
            xthis.scene.get("MenuOverlay").visitSponsor();
        });
        this.startyScore = this.scene.get("MenuOverlay").scoreText.y;
        this.startyHighScore = this.scene.get("MenuOverlay").highScoreText.y;
    };
    SponsorOverlay.prototype.hideBanner = function () {
        // this.adContainer.setVisible(false);
        this.tweens.add({
            targets: [this.adContainer, this.btn],
            y: -110,
            ease: 'Sine.easeIn',
            duration: 250
        });
        this.tweens.add({
            targets: this.scene.get("MenuOverlay").scoreText,
            y: this.startyScore - this.bottomPos,
            ease: 'Sine.easeIn',
            duration: 250
        });
        gTween = this.tweens.add({
            targets: this.scene.get("MenuOverlay").highScoreText,
            y: this.startyHighScore - this.bottomPos,
            ease: 'Sine.easeIn',
            duration: 250
        });
    };
    SponsorOverlay.prototype.showBanner = function () {
        // this.adContainer.setVisible(true);
        this.tweens.add({
            targets: this.adContainer,
            y: 0,
            ease: 'Sine.easeOut',
            duration: 500
        });
        this.tweens.add({
            targets: this.btn,
            y: this.bottomPos,
            ease: 'Sine.easeOut',
            duration: 500
        });
        this.tweens.add({
            targets: this.scene.get("MenuOverlay").scoreText,
            y: this.startyScore,
            ease: 'Sine.easeOut',
            duration: 500
        });
        gTween = this.tweens.add({
            targets: this.scene.get("MenuOverlay").highScoreText,
            y: this.startyHighScore,
            ease: 'Sine.easeOut',
            duration: 500
        });
    };
    SponsorOverlay.prototype.showFullScreen = function () {
    };
    return SponsorOverlay;
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
        var totalButtonLength = _buttons.length + spacer;
        var stp = _camera.width / _buttons.length + spacer;
        var startx = (stp / 2) - (spacer);
        Phaser.Actions.GridAlign(_buttons, {
            width: totalButtonLength,
            height: 1,
            cellWidth: stp,
            cellHeight: 50,
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
        this.prefsPlayAudio = 'com.taaragames.' + _gameName + '.playAudio';
        this.prefsPlayMusic = 'com.taaragames.' + _gameName + '.playMusic';
        this.prefsHighScore = 'com.taaragames.' + _gameName + '.highScore';
        this.leaderboardFile = 'com.taaragames.' + _gameName + '.leaderboard5';
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
    function getDeviceData() {
        var myOwnRegex = [[/(kaios)\/([\w\.]+)/i], [window.UAParser.BROWSER.NAME, window.UAParser.BROWSER.VERSION]];
        var parser = new window.UAParser({ browser: myOwnRegex });
        var vendor = parser.getDevice().vendor;
        var model = parser.getDevice().model;
        var os;
        os = parser.getBrowser();
        if (vendor == null) {
            vendor = 'unknown';
        }
        if (os == null) {
            os = 'unknown';
        }
        if (model == null) {
            model = 'unknown';
        }
        AAKaiAnalytics.sendEvent("startgame");
        AAKaiAnalytics.sendSpecial("vendor", vendor + " " + model);
        AAKaiAnalytics.sendSpecial("KaiOS", os.version);
    }
    AAKaiAnalytics.getDeviceData = getDeviceData;
    function initAnalytics(googleID, _gameName) {
        this.gameName = _gameName;
        var currdate = new Date();
        (function (i, s, o, g, r, a, m) {
            i["GoogleAnalyticsObject"] = r;
            (i[r] =
                i[r] ||
                    function () {
                        (i[r].q = i[r].q || []).push(arguments);
                    }),
                (i[r].l = 1 * currdate);
            (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga", this.gaNewElem, this.gaElems);
        //NOTE: ga ERRORS are false possitives! Ignore
        window.ga("create", googleID, "beacon");
        window.ga("send", "pageview");
        AAKaiAnalytics.getDeviceData();
    }
    AAKaiAnalytics.initAnalytics = initAnalytics;
    function sendSpecial(_action, _label, _nointeract, _value) {
        if (_nointeract === void 0) { _nointeract = true; }
        if (_value === void 0) { _value = 0; }
        if (gAnalytic == kGOOGLE) {
            if (window.ga != undefined) {
                console.log('sending');
                window.ga('send', {
                    'transport': 'beacon',
                    'hitType': 'event',
                    'eventCategory': gGameName,
                    'eventAction': _action,
                    'eventLabel': _label,
                    'eventValue': _value,
                    'nonInteraction': _nointeract
                });
            }
        }
        else if (gAnalytic == kMATOMO) {
            window._paq.push(['setRequestMethod', 'POST']);
            window._paq.push(['trackEvent', gGameName, _action, _label]);
        }
    }
    AAKaiAnalytics.sendSpecial = sendSpecial;
    // ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
    // sendEvent("play", gGameVersion);
    // sendEvent("os", '1.0.0',false);
    // export function sendEventGoogle(_action: String, _label: String, _nointeract = true, _value = 0) {
    function sendEvent(_action, _nointeract, _value) {
        if (_nointeract === void 0) { _nointeract = true; }
        if (_value === void 0) { _value = 0; }
        if (gAnalytic == kGOOGLE) {
            if (window.ga != undefined) {
                console.log('sending');
                window.ga('send', {
                    'transport': 'beacon',
                    'hitType': 'event',
                    'eventCategory': gGameName,
                    'eventAction': _action,
                    'eventLabel': gGameVersion,
                    'eventValue': _value,
                    'nonInteraction': _nointeract
                });
            }
        }
        else if (gAnalytic == kMATOMO) {
            window._paq.push(['setRequestMethod', 'POST']);
            window._paq.push(['trackEvent', gGameName, _action, gGameVersion]);
        }
    }
    AAKaiAnalytics.sendEvent = sendEvent;
    function sendSponsorEvent() {
        if (gAnalytic == kGOOGLE) {
            if (window.ga != undefined) {
                console.log('sending');
                window.ga('send', {
                    'transport': 'beacon',
                    'hitType': 'event',
                    'eventCategory': "sponsorClick",
                    'eventAction': gGameName,
                    'eventLabel': "web",
                    'eventValue': 0,
                    'nonInteraction': false
                });
            }
        }
        else {
            window._paq.push(['setRequestMethod', 'POST']);
            window._paq.push(['trackEvent', "sponsorClick", gGameName, gGameVersion]);
        }
    }
    AAKaiAnalytics.sendSponsorEvent = sendSponsorEvent;
    // THIS IS LEFT HERE AS A REMINDER OF HOOW I LOADED A LOCAL VERIOSN OF ANALYTICS
    // export function initAnalyticsLocal(googleID, _gameName) {
    //   this.gameName = _gameName;
    //   var currdate: any = new Date();
    //   window['GoogleAnalyticsObject'] = 'ga';
    //   (<any>window).ga = (<any>window).ga || function () {
    //     (<any>window).ga.q = (<any>window).ga.q || [];
    //     (<any>window).ga.q.push(arguments);
    //   };
    //   (<any>window).ga.l = 1 * currdate;
    //   (<any>window).ga("create", googleID, "beacon");
    //   (<any>window).ga("send", "pageview");
    // }
})(AAKaiAnalytics || (AAKaiAnalytics = {})); //end module
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
var kTESTMODE = 1; /* set to 0 for real ads */
var gGameName = "Template";
var gGameVersion = "1.0.0";
var gamePrefsFile = "gameTemplate_000";
var gameBGColor = 0x333333;
var gLogoDisplayLength = 2000;
var gStageWidth = 240 * 2;
var gStageHeight = 228 * 2;
// gSpeedNormalize is used to make testing and working on the PC normal speed
// KaiOS Phaser runs at 30fps so I compensate and double most things.
var gSpeedNormalize = 1.0;
var gTween;
var isKaiOS = false;
if (navigator.userAgent.toLowerCase().indexOf('kaios') > -1) {
    isKaiOS = true;
    gSpeedNormalize = 2.0; // double things up on the device.  Could break in the future?
}
var scenes = [BootScene, PreloadScene, SponsorOverlay, MenuOverlay, MenuScene, HelpScene, GameScene];
var states;
(function (states) {
    states[states["kSTATE_NOTHING"] = 0] = "kSTATE_NOTHING";
    states[states["kSTATE_START"] = 1] = "kSTATE_START";
    states[states["kSTATE_MENU"] = 2] = "kSTATE_MENU";
    states[states["kSTATE_HELP"] = 3] = "kSTATE_HELP";
    states[states["kSTATE_PLAYING"] = 4] = "kSTATE_PLAYING";
    states[states["kSTATE_GAMEOVER"] = 5] = "kSTATE_GAMEOVER";
    states[states["kSTATE_PAUSED"] = 6] = "kSTATE_PAUSED";
    states[states["kSTATE_SHOWING_AD"] = 7] = "kSTATE_SHOWING_AD";
    states[states["kSTATE_ADSELECTED"] = 8] = "kSTATE_ADSELECTED";
})(states || (states = {}));
var game;
var gGameState = states.kSTATE_NOTHING;
var emitter = new Phaser.Events.EventEmitter();
var gGameTimeStart;
// 1 = google
// 2 = matomo
var kGOOGLE = 1;
var kMATOMO = 2;
var gAnalytic = kGOOGLE;
// ******************************************************************************
// ******************************************************************************
// NOTE ******* If using Matomo the init is in the index.html file */
// DON"T USE MATOMO FOR ONLINE GAMES. USE GOOGLE.
// Using Google Analytics //////////////////////////////////////////////////////
// TEST:UA-150350318-3
// PROD:UA-150350318-1
// ******************************************************************************
AAKaiAnalytics.initAnalytics('UA-150350318-3', gGameName);
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
            width: gStageWidth,
            height: gStageHeight,
        }
    };
    gGameTimeStart = new Date().getMilliseconds();
    game = new Phaser.Game(config);
    game.canvas.mozOpaque = true;
    if (isKaiOS) {
        game.body.style.cursor = "none";
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
//# sourceMappingURL=game.js.map