class MoreGamesScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MoreGamesScene' });
    }

    preload() {
        
    }

    create() {
       gGameState = states.kSTATE_MOREGAMES;
       let mo = this.scene.get('MenuOverlay');
       (<MenuOverlay>mo).scoreText.setVisible(false);
       (<MenuOverlay>mo).highScoreText.setVisible(false);
       this.add.image(0,0,'spriteAtlas','help_en.png').setOrigin(0,0);

    }

}