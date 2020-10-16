class HelpScene extends Phaser.Scene {

    constructor() {
        super({ key: 'HelpScene' });
    }

    preload() {
        
    }

    create() {
       gGameState = states.kSTATE_HELP;

       let mo = this.scene.get('MenuOverlay');

       (<MenuOverlay>mo).hideScores(true);

       this.add.image(0,0,kSPRITE_ATLAS,kIMG_HELP).setOrigin(0,0);

    }

}