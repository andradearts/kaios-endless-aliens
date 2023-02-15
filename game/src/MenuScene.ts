class MenuScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {

        this.cameras.main.setBackgroundColor(0x000000);
        gGameState = states.kSTATE_MENU;
    }

    create() {
        AAKaiAds.preLoadBannerAd();
        this.removeLogo();
        
        this.scene.sendToBack();
       
        let vy = this.sys.canvas.height - 17;
        let vx = 12;
       
        this.add.text(12, this.sys.canvas.height - 17, gGameVersion,{"fontSize":"12px"});

        let mo = this.scene.get('MenuOverlay');
        (<MenuOverlay>mo).showMenuSceneButtons(()=>{});
        (<MenuOverlay>this.scene.get('MenuOverlay')).showScores(true);
    }

    removeLogo() {
        let element = document.getElementsByClassName('loader')[0];
        if (element != undefined) {
            (<any>element).style.opacity = "0";

            var op = 1;  // initial opacity
            var timer = setInterval(function () {
                clearInterval(timer);
                (<any>element).remove();
            }, 2000);
        }
    }
}