
class BootScene extends Phaser.Scene {


    constructor() {
        super({ key: 'BootScene' });
    }

    
    preload() {
        this.load.setPath('assets/images/');

        this.load.image('logo', 'taara-logo.png');

        // this.load.image('preloadBar', 'progressBar.png', null);
        // this.load.image('preloadBarMask', 'progressBarMask.png', null);

        this.load.on('complete', function () {
            this.scene.start('PreloadScene');
        }, this);

    }

}