


class MenuOverlay extends Phaser.Scene {

    // debugText;
    // debugInfo;

    // v2 ================================================================

    tagVOffset = 23;
    tags = [];
    buttonBG;

    audioOffImage;

    //end v2 ================================================================

    //kHideDistance = 350;
    pauseEnabled = false;

    gameoverSprite;

    // AUDIO
    sfxButton;

    // UI
    btnPlay;
    btnSound;
    btnHelp;
    btnSettings;
    btnMoreGames;
    btnFullscreen;
    btnResetGame;

    //btnSponsor;

    //containers for the buttons so I can hold the number badges
    c_btnPlay;
    c_btnSound;
    c_btnHelp;
    c_btnSettings
    c_btnMoreGames;
    c_btnFullScreen;

    buttons;
    currentActiveButton = 4; // start on the play button

    btnPause;
    buttonTween;

    buttonY;
    buttonY2;

    transitioning;

    // scoreText;
    // highScoreText;
    // fpsText;
    singlePress;

    pauseImage;
    pauseKey;
    cursors;

    tweeners = 0;

    //dom elements
    fpsMeter;
    fpsMeterCount = 0;
    fpsMeterMOD = 60;

    scoreDom;
    highscoreDom;
    scoresDom;

    constructor() {
        super({ key: 'MenuOverlay' });
    }

    preload() {

        // Get the Prefs & high score
        AAPrefs.initGamePrefs(gamePrefsFile);
        AAHighScores.initHighScores();


        if (!gIsTouchDevice) {
            AAKaiControls.setUpInputs(this);
            emitter.on('keydown', this.keydown, this);
            emitter.on('keyup', this.keyup, this);
        }

    }


    create() {

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

        this.tweeners = 0;

        // var txt = [
        //     "window innerHeight: " + window.innerHeight + " ",
        //     "window innerWidth: " + window.innerWidth + " ",
        //     "document.referrer: " + document.referrer + " ",
        //     "document.fullscreenEnabled: " + document.fullscreenEnabled + " ",
        //     "document.documentElement.clientHeight: " + document.documentElement.clientHeight + " ",
        //     "document.documentElement.clientWidth: " + document.documentElement.clientWidth + " ",

        // ];



    }

    removeAllListeners() {
        this.events.removeListener('gameover');
        this.events.removeListener('setscore');
        this.events.removeListener('setscorefloat');

        emitter.removeListener('fullscreen');
        emitter.removeListener('keyDown');
        emitter.removeListener('keyUp');

    }

    keydown(theKeyEvent) {
        if ((this.transitioning) || (AAFunctions.areButtonsBouncing())) {
            return;
        }

        if (this.tweeners != 0) {
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
            case "SoftLeft":
            case "SoftRight":
                theKeyEvent.preventDefault();
                break;

        }
    }

    keyup(theKeyEvent) {

        if (this.tweeners != 0) {
            return;
        }

        let theKey = theKeyEvent.key;
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

        if ((theKeyEvent.key == "SoftRight") || (theKeyEvent.key == "8")) {
            // this.action_sponsorButton("up");
            this.visitSponsor();
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
                    this.playBtnSnd();
                    AAKaiAnalytics.sendEvent("quitgame");
                    this.backToMenu("GameScene");
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
            case "SoftRight":
            case "SoftLeft":
                theKeyEvent.preventDefault();
                break;

        }
    }

    setUpAudio() {
        this.sfxButton = this.sound.add('button');
    }

    //Set the game to it's initial state by initializing all the variables
    playGame() {

        AAKaiAnalytics.sendEvent("play");
        this.gameoverSprite.setVisible(false);

        if (this.pauseEnabled) {
            this.btnPause.setVisible(true);
        }

        this.hideNumberTags(this.tags);
        this.hideAllButtons(() => {
            this.hideButtonBG(() => {
                this.scene.get("MenuScene").scene.start("GameScene");
            });
        });
    }

    resetFromGame() {
        AAKaiAnalytics.sendEvent("back-paused");
        // this.resetToMenu();
        this.showResetButton(false);
        this.scene.stop('GameScene');
        this.backToMenu("GameScene");
    }

