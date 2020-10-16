
class PreloadScene extends Phaser.Scene {

    meterBar;
    kitt;

    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {

        // AAKaiAds.preLoadFullscreenAd();
        //    AAKaiAds.preLoadBannerAd();

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

        this.load.json('manifest','manifest.webapp');

        this.load.setPath("assets/html/");
        this.load.html('moreGamesHTML', 'moregames.html');
        this.load.html('newgameHTML', 'newgame.html');
        

        let touchExt = '';
        if (kTOUCH === 1){
            touchExt = '_TP';
        }

        // Spritesheets
        this.load.setPath("assets/images/");
        this.load.atlas(
            "spriteAtlas",
            "spriteAtlas"+touchExt+".png",
            "spriteAtlas"+touchExt+".json",
            null,
            null
        );


        // this.load.image('coverart', 'coverart.png');


        //Sound Effects
        this.load.setPath("assets/audio/");
        let ext = '.ogg';

        // These two sounds are the standard button sounds
        this.load.audio("button", "click" + ext);
        // this.load.audio("buttonNav", "chime-triad" + ext);


    }

    goToGameScene(a, c, b, d) {
        initGame();
        this.scene.start('MenuScene');
        this.scene.start('MenuOverlay');
        this.scene.start('SponsorOverlay');
    }

}
