
class BootScene extends Phaser.Scene {


    constructor() {
        super({ key: 'BootScene' });
    }

    
    preload() {
        this.load.setPath('assets/images/');

        this.load.image('logo', 'taara-logo.png');

        this.load.on('complete', function () {
            this.scene.start('PreloadScene');
        }, this);

    }

}