    gameover() {

        gGameState = states.kSTATE_GAMEOVER;


        // Make sure the correct texture for hte back button is being used.
        this.btnHelp.setTexture(kSPRITE_ATLAS, kBTN_BACK);

        this.showButtonBG(() => {
            this.showNumberTags(this.tags);
            this.showSpecificButtons(this.buttons, () => { });
        });

        // Hide the pause button
        if (this.pauseEnabled) {
            this.btnPause.setVisible(false);
        }

        // show the gameover image
        this.gameoverSprite.setVisible(true);
        AAFunctions.tweenBounce(this, this.gameoverSprite);

        this.singlePress = true;


    }

    checkForPause(theKey) {
        if (this.pauseEnabled) {

            // if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            if (theKey == "*") {
                this.singlePress = true;
                this.action_btnPause("up");
            }
        }

    }


    // This check for the center button when the help scene is displayed
    // and then take you back home to the main menu;
    checkHelpControls(theKey) {
        if (theKey == "1") {

            switch (gGameState) {
                case states.kSTATE_HELP:
                    this.backToMenu("HelpScene");
                case states.kSTATE_MOREGAMES:
                    this.backToMenu("MoreGamesScene");
                    break;
                case states.kSTATE_SETTINGS:
                    this.backToMenu("SettingsScene");
                    break;
            }

            this.singlePress = true;
        }

        // Display the FPS eater egg
        if (kTOUCH == 0) {
            if (theKey == "*") {
                this.singlePress = true;
                gSHOW_FPS = !gSHOW_FPS
                if (gSHOW_FPS) {
                    this.fpsMeter.style.display = "block";
                } else {
                    this.fpsMeter.style.display = "none";
                }
            }
        }
    }

    checkPauseControls(theKey) {
        if (theKey == "1") {
            this.btnHelp.pointerUp(null);
        }
    }

    checkMenuControls(theKey) {

        if (gFullscreenAdShowing) { return };

        switch (theKey) {
            case "8":
            case "SoftRight":
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
    }
    checkGameOverMenuControls(theKey) {

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
    }


    // **************************************************************************
    // SET UP THE UI
    // **************************************************************************

    setUpUI() {

        this.buttonY = 276;

        // Set up background art for buttons
        this.buttonBG = this.add.graphics();
        this.buttonBG.lineStyle(3, 0x5C5822, 1);
        this.buttonBG.fillStyle(0xFBED62, 1);

        //  32px radius on the corners
        this.buttonBG.fillStyle(0x5C5822, 1);
        this.buttonBG.fillRoundedRect(4, 250, 232, 52, 23);
        this.buttonBG.fillStyle(0xFBED62, 1);
        this.buttonBG.fillRoundedRect(7, 253, 226, 46, 20);

        this.buttonBG.alpha = .63;

        let isVis = true;
        let numBadge;

        // Play Button #######################################################################
        this.btnPlay = new Button(this, 0, 0, kSPRITE_ATLAS, kBTN_PLAY, this.action_BtnPlay, "play", true).setVisible(isVis);

        // Sound Button #######################################################################

        let whichButton = kBTN_SOUND_OFF;
        // if (AAPrefs.playAudio) {
        //     whichButton = kBTN_SOUND_ON;
        // }

        this.btnSound = new Button(this, 0, 5, kSPRITE_ATLAS, kBTN_SOUND_ON, this.action_btnSound, "sound", true).setVisible(isVis);

        // Help/Back Button #######################################################################

        whichButton = kBTN_HELP;
        this.btnHelp = new Button(this, 0, 5, kSPRITE_ATLAS, whichButton, this.action_BtnHelpBack, "help", true).setVisible(true);


        // Settings Button #######################################################################
        whichButton = kBTN_SETTINGS;
        this.btnSettings = new Button(this, 0, 5, kSPRITE_ATLAS, whichButton, this.action_btnSettings, "settings", true).setVisible(kSHOW_SETTINGS_BUTTON);

        // More Games Button #######################################################################
        this.btnMoreGames = new Button(this, 0, 0, kSPRITE_ATLAS, kBTN_MORE_GAMES, this.action_btnMoreGames, "more", true).setVisible(isVis);


        // Reset Button #######################################################################
        this.btnResetGame = new Button(this, 40, this.cameras.main.height + 25, kSPRITE_ATLAS, kBTN_RESET_GAME, this.action_btnResetGame, "resetgame", true);
        //.setVisible(true);


        // Fullscreen Button #######################################################################
        // this.btnFullscreen = new Button(this, 0, 5, kSPRITE_ATLAS, kBTN_FULLSCREEN_ON, this.action_btnFullscreen, "fullscreen", true).setVisible(isVis);
        // if (kTOUCH == 0) {
        //     numBadge = this.add.image(0, -14, kSPRITE_ATLAS, "tag#.png").setVisible(gIsTouchDevice);
        //     this.c_btnFullScreen = this.add.container(this.cameras.main.width - 10, this.cameras.main.height - 10, [this.btnFullscreen, numBadge]).setVisible(kSHOW_FULLSCREEN_BUTTON);
        // } else {
        //     this.c_btnFullScreen = this.add.container(this.cameras.main.width - 10, this.cameras.main.height - 10, [this.btnFullscreen]).setVisible(kSHOW_FULLSCREEN_BUTTON);
        // }
        // Pause Button #######################################################################

        // whichButton = 'btnPause.png';
        // this.btnPause = new Button(this, this.cameras.main.width - 35, 20, kSPRITE_ATLAS, whichButton, this.action_btnPause, "pause", true).setVisible(false);



        // DISPLAY BUTTONS #######################################################
        // #######################################################################

        // HELP -- PLAY -- SOUND
        let buttonOffset = 45;
        if (kTOUCH == 1) {
            buttonOffset *= 4;
        }

        if (kSHOW_SETTINGS_BUTTON) {
            AAFunctions.displayButtons([this.btnHelp, this.btnMoreGames, this.btnPlay, this.btnSound, this.btnSettings], this.cameras.main, this.buttonY, -25);
        } else {
            AAFunctions.displayButtons([this.btnHelp, this.btnMoreGames, this.btnPlay, this.btnSound], this.cameras.main, this.buttonY, -25);
        }

        this.tags = [
            this.add.image(this.btnHelp.x, this.btnHelp.y - this.tagVOffset, kSPRITE_ATLAS, kTAG_1).setVisible(!gIsTouchDevice),
            this.add.image(this.btnMoreGames.x, this.btnMoreGames.y - this.tagVOffset, kSPRITE_ATLAS, kTAG_2).setVisible(!gIsTouchDevice),
            this.add.image(this.btnPlay.x, this.btnPlay.y - this.tagVOffset, kSPRITE_ATLAS, kTAG_5).setVisible(!gIsTouchDevice),
            this.add.image(this.btnSound.x, this.btnSound.y - this.tagVOffset, kSPRITE_ATLAS, kTAG_3).setVisible(!gIsTouchDevice)
        ];

        //Settings Button is a special case.  Some games do have a settings buttons
        if (kSHOW_SETTINGS_BUTTON) {
            let settBtnTag = this.add.image(this.btnSettings.x, this.btnSettings.y - this.tagVOffset, kSPRITE_ATLAS, kTAG_4);
            settBtnTag.setVisible(kSHOW_SETTINGS_BUTTON || !gIsTouchDevice);
            this.tags.push(settBtnTag);

        }

        this.audioOffImage = this.add.image(this.btnSound.x, this.btnSound.y, kSPRITE_ATLAS, kBTN_SOUND_OFF).setVisible(!AAPrefs.playAudio);

        // SETTINGS -- MORE GAMES -- FULLSCREEN
        if (kTOUCH == 1) {
            this.buttonY2 = (this.cameras.main.height - 105 * 3);
        } else {
            this.buttonY2 = (this.cameras.main.height - 105);
        }


        if (kSHOW_SETTINGS_BUTTON) {
            this.buttons = [this.btnHelp, this.btnMoreGames, this.btnPlay, this.btnSound, this.btnSettings];
        } else {
            this.buttons = [this.btnHelp, this.btnMoreGames, this.btnPlay, this.btnSound];
        }

        // Pause Graphic #######################################################################

        this.createPauseGrc();

        // GameOver Sprite #######################################################################

        this.gameoverSprite = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2.5, kSPRITE_ATLAS, kIMG_GAMEOVER).setVisible(false);

        // Number Font #######################################################################

        //this.makeTheNumbersFont();

        // Score Text #######################################################################

        // let scoreSize = 32;//15 * 1.5;

        // if (kTOUCH == 1) {
        //     scoreSize = 32 * 2;//15 * 3;
        // }

        // This is the main div holding the score and high score text
        this.scoresDom = document.getElementById('scores');
        this.scoresDom.style.opacity = "1";
        
        this.scoreDom = document.getElementById('scoreText');
        // this.scoreDom.style.display = 'block';

        this.highscoreDom = document.getElementById('highscoreText');
        // this.highscoreDom.style.display = 'block';
        this.highscoreDom.innerText = AAHighScores.highScore;

        // this.scoreText = this.add.bitmapText(9, 6, 'sysFont', '0', scoreSize).setDepth(999);
        // //this.add.bitmapText(9, 6, 'numbersFont', '0', scoreSize).setDepth(999);
        // this.scoreText.setOrigin(0);
        // this.scoreText.setTint(0xffffff);
        // this.scoreText.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        // this.scoreText.scaleX = .5;
        // this.scoreText.scaleY = .5;

        // HighScore Text #######################################################################

        // scoreSize = 16;//8 * 1.5;
        // let touchOffset = 1.5;
        // if (kTOUCH == 1) {
        //     scoreSize = 16 * 3;//8 * 3;
        //     touchOffset = 3;
        // }
        // this.highScoreText = this.add.bitmapText(9, 25 * touchOffset, 'sysFont', AAHighScores.highScore, scoreSize).setDepth(999);

        // // this.add.bitmapText(12, 25 * touchOffset, 'numbersFont', AAHighScores.highScore, scoreSize).setDepth(999);
        // this.highScoreText.setOrigin(0);
        // this.highScoreText.setTint(0xcccccc);
        // this.highScoreText.scaleX = .5;
        // t5his.highScoreText.scaleY = .5;

        // FPS TEXT #######################################################################
        this.fpsMeter = document.getElementById('fpsMeter');

        // this.fpsText = this.add.bitmapText(9, this.game.canvas.height / 2, 'sysFont', '0.0', 16).setVisible(gSHOW_FPS);
        // this.fpsText.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        // this.fpsText.setTint(0x666666);

        // this.debugInfo = this.add.bitmapText(10, 130, 'numbersFont', '0', scoreSize).setDepth(999);

        var element = this.add.dom(10, 90).createFromCache('newgameHTML').setOrigin(0, 0);

    }

    // makeTheNumbersFont() {
    //     let config = {
    //         image: 'numbersFont',
    //         width: 40,
    //         height: 40,
    //         offset: { x: 0 },
    //         chars: '0123456789.',
    //         charsPerRow: 11
    //     };

    //     // I have to put the <any> here because the typescript defs have an error
    //     // somewhere that won't let me use the param unless I add <any>
    //     let it = Phaser.GameObjects.RetroFont.Parse(this, <any>config);
    //     this.cache.bitmapFont.add('numbersFont', it);
    // }


    playBtnSnd() {
        if (AAPrefs.playAudio == true)
            this.sfxButton.play();
    }

    // I some times won't need with either full screen or the settings button.
    // ALWAYS show HELP - PLAY - SOUND - MOREGAMES
    buttonSetVisible(who, how) {
        switch (who) {
            case 'settings':
                this.c_btnSettings.setVisible(how);
                break;
            case "fullscreen":
                this.c_btnFullScreen.setVisible(how);
            default:
                break;
        }
    }

    update(time, delta) {
        if (gSHOW_FPS) {
            this.fpsMeter.innerText = (1000 / delta).toFixed(1);
        }
        if ((++this.fpsMeterCount % this.fpsMeterMOD) == 0) {
            addToFPSArray((1000 / delta).toFixed(1));
        }
        //Yup...this ia a hack but ti works
        if (!AAPrefs.playAudio) {
            this.audioOffImage.y = this.btnSound.y;
        }

    }


    navigateDirectionToButton(dir) {

        let nextButton = Phaser.Math.Clamp(this.currentActiveButton + dir, 0, this.buttons.length - 1);

        if (this.buttons[nextButton].visible == false) {
            nextButton += dir;
        }
        nextButton = Phaser.Math.Clamp(nextButton, 0, this.buttons.length - 1);
        if (this.buttons[nextButton].visible == true) {
            this.buttons[this.currentActiveButton].first.deselect();

            this.buttons[nextButton].first.select(true);
            this.currentActiveButton = nextButton;

        }

    }

    setScore(data) {
        let thescore = data[0];
        this.displayScore(thescore);
    }

    setScoreFloat(data) {
        let thescore = data[0].toFixed(2);
        this.displayScore(thescore);
    }

    displayScore(thescore) {
        this.scoreDom.innerText = thescore.toString();
        this.scoreDom.classList.add("scoreBounce");
        setTimeout(() => { this.scoreDom.classList.remove("scoreBounce"); }, 1200);

        if (thescore >= AAHighScores.highScore) {
            this.highscoreDom.innerText = thescore.toString();
            this.highscoreDom.classList.add("scoreBounce");
            setTimeout(() => { this.highscoreDom.classList.remove("scoreBounce"); }, 1200);
            AAHighScores.saveScoreToLocalStorage(thescore)
        }
    }


    visitSponsor() {
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
    }


    createPauseGrc() {

        let graphics = this.add.graphics();

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

        let graphics2 = this.add.graphics();

        let startx = this.sys.canvas.width / 2 - 30;
        let starty = 170;
        let pHeight = 60;
        graphics2.moveTo(startx, starty);
        graphics2.lineTo(startx + 20, starty);
        graphics2.lineTo(startx + 20, starty + pHeight);
        graphics2.lineTo(startx, starty + pHeight);

        graphics2.closePath();
        graphics2.strokePath();
        graphics2.fillStyle(0xFFFFFF, 1);
        graphics2.fill();

        // =======================================================

        let graphics3 = this.add.graphics();

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
    }

    disablePause() {
        this.pauseEnabled = false
        // this.btnPause.setVisible(false);
    }

    // **************************************************************************
    // **************************************************************************
    // **************************************************************************
    // Button CALLBACKS
    // **************************************************************************
    action_BtnPlay(state) {

        if (this.tweeners != 0) {
            return;
        }

        if (state == 'up') {
            this.playBtnSnd();


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
                    break
            }

        }
    }

    action_btnSound(_state) {
        if (this.tweeners != 0) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();

            AAPrefs.toggleAudio();

            if (AAPrefs.playAudio == true) {
                AAKaiAnalytics.sendEvent("soundOn");
            } else {
                AAKaiAnalytics.sendEvent("soundOff");
            }
            this.audioOffImage.setVisible(!AAPrefs.playAudio);

            AAFunctions.tweenBounce(this, this.btnSound);

        }
    }

    action_btnPause(_state) {
        if (this.tweeners != 0) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();

            if (gGameState == states.kSTATE_PLAYING) {

                this.btnHelp.setTexture(kSPRITE_ATLAS, kBTN_BACK);

                gGameState = states.kSTATE_PAUSED;

                this.pauseImage.setVisible(true);
                AAFunctions.tweenBounce(this, this.pauseImage);
                // (<SponsorOverlay>this.scene.get("SponsorOverlay")).showBanner();
                game.scene.pause("GameScene");
                AAKaiAnalytics.sendEvent("pause");

            } else if (gGameState == states.kSTATE_PAUSED) {

                gGameState = states.kSTATE_PLAYING;
                this.pauseImage.setVisible(false);
                // (<SponsorOverlay>this.scene.get("SponsorOverlay")).hideBanner();
                game.scene.resume("GameScene");
                AAKaiAnalytics.sendEvent("resume");
            }
        }
    }

    action_BtnHelpBack(_state) {
        if (this.tweeners != 0) {
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


                    this.hideNumberTags(this.tags);
                    this.hideAllButtons(() => {
                        this.hideButtonBG(() => {
                            this.btnHelp.setTexture(kSPRITE_ATLAS, kBTN_BACK);
                            this.showButtonBG(() => {
                                this.showNumberTags(this.tags[0]);
                                this.showSpecificButtons([this.btnHelp], () => { });
                            });
                        });
                    });

                    // (<SponsorOverlay>this.scene.get("SponsorOverlay")).
                    hideBanner();
                    AAKaiAnalytics.sendEvent("help");
                    break;

                case states.kSTATE_GAMEOVER:

                    this.hideNumberTags(this.tags);
                    this.hideAllButtons(() => {
                        this.hideButtonBG(() => {
                            this.btnHelp.setTexture(kSPRITE_ATLAS, kBTN_HELP);
                            this.showButtonBG(() => {
                                this.scene.get("GameScene").scene.start("MenuScene");
                                gGameState = states.kSTATE_MENU;
                                this.showNumberTags(this.tags);
                                this.showSpecificButtons(this.buttons, () => { });
                            });
                        });
                    });

                    AAKaiAnalytics.sendEvent("back-gameover");
                    break;

                case states.kSTATE_MOREGAMES:
                    this.backToMenu("MoreGamesScene");
                case states.kSTATE_SETTINGS:
                    this.backToMenu("SettingsScene");
                    break;
                case states.kSTATE_PAUSED:
                case states.kSTATE_HELP:
                    this.backToMenu("HelpScene");
                    break;
            }
            this.scene.bringToTop();
        }
    }



    action_btnFullscreen(_state) {
        if (this.tweeners != 0) {
            return;
        }
        if (kSHOW_FULLSCREEN_BUTTON) {
            if (gGameState == states.kSTATE_MENU) {
                if (_state == 'up') {
                    this.playBtnSnd();
                    if (this.scale.isFullscreen) {
                        this.btnFullscreen.setTexture(kSPRITE_ATLAS, kBTN_FULLSCREEN_ON);
                        this.scale.stopFullscreen();
                    } else {
                        this.btnFullscreen.setTexture(kSPRITE_ATLAS, kBTN_FULLSCREEN_OFF);
                        this.scale.startFullscreen();
                    }
                }
            }
        }
    }

    action_btnSettings(_state) {
        // if (gGameState == states.kSTATE_MENU) {
        if (this.tweeners != 0) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();

            this.scene.get("MenuScene").scene.start("SettingsScene");
            gGameState = states.kSTATE_SETTINGS;

            this.hideNumberTags(this.tags);
            this.hideAllButtons(() => {
                this.hideButtonBG(() => {
                    this.btnHelp.setTexture(kSPRITE_ATLAS, kBTN_BACK);
                    this.showButtonBG(() => {
                        this.showNumberTags(this.tags[0]);
                        this.showSpecificButtons([this.btnHelp], () => { });
                    });
                });
            });

            // (<SponsorOverlay>this.scene.get("SponsorOverlay")).
            hideBanner();
            AAKaiAnalytics.sendEvent("settings");

        }
        // }
    }
    action_btnMoreGames(_state) {
        if (this.tweeners != 0) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();

            this.scene.get("MenuScene").scene.start("MoreGamesScene");
            gGameState = states.kSTATE_MOREGAMES;

            this.hideNumberTags(this.tags);
            this.hideAllButtons(() => {
                this.hideButtonBG(() => {
                    this.btnHelp.setTexture(kSPRITE_ATLAS, kBTN_BACK);
                    this.showButtonBG(() => {
                        this.showNumberTags(this.tags[0]);
                        this.showSpecificButtons([this.btnHelp], () => { });
                    });
                });
            });

            // (<SponsorOverlay>this.scene.get("SponsorOverlay")).
            hideBanner();
            AAKaiAnalytics.sendEvent("moregames");

        }
    }

    //V2 ==================================================

    action_btnResetGame(_state) {
        if (this.tweeners != 0) {
            return;
        }
        if (gGameState == states.kSTATE_MENU) {
            if (_state == 'up') {
                this.playBtnSnd();
                this.gameover();
            }
        }
    }

    showResetButton(how) {
        //this.btnResetGame.setVisible(how);
        let bY = this.cameras.main.height - 5;
        if (how === false) {
            bY = this.cameras.main.height + 25;
        }
        // this.btnResetGame.setVisible(true);
        this.tweens.add({
            targets: this.btnResetGame,
            y: bY,
            duration: 200,
            onComplete: () => {
                this.tweeners--;
            },
            onCompleteScope: this
        });
        this.tweeners++;
    }

    backToMenu(fromWhere) {
        this.hideNumberTags(this.tags[0]);

        this.hideSpecificButtons([this.btnHelp], () => {
            this.hideButtonBG(() => {
                this.scene.get(fromWhere).scene.start("MenuScene");

                // hide the reset button


                this.btnHelp.setTexture(kSPRITE_ATLAS, kBTN_HELP);

                if (this.pauseEnabled) {
                    this.btnPause.setVisible(false);
                    this.pauseImage.setVisible(false);
                }
                //hide the game over sprite
                this.gameoverSprite.setVisible(false);

                this.showButtonBG(() => {
                    this.showNumberTags(this.tags);
                    this.showSpecificButtons(this.buttons, () => {
                        gGameState = states.kSTATE_MENU;

                        // if (false == this.scoreText.visible) {
                        //     this.scoreText.setVisible(true);
                        //     this.highScoreText.setVisible(true);
                        // }
                        this.hideScores(false);
                        // (<SponsorOverlay>this.scene.get("SponsorOverlay")).
                        showBanner();
                    });

                });
            });
        });
    }

    hideNumberTags(theTags) {
        this.tweens.add({
            targets: theTags,
            y: this.game.canvas.height + 20,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: (<any>this.tweens).stagger(50),
            onComplete: () => {
                this.tweeners--;
            },
            onCompleteScope: this
        });
        this.tweeners++;
    }

    showNumberTags(theTags) {
        this.tweens.add({
            targets: theTags,
            y: this.buttonY - this.tagVOffset,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: (<any>this.tweens).stagger(50),
            onComplete: () => {
                this.tweeners--;
            },
            onCompleteScope: this
        });
        this.tweeners++;
    }
    hideScores(how) {
        let op = "1";//"block";
        if (how == true) {
            op = "0";//"none";
        }
        // this.scoreDom.style.display = op;
        // this.highscoreDom.style.display = op;
        this.scoresDom.style.opacity = op;
    }
    hideAllButtons(theCallback) {

        this.showResetButton(false);
        // if (AAPrefs.playAudio){
        //     this.audioOffImage.setVisible(false);
        // }
        this.tweens.add({
            targets: this.buttons,
            y: this.game.canvas.height + 50,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: (<any>this.tweens).stagger(5),
            onComplete: () => {
                //this.showSpecificButtons(showList);
                this.tweeners--;
                theCallback();
            }
        });
        this.tweeners++;
    }

    hideButtonBG(theCallback) {

        this.tweens.add({
            targets: this.buttonBG,
            x: -this.game.canvas.width - 50,
            duration: 100,
            ease: 'Sine.easeInOut',
            onComplete: () => { theCallback(); this.tweeners--; }
        });
        this.tweeners++;
    }

    showButtonBG(theCallback) {
        this.tweens.add({
            targets: this.buttonBG,
            x: 0,//this.game.canvas.width / 2,
            duration: 100,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.tweeners--;
                theCallback();
            },
            callbackScope: this
        });
        this.tweeners++;
    }


    hideSpecificButtons(theButtons, theFunction) {
        this.tweens.add({
            targets: theButtons,
            y: this.game.canvas.height + 50,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: (<any>this.tweens).stagger(50),
            onComplete: () => {
                this.tweeners--;
                theFunction(theFunction);
            }
        });
        this.tweeners++;
    }

    showSpecificButtons(theButtons, theCallback) {
        this.tweens.add({
            targets: theButtons,
            y: this.buttonY,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: (<any>this.tweens).stagger(50),
            onComplete: () => {
                this.tweeners--;
                theCallback();
            }
        });
        this.tweeners++;

    }
}//end scene


