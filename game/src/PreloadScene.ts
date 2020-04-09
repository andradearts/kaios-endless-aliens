
class PreloadScene extends Phaser.Scene {

    meterBar;
    kitt;

    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {

         AAKaiAds.preLoadDisplayAd();
    //    AAKaiAds.preLoadBannerAd();

        this.cameras.main.setBackgroundColor(0xFFDD18);

        let logo = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "logo").setAlpha(0);

        this.tweens.add({
            targets: logo,
            alpha: 1.0,
            duration: 100,
            ease: 'Power.easeIn'
        });

      
        let meterBarbg = this.add.graphics();

        let topOfBar = 70;
        let bottomOfBar = 25;
        meterBarbg.beginPath();

        meterBarbg.moveTo(0, this.sys.game.canvas.height - topOfBar);
        meterBarbg.lineTo(this.sys.canvas.width, this.sys.game.canvas.height - topOfBar);
        meterBarbg.lineTo(this.sys.canvas.width, this.sys.game.canvas.height - bottomOfBar);
        meterBarbg.lineTo(0, this.sys.game.canvas.height - bottomOfBar);

        meterBarbg.closePath();
        meterBarbg.strokePath();
        meterBarbg.fillStyle(0x000000, 1);
        meterBarbg.fill();


        ///
        this.meterBar = this.add.graphics();

        this.meterBar.beginPath();

        this.meterBar.moveTo(0, this.sys.game.canvas.height - topOfBar);
        this.meterBar.lineTo(this.sys.canvas.width, this.sys.game.canvas.height - topOfBar);
        this.meterBar.lineTo(this.sys.canvas.width, this.sys.game.canvas.height - bottomOfBar);
        this.meterBar.lineTo(0, this.sys.game.canvas.height - bottomOfBar);

        this.meterBar.closePath();
        this.meterBar.strokePath();
        this.meterBar.fillStyle(0xff0000, 1.0);
        this.meterBar.fill();

        this.meterBar.scaleX = .1;


        this.kitt = this.add.graphics();
        this.kitt.moveTo(0, this.sys.game.canvas.height - topOfBar);
        this.kitt.lineTo(20, this.sys.game.canvas.height - topOfBar);
        this.kitt.lineTo(20, this.sys.game.canvas.height - bottomOfBar);
        this.kitt.lineTo(0, this.sys.game.canvas.height - bottomOfBar);

        this.kitt.closePath();
        this.kitt.strokePath();
        this.kitt.fillStyle(0xffffff, 1.0);
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
    }

    loadAssets() {

        this.load.on('progress', function (it) {
            this.meterBar.scaleX = this.load.progress;
        }, this);

        this.load.on('complete', function () {
            this.meterBar.fillStyle(0x00A800, 1.0);
            this.meterBar.fill();
            this.meterBar.scaleX = 1.0;
            AAFunctions.fade(this, "out", 500, this.goToGameScene, gLogoDisplayLength);
        }, this);

        // *** LOAD ASSETS ***

        // ========================================================================
        // 3/30/20
        // commented this out as I'm trying out banner kaios ads
        // ========================================================================
        // let d = '?' + new Date().getTime();
        // this.load.text('sponsorURL', 'https://taara.games/sponsor.txt' + d);
        // this.load.image('sponsor', 'https://taara.games/sponsor.png' + d);


        
        // Spritesheets
        this.load.setPath("assets/images/");
        this.load.atlas(
            "spriteAtlas",
            "spriteAtlas.png",
            "spriteAtlas.json",
            null,
            null
        );


        // this.load.image('gamefont', 'numbers.png');


        this.load.bitmapFont('sysFont', 'retroSystem.png', 'retroSystem.fnt', null, null);

        // this.load.image('coverart', 'coverart.png');

        //Fonts
        this.load.image('numbersFont', 'numbers@2x.png');

        //Sound Effects
        this.load.setPath("assets/audio/");
        let ext = '.ogg';

        // These two sounds are the standard button sounds
        this.load.audio("button", "click" + ext);
        // this.load.audio("buttonNav", "chime-triad" + ext);


    }

    goToGameScene(a, c, b, d) {
        this.scene.start('MenuScene');
        this.scene.start('MenuOverlay');
        this.scene.start('SponsorOverlay');
        
        // switch (true) {

        //     // this.sys.game.device.os.chromeOS     // Is running on chromeOS?
        //     // this.sys.game.device.os.cordova      // Is the game running under Apache Cordova?
        //     // this.sys.game.device.os.crosswalk    // Is the game running under the Intel Crosswalk XDK?
        //     // this.sys.game.device.os.ejecta       // Is the game running under Ejecta?
        //     // this.sys.game.device.os.electron     // Is the game running under GitHub Electron?
        //     case this.sys.game.device.os.desktop:      // Is running on a desktop?
        //     case this.sys.game.device.os.android:     // Is running on android?
        //     case this.sys.game.device.os.iOS:         // Is running on iOS?
        //     case this.sys.game.device.os.iPad:        // Is running on iPad?
        //     case this.sys.game.device.os.iPhone:       // Is running on iPhone?
        //     case this.sys.game.device.os.kindle:      // Is running on an Amazon Kindle?
        //     case this.sys.game.device.os.linux:     // Is running on linux?
        //     case this.sys.game.device.os.macOS:    // Is running on macOS?
        //     case this.sys.game.device.os.webApp:   // Set to true if running as a WebApp, i.e. within a case WebView
        //     case this.sys.game.device.os.windows:      // Is running on windows?
        //     case this.sys.game.device.os.windowsPhone: // Is running on a Windows Phone?
        //     // this.sys.game.device.os.node         // Is the game running under Node.js?
        //     // this.sys.game.device.os.nodeWebkit   // Is the game running under Node-/Webkit?
        //     case gRunnngInBrowser:
        //         this.scene.start('SponsorOverlay');
        //         break;
        // }

        // AAKaiAds.displayFullscreenAd();
        // AAKaiAds.preLoadDisplayAd();
    }

}