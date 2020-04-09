class MenuScene extends Phaser.Scene {


    bgContainer;

    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {

        this.cameras.main.setBackgroundColor(0x000000);
        gGameState = states.kSTATE_MENU;
    }

    create() {

      
        this.scene.sendToBack();

        this.add.text(12, this.sys.canvas.height - 17, gGameVersion);
    }

    
}