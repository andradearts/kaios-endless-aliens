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
        var element = this.add.dom(10, 140).createFromCache('newgameHTML').setOrigin(0, 0);

        let vy = this.sys.canvas.height - 17;
        let vx = 12;
        if (kTOUCH == 1) {
            vy = 8;
            vx = this.game.canvas.width-60;
        }
        this.add.bitmapText(vx, vy, 'sysFont', gGameVersion, 12).setDepth(999);
    }


}