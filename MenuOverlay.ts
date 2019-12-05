


class MenuOverlay extends Phaser.Scene {

    // debugText;
    // debugInfo;

    kHideDistance = 150;
    _SHOWFPS = false;

    kHOME_BUTTON_INDEX = 1;

    gameoverSprite;

    // AUDIO
    sfxButton;

    // UI
    btnPlay;
    btnSound;
    btnHelp;

    //containers for the buttons so I can hold the number badges
    c_btnPlay;
    c_btnSound;
    c_btnHelp;

    //btnPause;
    buttonTween;
    buttons; // the array to hold the buttons for keyboard navigation

    buttonY;
    btnPlayStartY;
    btnSoundStartY;
    btnHelpStartY;

    btnHelpIndex;
    btnPlayIndex;
    btnSoundIndex;

    transitioning



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

        emitter.on('keydown', this.keydown, this);
        emitter.on('keyup', this.keyup, this);

        // this.debugInfo = this.add.text(0, 0, 'Click to add objects', { fill: '#00ff00' });

    }

    removeAllListeners() {
        this.events.removeListener('gameover');
        this.events.removeListener('setscore');
        this.events.removeListener('setscorefloat');
        this.events.removeListener('keyDown');
        this.events.removeListener('keyUp');
        // this.events.removeListener('showAdSceneButtons');
        // this.events.removeListener('hideAdSceneButtons');

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
            case "1":
            case "2":
            case "3":
            case "8":
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
        } else {
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
    }

    setUpAudio() {
        this.sfxButton = this.sound.add('button');
    }

    //Set the game to it's initial state by initializing all the variables
    reset() {

        AAKaiAnalytics.sendEvent("play");
        this.gameoverSprite.setVisible(false);
        this.hideAllButtons();
        let restartFromAd = false;
        this.scene.get("MenuScene").scene.start("GameScene", { restartFromAd });
        (<SponsorOverlay>this.scene.get("SponsorOverlay")).hideBanner();
    }

    resetFromGame() {
        AAKaiAnalytics.sendEvent("back-paused");
        this.resetToMenu();
        this.scene.stop('GameScene');
    }

    resetFromHelp() {
        if ((this.transitioning) || (AAFunctions.areButtonsBouncing())) {
            return;
        }
        gGameState = states.kSTATE_MENU;

        this.showButton(this.c_btnSound, this.buttonY, this.c_btnSound.x);
        this.showButton(this.c_btnPlay, this.buttonY, this.c_btnPlay.x);

        this.btnHelp.setTexture('spriteAtlas', 'btnHelp.png');
        AAFunctions.tweenBounce(this, this.c_btnHelp);

        (<SponsorOverlay>this.scene.get("SponsorOverlay")).showBanner();

        this.scene.get("HelpScene").scene.start("MenuScene");
        AAKaiAnalytics.sendEvent("back-help");

    }
    resetToMenu() {
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
        (<SponsorOverlay>this.scene.get("SponsorOverlay")).showBanner();
    }

    gameover() {

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

        (<SponsorOverlay>this.scene.get("SponsorOverlay")).showBanner();

    }
    checkForPause(theKey) {
        if (!this.areButtonsTweening()) {
            // if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            if (theKey == "*") {
                this.singlePress = true;
                this.pauseGame("up");
            }
        }
    }



    // This check for the center button when the help scene is displayed
    // and then take you back home to the main menu;
    checkHelpControls(theKey) {
        if (theKey == "1") {
            // this.btnHelp.pointerUp(null);
            this.btnPlay.pointerUp(null);
            this.resetFromHelp();
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
            //this.btnPlay.pointerUp(null);
            this.btnHelp.pointerUp(null);
            // this.play("up");
        }
    }

    checkMenuControls(theKey) {

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
    }
    checkGameOverMenuControls(theKey) {

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

        let nudge2x = 2;
        // if (isKaiOS){
        //     nudge2x = 2;
        // }

        this.btnPlay = new Button(this, 0, 0, 'spriteAtlas', 'btnPlay.png', this.play, "play", true).setVisible(isVis);


        numBadge = this.add.image(34 * nudge2x, -27 * nudge2x, "spriteAtlas", "btn2.png").setVisible(isKaiOS);


        this.c_btnPlay = this.add.container(0, 0, [this.btnPlay, numBadge]).setVisible(isVis);

        let whichButton = 'btnSoundOff.png';
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
        let col = 0xffde17;

        this.buttonY = (this.cameras.main.height - 20 * nudge2x);

        AAFunctions.displayButtons([this.c_btnHelp, this.c_btnPlay, this.c_btnSound], this.cameras.main, this.buttonY, 5);

        this.createPauseGrc();

        this.gameoverSprite = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 3, 'spriteAtlas', 'gameover.png').setVisible(false);

        this.makeTheNumbersFont();

        let scoreSize = 80;
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

    }

    makeTheNumbersFont() {
        let config = {
            image: 'numbersFont',
            width: 80,
            height: 80,
            offset: { x: 0 },
            chars: '0123456789.',
            charsPerRow: 11
        };

        // I have to put the <any> here because the typescript defs have an error
        // somewhere that won't let me use the param unless I add <any>
        let it = Phaser.GameObjects.RetroFont.Parse(this, <any>config);
        this.cache.bitmapFont.add('numbersFont', it);
    }

    // **************************************************************************
    // Button CALLBACKS
    // **************************************************************************
    play(state) {
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
                    break
            }

        }
    }

    toggleSound(_state) {
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
            //AAAnalytics.sendButtonEvent('sound', kIOS_WRAPPED);
            AAFunctions.tweenBounce(this, this.c_btnSound);

        }
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
                // this.btnPlay.setTexture('spriteAtlas', 'btnPlay.png');
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
            isATweeing =  this.buttonTween.isPlaying();
        }

        if (gTween != null) {
            isATweeing = gTween.isPlaying();
        }

        return isATweeing;
    }

    hideAllButtons() {
        if (!this.areButtonsTweening()) {
            // this.showButton(this.btnPlay, -this.btnPlay.y, this.btnPlay.x, false);
            // this.showButton(this.btnSound, -this.btnSound.y, this.btnSound.x, false);
            // this.showButton(this.btnHelp, -this.btnHelp.y, this.btnHelp.x, false);

            this.showButton(this.c_btnPlay, this.buttonY + this.kHideDistance, this.c_btnPlay.x);
            this.showButton(this.c_btnSound, this.buttonY + this.kHideDistance, this.c_btnSound.x);
            this.showButton(this.c_btnHelp, this.buttonY + this.kHideDistance, this.c_btnHelp.x);
        }
    }

    pauseGame(_state) {
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
                (<SponsorOverlay>this.scene.get("SponsorOverlay")).showBanner();
                game.scene.pause("GameScene");
                AAKaiAnalytics.sendEvent("pause");

            } else if (gGameState == states.kSTATE_PAUSED) {

                gGameState = states.kSTATE_PLAYING;
                //this.showButton(this.btnPlay, -this.btnPlay.y, this.btnPlay.x, false);
                this.showButton(this.c_btnHelp, this.buttonY + this.kHideDistance, this.c_btnHelp.x);
                this.showButton(this.c_btnSound, this.buttonY + this.kHideDistance, this.c_btnSound.x);
                this.pauseImage.setVisible(false);
                //AAAds.showBannerAd_WEB(false);
                (<SponsorOverlay>this.scene.get("SponsorOverlay")).hideBanner();
                game.scene.resume("GameScene");
                AAKaiAnalytics.sendEvent("resume");
            }
        }
    }

    showHelp(_state) {
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
                    (<SponsorOverlay>this.scene.get("SponsorOverlay")).hideBanner(); AAFunctions.tweenBounce(this, this.c_btnHelp);
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
    }



    // **************************************************************************
    // **************************************************************************
    // **************************************************************************
    // **************************************************************************
    // ALL GAME CODE STARTS UNDER HERE

    // SET UP THE GAME
    // **************************************************************************

    update(time, delta) {
        if (this._SHOWFPS) {
            this.fpsText.setText('FPS: ' + (1000 / delta).toFixed(1));
        }
        // this.debugInfo.setText([
        //     'w inner height: ' + window.innerWidth,
        //     'w inner height: ' + window.innerHeight,
        //     'isKaiOS:' + isKaiOS.toString()
        // ]);
        // this.debugText.text = gGameState.toString();
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
        AAKaiAnalytics.sendSponsorEvent();
        let txt = this.cache.text.get('sponsorURL');
        console.log(txt);
        window.location.href = txt;
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

        let startx = this.sys.canvas.width/2 - 30;
        let starty = 170;
        let pHeight = 60;
        graphics2.moveTo(startx, starty);
        graphics2.lineTo(startx+20, starty);
        graphics2.lineTo(startx+20, starty+pHeight);
        graphics2.lineTo(startx, starty+pHeight);

        graphics2.closePath();
        graphics2.strokePath();
        graphics2.fillStyle(0xFFFFFF, 1);
        graphics2.fill();

        // =======================================================

        let graphics3 = this.add.graphics();

        startx =this.sys.canvas.width/2 + 10;
        
        graphics3.moveTo(startx, starty);
        graphics3.lineTo(startx+20, starty);
        graphics3.lineTo(startx+20, starty+pHeight);
        graphics3.lineTo(startx, starty+pHeight);

        graphics3.closePath();
        graphics3.strokePath();
        graphics3.fillStyle(0xFFFFFF, 1);
        graphics3.fill();

        this.pauseImage = this.add.container(0, 0, [graphics, graphics2,graphics3]).setVisible(false);
    }
}//end scene
