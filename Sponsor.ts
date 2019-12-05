class SponsorOverlay extends Phaser.Scene {

    adContainer;
    btn;

    bottomPos = 80;

    startyScore;
    startyHighScore;

    constructor() {
        super({ key: 'SponsorOverlay' });
    }

    preload() {

    }

    create() {

        let adFrame = this.add.image(0, 0, 'sponsor');
        adFrame.setOrigin(0, 0);

        this.btn = this.add.image(this.sys.canvas.width - 50, this.bottomPos, "spriteAtlas", "btn8.png").setVisible(isKaiOS);

        this.adContainer = this.add.container(0, 0, [adFrame, this.btn]).setVisible(true);
        adFrame.setInteractive();

        let xthis = this;
        adFrame.on('pointerup', function (pointer) {
            (<MenuOverlay>xthis.scene.get("MenuOverlay")).visitSponsor();
        });

        this.startyScore =(<MenuOverlay>this.scene.get("MenuOverlay")).scoreText.y;
        this.startyHighScore =(<MenuOverlay>this.scene.get("MenuOverlay")).highScoreText.y;
    }

    hideBanner() {
        // this.adContainer.setVisible(false);


        this.tweens.add({
            targets: [this.adContainer,this.btn],
            y: -110,//'-=' + this.bottomPos.toString(),
            ease: 'Sine.easeIn',
            duration: 250
        });

        this.tweens.add({
            targets: (<MenuOverlay>this.scene.get("MenuOverlay")).scoreText,
            y: this.startyScore-this.bottomPos,
            ease: 'Sine.easeIn',
            duration: 250
        });
        gTween = this.tweens.add({
            targets: (<MenuOverlay>this.scene.get("MenuOverlay")).highScoreText,
            y: this.startyHighScore-this.bottomPos,
            ease: 'Sine.easeIn',
            duration: 250
        });
    }
    showBanner() {
        // this.adContainer.setVisible(true);
        this.tweens.add({
            targets: this.adContainer,
            y: 0, //'+=' + this.bottomPos.toString(),
            ease: 'Sine.easeOut',
            duration: 500
        });
        this.tweens.add({
            targets: this.btn,
            y: this.bottomPos,
            ease: 'Sine.easeOut',
            duration: 500
        });
        this.tweens.add({
            targets: (<MenuOverlay>this.scene.get("MenuOverlay")).scoreText,
            y: this.startyScore,
            ease: 'Sine.easeOut',
            duration: 500
        });

        gTween = this.tweens.add({
            targets: (<MenuOverlay>this.scene.get("MenuOverlay")).highScoreText,
            y: this.startyHighScore,
            ease: 'Sine.easeOut',
            duration: 500
        });
    }

    showFullScreen() {

    }

}