class SponsorOverlay extends Phaser.Scene {

    adContainer;

    constructor() {
        super({ key: 'SponsorOverlay' });
    }

    preload() {

    }

    create() {

        let adFrame = this.add.graphics();

        adFrame.beginPath();

        adFrame.moveTo(0, 0);
        adFrame.lineTo(this.sys.canvas.width, 0);
        adFrame.lineTo(this.sys.canvas.width, 42);
        adFrame.lineTo(0, 42);

        adFrame.closePath();
        adFrame.strokePath();
        adFrame.fillStyle(0xff0000, .75);
        adFrame.fill();


        let btn = this.add.image(this.sys.canvas.width - 25, 42, "spriteAtlas", "btn5.png");

        this.adContainer = this.add.container(0, 0, [adFrame, btn]).setVisible(true);
    }

    hideBanner() {
        this.adContainer.setVisible(false);
    }
    showBanner() {
        this.adContainer.setVisible(true);
    }

    showFullScreen() {

    }

}