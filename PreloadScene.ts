
class PreloadScene extends Phaser.Scene {

    //pieMeter;
    meterBar;

    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {

        
        this.cameras.main.setBackgroundColor(0xFFDD18);

        let logo = this.add.image(this.sys.canvas.width/2,this.sys.canvas.height/2,"logo").setAlpha(0);

        this.tweens.add({
            targets: logo,
            alpha: 1.0,
            duration: 500,
            ease: 'Power.easeIn'
        });

        this.meterBar = this.add.graphics();

        this.meterBar.beginPath();

        this.meterBar.moveTo(0, 211);
        this.meterBar.lineTo(this.sys.canvas.width, 211);
        this.meterBar.lineTo(this.sys.canvas.width, 215);
        this.meterBar.lineTo(0, 215);

        this.meterBar.closePath();
        this.meterBar.strokePath();
        this.meterBar.fillStyle(0xff0000, .75);
        this.meterBar.fill();

        this.meterBar.scaleX = .1;
        
    
        this.loadAssets();
        
    }

    loadAssets(){

        this.load.on('progress', function (it) {
            this.meterBar.scaleX = this.load.progress;
        }, this);

        this.load.on('complete', function () {
            this.meterBar.fillStyle(0x00FF00,1.0);
            this.meterBar.scaleX = 1.0;
            AAFunctions.fade(this, "out", 500, this.goToGameScene, gLogoDisplayLength);
        }, this);


        // sponsor
        // should i load a text file with the url OR should I just
        // use a url that will redirect to
        this.load.text('sponsorURL','sponsor.txt');

         // *** LOAD ASSETS ***
        // Spritesheets
        this.load.setPath("assets/images/");
        this.load.atlas(
            "spriteAtlas",
            "spriteAtlas.png",
            "spriteAtlas.json",
            null,
            null
        );

        //Fonts
        this.load.image('numbersFont', 'numbers.png');

        //Sound Effects
        this.load.setPath("assets/audio/");
        let ext = '.mp3';

        // These two sounds are the standard button sounds
        this.load.audio("button", "chime-airy" + ext);
        // this.load.audio("buttonNav", "chime-triad" + ext);
    }

    goToGameScene(a,c,b,d){
        this.scene.start('MenuScene');
        this.scene.start('MenuOverlay');
        this.scene.start('SponsorOverlay');
    }
   
}