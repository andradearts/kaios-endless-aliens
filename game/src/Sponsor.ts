class SponsorOverlay extends Phaser.Scene {

    adContainer;
    btn;

    bottomPos = kBOTTOM_POSITION_FOR_AD * gRetinaOffset;

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
        // if (kUSESPONSOR == false) {
        //     return;
        // }


        this.events.removeListener('hideAd');
        this.events.removeListener('showAd');
        emitter.on('hideAd', this.hideBanner, this);
        emitter.on('showAd', this.showBanner, this);

        this.domad = document.getElementById('sponsorad');
        this.sponsorTag = document.getElementsByClassName('tagNum')[0];

        ///////////////////////////////////////////////////
        let adFrame = this.add.image(0, 0, 'sponsor');
        adFrame.setOrigin(0, 0);


        // NOTE: 3/30/20
        // commented out the sponsor code to play with KaiAds
        // commented out setInteractive() and pointerUp
        this.btn = this.add.image(this.sys.canvas.width - 25, this.bottomPos, "spriteAtlas", "tag8.png").setVisible(!gIsTouchDevice);//false);

        let where = -this.bottomPos;
        if (kTOUCH == 1){
            where = 950;
        }
        this.adContainer = this.add.container(0, where, [adFrame, this.btn]).setVisible(true).setVisible(false);;
        // adFrame.setInteractive();

        // let xthis = this;
        // adFrame.on('pointerup', function (pointer) {
        //     (<MenuOverlay>xthis.scene.get("MenuOverlay")).visitSponsor();
        // });

        this.startyScore = (<MenuOverlay>this.scene.get("MenuOverlay")).scoreText.y;
        this.startyHighScore = (<MenuOverlay>this.scene.get("MenuOverlay")).highScoreText.y;

        // Sponsor Button #####################################################################
        if (kTOUCH == 0) {
            this.btnSponsor = new Button(this, this.sys.canvas.width - 80 * gRetinaOffset, this.sys.canvas.height + 60, 'spriteAtlas', "btnSponsor.png", this.action_sponsorButton, "sponsor", true).setVisible(true).setOrigin(.5, 1).setVisible(isKaiOS);


            if ((gRunnngInBrowser) || (kTOUCH == 1)) {
                this.btnSponsor.setVisible(false);
            }

        }


        // this.showBanner();
        this.scene.bringToTop();
        //if (isKaiOS) {
        //    this.showBanner();
        //}
    }

    hideBanner() {
        // this.adContainer.setVisible(false);

        // if (kUSESPONSOR == false) {
        //     return;
        // }

        if (kTOUCH == 0) {
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

            if (!gIsTouchDevice) { //(isKaiOS) {
                this.sponsorTag.style.visibility = "visible";
            }

            gTween = this.tweens.add({
                targets: this.btnSponsor,
                y: this.sys.game.canvas.height + 60,
                ease: 'Sine.easeIn',
                duration: 250
            });

            // this.tweens.add({
            //     targets: (<MenuOverlay>this.scene.get("MenuOverlay")).scoreText,
            //     y: this.startyScore,
            //     ease: 'Sine.easeIn',
            //     duration: 250
            // });

            // gTween = this.tweens.add({
            //     targets: (<MenuOverlay>this.scene.get("MenuOverlay")).highScoreText,
            //     y: this.startyHighScore,
            //     ease: 'Sine.easeIn',
            //     duration: 250
            // });
        }else{
            this.tweens.add({
                targets: [this.adContainer, this.btn],
                y: 950,//'-=' + this.bottomPos.toString(),
                ease: 'Sine.easeIn',
                onUpdate: function () {
                    this.domad.style.top = this.adContainer.y + "px";
                },
                callbackScope: this,
                duration: 250
            });
        }
    }


    showBanner() {
        // console.log('show banner yo');
        this.scene.bringToTop();
        //works
        //this.domad.style.visibility = "visible";
        // if (gAdShowingBanner) {
        //     if (isKaiOS) {
        //         this.sponsorTag.style.visibility = "visible";
        //     }
        // } else {
        //     return;
        // }
        if (!gIsTouchDevice) { //(isKaiOS) {
            this.sponsorTag.style.visibility = "visible";
        }

        switch (true) {
            // case (gGameState == states.kSTATE_PLAYING):
            case (gGameState == states.kSTATE_SETTINGS):
            case (gGameState == states.kSTATE_HELP):
            case (gGameState == states.kSTATE_MOREGAMES):
                return;
                break;

            default:
                break;
        }
        // if (gGameState == states.kSTATE_PLAYING) {
        //     return;
        // }
        // if (gGameState == states.kSTATE_SETTINGS) {
        //     return;
        // }
        // if (gGameState == states.kSTATE_HELP) {
        //     return;
        // }
        // if (gGameState == states.kSTATE_MOREGAMES) {
        //     return;
        // }


        // if (kUSESPONSOR == false) {
        //     return;
        // }

        // if (gAdShowingBanner == false) {
        //     return;
        // }

        // let newX = (window.innerWidth /2)-120 ; //150; 150 is for non kaios
        // this.domad.style.left = newX + "px";

        if (kTOUCH == 0) {
            // this.adContainer.setVisible(true);
            this.tweens.add({
                targets: [this.adContainer, this.btn], //this.adContainer,
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


            gTween = this.tweens.add({
                targets: this.btnSponsor,
                y: this.sys.game.canvas.height+2,
                ease: 'Sine.easeOut',
                duration: 250
            });

            // this.tweens.add({
            //     targets: (<MenuOverlay>this.scene.get("MenuOverlay")).scoreText,
            //     y: this.startyScore + (this.bottomPos),
            //     ease: 'Sine.easeOut',
            //     duration: 500
            // });


            // gTween = this.tweens.add({
            //     targets: (<MenuOverlay>this.scene.get("MenuOverlay")).highScoreText,
            //     y: this.startyHighScore + (this.bottomPos),
            //     ease: 'Sine.easeOut',
            //     duration: 500
            // });
        } else {
            this.tweens.add({
                targets: [this.adContainer, this.btn], //this.adContainer,
                y: 900, //'+=' + this.bottomPos.toString(),
                ease: 'Sine.easeOut',
                onUpdate: function () {
                    this.domad.style.top = this.adContainer.y + "px";
                },
                callbackScope: this,
                duration: 500
            });
        }
    }

    action_sponsorButton(_state) {
        if (_state == 'up') {
            if (!gFullscreenAdShowing) {
                //this.playBtnSnd();
                AAKaiAds.theBannerAd.call('click');
            }
        }
    }

}