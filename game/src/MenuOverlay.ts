


class MenuOverlay extends Phaser.Scene {

    // debugText;
    // debugInfo;

    kHideDistance = 350;
    _SHOWFPS = false;
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
    //btnSponsor;

    //containers for the buttons so I can hold the number badges
    c_btnPlay;
    c_btnSound;
    c_btnHelp;
    c_btnSettings
    c_btnMoreGames;
    c_btnFullScreen;


    btnPause;
    buttonTween;

    buttonY;
    buttonY2;

    transitioning;

    scoreText;
    highScoreText;
    fpsText;
    singlePress;

    pauseImage;
    pauseKey;


    constructor() {
        super({ key: 'MenuOverlay' });
    }

    preload() {
        // Get the Prefs & high score
        AAPrefs.initGamePrefs(gamePrefsFile);
        AAHighScores.initHighScores();
        // AAKaiAds.displayFullscreenAd();
        AAKaiAds.preLoadBannerAd();

    }


    create() {

        AAKaiControls.setUpInputs(this);

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

        emitter.on('keydown', this.keydown, this);
        emitter.on('keyup', this.keyup, this);


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

        if (gGameState != states.kSTATE_MENU) {
            if (theKeyEvent.key == "Backspace") {
                theKeyEvent.preventDefault();
            }
        }

        switch (theKeyEvent.key) {
            case "1": //help
            case "2": //play 
            case "3": //sound
            case "4": //settings
            case "5": //moregames
            case "#": //fullscreen
            case "8": //sponsor
                theKeyEvent.preventDefault();
                break;

        }
    }

    keyup(theKeyEvent) {
        if ((this.transitioning) || (AAFunctions.areButtonsBouncing())) {
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

        if (theKeyEvent.key == "SoftRight") {
            // this.action_sponsorButton("up");
            (<SponsorOverlay>this.scene.get("SponsorOverlay")).action_sponsorButton("up")

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
            case "2": //play 
            case "3": //sound
            case "4": //settings
            case "5": //moregames
            case "#": //fullscreen
            case "8": //sponsor
                theKeyEvent.preventDefault();
                break;

        }
    }

    setUpAudio() {
        this.sfxButton = this.sound.add('button');
    }

    resetByBackSpace() {
        this.playBtnSnd();
        AAKaiAnalytics.sendEvent("quitgame");
        this.resetToMenu();
    }

    //Set the game to it's initial state by initializing all the variables
    reset() {

        AAKaiAnalytics.sendEvent("play");
        this.gameoverSprite.setVisible(false);
        this.hideAllButtons();
        if (this.pauseEnabled) {
            this.btnPause.setVisible(true);
        }
        let restartFromAd = false;
        this.scene.get("MenuScene").scene.start("GameScene", { restartFromAd });
        (<SponsorOverlay>this.scene.get("SponsorOverlay")).hideBanner();
    }

    resetFromGame() {
        AAKaiAnalytics.sendEvent("back-paused");
        this.resetToMenu();
        this.scene.stop('GameScene');
    }

    resetFromHelpBackButton(_theScene) {
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
        (<SponsorOverlay>this.scene.get("SponsorOverlay")).showBanner();

        this.scene.get(_theScene).scene.start("MenuScene");
        AAKaiAnalytics.sendEvent("back-help");

    }
    resetToMenu() {
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
        (<SponsorOverlay>this.scene.get("SponsorOverlay")).showBanner();
    }

    gameover() {

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

        (<SponsorOverlay>this.scene.get("SponsorOverlay")).showBanner();

    }
    checkForPause(theKey) {
        if (this.pauseEnabled) {
            if (!this.areButtonsTweening()) {
                // if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
                if (theKey == "*") {
                    this.singlePress = true;
                    this.action_btnPause("up");
                }
            }
        }
    }


    // This check for the center button when the help scene is displayed
    // and then take you back home to the main menu;
    checkHelpControls(theKey) {
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
            this._SHOWFPS = !this._SHOWFPS
            this.fpsText.visible = !this.fpsText.visible
        }
    }

    checkPauseControls(theKey) {

        if (theKey == "1") {
            this.btnHelp.pointerUp(null);
        }
    }

