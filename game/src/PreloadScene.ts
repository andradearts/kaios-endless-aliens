class PreloadScene extends Phaser.Scene {

    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {

        AAKaiAds.preloadFullscreenAd()

        this.cameras.main.setBackgroundColor(0xFFDD18);

        let logo = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "logo").setAlpha(0);

        this.tweens.add({
            targets: logo,
            alpha: 1.0,
            duration: 100,
            ease: 'Power.easeIn'
        });

        this.loadAssets();
    }

    loadAssets() {

        var probar = document.getElementById('progresso');

        this.load.on('progress', function (it) {
            let f = (it*200)
            probar.style.width = f.toString()+"px"
        }, this);

        this.load.on('complete', function () {
            console.log(this.load.progress)
            probar.style.opacity = "0";
            AAFunctions.fade(this, "out", 100, this.goToGameScene, gLogoDisplayLength);
        }, this);

        // *** LOAD ASSETS ***

        this.load.json('manifest', 'manifest.webapp');

        // SVG Menu Items
        this.load.setPath("assets/svg/");
        this.load.svg(kBTN_PLAY, "btnPlay.svg", { width: 81, height: 40 });
        this.load.svg(kBTN_BACK, "btnBackBottom.svg", { width: 65, height: 19 });
        this.load.svg(kBTN_HELP, "btnHelp.svg", { width: 55, height: 31 });
        this.load.svg(kBTN_SOUND_OFF, "btnSoundOff.svg", { width: 55, height: 31 });
        this.load.svg(kBTN_SOUND_ON, "btnSoundOn.svg", { width: 55, height: 31 });
       
        this.load.svg("btnResetGame", "btnResetGame.svg", { width: 56, height: 15 });
   
        this.load.svg(kIMG_GAMEOVER, "gameover.svg", { width: 196, height: 62 });
   
        // Spritesheets
        this.load.setPath("assets/images/");

        this.load.image(kIMG_BG,"bg.png");
        this.load.image(kIMG_LOGO,"taara-logo.png");

        this.load.atlas(
            kSPRITE_ATLAS,
            kSPRITE_ATLAS + ".png",
            kSPRITE_ATLAS + ".json",
            null,
            null
        );

        // this.load.image('coverart', 'coverart.png');

        //Sound Effects
        this.load.setPath("assets/audio/");
        let ext = '.mp3';

        // These two sounds are the standard button sounds
        this.load.audio("button", "sfxButton_select" + ext);
        this.load.audio("play", "sfxButton_play" + ext);
        this.load.audio("back", "sfxButton_back" + ext);

    }

    goToGameScene(a, c, b, d) {
        initGame();
        this.scene.start('MenuOverlay');
        this.scene.start('MenuScene');
    
    }

}
