var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        this.setUpUI();
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
        if (window.navigator.vibrate) {
            window.navigator.vibrate(300);
        }
        this.cameras.main.shake(150);
        if (++gFullscreenAdCount % gShowFullscreenAdEveryX == 0) {
            gFullscreenAdCount = 0;
            // Display Fullscreen!
            AAKaiAds.showFullscreenAd();
            AAKaiAds.preloadFullscreenAd();
        }
    };
    GameScene.prototype.setUpSprites = function () {
    };
    GameScene.prototype.setUpAudio = function () {
    };
    GameScene.prototype.setUpUI = function () {
        this.scene.get('MenuOverlay').showScores(true);
        //(<MenuOverlay>this.scene.get('MenuOverlay')).showResetButton(true);
    };
    return GameScene;
}(Phaser.Scene));
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
        AAKaiAds.preLoadBannerAd();
        this.removeLogo();
        this.scene.sendToBack();
        this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, kSPRITE_ATLAS, "title.png").setOrigin(.5);
        var vy = this.sys.canvas.height - 17;
        var vx = 12;
        this.add.text(12, this.sys.canvas.height - 17, gGameVersion, { "fontSize": "12px" });
        var mo = this.scene.get('MenuOverlay');
        mo.showMenuSceneButtons(function () { });
        mo.showScores(true);
        // (<MenuOverlay>this.scene.get('MenuOverlay')).showScores(true);
    };
    MenuScene.prototype.removeLogo = function () {
        var element = document.getElementsByClassName('loader')[0];
        if (element != undefined) {
            element.style.opacity = "0";
            var op = 1; // initial opacity
            var timer = setInterval(function () {
                clearInterval(timer);
                element.remove();
            }, 500);
        }
    };
    return MenuScene;
}(Phaser.Scene));
var MenuOverlay = /** @class */ (function (_super) {
    __extends(MenuOverlay, _super);
    function MenuOverlay() {
        var _this_1 = _super.call(this, { key: 'MenuOverlay' }) || this;
        _this_1.pauseEnabled = false;
        _this_1.buttonY = 276;
        _this_1.tweeners = 0;
        _this_1.fpsMeterCount = 0;
        _this_1.fpsMeterMOD = 60;
        return _this_1;
    }
    MenuOverlay.prototype.preload = function () {
        // Get the Prefs & high score
        AAPrefs.initGamePrefs(gamePrefsFile);
        AAHighScores.initHighScores();
        AAKaiControls.setUpInputs(this);
    };
    MenuOverlay.prototype.create = function () {
        this.setUpAudio();
        this.setUpUI();
        gGameState = states.kSTATE_MENU;
        this.removeAllListeners();
        this.events.on('gameover', this.gameover, this);
        this.events.on('setscore', this.setScore, this);
        this.events.on('setscorefloat', this.setScoreFloat, this);
        // IMPORTANT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // THIS IS CALLED FROM THE FIREFOX UI WHEN A USER CLICKS "EXIT"
        // emitter.on('fullscreen', this.action_btnFullscreen, this);
        this.tweeners = 0;
        // Alternative to the KaiControls API I wrote that sometimes doesn't work.
        var _this = this;
        document.addEventListener('keydown', function (event) {
            _this.keydown(event);
        });
        document.addEventListener('keyup', function (event) {
            _this.keyup(event);
        });
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
        if (AAFunctions.areButtonsBouncing()) {
            return;
        }
        if (this.tweeners != 0) {
            return;
        }
        if (gGameState != states.kSTATE_MENU) {
            if (theKeyEvent.key == "Backspace") {
                theKeyEvent.preventDefault();
            }
        } // switch (theKeyEvent.key) {
        //     case "1": //help
        //     case "2": //moregames 
        //     case "3": //sound
        //     case "4": //settings
        //     case "5": //play
        //     case "#": //fullscreen
        //     case "8": //sponsor
        //     case "SoftLeft":
        //     case "SoftRight":
        //         theKeyEvent.preventDefault();
        //         break;
        // }
    };
    MenuOverlay.prototype.keyup = function (theKeyEvent) {
        if (this.tweeners != 0) {
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
            case states.kSTATE_HELP:
                this.checkHelpControls(theKey);
                break;
        }
        if ((theKeyEvent.key == "SoftRight") || (theKeyEvent.key == "8")) {
            // this.action_sponsorButton("up");
            this.visitSponsor();
        }
        if (theKeyEvent.key == "SoftLeft") {
            switch (gGameState) {
                case states.kSTATE_HELP:
                    // case states.kSTATE_GAMEOVER:
                    this.action_BtnBack("up");
                    break;
            }
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
                    this.showResetButton(false);
                    this.playBackSnd();
                    AAKaiAnalytics.sendEvent("quitgame");
                    this.backToMenu("GameScene");
                    theKeyEvent.preventDefault();
                    break;
            }
        }
        // switch (theKeyEvent.key) {
        //     case "1": //help
        //     case "2": //moregames 
        //     case "3": //sound
        //     case "4": //settings
        //     case "5": //play
        //     case "#": //fullscreen
        //     case "8": //sponsor
        //     case "SoftRight":
        //     case "SoftLeft":
        //         theKeyEvent.preventDefault();
        //         break;
        // }
    };
    MenuOverlay.prototype.setUpAudio = function () {
        this.sfxButton = this.sound.add('button');
        this.sfxButtonPlay = this.sound.add('play');
        this.sfxButtonBack = this.sound.add('back');
    };
    //Set the game to it's initial state by initializing all the variables
    MenuOverlay.prototype.playGame = function () {
        var _this_1 = this;
        AAKaiAnalytics.sendEvent("play");
        this.gameoverSprite.setVisible(false);
        hideBanner();
        this.hideMenuSceneButtons(function () { });
        this.hideBackButton(function () {
            _this_1.scene.get("MenuScene").scene.start("GameScene");
        });
    };
    MenuOverlay.prototype.resetFromGame = function () {
        AAKaiAnalytics.sendEvent("back-paused");
        this.showResetButton(false);
        this.scene.stop('GameScene');
        this.backToMenu("GameScene");
    };
    MenuOverlay.prototype.gameover = function () {
        var _this_1 = this;
        gGameState = states.kSTATE_GAMEOVER;
        this.gameoverSprite.setVisible(true);
        AAFunctions.tweenBounce(this, this.gameoverSprite);
        this.singlePress = true;
        this.showMenuSceneButtons(function () {
            _this_1.showFullScreenAfterSomeTime();
        });
    };
    MenuOverlay.prototype.showFullScreenAfterSomeTime = function () {
        if (gUseFullscreenAd) {
            if (AAKaiAds.fullscreenAdLoaded) {
                if (++gFullscreenAdCount == gShowFullscreenAdEveryX) {
                    AAKaiAds.showFullscreenAd();
                    gFullscreenAdCount = 0;
                }
            }
        }
    };
    MenuOverlay.prototype.visitSponsor = function () {
        if (AAPrefs.playAudio == true)
            this.sfxButtonPlay.play();
        if ((gGameState == states.kSTATE_PLAYING) ||
            (gGameState == states.kSTATE_HELP)) {
            return;
        }
        AAKaiAds.theBannerAd.call('click');
    };
    MenuOverlay.prototype.checkForPause = function (theKey) {
        if (this.pauseEnabled) {
            // if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            if (theKey == "*") {
                this.singlePress = true;
                this.action_btnPause("up");
            }
        }
    };
    // This check for the center button when the help scene is displayed
    // and then take you back home to the main menu;
    MenuOverlay.prototype.checkHelpControls = function (theKey) {
        if (theKey == "1") {
            switch (gGameState) {
                case states.kSTATE_HELP:
                    this.action_BtnBack("up");
                    break;
            }
            this.singlePress = true;
        }
        // Display the FPS eater egg
        if (theKey == "*") {
            this.singlePress = true;
            gSHOW_FPS = !gSHOW_FPS;
            if (gSHOW_FPS) {
                this.fpsMeter.style.display = "block";
            }
            else {
                this.fpsMeter.style.display = "none";
            }
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
            case "SoftRight":
                this.visitSponsor();
                break;
            case "3":
                this.btnSound.pointerUp(null);
                break;
            case "1":
                // if (gAdShowing == false) 
                this.btnHelp.pointerUp(null);
                // }
                break;
            case "Enter":
            case "5":
                this.btnPlay.pointerUp(null);
                break;
        }
    };
    // **************************************************************************
    // SET UP THE UI
    // **************************************************************************
    MenuOverlay.prototype.setUpUI = function () {
        // this.buttonY = 276;
        this.logo = this.add.image(this.game.canvas.width / 2, this.game.canvas.height + 100, kSPRITE_ATLAS, kIMG_LOGO).setAlpha(.25);
        this.logo.setData('homeY', this.game.canvas.height - 25);
        var isVis = true;
        var numBadge;
        // Play Button #######################################################################
        this.btnPlay = new Button(this, 0, 0, kSPRITE_ATLAS, kBTN_PLAY, this.action_BtnPlay, true).setVisible(isVis);
        this.btnPlay.setData('homeY', this.buttonY - 25);
        // Sound Button #######################################################################
        var whichButton = kBTN_SOUND_OFF;
        // if (AAPrefs.playAudio) {
        //     whichButton = kBTN_SOUND_ON;
        // }
        this.btnSound = new Button(this, 0, 5, kSPRITE_ATLAS, kBTN_SOUND_ON, this.action_btnSound, true).setVisible(isVis);
        this.btnSound.setData('homeY', this.buttonY);
        // Help Button #######################################################################
        whichButton = kBTN_HELP;
        this.btnHelp = new Button(this, 0, 5, kSPRITE_ATLAS, whichButton, this.action_BtnHelp, true).setVisible(true);
        this.btnHelp.setData('homeY', this.buttonY);
        this.btnBack = new Button(this, 10, this.game.canvas.height, kSPRITE_ATLAS, kBTN_BACK, this.action_BtnBack, true).setVisible(true);
        this.btnBack.setOrigin(0);
        // Reset Button #######################################################################
        this.btnResetGame = new Button(this, 40, this.cameras.main.height + 25, kSPRITE_ATLAS, kBTN_RESET_GAME, this.action_btnResetGame, true);
        //.setVisible(true);
        // DISPLAY BUTTONS #######################################################
        // #######################################################################
        AAFunctions.displayButtons([this.btnHelp, this.btnPlay, this.btnSound], this.cameras.main, this.game.canvas.height + 100, -25);
        this.audioOffImage = this.add.image(this.btnSound.x, this.btnSound.y, kSPRITE_ATLAS, kBTN_SOUND_OFF).setVisible(!AAPrefs.playAudio);
        this.buttons = [this.btnHelp, this.btnPlay, this.btnSound];
        // GameOver Sprite #######################################################################
        this.gameoverSprite = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, kSPRITE_ATLAS, kIMG_GAMEOVER).setVisible(false);
        // This is the main div holding the score and high score text
        this.scoresDom = document.getElementById('scores');
        this.scoresDom.style.opacity = "1";
        this.scoreDom = document.getElementById('scoreText');
        // this.scoreDom.style.display = 'block';
        this.highscoreDom = document.getElementById('highscoreText');
        // this.highscoreDom.style.display = 'block';
        this.highscoreDom.innerText = AAHighScores.highScore;
        // FPS TEXT #######################################################################
        this.fpsMeter = document.getElementById('fpsMeter');
    };
    MenuOverlay.prototype.playBtnSnd = function () {
        if (AAPrefs.playAudio == true)
            this.sfxButton.play();
    };
    MenuOverlay.prototype.playBackSnd = function () {
        if (AAPrefs.playAudio == true)
            this.sfxButtonBack.play();
    };
    MenuOverlay.prototype.playPlaySnd = function () {
        if (AAPrefs.playAudio == true)
            this.sfxButtonPlay.play();
    };
    MenuOverlay.prototype.update = function (time, delta) {
        if (gSHOW_FPS) {
            this.fpsMeter.innerText = (1000 / delta).toFixed(1);
        }
        //Yup...this ia a hack but ti works
        if (!AAPrefs.playAudio) {
            this.audioOffImage.y = this.btnSound.y;
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
        this.scoreDom.innerText = thescore.toString();
        //this.scoreDom.classList.add("scoreBounce");
        // setTimeout(() => { this.scoreDom.classList.remove("scoreBounce"); }, 1200);
        if (thescore >= AAHighScores.highScore) {
            this.highscoreDom.innerText = thescore.toString();
            // this.highscoreDom.classList.add("scoreBounce");
            // setTimeout(() => { this.highscoreDom.classList.remove("scoreBounce"); }, 1200);
            AAHighScores.saveScoreToLocalStorage(thescore);
        }
    };
    MenuOverlay.prototype.disablePause = function () {
        this.pauseEnabled = false;
    };
    // **************************************************************************
    // Button CALLBACKS
    // **************************************************************************
    MenuOverlay.prototype.action_BtnPlay = function (state) {
        if (this.tweeners != 0) {
            return;
        }
        if (state == 'up') {
            this.playPlaySnd();
            AAFunctions.tweenBounce(this, this.btnPlay);
            switch (gGameState) {
                case states.kSTATE_PAUSED:
                    this.resetFromGame();
                    break;
                case states.kSTATE_MENU:
                case states.kSTATE_GAMEOVER:
                    this.playGame();
                    break;
                case states.kSTATE_HELP:
                    this.backToMenu("HelpScene");
                    break;
                default:
                    this.playGame();
                    break;
            }
        }
    };
    MenuOverlay.prototype.action_btnSound = function (_state) {
        if (this.tweeners != 0) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();
            AAPrefs.toggleAudio();
            if (AAPrefs.playAudio == true) {
                AAKaiAnalytics.sendEvent("soundOn");
            }
            else {
                AAKaiAnalytics.sendEvent("soundOff");
            }
            this.audioOffImage.setVisible(!AAPrefs.playAudio);
            AAFunctions.tweenBounce(this, this.btnSound);
        }
    };
    MenuOverlay.prototype.action_btnPause = function (_state) {
        if (this.tweeners != 0) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();
            if (gGameState == states.kSTATE_PLAYING) {
                // this.btnHelp.setTexture(kBTN_BACK);
                gGameState = states.kSTATE_PAUSED;
                this.pauseImage.setVisible(true);
                AAFunctions.tweenBounce(this, this.pauseImage);
                game.scene.pause("GameScene");
                AAKaiAnalytics.sendEvent("pause");
            }
            else if (gGameState == states.kSTATE_PAUSED) {
                gGameState = states.kSTATE_PLAYING;
                this.pauseImage.setVisible(false);
                game.scene.resume("GameScene");
                AAKaiAnalytics.sendEvent("resume");
            }
        }
    };
    MenuOverlay.prototype.action_BtnBack = function (_state) {
        var _this_1 = this;
        if (_state == 'up') {
            this.playBackSnd();
            switch (gGameState) {
                case states.kSTATE_GAMEOVER:
                    this.hideBackButton(function () {
                        _this_1.gameoverSprite.setVisible(false);
                        //this.scene.switch("MenuScene")
                        _this_1.scene.get("GameScene").scene.stop("GameScene");
                        _this_1.scene.get("GameScene").scene.start("MenuScene");
                    });
                    AAKaiAnalytics.sendEvent("back-gameover");
                    break;
                case states.kSTATE_HELP:
                    this.hideBackButton(function () {
                        _this_1.gameoverSprite.setVisible(false);
                        _this_1.scene.get("MenuScene").scene.stop("HelpScene");
                        _this_1.scene.get("GameScene").scene.start("MenuScene");
                    });
                    AAKaiAnalytics.sendEvent("back-help");
                    break;
            }
        }
    };
    MenuOverlay.prototype.action_BtnHelp = function (_state) {
        var _this_1 = this;
        if (this.tweeners != 0) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();
            AAFunctions.tweenBounce(this, this.btnHelp);
            // Just make sure that the gameover sprite is hidden in case this is called from a gameover()
            //  It's just easier this way.
            //this.gameoverSprite.setVisible(false);
            switch (gGameState) {
                case states.kSTATE_MENU:
                case states.kSTATE_GAMEOVER:
                    this.gameoverSprite.setVisible(false);
                    this.hideBackButton(function () {
                        _this_1.hideMenuSceneButtons(function () {
                            _this_1.scene.get("MenuScene").scene.stop("GameScene");
                            _this_1.scene.get("MenuScene").scene.start("HelpScene");
                            gGameState = states.kSTATE_HELP;
                        });
                    });
                    break;
            }
            this.scene.bringToTop();
        }
    };
    //V2 ==================================================
    MenuOverlay.prototype.action_btnResetGame = function (_state) {
        if (this.tweeners != 0) {
            return;
        }
        if (gGameState == states.kSTATE_MENU) {
            if (_state == 'up') {
                this.playBtnSnd();
                this.gameover();
            }
        }
    };
    MenuOverlay.prototype.showResetButton = function (how) {
        var _this_1 = this;
        //this.btnResetGame.setVisible(how);
        var bY = this.cameras.main.height - 5;
        if (how === false) {
            bY = this.cameras.main.height + 25;
        }
        // this.btnResetGame.setVisible(true);
        this.tweens.add({
            targets: this.btnResetGame,
            y: bY,
            duration: 200,
            onComplete: function () {
                _this_1.tweeners--;
            },
            onCompleteScope: this
        });
        this.tweeners++;
    };
    MenuOverlay.prototype.hideGameOver = function () {
        this.gameoverSprite.setVisible(false);
    };
    MenuOverlay.prototype.backToMenu = function (fromWhere) {
        this.playBackSnd();
        this.scene.get(fromWhere).scene.start("MenuScene");
        if (this.pauseEnabled) {
            this.pauseImage.setVisible(false);
        }
        //hide the game over sprite
        this.gameoverSprite.setVisible(false);
        this.showMenuSceneButtons(function () {
            gGameState = states.kSTATE_MENU;
            showBanner();
        });
    };
    MenuOverlay.prototype.showScores = function (how) {
        var op = "1"; //"block";
        if (how == false) {
            op = "0"; //"none";
        }
        // this.scoreDom.style.display = op;
        this.highscoreDom.style.opacity = op;
        this.scoresDom.style.opacity = op;
    };
    MenuOverlay.prototype.showBackButton = function (theCallback) {
        var _this_1 = this;
        this.tweens.add({
            targets: this.btnBack,
            y: this.game.canvas.height - this.btnBack.height,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: this.tweens.stagger(5),
            onComplete: function () {
                _this_1.tweeners--;
                theCallback();
            }
        });
        this.tweeners++;
    };
    MenuOverlay.prototype.hideBackButton = function (theCallback) {
        var _this_1 = this;
        this.tweens.add({
            targets: this.btnBack,
            y: this.game.canvas.height + 50,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: this.tweens.stagger(5),
            onComplete: function () {
                //this.showSpecificButtons(showList);
                _this_1.tweeners--;
                theCallback();
            }
        });
        this.tweeners++;
    };
    MenuOverlay.prototype.showSpecificButtons = function (theButtons, theCallback) {
        var _this_1 = this;
        this.tweens.add({
            targets: theButtons,
            y: this.buttonY,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: this.tweens.stagger(50),
            onComplete: function () {
                _this_1.tweeners--;
                theCallback();
            }
        });
        this.tweeners++;
    };
    MenuOverlay.prototype.showMenuSceneButtons = function (theCallback) {
        var _this_1 = this;
        this.showMenuItem(this.buttons[0], 0, function () { });
        this.showMenuItem(this.buttons[1], 50, function () { });
        this.showMenuItem(this.buttons[2], 100, function () {
            _this_1.showMenuItem(_this_1.logo, 0, function () { });
        });
    };
    MenuOverlay.prototype.showMenuItem = function (who, _delay, theCallback) {
        var _this_1 = this;
        this.tweens.add({
            targets: who,
            y: who.getData('homeY'),
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: _delay,
            onComplete: function () {
                _this_1.tweeners--;
                theCallback();
            }
        });
        this.tweeners++;
    };
    MenuOverlay.prototype.hideMenuSceneButtons = function (theCallback) {
        var _this_1 = this;
        this.tweens.add({
            targets: this.buttons,
            y: this.game.canvas.height + 100,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: this.tweens.stagger(50),
            onComplete: function () {
                _this_1.tweeners--;
                theCallback();
            }
        });
        this.tweeners++;
        this.tweens.add({
            targets: this.logo,
            y: this.game.canvas.height + 100,
            duration: 100,
            ease: 'Sine.easeInOut',
            onComplete: function () {
                _this_1.tweeners--;
            }
        });
        this.tweeners++;
    };
    return MenuOverlay;
}(Phaser.Scene)); //end scene
var PreloadScene = /** @class */ (function (_super) {
    __extends(PreloadScene, _super);
    function PreloadScene() {
        return _super.call(this, { key: 'PreloadScene' }) || this;
    }
    PreloadScene.prototype.preload = function () {
        AAKaiAds.preloadFullscreenAd();
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
        var probar = document.getElementById('progresso');
        this.load.on('progress', function (it) {
            var f = (it * 200);
            probar.style.width = f.toString() + "px";
        }, this);
        this.load.on('complete', function () {
            probar.style.opacity = "0";
            AAFunctions.fade(this, "out", 100, this.goToGameScene, gLogoDisplayLength);
        }, this);
        // *** LOAD ASSETS ***
        this.load.json('manifest', 'manifest.webapp');
        // Spritesheets
        this.load.setPath("assets/images/");
        this.load.image(kIMG_BG, "bg.png");
        this.load.image(kIMG_LOGO, "taara-logo.png");
        this.load.atlas(kSPRITE_ATLAS, kSPRITE_ATLAS + ".png", kSPRITE_ATLAS + ".json", null, null);
        // this.load.image('coverart', 'coverart.png');
        //Sound Effects
        this.load.setPath("assets/audio/");
        var ext = '.mp3';
        // These two sounds are the standard button sounds
        this.load.audio("button", "sfxButton_select" + ext);
        this.load.audio("play", "sfxButton_play" + ext);
        this.load.audio("back", "sfxButton_back" + ext);
    };
    PreloadScene.prototype.goToGameScene = function (a, c, b, d) {
        initGame();
        this.scene.start('MenuOverlay');
        this.scene.start('MenuScene');
    };
    return PreloadScene;
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
        hideBanner();
        mo.showScores(false);
        mo.showBackButton(function () { });
        AAKaiAnalytics.sendEvent("help");
        this.add.image(0, 0, kSPRITE_ATLAS, kIMG_HELP).setOrigin(0, 0);
    };
    return HelpScene;
}(Phaser.Scene));
// CHANGE BEFORE PUBLISHING * * * * * * * * * * * * * * * * * * * * * * * * * * * 
var kTESTMODE = 1; /* set to 0 for real ads */
var gGameName = "_TEMPLATE_";
var gGameVersion = "1.0.0";
// GOOGLE  -- ALSO ADD TO INDEX.HTML !!!!!!!
// UNIQUE TO EVERY GAME TEMPLATE ID IS taaragames.com for testing
var measurement_id = "G-NG6FFXYDP5";
var api_secret = "x8Mm4cF4Rjy4mIqI1KqRpg";
//used for arcade debug and console.logs()
var kDEBUG = false;
var gSHOW_FPS = false; // this can be dynamically set
var gBannerAdDuration = 1000 * 30;
var gUseBanner = true;
var gUseFullscreenAd = false;
var gShowFullscreenAdEveryX = 5;
var gFullscreenAdCount = 3;
// END CHANGE * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// ******************************************************************************
// ******************************************************************************
// ******************************************************************************
// ******************************************************************************
var manifest;
// used to move the score down when ads are displayed
var kBOTTOM_POSITION_FOR_AD = 45;
// STAGE OPTIONS ==================================
var gameBGColor = 0x333333;
var gStageWidth = 240; // I'm leaving it as a multiple to remind me of org size
var gStageHeight = 320; //228 * 2; //web is 228
// LOGO ============================================
// How long to stay on the Taara games Logo loading scene
var gLogoDisplayLength = 500;
var gamePrefsFile = "games.taara." + gGameName + ".prefs";
// MAIN ATLAS
var kSPRITE_ATLAS = 'spriteatlas2';
// BUTTONS
var kBTN_BACK = 'btnBackBottom.png';
var kBTN_PLAY = 'btnPlay.png';
var kBTN_SOUND_OFF = 'btnSoundOff.png';
var kBTN_SOUND_ON = 'btnSound.png';
var kBTN_HELP = 'btnHelp.png';
var kBTN_RESET_GAME = 'btnRestart.png';
var kBTN_SPONSOR = 'btnSponsor.png';
// UI SPRITES
var kIMG_BG = 'purpBG';
var kIMG_GAMEOVER = "gameover.png";
var kIMG_LOGO = "taara-logo.png";
var kIMG_HELP = 'help.png';
var debug_log;
if (kDEBUG)
    debug_log = console.log.bind(window.console);
