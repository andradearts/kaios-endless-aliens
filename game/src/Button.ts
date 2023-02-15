// / <reference path='../phaser.d.ts'/>
// / <reference path='./shaders/OutlinePipeline.ts'/>

class Button extends Phaser.GameObjects.Sprite {

    upFrame;
    downFrame;
    overFrame;
    callback;
    myScene;
    clicked = false;
    outline;
    isScreenButton;
    id;
    myScope;
    rollovedEnabled;

    isSelected = false;

    // #UP,#DOWN or #BOTH
    callWhen = 'both'; //default

    // Main color of the button
    mainTint;
    rolloverColor = 0xffff99;
    selectColor = 0x00FF00;

    // constructor(_scene, _x, _y, _tex, _upFrame, _callback, theName, hasRollver) {
    constructor(_scene, _x, _y, _upFrame, _callback, hasRollver) {
        super(_scene, _x, _y, _upFrame);
        _scene.add.existing(this);

        this.rollovedEnabled = hasRollver;
        this.name = _upFrame;
        this.setOrigin(.5);
        this.setInteractive();
        this.on('pointerup', this.pointerUp, this);
        this.on('pointerdown', this.pointerDown, this);
        this.on('pointerover', this.pointerOver, this);
        this.on('pointerout', this.pointerOut, this);


        this.upFrame = _upFrame;

        this.callback = _callback;
        this.myScene = _scene;

        this.clicked = false;

        this.isSelected = false;

        this.scene.input.on('pointerup', this.generalPointerUp, this);
        return this;

    }

    setMainTint(theTint) {
        this.mainTint = theTint;
        this.setTint(theTint);
    }
    select(shoudAnimate = true) {

        //  if (kIOS_WRAPPED) {
        this.setTint(this.selectColor);//0xf6a45b);
        //}

        if (shoudAnimate) {
            let oldSclX = 1;//this.scaleX;
            let oldSclY = 1;//this.scaleY;
            this.setScale(0);

            this.myScene.tweens.add({
                targets: this,
                scaleX: oldSclX,
                scaleY: oldSclY,
                ease: 'Bounce.easeOut',
                duration: 300
            });
        }
        this.isSelected = true;
    }

    deselect() {
        this.myClearTint();
        this.setTint(this.mainTint);
        this.isSelected = false;
    }

    myClearTint() {

        if (this.mainTint == null) {
            this.clearTint();
        } else {
            this.setTint(this.mainTint);
        }
    }

    bounce(dir, toSize: number = 1) {

        let oldSclX;// = this.scaleX;
        let oldSclY;// = this.scaleY;


        if (dir == 'in') {
            oldSclX = toSize;//this.scaleX;
            oldSclY = toSize;//this.scaleY;
            this.setScale(0);
        } else if (dir == 'out') {
            oldSclX = 0;
            oldSclY = 0;
        }
        this.myScene.tweens.add({
            targets: this,
            scaleX: oldSclX,
            scaleY: oldSclY,
            ease: 'Bounce.easeOut',
            duration: 300,
            onComplete: () => {
                if (dir == 'out') {
                    this.setVisible(false);
                    this.setScale(1);
                }
            }
        });
    }
    enableRollover(how) {
        this.rollovedEnabled = how;
    }

    pointerMove(pointer) {
        //  console.log(pointer.event.type);
    }
    generalPointerUp(pointer) {

        if ((this.callWhen == 'up') || (this.callWhen == 'both')) {
            if (this.id == pointer.id) {
                let it = Phaser.Geom.Rectangle.Contains(this.getBounds(), pointer.upX, pointer.upY);
                if (!it) {
                    this.pointerUpOutside(pointer);
                }
            }
        }

    }

    pointerUpOutside(pointer) {
        if ((this.callWhen == 'up') || (this.callWhen == 'both')) {
            //this.setFrame(this.upFrame);
            this.myClearTint();//  setTint(0xffffff);
            // this.myScene.events.emit('screenButtonEvent', "up", this.name);
        }
    }
    pointerUp(pointer) {

        // The reason I check for clicked is so I don't trigger the pointer up if
        // the mouse wasn't frist clicked on the button itself.
        // I check for pointer null when I send this event via keyboard control.  Null tells
        // me it's a keyup pressed custom event
        if ((this.callWhen == 'up') || (this.callWhen == 'both')) {
            if ((this.clicked == true) || (pointer == null)) {
                this.clicked = false;
                this.myClearTint();//this.setTint(0xffffff);
                //this.setFrame(this.upFrame);
                // this.callback.call(this.myScene);
                if (this.callback) {
                    this.callback.call(this.myScene, 'up');
                }

                // this.myScene.events.emit('screenButtonEvent', "up", this.name);
            }
        }
    }

    pointerDown(pointer) {
        if ((this.callWhen == 'down') || (this.callWhen == 'both')) {
            this.id = pointer.id;
            this.clicked = true;
            this.setTint(0x9df89d);

            // this.setFrame(this.downFrame);
            if (this.callback) {
                this.callback.call(this.myScene, 'down');
            }

            // this.myScene.events.emit('screenButtonEvent', "down", this.name);
        }
    }

    pointerOver(pointer, x, y) {
        if (this.rollovedEnabled) {
            //this.setPipeline("Outline");
            // this.setFrame(this.overFrame);
            //  if (kIOS_WRAPPED) {
            this.setTint(this.rolloverColor);
            //  }
            // this.myScene.events.emit('rollover', this);
        }
    }

    pointerOut(pointer) {
        if (this.rollovedEnabled) {
            //this.setFrame(this.upFrame);
            this.myClearTint();//this.setTint(0x000000);
        }
    }

    // Leave this comment here for my reference 
    // b.setFrames('btn_sound_off.png', 'btn_sound_off.png', 'btn_sound_on.png', 'btn_sound_off.png');
    // used for switching up toggle states  
    setFrames(_upFrame) {
        this.upFrame = _upFrame;
        this.setFrame(this.upFrame);
    }

}//end class
