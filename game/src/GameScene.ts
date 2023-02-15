class GameScene extends Phaser.Scene {


    jumps = 0; //track ad launch
    poop = 0;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {

    }

    create() {

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
        
    }

    // removeAllListeners() {
    //     this.events.removeListener('startgame');
    // }

    // This gets called from the menu scene when the play button is clicked
    // Init all my game data here.
    startGame() {

        //I have to kill the KaiAd object because it causes stutter.

        gGameState = states.kSTATE_PLAYING;
        this.poop = 0;

    }

    update(time, delta) {

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

    }
    
    gameover() {
        AAKaiAnalytics.sendEvent("gameover");
        gGameState = states.kSTATE_GAMEOVER;

        // show the game over button layout.
        this.scene.get('MenuOverlay').events.emit('gameover');

        // if (AAPrefs.playAudio == true)
        //     this.sfxEndGame.play();

        window.navigator.vibrate(300);
        this.cameras.main.shake(150);


       
    }


    setUpSprites() {

    }
    setUpAudio() {

    }
    setUpUI() {

        (<MenuOverlay>this.scene.get('MenuOverlay')).showScores(true);
        //(<MenuOverlay>this.scene.get('MenuOverlay')).showResetButton(true);
    }
}
