class HelpScene extends Phaser.Scene {

    constructor() {
        super({ key: 'HelpScene' });
    }

    preload() {
        
    }

    create() {
       gGameState = states.kSTATE_HELP;

       let mo = this.scene.get('MenuOverlay');

       (<MenuOverlay>mo).scoreText.setVisible(false);
       (<MenuOverlay>mo).highScoreText.setVisible(false);

    //    setTimeout(()=>{
    //       // (<MenuOverlay>mo).showButtonBG();
    //       // (<MenuOverlay>mo).btnHelp.setTexture('spriteAtlas', 'btnBack.png');
    //       // (<MenuOverlay>mo).showSpecificButtons([(<MenuOverlay>mo).btnHelp]);
    //     },200);
      

       this.add.image(0,0,'spriteAtlas','help_en.png').setOrigin(0,0);

    }

}