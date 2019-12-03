class MenuScene extends Phaser.Scene {


    bgContainer;

    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {

        this.cameras.main.setBackgroundColor(0xFFE660);
        gGameState = states.kSTATE_MENU;
    }

    create() {

      
        this.scene.sendToBack();
    }

    
}