    checkMenuControls(theKey) {

        if (gAdShowing) { return };

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
            case "4":
                if (kSHOW_SETTINGS_BUTTON) {
                    this.btnSettings.pointerUp(null);
                }
                break;

            case "5":
                this.btnMoreGames.pointerUp(null);
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

    showButton(who, ly, lx) {
        var scaleSpeed = 150;

        // reset the scales of the button to 1.0 to avoid weird scaling issues
        who.scaleX = 1.0;
        who.scaleY = 1.0;

        let _y = ly;
        let _x = lx;

        let theEase = 'BounceInOut'


        let xthis = this;
        this.buttonTween = this.tweens.add({
            targets: who,
            y: { value: _y, duration: scaleSpeed, ease: theEase },
            x: { value: _x, duration: scaleSpeed, ease: theEase },
            // scaleX: { value: .25, duration: scaleSpeed / 1.5, ease: 'BounceInOut', yoyo: true },
            // scaleY: { value: 2.5, duration: scaleSpeed / 1.5, ease: 'BounceInOut', yoyo: true },
        });
    }

    // **************************************************************************
    // SET UP THE UI
    // **************************************************************************

    setUpUI() {


        let isVis = true;
        let numBadge;

        // Play Button #######################################################################
        this.btnPlay = new Button(this, 0, 0, 'spriteAtlas', 'btnPlay.png', this.action_BtnPlay, "play", true).setVisible(isVis);
        numBadge = this.add.image(0, -50, "spriteAtlas", "tag2.png").setVisible(isKaiOS);
        this.c_btnPlay = this.add.container(0, 0, [this.btnPlay, numBadge]).setVisible(isVis);


        // Sound Button #######################################################################

        let whichButton = 'btnSoundOff.png';
        if (AAPrefs.playAudio) {
            whichButton = 'btnSoundOn.png';
        }

        this.btnSound = new Button(this, 0, 5, 'spriteAtlas', whichButton, this.action_btnSound, "sound", true).setVisible(isVis);
        numBadge = this.add.image(0, -34, "spriteAtlas", "tag3.png").setVisible(isKaiOS);
        this.c_btnSound = this.add.container(this.cameras.main.width - 10, this.cameras.main.height - 10, [this.btnSound, numBadge]).setVisible(isVis);

        // Help/Back Button #######################################################################

        whichButton = 'btnHelp.png';
        this.btnHelp = new Button(this, 0, 5, 'spriteAtlas', whichButton, this.action_BtnHelpBack, "help", true).setVisible(true);
        numBadge = this.add.image(0, -34, "spriteAtlas", "tag1.png").setVisible(isKaiOS);
        this.c_btnHelp = this.add.container(15, this.cameras.main.height - 10, [this.btnHelp, numBadge]).setVisible(true);

        // Settings Button #######################################################################
        whichButton = 'btnSettings.png';
        this.btnSettings = new Button(this, 0, 5, 'spriteAtlas', whichButton, this.action_btnSettings, "settings", true).setVisible(true);
        numBadge = this.add.image(0, -34, "spriteAtlas", "tag4.png").setVisible(isKaiOS);
        this.c_btnSettings = this.add.container(15, this.cameras.main.height - 10, [this.btnSettings, numBadge]).setVisible(kSHOW_SETTINGS_BUTTON);

        // More Games Button #######################################################################
        this.btnMoreGames = new Button(this, 0, 0, 'spriteAtlas', 'btnMoreGames.png', this.action_btnMoreGames, "more", true).setVisible(isVis);
        numBadge = this.add.image(0, -40, "spriteAtlas", "tag5.png").setVisible(isKaiOS);
        this.c_btnMoreGames = this.add.container(0, 0, [this.btnMoreGames, numBadge]).setVisible(isVis);

        // Fullscreen Button #######################################################################
        this.btnFullscreen = new Button(this, 0, 5, 'spriteAtlas', 'btnFullscreenOn.png', this.action_btnFullscreen, "fullscreen", true).setVisible(isVis);
        numBadge = this.add.image(0, -34, "spriteAtlas", "tag#.png").setVisible(isKaiOS);
        this.c_btnFullScreen = this.add.container(this.cameras.main.width - 10, this.cameras.main.height - 10, [this.btnFullscreen, numBadge]).setVisible(kSHOW_FULLSCREEN_BUTTON);

        // Pause Button #######################################################################

        whichButton = 'btnPause.png';
        this.btnPause = new Button(this, this.cameras.main.width - 35, 20, 'spriteAtlas', whichButton, this.action_btnPause, "pause", true).setVisible(false);

        // // Sponsor Button #####################################################################
        // this.btnSponsor = new Button(this, this.sys.canvas.width - 60, this.sys.canvas.height, 'spriteAtlas', "sponsor.png", this.action_sponsorButton, "sponsor", true).setVisible(true).setOrigin(.5, 1);

        // DISPLAY BUTTONS #######################################################################
        // #######################################################################################

        // HELP -- PLAY -- SOUND
        this.buttonY = (this.cameras.main.height - 90);
        AAFunctions.displayButtons([this.c_btnHelp, this.c_btnPlay, this.c_btnSound], this.cameras.main, this.buttonY, 60);

        // SETTINGS -- MORE GAMES -- FULLSCREEN
        this.buttonY2 = (this.cameras.main.height - 210);

        AAFunctions.displayButtons([this.c_btnSettings, this.c_btnMoreGames, this.c_btnFullScreen], this.cameras.main, this.buttonY2, 0);

        // Pause Graphic #######################################################################

        this.createPauseGrc();

        // GameOver Sprite #######################################################################

        this.gameoverSprite = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2.5, 'spriteAtlas', 'gameover.png').setVisible(false);

        // Number Font #######################################################################

        this.makeTheNumbersFont();

        // Score Text #######################################################################

        let scoreSize = 15 * 2;
        this.scoreText = this.add.bitmapText(9, 6, 'numbersFont', '0', scoreSize).setDepth(999);
        this.scoreText.setOrigin(0);
        this.scoreText.setTint(0xffffff);
        // this.scoreText.scaleX = .5;
        // this.scoreText.scaleY = .5;

        // HighScore Text #######################################################################

        scoreSize = 8 * 2;
        this.highScoreText = this.add.bitmapText(12, 25 * 2, 'numbersFont', AAHighScores.highScore, scoreSize).setDepth(999);
        this.highScoreText.setOrigin(0);
        this.highScoreText.setTint(0xcccccc);
        // this.highScoreText.scaleX = .5;
        // t5his.highScoreText.scaleY = .5;

        // FPS TEXT #######################################################################

        // if (gSHOWFPS) {
        this.fpsText = this.add.bitmapText(9, 80, 'numbersFont', '0.0', 15).setVisible(false);
        this.fpsText.setTint(0x666666);
        // }

        // this.debugInfo = this.add.bitmapText(10, 130, 'numbersFont', '0', scoreSize).setDepth(999);

    }

