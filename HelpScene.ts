class HelpScene extends Phaser.Scene {

    constructor() {
        super({ key: 'HelpScene' });
    }

    preload() {
        
    }

    create() {
    //    gGameState = states.kSTATE_HELP;
       this.add.image(100,100,'spriteAtlas','btnHelp.png');
       this.add.image(this.sys.canvas.width/2,this.sys.canvas.height/2,'spriteAtlas','help_en.png');
    }

}