else
    debug_log = function () { };
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
var AAKaiAds;
(function (AAKaiAds) {
    AAKaiAds.err = 0;
    AAKaiAds.bannerAdLoaded = false;
    AAKaiAds.fullscreenAdLoaded = false;
    AAKaiAds.fullscreenAdShowing = false;
    function preLoadBannerAd(lAdSize) {
        if (lAdSize === void 0) { lAdSize = 54; }
        var _this = this;
        getKaiAd({
            publisher: '60580691-026e-426e-8dac-a3b92289a352',
            app: gGameName,
            test: kTESTMODE,
            slot: 'banner',
            timeout: gBannerAdDuration,
            // 36 or 54 height
            // 36 ALWAYS items out and displays 23 in green
            h: lAdSize,
            w: 240,
            container: document.getElementById('sponsorad'),
            // Max supported size is 240x264
            onerror: function (err) {
                _this.err = err;
                debug_log("-----> banner ad error " + err);
                // //AAKaiAnalytics.sendEvent("vp_banner_error_" + err)
                _this.bannerAdLoaded = false;
                hideBanner();
                setTimeout(function () {
                    // //AAKaiAnalytics.sendEvent("vp_re_preLoadBannerAdFromError_30secTimeout")
                    AAKaiAds.preLoadBannerAd();
                }, 30000);
            },
            onready: function (ad) {
                _this.theBannerAd = ad;
                // Ad is ready to be displayed
                // calling 'display' will display the ad
                ad.call('display', {
                    // In KaiOS the app developer is responsible
                    // for user navigation, and can provide
                    // navigational className and/or a tabindex
                    tabindex: 0,
                    // if the application is using
                    // a classname to navigate
                    // this classname will be applied
                    // to the container
                    navClass: '',
                    // display style will be applied
                    // to the container block or inline-block
                    display: 'block',
                });
                // emitter.emit('showAd');
                //console.log("OK");
                debug_log("-----> banner ad loaded");
                _this.bannerAdLoaded = true;
                // //AAKaiAnalytics.sendEvent("vp_banner_loaded")
                showBanner();
                // this is here to use in case of legacy code
                // (<SponsorOverlay>game.scene.get("SponsorOverlay")).showBanner();
            }
        });
    }
    AAKaiAds.preLoadBannerAd = preLoadBannerAd;
    function preloadFullscreenAd() {
        var _this = this;
        getKaiAd({
            publisher: '60580691-026e-426e-8dac-a3b92289a352',
            app: gGameName,
            test: kTESTMODE,
            slot: 'fullscreen',
            onerror: function (err) {
                _this.err = err;
                // emitter.emit('hideAd');
                debug_log("-----> fullscreen ad err:".concat(err));
                // //AAKaiAnalytics.sendEvent("vp_fullscreenAd_error_" + err)
                setTimeout(function () { AAKaiAds.preloadFullscreenAd(); }, 1000 * 30);
                _this.fullscreenAdLoaded = false;
                _this.fullscreenAdShowing = false;
            },
            onready: function (ad) {
                // Ad is ready to be displayed
                // calling 'display' will display the ad
                // ad.call('display')
                debug_log("-----> fullscreen ad preloaded");
                // //AAKaiAnalytics.sendEvent("vp_banner_loaded");
                _this.theFullScreenAd = ad;
                _this.fullscreenAdLoaded = true;
                // user closed the ad (currently only with fullscreen)
                ad.on('close', function () {
                    if (_this.bannerAdLoaded == true) {
                        _this.fullscreenAdShowing = false;
                        showBanner();
                    }
                });
            }
        });
    }
    AAKaiAds.preloadFullscreenAd = preloadFullscreenAd;
    function showFullscreenAd() {
        debug_log("-----> show fullscreen ad");
        // //AAKaiAnalytics.sendEvent("vp_showFullscreenAd");
        //if (this.bannerAdLoaded == true){
        //   hideBanner();
        //}
        gFullscreenAdCount = 0;
        this.fullscreenAdShowing = true;
        this.theFullScreenAd.call('display');
        setTimeout(function () { AAKaiAds.preloadFullscreenAd(); }, 1000 * 30);
    }
    AAKaiAds.showFullscreenAd = showFullscreenAd;
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
            // emitter.emit('keydown', event);
        });
        document.addEventListener('keyup', function (event) {
            _this.handleKeyUp(event);
            // emitter.emit('keyup', event);
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
        // this.checkForHighScoreList();
        this.getScoreFromLocalStorage();
    }
    AAHighScores.initHighScores = initHighScores;
    // export function checkForHighScoreList() {
    //     var scr = localStorage.getItem(AAPrefs.leaderboardFile);
    //     if (scr == undefined) {
    //         this.createDummyHighScores();
    //     }
    // }
    // export function createDummyHighScores() {
    //     this.saveHighScoreToLeaderboard("Mark", Phaser.Math.RND.integerInRange(1, 10), true);
    //     this.saveHighScoreToLeaderboard("Lori", Phaser.Math.RND.integerInRange(1, 10), true);
    //     this.saveHighScoreToLeaderboard("Reese", Phaser.Math.RND.integerInRange(1, 10), true);
    //     this.saveHighScoreToLeaderboard("Sophia", Phaser.Math.RND.integerInRange(1, 10), true);
    //     this.saveHighScoreToLeaderboard("Loki", Phaser.Math.RND.integerInRange(1, 10), true);
    //     this.getHighScoreList();
    // }
    // export function saveHighScoreToLeaderboard(theName, theScoreToSave, save) {
    //     //add the highscore and name to the array
    //     var newScoreObj = { player: theName, score: theScoreToSave };
    //     this.highScoreList.push(newScoreObj);
    //     var byScore = this.highScoreList.sort(AAHighScores.compareDESC);
    //     // remove the last element in the array
    //     // since i only want 10 items
    //     if (byScore.length > this.maxHighScoreCount) {
    //         byScore.pop();//slice(byScore.length);
    //     }
    //     if (save == true) {
    //         localStorage.setItem(AAPrefs.leaderboardFile, JSON.stringify(this.highScoreList));
    //     }
    // }
    // //Sort low to high -> 1,2,3,4,5,6,7,8,9,10
    // export function compareASC(scoreA, scoreB) {
    //     return parseFloat(scoreA.score) - parseFloat(scoreB.score);
    // }
    // //sort high to low -> 10,9,8,7,6,5,4,3,2,1
    // export function compareDESC(scoreA, scoreB) {
    //     return parseFloat(scoreB.score) - parseFloat(scoreA.score);
    // }
    // export function postScoreToGameCenter(theScoreToSave) {
    //         var textData = 'saveHighScore:' + theScoreToSave.toString();
    //        (<any>window).webkit.messageHandlers.observe.postMessage(textData);
    // }
    // export function openGameCenter() {
    //        (<any>window).webkit.messageHandlers.observe.postMessage('showGameCenter:0');
    // }
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
        // if (theScoreToSave >= this.highScore) {
        this.highScore = theScoreToSave;
        localStorage.setItem(AAPrefs.prefsHighScore, theScoreToSave.toString());
        //}
        return this.highScore;
    }
    AAHighScores.saveScoreToLocalStorage = saveScoreToLocalStorage;
    // export function checkIfMadeItIntoHighscoreList(theNewScore) {
    //     let isGoodEnough = false;
    //     if (theNewScore == 0) {
    //         return false;
    //     }
    //     //Double check I loaded the highscore list
    //     if (this.highScoreList.length <= 0) {
    //         this.getHighScoreList();
    //     }
    //     // See if the score table is still less than maxHighScoreCount
    //     if (this.highScoreList.length < this.maxHighScoreCount) {
    //         isGoodEnough = true;
    //     }
    //     for (var i = 0; i < this.highScoreList.length; i++) {
    //         let oldScore = this.highScoreList[i].score;
    //         if (theNewScore >= oldScore) {
    //             isGoodEnough = true;
    //             break;
    //         }
    //     }
    //     return isGoodEnough;
    // }
    // export function getHighScoreList() {
    //     //console.log("getHighScore()")
    //     var scr = localStorage.getItem(AAPrefs.leaderboardFile);
    //     if (scr == undefined) {
    //         for (var i = 0; i < this.maxHighScoreCount; i++) {
    //             this.highScoreList[i] = this.highScoreObject;
    //         }
    //         localStorage.setItem(AAPrefs.leaderboardFile, JSON.stringify(this.highScoreList));
    //         // this.highScore = 0;
    //     } else {
    //         this.highScoreList = JSON.parse(scr);
    //     }
    // }
    // export function insertNameIntoHighScoreList(theName, theScoreToSave) {
    //     // public static getHighScoreList(theName, theScoreToSave) {
    //     let tempScoreList = this.highScoreList.slice(0);
    //     //add the higscore and name to the array
    //     var newScoreObj = { player: theName, score: theScoreToSave };
    //     tempScoreList.push(newScoreObj);
    //     var byScore = tempScoreList.sort(AAHighScores.compareDESC);
    //     // the last element in the array
    //     // since i only want maxHighScoreCount items
    //     if (byScore.length > AAHighScores.maxHighScoreCount) {
    //         byScore.pop();//slice(byScore.length);
    //     }
    //     return tempScoreList;
    // }
})(AAHighScores || (AAHighScores = {}));
// Google analytics engine to anon track user engagment
// https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag
var AAKaiAnalytics;
(function (AAKaiAnalytics) {
    function sendUA() {
        if (navigator.userAgent.toLowerCase().indexOf('kaios') > -1) {
            var _data = parseUA(window.navigator.userAgent);
            var moz = Object.keys(_data)[0];
            var it = _data[moz];
            var phone = Object.keys(it)[1];
            var kaios_version = _data["KAIOS"]["version"];
            sendEvent("device", { "phone": phone, "kaios_version": kaios_version });
        }
    }
    AAKaiAnalytics.sendUA = sendUA;
    function initAnalytics(_uid) {
        this.cid = _uid;
        // AAKaiAnalytics.sendUA();
    }
    AAKaiAnalytics.initAnalytics = initAnalytics;
    function sendEvent(_action, _params) {
        // if (kDEBUG == true){
        //   return
        // }
        // if (navigator.userAgent.toLowerCase().indexOf('kaios') > -1) {
        if (_params === void 0) { _params = {}; }
        //   fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
        //     method: "POST",
        //     body: JSON.stringify({
        //       client_id: this.cid,
        //       events: [{
        //         name: _action,
        //         params: _params,
        //       }]
        //     })
        //   });
        // }
    }
    AAKaiAnalytics.sendEvent = sendEvent;
    var parseUA = (function () {
        //useragent strings are just a set of phrases each optionally followed by a set of properties encapsulated in paretheses
        var part = /\s*([^\s/]+)(\/(\S+)|)(\s+\(([^)]+)\)|)/g;
        //these properties are delimited by semicolons
        var delim = /;\s*/;
        //the properties may be simple key-value pairs if;
        var single = [
            //it is a single comma separation,
            /^([^,]+),\s*([^,]+)$/,
            //it is a single space separation,
            /^(\S+)\s+(\S+)$/,
            //it is a single colon separation,
            /^([^:]+):([^:]+)$/,
            //it is a single slash separation
            /^([^/]+)\/([^/]+)$/,
            //or is a special string
            /^(.NET CLR|Windows)\s+(.+)$/
        ];
        //otherwise it is unparsable because everyone does it differently, looking at you iPhone
        var many = / +/;
        //oh yeah, bots like to use links
        var link = /^\+(.+)$/;
        var inner = function (properties, property) {
            var tmp;
            if (tmp = property.match(link)) {
                properties.link = tmp[1];
            }
            else if (tmp = single.reduce(function (match, regex) { return (match || property.match(regex)); }, null)) {
                properties[tmp[1]] = tmp[2];
            }
            else if (many.test(property)) {
                if (!properties.properties)
                    properties.properties = [];
                properties.properties.push(property);
            }
            else {
                properties[property] = true;
            }
            return properties;
        };
        return function (input) {
            var output = {};
            for (var match = void 0; match = part.exec(input); '') {
                output[match[1]] = __assign(__assign({}, (match[5] && match[5].split(delim).reduce(inner, {}))), (match[3] && { version: match[3] }));
            }
            return output;
        };
    })();
})(AAKaiAnalytics || (AAKaiAnalytics = {})); //end module
// export function sendEvent_old(_action: string, _value = 0) {
//   // gtag('event', escape(_action), {
//   //   event_category:  escape(gGameName),
//   //   event_label: escape(gGameName)
//   // });
//   debug_log(_action)
//   let pageName = escape(gGameName);//;//location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
//   let data = 'v=1&t=event&tid=' + this._googleID + '&cid=' + escape(this.cid) + '&ec=' + escape(gGameName) 
//   + '&el=' + escape(gGameName) + '&ea=' + escape(_action) + '&an=' + escape(gGameName) + '&av=' + escape(gGameVersion) + "&dp=" + escape(pageName) 
//   //+ "&cn=kaiosapp"
//   //'&ev='+_value+
//   //'&el='+gGameVersion
//   var http = new window.XMLHttpRequest();
//   (<any>http).mozAnon = true;
//   (<any>http).mozSystem = true;
//   var url = 'https://www.google-analytics.com/collect?';
//   var params = data;
//   http.open('POST', url, true);
//   //Send the proper header information along with the request
//   http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//   http.onreadystatechange = function () {//Call a function when the state changes.
//     if (http.readyState == 4 && http.status == 200) {
//        //console.log(http.responseText);
//     }
//   }
//   http.send(params);
// }
// non interact is implied here.
// export function sendSpecial(_action: string, _label: string, _value = 0) {
//   let pageName =  escape(gGameName);//gGameName;//location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
//   let data = 'v=1&t=event&ni=1&tid=' + this._googleID + '&cid=' + this.cid + '&ec=' + escape(gGameName) + '&ea=' + escape(_action) + '&el=' + escape(_label) + '&ev=' + _value + '&an=' + escape(gGameName) + '&av=' + escape(gGameVersion) + "&dp=" + escape(pageName)
//   // + "&cn=kaiosapp"
//   var http = new window.XMLHttpRequest();
//   (<any>http).mozAnon = true;
//   (<any>http).mozSystem = true;
//   var url = 'https://www.google-analytics.com/collect?';
//   var params = data;
//   http.open('POST', url, true);
//   //Send the proper header information along with the request
//   http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//   http.onreadystatechange = function () {//Call a function when the state changes.
//     // if (http.readyState == 4 && http.status == 200) {
//     //    console.log(http.responseText);
//     // }
//   }
//   http.send(params);
// }
// old init
// var http = new window.XMLHttpRequest();
// (<any>http).mozAnon = true;
// (<any>http).mozSystem = true;
// var url = 'https://www.google-analytics.com/collect?';
// // var params = 'v=1&t=pageview&tid='+ googleID +'&cid='+this.cid+'&dh=taara.games&dp='+ gGameName +'&dt='+gGameState;
// let pageName = escape(gGameName);//location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
// var params = 'v=1&t=pageview&tid=' + googleID + '&cid=' + escape(this.cid) + '&dt=' + escape(gGameName) + '&an=' + escape(gGameName) + '&av=' + escape(gGameVersion) + "&dp=" + pageName
// // + "&cn=kaiosapp";
// http.open('POST', url, true);
// console.log(url + params);
// //Send the proper header information along with the request
// http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
// http.onreadystatechange = function () {//Call a function when the state changes.
//   if (http.readyState == 4 && http.status == 200) {
//     //console.log(http.responseText);
//     AAKaiAnalytics.sendUA();
//   }
// }
// http.send(params);
// console.log(`phone=${phone}, v=${kaios_version}`)
// console.log(parseUA("Mozilla/5.0 (Mobile; N139DL; rv:84.0) Gecko/84.0 Firefox/84.0 KAIOS/3.1"));
// console.log( "window.navigator.userAgent" )
// sendEvent("device",{ "device": window.navigator.userAgent } );
// sendEvent("device",{"test":"test"} );
// let ua = escape(window.navigator.userAgent);
// let pageName =  escape(gGameName);//location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
// let data = 'v=1&t=event&tid=' + this._googleID + '&cid=' + escape(this.cid) + '&ec=' + escape("User Agent") + '&ea=' + escape(window.navigator.userAgent) + "&dp=" + escape(pageName)
// var http = new window.XMLHttpRequest();
// (<any>http).mozAnon = true;
// (<any>http).mozSystem = true;
// var url = 'https://www.google-analytics.com/collect?';
// var params = data;
// http.open('POST', url, true);
// //Send the proper header information along with the request
// http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
// http.onreadystatechange = function () {//Call a function when the state changes.
//   // if (http.readyState == 4 && http.status == 200) {
//   //   console.log(http.responseText);
//   // }else{
//   //   console.error(http.responseText);
//   // }
// }
// http.send(params);
// let _googleID;
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
var isKaiOS = true;
if (navigator.userAgent.toLowerCase().indexOf('kaios') > -1) {
    isKaiOS = true;
}
// This is called when preload is done.  This is new 10/16/20 so I can load the manifest nad use it's data.
function initGame() {
    manifest = game.cache.json.get('manifest');
    // because I only load kaios 2.x manifest I need to chekc for kaios 3.
    // If it is kaios 3 I append " 3" to the end of the name.  This name is used for KiaADs
    // Mozilla/5.0 (Mobile; TCL 4056W; rv:84.0) Gecko/84.0 Firefox/84.0 KAIOS/3.0
    var versionNumber = "";
    if (navigator.appVersion.indexOf("KAIOS/3") != -1) {
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
var centerGame = Phaser.Scale.CENTER_HORIZONTALLY; //CENTER_BOTH;
var myScale;
myScale = {
    parent: 'gameStage2',
    // autoCenter: Phaser.Scale.CENTER_BOTH, //Phaser.Scale.CENTER_HORIZONTALLY,
    mode: Phaser.Scale.NONE,
    width: gStageWidth,
    height: gStageHeight,
    autoRound: true
};
var scenes = [PreloadScene, MenuOverlay, MenuScene, HelpScene, GameScene];
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
window.onload = function () {
    var config = {
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
    };
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
            return;
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
// / <reference path='../phaser.d.ts'/>
// / <reference path='./shaders/OutlinePipeline.ts'/>
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    // constructor(_scene, _x, _y, _tex, _upFrame, _callback, theName, hasRollver) {
    function Button(_scene, _x, _y, _tex, _upFrame, _callback, hasRollver) {
        var _this = _super.call(this, _scene, _x, _y, _tex, _upFrame) || this;
        _this.clicked = false;
        _this.isSelected = false;
        // #UP,#DOWN or #BOTH
        _this.callWhen = 'both'; //default
        _this.rolloverColor = 0xffff99;
        _this.selectColor = 0x00FF00;
        _scene.add.existing(_this);
        _this.rollovedEnabled = hasRollver;
        _this.name = _upFrame;
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
//# sourceMappingURL=game.js.map