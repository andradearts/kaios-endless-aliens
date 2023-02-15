class MoreGamesScene extends Phaser.Scene {

    bgContainer;
    bg;

    constructor() {
        super({ key: 'MoreGamesScene' });
    }

    preload() {
        this.cameras.main.setBackgroundColor(0xFBF200);
        gGameState = states.kSTATE_MOREGAMES;
    }

    create() {
        this.scene.sendToBack();
        //this.bg = this.add.image(0, 0, 'logo').setOrigin(0, 0);
        // this.add.tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, 'spriteAtlas', 'bgpattern.jpg').setAlpha(.5);
        // this.bg.setOrigin(0, 0);
        let graphics = this.add.graphics();

        graphics.beginPath();

        graphics.moveTo(0, 0);
        graphics.lineTo(this.sys.canvas.width, 0);
        graphics.lineTo(this.sys.canvas.width, this.sys.canvas.height);
        graphics.lineTo(0, this.sys.canvas.height);

        graphics.closePath();
        graphics.strokePath();
        graphics.fillStyle(0x00000, .75);
        graphics.fill();

        let mo = this.scene.get('MenuOverlay');
        (<MenuOverlay>mo).hideScores(true);

       
        // add the icons
        // should be in AAShared in the future!
        // and SHOULD be an html file

        // let it = this.add.dom(0,0, 'div', 'background-color: lime; width: 100%; height: 100%; font: 48px Arial', '').setOrigin(0);

        // it.setHTML(" <iframe src='https://taara.games/' scrolling='no' frameborder='0' width='240px' height='320px' top='0'></iframe>")
        var element = this.add.dom(0, 0).createFromCache('moreGamesHTML').setOrigin(0,0);

        //this.add.image(this.sys.canvas.width/2, this.sys.canvas.height-70, kSPRITE_ATLAS,kIMG_KAISTORE);


        if (gRunnngInBrowser) {
            //display link to website taara.games
        } else {
            //display KaiStore badge

        }

        // window.open("https://taara.games/",'Taara.Games','titlebar=no,toolbar=no,location=no,status=no,menubar=no,resizable=no')
    }
    update() {
        if (this.bg) {
            this.bg.tilePositionY = this.bg.tilePositionY + .2;
            //  this.bg2.tilePositionY = this.bg2.tilePositionY - .12;
            // ;
        }
    }
}