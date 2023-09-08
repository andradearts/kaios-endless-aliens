class MenuOverlay extends Phaser.Scene {

    
    pauseEnabled = false;

    gameoverSprite;

    // AUDIO
    sfxButton;
    sfxButtonPlay;
    sfxButtonBack;

    // UI
    btnPlay;
    btnSound;
    btnHelp;
    btnBack;
    btnResetGame;
    audioOffImage;
    logo;

    buttons;
    buttonY = 276;

    singlePress;

    pauseImage;

    tweeners = 0;

    //dom elements
    fpsMeter;
    fpsMeterCount = 0;
    fpsMeterMOD = 60;

    // score dom elements
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
        AAKaiControls.setUpInputs(this);

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
        // emitter.on('fullscreen', this.action_btnFullscreen, this);

        this.tweeners = 0;

        // Alternative to the KaiControls API I wrote that sometimes doesn't work.

        var _this = this;
        document.addEventListener('keydown', function (event) {
            _this.keydown(event)
        });
        document.addEventListener('keyup', function (event) {
            _this.keyup(event)
        });


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
        if (AAFunctions.areButtonsBouncing()) {
            return;
        }

        if (this.tweeners != 0) {
            return;
        }

        if (gGameState == states.kSTATE_GAMEOVER_DELAY){
            gGameState = states.kSTATE_GAMEOVER
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

       
    }

    keyup(theKeyEvent) {

        if (this.tweeners != 0) {
            return;
        }

        let theKey = theKeyEvent.key;
        switch (gGameState) {

            case states.kSTATE_MENU:
            case states.kSTATE_GAMEOVER:
            case states.kSTATE_GAMEOVER_DELAY:
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
                    this.action_BtnBack("up")
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
                case states.kSTATE_GAMEOVER_DELAY:
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
    }

    setUpAudio() {
        this.sfxButton = this.sound.add('button');
        this.sfxButtonPlay = this.sound.add('play');
        this.sfxButtonBack = this.sound.add('back');
    }

    //Set the game to it's initial state by initializing all the variables
    playGame() {

        AAKaiAnalytics.sendEvent("play");
        this.gameoverSprite.setVisible(false);
        hideBanner()

        this.hideMenuSceneButtons(() => { })
        this.hideBackButton(() => {
            this.scene.get("MenuScene").scene.start("GameScene");
        })


    }

    resetFromGame() {
        AAKaiAnalytics.sendEvent("back-paused");
        this.showResetButton(false);
        this.scene.stop('GameScene');
        this.backToMenu("GameScene");
    }

    gameover() {

        gGameState = states.kSTATE_GAMEOVER;

        this.gameoverSprite.setVisible(true);
        AAFunctions.tweenBounce(this, this.gameoverSprite);
        this.singlePress = true;

        this.showMenuSceneButtons(() => {
            this.showFullScreenAfterSomeTime()
        })

    }

    showFullScreenAfterSomeTime() {

        if (gUseFullscreenAd) {
            if (AAKaiAds.fullscreenAdLoaded) {
                if (++gFullscreenAdCount == gShowFullscreenAdEveryX) {
                    AAKaiAds.showFullscreenAd();
                    gFullscreenAdCount = 0;
                }
            }
        }
    }

    visitSponsor() {

        if (AAPrefs.playAudio == true)
            this.sfxButtonPlay.play();

        if ((gGameState == states.kSTATE_PLAYING) ||
            (gGameState == states.kSTATE_HELP)) {
            return
        }

        AAKaiAds.theBannerAd.call('click');
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
                    this.action_BtnBack("up")
                    break;
            }

            this.singlePress = true;
        }

        // Display the FPS eater egg
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
                if (gGameState == states.kSTATE_GAMEOVER_DELAY){
                    gGameState = states.kSTATE_GAMEOVER
                    return;
                }
                this.btnPlay.pointerUp(null);
                break;
        }
    }

    

    // **************************************************************************
    // SET UP THE UI
    // **************************************************************************

    setUpUI() {

        // this.buttonY = 276;

       

        this.logo = this.add.image(this.game.canvas.width / 2, this.game.canvas.height + 100, kSPRITE_ATLAS, kIMG_LOGO).setAlpha(.25);
        this.logo.setData('homeY', this.game.canvas.height - 25)

        let isVis = true;
        let numBadge;

        // Play Button #######################################################################
        this.btnPlay = new Button(this, 0, 0, kSPRITE_ATLAS, kBTN_PLAY, this.action_BtnPlay, true).setVisible(isVis);
        this.btnPlay.setData('homeY', this.buttonY - 25);
        // Sound Button #######################################################################

        let whichButton = kBTN_SOUND_OFF;
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
        this.btnBack.setOrigin(0)

        // Reset Button #######################################################################
        this.btnResetGame = new Button(this, 40, this.cameras.main.height + 25, kSPRITE_ATLAS, kBTN_RESET_GAME, this.action_btnResetGame, true);
        //.setVisible(true);


        // DISPLAY BUTTONS #######################################################
        // #######################################################################

        AAFunctions.displayButtons([this.btnHelp, this.btnPlay, this.btnSound], this.cameras.main, this.game.canvas.height + 100, -25);
      
        this.audioOffImage = this.add.image(this.btnSound.x, this.btnSound.y, kSPRITE_ATLAS,kBTN_SOUND_OFF).setVisible(!AAPrefs.playAudio);

        this.buttons = [this.btnHelp, this.btnPlay, this.btnSound];

        // GameOver Sprite #######################################################################
        this.gameoverSprite = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, kSPRITE_ATLAS,kIMG_GAMEOVER).setVisible(false);



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

    }


    playBtnSnd() {
        if (AAPrefs.playAudio == true)
            this.sfxButton.play();
    }
    playBackSnd() {
        if (AAPrefs.playAudio == true)
            this.sfxButtonBack.play();
    }
    playPlaySnd() {
        if (AAPrefs.playAudio == true)
            this.sfxButtonPlay.play();
    }

    update(time, delta) {
        if (gSHOW_FPS) {
            this.fpsMeter.innerText = (1000 / delta).toFixed(1);
        }

        //Yup...this ia a hack but ti works
        if (!AAPrefs.playAudio) {
            this.audioOffImage.y = this.btnSound.y;
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
        //this.scoreDom.classList.add("scoreBounce");
        // setTimeout(() => { this.scoreDom.classList.remove("scoreBounce"); }, 1200);

        if (thescore >= AAHighScores.highScore) {
            this.highscoreDom.innerText = thescore.toString();
            // this.highscoreDom.classList.add("scoreBounce");
            // setTimeout(() => { this.highscoreDom.classList.remove("scoreBounce"); }, 1200);
            AAHighScores.saveScoreToLocalStorage(thescore)
        }
    }


    disablePause() {
        this.pauseEnabled = false
    }

    // **************************************************************************
    // Button CALLBACKS
    // **************************************************************************
    action_BtnPlay(state) {

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

                // this.btnHelp.setTexture(kBTN_BACK);

                gGameState = states.kSTATE_PAUSED;

                this.pauseImage.setVisible(true);
                AAFunctions.tweenBounce(this, this.pauseImage);
                game.scene.pause("GameScene");
                AAKaiAnalytics.sendEvent("pause");

            } else if (gGameState == states.kSTATE_PAUSED) {

                gGameState = states.kSTATE_PLAYING;
                this.pauseImage.setVisible(false);
                game.scene.resume("GameScene");
                AAKaiAnalytics.sendEvent("resume");
            }
        }
    }

    action_BtnBack(_state) {

        if (_state == 'up') {
            this.playBackSnd();

            switch (gGameState) {

                case states.kSTATE_GAMEOVER:
                    this.hideBackButton(() => {
                        this.gameoverSprite.setVisible(false);

                        //this.scene.switch("MenuScene")
                        this.scene.get("GameScene").scene.stop("GameScene")
                        this.scene.get("GameScene").scene.start("MenuScene");
                    });

                    AAKaiAnalytics.sendEvent("back-gameover");
                    break;
                case states.kSTATE_HELP:
                    this.hideBackButton(() => {
                        this.gameoverSprite.setVisible(false);
                        this.scene.get("MenuScene").scene.stop("HelpScene")
                        this.scene.get("GameScene").scene.start("MenuScene");
                    });
                    AAKaiAnalytics.sendEvent("back-help");
                    break;

            }

        }
    }

    action_BtnHelp(_state) {
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
                    this.hideBackButton(() => {
                        this.hideMenuSceneButtons(() => {
                            this.scene.get("MenuScene").scene.stop("GameScene")
                            this.scene.get("MenuScene").scene.start("HelpScene");
                            gGameState = states.kSTATE_HELP;
                        });
                    });
                    break;
            }
            this.scene.bringToTop();
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

    hideGameOver() {
        this.gameoverSprite.setVisible(false);
    }

    backToMenu(fromWhere) {
        this.playBackSnd();

        this.scene.get(fromWhere).scene.start("MenuScene");

        if (this.pauseEnabled) {
            this.pauseImage.setVisible(false);
        }
        //hide the game over sprite
        this.gameoverSprite.setVisible(false);


        this.showMenuSceneButtons(() => {
            gGameState = states.kSTATE_MENU;
            showBanner();
        });
    }

    showScores(how) {
        let op = "1";//"block";
        if (how == false) {
            op = "0";//"none";
        }
        // this.scoreDom.style.display = op;
        this.highscoreDom.style.opacity = op;
        this.scoresDom.style.opacity = op;
    }

    showBackButton(theCallback) {
        this.tweens.add({
            targets: this.btnBack,
            y: this.game.canvas.height - this.btnBack.height,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: (<any>this.tweens).stagger(5),
            onComplete: () => {
                this.tweeners--;
                theCallback();
            }
        });
        this.tweeners++;
    }

    hideBackButton(theCallback) {
        this.tweens.add({
            targets: this.btnBack,
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

    showMenuSceneButtons(theCallback) {
        this.showMenuItem(this.buttons[0], 0, () => { });
        this.showMenuItem(this.buttons[1], 50, () => { });
        this.showMenuItem(this.buttons[2], 100, () => {
            this.showMenuItem(this.logo, 0, () => { });
        });
    }

    showMenuItem(who, _delay, theCallback) {

        this.tweens.add({
            targets: who,
            y: who.getData('homeY'),
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: _delay,
            onComplete: () => {
                this.tweeners--;
                theCallback();
            }
        });
        this.tweeners++;

    }
    hideMenuSceneButtons(theCallback) {

        this.tweens.add({
            targets: this.buttons,
            y: this.game.canvas.height + 100,
            duration: 200,
            ease: 'Sine.easeInOut',
            delay: (<any>this.tweens).stagger(50),
            onComplete: () => {
                this.tweeners--;
                theCallback();
            }
        });
        this.tweeners++;


        this.tweens.add({
            targets: this.logo,
            y: this.game.canvas.height + 100,
            duration: 100,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.tweeners--;
            }
        });
        this.tweeners++;

    }

}//end scene


