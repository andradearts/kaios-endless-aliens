class SponsorOverlay extends Phaser.Scene {

    adContainer;
    btn;

    bottomPos = kBOTTOM_POSITION_FOR_AD;

    startyScore;
    startyHighScore;

    domad;
    sponsorTag;
    btnSponsor;

    constructor() {
        super({ key: 'SponsorOverlay' });
    }

    preload() {

    }

    create() {
        if (kUSESPONSOR == false) {
            return;
        }

        this.events.removeListener('hideAd');
        this.events.removeListener('showAd');
        emitter.on('hideAd', this.hideBanner, this);
        emitter.on('showAd', this.showBanner, this);

        this.domad = document.getElementById('kaiosad');
        this.sponsorTag = document.getElementById('tag');

        ///////////////////////////////////////////////////
        let adFrame = this.add.image(0, 0, 'sponsor');
        adFrame.setOrigin(0, 0);


        // NOTE: 3/30/20
        // commented out the sponsor code to play with KaiAds
        // commented out setInteractive() and pointerUp
        this.btn = this.add.image(this.sys.canvas.width - 50, this.bottomPos, "spriteAtlas", "tag8.png").setVisible(false);//isKaiOS);

        this.adContainer = this.add.container(0, -this.bottomPos, [adFrame, this.btn]).setVisible(true).setVisible(false);;
        // adFrame.setInteractive();

        // let xthis = this;
        // adFrame.on('pointerup', function (pointer) {
        //     (<MenuOverlay>xthis.scene.get("MenuOverlay")).visitSponsor();
        // });

        this.startyScore = (<MenuOverlay>this.scene.get("MenuOverlay")).scoreText.y;
        this.startyHighScore = (<MenuOverlay>this.scene.get("MenuOverlay")).highScoreText.y;

        // Sponsor Button #####################################################################
        this.btnSponsor = new Button(this, this.sys.canvas.width - 60, this.sys.canvas.height + 60, 'spriteAtlas', "sponsor.png", this.action_sponsorButton, "sponsor", true).setVisible(true).setOrigin(.5, 1).setVisible(isKaiOS);

        // this.showBanner();
    }

    hideBanner() {
        // this.adContainer.setVisible(false);

        if (kUSESPONSOR == false) {
            return;
        }

        //works
        //this.domad.style.visibility = "hidden";
        this.tweens.add({
            targets: [this.adContainer, this.btn],
            y: -110,//'-=' + this.bottomPos.toString(),
            ease: 'Sine.easeIn',
            onUpdate: function () {
                this.domad.style.top = this.adContainer.y + "px";
            },
            callbackScope: this,
            duration: 250
        });

        this.tweens.add({
            targets: (<MenuOverlay>this.scene.get("MenuOverlay")).scoreText,
            y: this.startyScore,
            ease: 'Sine.easeIn',
            duration: 250
        });

        this.tweens.add({
            targets: this.btnSponsor,
            y: this.sys.game.canvas.height + 80,
            ease: 'Sine.easeIn',
            duration: 250
        });

        gTween = this.tweens.add({
            targets: (<MenuOverlay>this.scene.get("MenuOverlay")).highScoreText,
            y: this.startyHighScore,
            ease: 'Sine.easeIn',
            duration: 250
        });
    }


    showBanner() {

        //works
        //this.domad.style.visibility = "visible";
        // if (gAdShowingBanner) {
        //     if (isKaiOS) {
        //         this.sponsorTag.style.visibility = "visible";
        //     }
        // } else {
        //     return;
        // }

        if (gGameState == states.kSTATE_PLAYING) {
            return;
        }
        if (kUSESPONSOR == false) {
            return;
        }
        // this.adContainer.setVisible(true);
        this.tweens.add({
            targets: this.adContainer,
            y: 0, //'+=' + this.bottomPos.toString(),
            ease: 'Sine.easeOut',
            onUpdate: function () {
                this.domad.style.top = this.adContainer.y + "px";
            },
            callbackScope: this,
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
            y: this.startyScore + this.bottomPos,
            ease: 'Sine.easeOut',
            duration: 500
        });

        this.tweens.add({
            targets: this.btnSponsor,
            y: this.sys.game.canvas.height,
            ease: 'Sine.easeOut',
            duration: 250
        });
        gTween = this.tweens.add({
            targets: (<MenuOverlay>this.scene.get("MenuOverlay")).highScoreText,
            y: this.startyHighScore + this.bottomPos,
            ease: 'Sine.easeOut',
            duration: 500
        });
    }

    action_sponsorButton(_state) {
        if (_state == 'up') {
            if (!gAdShowing) {
                //this.playBtnSnd();
                AAKaiAds.theBannerAd.call('click');
            }
        }
    }

}