    makeTheNumbersFont() {
        let config = {
            image: 'numbersFont',
            width: 40,
            height: 40,
            offset: { x: 0 },
            chars: '0123456789.',
            charsPerRow: 11
        };

        // I have to put the <any> here because the typescript defs have an error
        // somewhere that won't let me use the param unless I add <any>
        let it = Phaser.GameObjects.RetroFont.Parse(this, <any>config);
        this.cache.bitmapFont.add('numbersFont', it);
    }




    playBtnSnd() {
        if (AAPrefs.playAudio == true)
            this.sfxButton.play();
    }

    // playNavSnd() {
    //     if (AAPrefs.playAudio == true)
    //         this.sfxButtonNav.play();
    // }

    showButtons(isGameOver) {

        if (!this.areButtonsTweening()) {
            if (isGameOver) {
                this.showButton(this.c_btnSound, this.buttonY, this.c_btnSound.x);
                this.showButton(this.c_btnHelp, this.buttonY, this.c_btnHelp.x);
            }


            this.showButton(this.c_btnPlay, this.buttonY, this.c_btnPlay.x);
            // Hilight and select the button to make the keyboard work
            //this.btnPlay.select(false);
        }


    }

    areButtonsTweening() {
        let isATweeing = false;
        if (this.buttonTween != null) {
            isATweeing = this.buttonTween.isPlaying();
        }

        if (gTween != null) {
            isATweeing = gTween.isPlaying();
        }

        return isATweeing;
    }

