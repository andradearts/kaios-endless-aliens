class SettingsScene extends Phaser.Scene {

    constructor() {
        super({ key: 'SettingsScene' });
    }

    preload() {
        
    }

    create() {
       gGameState = states.kSTATE_SETTINGS;
       let mo = this.scene.get('MenuOverlay');
       (<MenuOverlay>mo).hideScores(true);
       this.add.image(0,0,kSPRITE_ATLAS,kIMG_SETTINGS).setOrigin(0,0);

    }

}