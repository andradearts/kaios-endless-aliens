class HelpScene extends Phaser.Scene {

    constructor() {
        super({ key: 'HelpScene' });
    }

    preload() {
        
    }

    create() {
       gGameState = states.kSTATE_HELP;

       let mo = this.scene.get('MenuOverlay');

       hideBanner();
       (<MenuOverlay>mo).showScores(false);
       (<MenuOverlay>mo).showBackButton(()=>{});
       
       AAKaiAnalytics.sendEvent("help");

       this.add.image(0,0,kSPRITE_ATLAS,kIMG_HELP).setOrigin(0,0);

    }

}