    hideAllButtons() {
        if (!this.areButtonsTweening()) {

            let where = this.sys.game.canvas.height + 150;

            this.hideTopPlaySoundButtons(this.buttonY + where);

            this.showButton(this.c_btnHelp, this.buttonY + where, this.c_btnHelp.x);

            this.hideTopRowOfButtons(this.buttonY2 + where);

        }
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
        if (this._SHOWFPS) {
            this.fpsText.setText('FPS: ' + (1000 / delta).toFixed(1));
        }
        // if (this.debugInfo) {
        //     this.debugInfo.setText([
        //         'GameData.rockcount: ' + GameData.rockCount
        //         this.bigRocks
        //     ]);
        //     // this.debugText.text = gGameState.toString();
        // }
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
        this.scoreText.text = thescore.toString();

        if (thescore >= AAHighScores.highScore) {
            this.highScoreText.text = this.scoreText.text;
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
        this.btnPause.setVisible(false);
    }

    hideTopPlaySoundButtons(_y) {
        this.showButton(this.c_btnSound, _y, this.c_btnSound.x);
        this.showButton(this.c_btnPlay, _y, this.c_btnPlay.x);
    }

    hideTopRowOfButtons(_y) {
        this.showButton(this.c_btnSettings, _y, this.c_btnSettings.x);
        this.showButton(this.c_btnMoreGames, _y, this.c_btnMoreGames.x);
        this.showButton(this.c_btnFullScreen, _y, this.c_btnFullScreen.x);

    }


    // **************************************************************************
    // **************************************************************************
    // **************************************************************************
    // Button CALLBACKS
    // **************************************************************************
    action_BtnPlay(state) {
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
                    break
            }

        }
    }

    action_btnSound(_state) {
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
            } else {
                // This will display the the OFF state when up and the ON state when pressed
                this.btnSound.setFrames('btnSoundOff.png', 'btnSoundOn.png', 'btnSoundOff.png');//, 'btn_sound_off.png');
                AAKaiAnalytics.sendEvent("soundOff");
            }
            AAFunctions.tweenBounce(this, this.c_btnSound);

        }
    }

    action_btnPause(_state) {
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
                (<SponsorOverlay>this.scene.get("SponsorOverlay")).showBanner();
                game.scene.pause("GameScene");
                AAKaiAnalytics.sendEvent("pause");

            } else if (gGameState == states.kSTATE_PAUSED) {

                gGameState = states.kSTATE_PLAYING;
                this.showButton(this.c_btnHelp, this.buttonY + this.kHideDistance, this.c_btnHelp.x);
                this.showButton(this.c_btnSound, this.buttonY + this.kHideDistance, this.c_btnSound.x);
                this.pauseImage.setVisible(false);
                (<SponsorOverlay>this.scene.get("SponsorOverlay")).hideBanner();
                game.scene.resume("GameScene");
                AAKaiAnalytics.sendEvent("resume");
            }
        }
    }

    action_BtnHelpBack(_state) {
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
                    (<SponsorOverlay>this.scene.get("SponsorOverlay")).hideBanner(); AAFunctions.tweenBounce(this, this.c_btnHelp);
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
    }

    action_btnFullscreen(_state) {
        if (kSHOW_FULLSCREEN_BUTTON) {
            if (gGameState == states.kSTATE_MENU) {
                if (_state == 'up') {
                    this.playBtnSnd();
                    if (this.scale.isFullscreen) {
                        this.btnFullscreen.setTexture('spriteAtlas', 'btnFullscreenOn.png');
                        this.scale.stopFullscreen();
                    } else {
                        this.btnFullscreen.setTexture('spriteAtlas', 'btnFullscreenOff.png');
                        this.scale.startFullscreen();
                    }
                }
            }
        }
    }

    action_btnSettings(_state) {
        if (gGameState == states.kSTATE_MENU) {
            if (_state == 'up') {
                this.playBtnSnd();

                this.scene.get("MenuScene").scene.start("SettingsScene");
                gGameState = states.kSTATE_SETTINGS;

                this.hideTopPlaySoundButtons(this.buttonY + this.kHideDistance);
                this.hideTopRowOfButtons(this.buttonY2 + this.kHideDistance);

                this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                (<SponsorOverlay>this.scene.get("SponsorOverlay")).hideBanner(); AAFunctions.tweenBounce(this, this.c_btnHelp);
                AAKaiAnalytics.sendEvent("settings");

            }
        }
    }
    action_btnMoreGames(_state) {
        if (gGameState == states.kSTATE_MENU) {
            if (_state == 'up') {
                this.playBtnSnd();

                this.scene.get("MenuScene").scene.start("MoreGamesScene");
                gGameState = states.kSTATE_MOREGAMES;

                this.hideTopPlaySoundButtons(this.buttonY + this.kHideDistance);
                this.hideTopRowOfButtons(this.buttonY2 + this.kHideDistance);


                this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                (<SponsorOverlay>this.scene.get("SponsorOverlay")).hideBanner(); AAFunctions.tweenBounce(this, this.c_btnHelp);
                AAKaiAnalytics.sendEvent("moregames");

            }
        }
    }

    // action_sponsorButton(_state) {
    //     if (_state == 'up') {

    //         // If the fullscreen ad is showing then do not accidently
    //         // click on the banner ad since that ad could be different
    //         // and it's just plain wrong and will cause user confusion
    //         if (!gAdShowing) {
    //             this.playBtnSnd();
    //             AAKaiAds.theBannerAd.call('click');
    //         }
    //     }
    // }

}//end scene


