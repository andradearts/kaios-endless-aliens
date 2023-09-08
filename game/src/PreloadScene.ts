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
            probar.style.opacity = "0";
            AAFunctions.fade(this, "out", 100, this.goToGameScene, gLogoDisplayLength);
        }, this);

        // *** LOAD ASSETS ***

        this.load.json('manifest', 'manifest.webapp');

        // Spritesheets
        this.load.setPath("assets/images/");

        this.load.image(kIMG_BG,"bg.png");
        this.load.image(kIMG_COVER,"coverart.jpg");
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

        let ext = '.wav';
        //SOund effects are to be wavs.  Some mp3 and oggs can crash phaser!

        ext = '.mp3';
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
