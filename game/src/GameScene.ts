class GameScene extends Phaser.Scene {


 
    shootKeyUp = true;

    lives: Array<Phaser.GameObjects.Image> = [];

    livingBugs: Array<Phaser.Physics.Arcade.Sprite> = [];
    gun;

    sfx_explode_amp;
    sfx_explode_hero;
    sfx_loseLife;
    sfx_reward_catch;
    sfx_reward_launch;
    sfx_shoot_amp;
    sfx_shoot_hero;
    sfx_ampDropAll;
    sfx_ampDropSingle;

    explosionPool: Phaser.GameObjects.Group;

    
    // Game play variables *****************************************************************************************
    // This is the delay bewteen the ship bullets.  decrease this to make the ship shoot faster
    kBULLET_DELAY = 400;

    // This keeps track of the last time a ship bullet was shot and is chekced against the game time.  It's set in shoot() function
    bulletTime = 0;

    // Sprites *****************************************************************************************
    // *******************************************************************************************************
    // This holds the ship sprite
    hero: Phaser.Physics.Arcade.Image;
    shield: Phaser.Physics.Arcade.Image;
    bonus: Phaser.Physics.Arcade.Image; //Phaser.GameObjects.Image;// Phaser.Physics.Arcade.Image;

    // the y position of the ship sprite based on if we're on mobile or desktop.  It's set in create()
    heroFloor;

    // Group Vaiables *****************************************************************************************
    // ********************************************************************************************************
    // This holds all the amphibians spites
    ampGroup: Phaser.GameObjects.Group; //Physics.Arcade.Group;// 
    //
    // This group contains all the explosions
    explosionGroup //: Phaser.Group;
    //
    // This group contains all the ship bullets
    bullets: Bullets; //Phaser.GameObjects.Group;
    //

    singleAmps: DropAmps;

    // This group contains all the amphibian bullets
    amphBullets: AmpBullets;

    streaks: Phaser.GameObjects.Group;
    // Amphibian Variable *****************************************************************************************
    // This tracks the drop time of the amphibians
    dropTime = 0;
    //
    // This traks the delay between drop times of the amphibians
    dropDelay = 4500;
    //
    // the time to track for when amphibians need to shoot
    ampShootTime;
    ampDropTime;

    // track the time between amphibians shots.  this will decrease over time
    ampShotDelay = 1500;
    ampDropDelay = 3000;


    bonusTimer: Phaser.Time.TimerEvent;
    dropAmpTimer: Phaser.Time.TimerEvent;
    ampShootTimer: Phaser.Time.TimerEvent;
    dropSingleAmpTimer: Phaser.Time.TimerEvent;
    // Border Sprites Variables :: These are hidden in the game ****************************************************
    // *************************************************************************************************************
    // To do not use checkForBounds when the amphibians move.  Instead I use a long rectangle sprite, hidden, with a
    // arcade physics to see if the amphibians and ship hit these borders.  When they hit they will bounce off the border
    // and head the opposite direction.
    //
    // This holds the left border sprite
    leftBorder;//:Phaser.Physics.Arcade.Image;
    //
    // This holds the right birder sprite
    rightBorder;//:Phaser.Physics.Arcade.Image;


    // Keyboard Controls *****************************************************************************************
    // ***********************************************************************************************************
    // This holds a refernce to input of Phaser.Keyboard.SPACEBAR
    shootKey //: Phaser.Key;


    // This will track the score of the game
    score = 0;

    // Sound variables *****************************************************************************************
    // *********************************************************************************************************
    // These variable will hold references to the sound objects within the game.  The sound are set up in the setUpAudio() function
    //
    // Holds the ship explosion sound
    sfxShipExplode;
    //
    // Holds the ship shotting sound
    sfxHeroShoot;
    //
    // Holds the amphibian explosion sound
    sfxAmpExplode;
    //
    // Holds the amphibian shotting sound
    sfxAmpShoot;
    //
    // Holds the bullet hit bullet sound
    sfxBulletExplode;



    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        hideBanner()
    }

    create() {

        this.setUpSprites();
        this.setUpAudio();
        this.setUpUI();

        //  Here we initilize the time bewteen amphibian shots
        this.ampShootTime = this.time.now + this.ampShotDelay;
        this.ampDropTime = this.time.now + this.ampDropDelay;
        this.dropTime = this.time.now + this.dropDelay;

        this.scene.bringToTop("MenuOverlay");
        
        this.startGame();
        
    }

    // removeAllListeners() {
    //     this.events.removeListener('startgame');
    // }

    // This gets called from the menu scene when the play button is clicked
    // Init all my game data here.
    startGame() {

        //I have to kill the KaiAd object because it causes stutter.
        this.gun = 1
        this.score = 0;
        (<MenuOverlay>this.scene.get("MenuOverlay")).displayScore(this.score);
        // this.lives.forEach(
        //     (who)=>{
        //         who.destroy()
        //     }
        // )
        // this.lives = []

        this.dropTime = this.time.now + this.dropDelay;


        gGameState = states.kSTATE_PLAYING;
        
        this.dropAmpTimer = this.time.addEvent({
            delay: this.dropDelay,
            callback: function () {
                this.dropAmps()
            },
            callbackScope: this,
            repeat: -1

        });

        this.ampShootTimer = this.time.addEvent({
            delay: this.ampShotDelay,
            callback: function () {
                this.ampShoot()
            },
            callbackScope: this

        });

        this.dropSingleAmpTimer = this.time.addEvent({
            delay: this.ampDropDelay,
            callback: function () {
                this.ampDrop()
            },
            callbackScope: this,
            repeat: -1

        });

        this.bonusTimer = this.time.addEvent({
            delay: 3000,
            callback: function () {
                this.launchBonus()
            },
            callbackScope: this

        });

    }

    update(time, delta) {

        // switch (gGameState) {
        //     case states.kSTATE_PLAYING:

        //         this.poop = this.poop + 10;
        //         this.scene.get('MenuOverlay').events.emit('setscore', [this.poop]);

        //         if (this.poop >= 1545) {
        //             gGameState = states.kSTATE_GAMEOVER;
        //             this.gameover();
        //         }
        //         break;
        // }

        switch (gGameState) {
            case states.kSTATE_PLAYING:

                this.checkKeys();
                // this.dropAmps();
                //this.ampShoot();
                //this.ampDrop();
                if (this.shield.visible == true) {
                    this.shield.x = this.hero.x
                    this.shield.y = this.hero.y - 3
                }

                // used for one button version
                // this.physics.world.wrap(this.hero, 5);

                break;
        }

    }
    
    checkKeys() {
        var left = AAKaiControls.ArrowLeft | AAKaiControls.NumKey1 | AAKaiControls.NumKey4;
        var right = AAKaiControls.ArrowRight | AAKaiControls.NumKey2 | AAKaiControls.NumKey5;
        var shot = AAKaiControls.Enter | AAKaiControls.NumKey3 | AAKaiControls.NumKey6;

        if (left) {
            this.moveShip(-4)
        } else if (right) {
            this.moveShip(4)
        }

        if (shot) {
            // if (this.shootKeyUp) {
            this.shoot();
            //         this.shootKeyUp = false
            //     }
            // } else {
            //     this.shootKeyUp = true
        }
    }

    // This function moves then amphibians down toward the ship
    dropAmps() {

        // Since we call this function every frame we only start the drop if it's time
        //if (this.time.now > this.dropTime) {

        var within = this.ampGroup.getMatching('visible', true)

        if (AAPrefs.playAudio) { this.sfx_ampDropAll.play(); }

        this.tweens.add({
            targets: within,
            props: {
                y: { value: '+=25', duration: 500, ease: 'Bounce.easeOut' }
            },
            onComplete: () => {
                this.addNewRowOfAmps(10)
                //setTimeout(() => { this.dropAmps(); }, this.dropDelay)
            },
            onCompleteScope: this

        });

        // Update the drop time to the new time to drop.
        // this.dropTime = this.time.now + this.dropDelay;

        //}

    }

    // This function adds a new row to the group of amphibians when called.
    // the parameter is the position.y to set the new amphibians
    addNewRowOfAmps(ay) {

        // Loop 5 times
        for (var x = 0; x < 5; x++) {

            // get the first dead amphibian we can find
            //var amphibian: Phaser.Physics.Arcade.Sprite = this.ampGroup.getFirstDead(true, (x * 35) + 50, ay)
            var amphibian: Amp = this.ampGroup.get((x * 35) + 30, ay);
            //getFirstDead(false, (x * 35) + 50, ay)
            // get((x * 35)+30, ay);

            amphibian.launch((x * 35) + 50, ay)

            if ((amphibian == null) || (amphibian == undefined))
                break;

            //let w = amphibian.frame.width;
            amphibian.active = true;
            amphibian.visible = true;
            amphibian.setSize(17, 14);
            amphibian.body.velocity.x = 45//35
            amphibian.setBounceX(.99)
            amphibian.play("amps")
            amphibian.setTint(Phaser.Display.Color.GetColor(0, 255, 0))
            amphibian.setDataEnabled()
            amphibian.setData('hits', 2)

            //this.livingBugs.push(amphibian)
        }
    }

    moveShip(dir) {
        var x = this.hero.x
        x += dir
        //condition ? exprIfTrue : exprIfFalse
        x = (x < 10) ? 10 : x
        x = (x > 230) ? 230 : x
        this.hero.x = x
    }


    gameover() {

        if (gGameState == states.kSTATE_GAMEOVER_DELAY) {
            return
        }

        gGameState = states.kSTATE_GAMEOVER_DELAY;

        AAKaiAnalytics.sendEvent("gameover");
        gGameState = states.kSTATE_GAMEOVER;

        // show the game over button layout.
        this.scene.get('MenuOverlay').events.emit('gameover');

        // if (AAPrefs.playAudio == true)
        //     this.sfxEndGame.play();
        if (window.navigator.vibrate){
            window.navigator.vibrate(300);
        }
        this.cameras.main.shake(150);

        if (++gFullscreenAdCount % gShowFullscreenAdEveryX == 0) {
            gFullscreenAdCount = 0
            // Display Fullscreen!
            AAKaiAds.showFullscreenAd();
            AAKaiAds.preloadFullscreenAd();
        }else{
             showBanner()
        }
       

        
        const startColor = Phaser.Display.Color.ObjectToColor({ r: 255, g: 0, b: 0, a: 255 })
        const endColor = Phaser.Display.Color.ObjectToColor({ r: 255, g: 255, b: 255, a: 255 })

        this.tweens.add({
            targets: this.hero,
            props: {
                scale: 3.0,
                angle: 1080
            },
            duration: 2000
        });

        this.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 100,
            repeat: 5,
            yoyo: true,
            onUpdate: tween => {
                const value = tween.getValue()
                const colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(startColor, endColor,
                    100,
                    value
                )
                const color = Phaser.Display.Color.GetColor(colorObj.r, colorObj.g, colorObj.b)
                this.hero.setTint(color)
                // this.hero.setScale(1+(value*.01))
            },
            onComplete: () => {
                this.expoldeParticle()

                if (AAPrefs.playAudio) { this.sfx_explode_hero.play(); }

                this.hero.destroy()
                window.navigator.vibrate(300);
                this.cameras.main.shake(250);
                this.stopAmpDropAndShot()

                this.time.addEvent({
                    delay: 3000,
                    callback: function () {
                        gGameState = states.kSTATE_GAMEOVER;
                        this.scene.get('MenuOverlay').events.emit('gameover');
                        
                    },
                    callbackScope: this,
                });

            },
            onCompleteScope: this
        });

       
        
        if (this.bonusTimer != null) {
            this.bonusTimer.destroy()
        }


    }

 stopAmpDropAndShot() {
        if (this.dropAmpTimer != null) {
            this.dropAmpTimer.destroy()
        }
        if (this.ampShootTimer != null) {
            this.ampShootTimer.destroy()
        }
        if (this.dropSingleAmpTimer != null) {
            this.dropSingleAmpTimer.destroy()
        }
    }
    shoot() {
        if (this.time.now > this.bulletTime) {

            // this.gun = 3
            if (AAPrefs.playAudio) { this.sfx_shoot_hero.play(); }

            //const bullet: Bullet = this.bullets.getFirstDead(false)// 
            // getFirstDead(false);
            // var bullet2: Bullet;
            // var bullet3: Bullet;

            if (this.gun == 1) {
                //if (bullet) {
                //   bullet.fire(this.hero.x, this.hero.y)
                //}
                this.bullets.fire(this.hero.x, this.hero.y)
            } else if (this.gun == 2) {
                // const bullet2 = this.bullets.getFirstDead(false)// get();//FirstDead(false);
                // // if (bullet && bullet2) {
                // bullet.fire(this.hero.x - 9, this.hero.y, -1)
                // bullet2.fire(this.hero.x + 9, this.hero.y, 1)
                this.bullets.fire(this.hero.x, this.hero.y, -2)
                this.bullets.fire(this.hero.x, this.hero.y, 2)

                //}
            } else if (this.gun == 3) {
                this.bullets.fire(this.hero.x, this.hero.y)
                this.bullets.fire(this.hero.x - 10, this.hero.y, -3)
                this.bullets.fire(this.hero.x + 10, this.hero.y, 3)

                // const bullet2 = this.bullets.getFirstDead(false)// get()//FirstDead(false);
                // const bullet3 = this.bullets.getFirstDead(false)// get()//FirstDead(false);
                // if (bullet && bullet2) {
                // bullet.fire(this.hero.x, this.hero.y)
                // bullet2.fire(this.hero.x - 10, this.hero.y, -3)
                // bullet3.fire(this.hero.x + 10, this.hero.y, 3)
                // }
            }


            this.bulletTime = this.time.now + this.kBULLET_DELAY;
        }
        // this is for one button mode
        // this.hero.body.velocity.x *= -1; 
    }

    getRandomAmpInView() {
        var within = this.ampGroup.getMatching('visible', true)
        var it = Phaser.Utils.Array.GetRandom(within)
        if (it.y < 280) {
            return it;
        } else {
            return this.getRandomAmpInView()
        }
        // if (it != null) {

        //     if (it.y > 10) {
        //         return it
        //     } else {
        //         return this.getRandomAmpInView()
        //     }
        // }
    }

    ampDrop() {

        // flash the bug a few times
        // maybe place a sfx
        // then drop to deck
        // wait 1-2 seconds
        // kill it

        if (this.ampGroup.getLength() < 3) {
            return;
        }

        // if (this.time.now > this.ampDropTime) {
        var it = this.getRandomAmpInView()


        // it.body.velocity.setTo(0, 0);
        // get it's position
        // destroy it
        // put a dummy in it's place.



        //ampDropDelay = 1200;
        this.ampDropTime = this.time.now + Phaser.Math.RND.integerInRange(1200, 2400);

        const startColor = Phaser.Display.Color.ObjectToColor({ r: 0, g: 255, b: 83, a: 255 })
        const endColor = Phaser.Display.Color.ObjectToColor({ r: 255, g: 83, b: 80, a: 255 })
        if (it) {
            this.tweens.addCounter({
                from: 0,
                to: 100,
                duration: 200,
                repeat: 5,
                yoyo: true,
                onUpdate: tween => {
                    const value = tween.getValue()
                    const colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(startColor, endColor,
                        100,
                        value
                    )
                    const color = Phaser.Display.Color.GetColor(colorObj.r, colorObj.g, colorObj.b)
                    it.setTint(color)
                },
                onComplete: () => {

                    var ax = it.x
                    var ay = it.y
                    it.kill() //destroy()

                    this.singleAmps.drop(ax, ay, this.hero.y)

                    if (AAPrefs.playAudio) { this.sfx_ampDropSingle.play(); }

                } //end onComplete
            })
        }
    }
    ampShoot() {


        if (AAPrefs.playAudio) { this.sfx_shoot_amp.play(); }


        var it = this.getRandomAmpInView()

        if (it) {
            this.amphBullets.fire(it.x, it.y, this.hero.x, this.hero.y)
        }

        this.ampShootTimer = this.time.addEvent({
            delay: Phaser.Math.RND.integerInRange(500, 2250),
            callback: function () {
                this.ampShoot()
            },
            callbackScope: this

        });
    }
    anotherAmpShot(perct) {
        // 50% of another bullet
        if (AAFunctions.chanceRoll(perct)) {
            setTimeout(() => { this.ampShoot(); }, Phaser.Math.RND.integerInRange(500, 750))
            // this.time.addEvent({
            //     delay: Phaser.Math.RND.integerInRange(500, 750),
            //     callback: function () {
            //         this.ampShoot();
            //         //this.anotherAmpShot(50)
            //     },
            //     callbackScope: this,
            // });
        }
    }

    setUpSprites() {
this.physics.world.fixedStep = false;
        this.physics.world.useTree = false;

        // create the borders that will be used to bounce the amphibians.  These will be hidden.
        // Create the left border sprite where x = 1 and y is just above the button of the game height, from the sprite atlas ' spriteAtlas' with sprite border.png
        this.leftBorder = this.physics.add.staticImage(0, 0, kSPRITE_ATLAS, 'border.png').setOrigin(0);
        // this.leftBorder.setImmovable(true)
        this.rightBorder = this.physics.add.staticImage(this.game.canvas.width, 0, kSPRITE_ATLAS, 'border.png').setOrigin(1, 0);
        // this.rightBorder.setImmovable(true)

        // debug enabled
        this.leftBorder.visible = kDEBUG;
        this.rightBorder.visible = kDEBUG;

        // this.spaceEmitter = this.add.particles(kSPRITE_ATLAS, 'starParticle.png').createEmitter({
        //     x: { min: 5, max: 235 },
        //     y: { min: 0, max: 310 },
        //     lifespan: 1000,
        //     speedY: { min: 5, max: 15 },
        //     alpha: { start: .5, end: 0,ease:Phaser.Math.Easing.Sine.InOut },
        //     scale: { start: .5, end: 0 },
        //     maxParticles:100,
        // });

        this.anims.remove('amps');
        this.anims.create({ key: 'amps', frames: this.anims.generateFrameNames(kSPRITE_ATLAS, { prefix: 'amp', start: 1, end: 2, suffix: '.png' }), repeat: -1, frameRate: 2 });

        //  Our amphibian group holds all the amphibian sprites

        this.ampGroup = this.physics.add.group({
            defaultKey: kSPRITE_ATLAS,
            classType: Amp, // this could be the problem!
            maxSize: 60,
            active: false
            // runChildUpdate: true
        });

        //this.ampGroup = this.add.group()
        // this.physics.add.group({ //
        //     key: kSPRITE_ATLAS,
        //     frame: 'amp1.png',
        //     frameQuantity: 50, //45,
        //     immovable: false,
        //     maxSize: -1,

        // });

        this.ampGroup.getChildren().forEach(function (child: Phaser.Physics.Arcade.Sprite) {
            child.y = -500;
            child.visible = false;
            child.active = false;
        });

        // add four rows
        var ay = 85
        this.addNewRowOfAmps(ay)
        this.addNewRowOfAmps(ay -= 25)
        this.addNewRowOfAmps(ay -= 25)
        this.addNewRowOfAmps(ay -= 25)

        this.physics.add.collider([this.rightBorder, this.leftBorder, this.ampGroup], this.ampGroup);
        // this.physics.add.collider(this.ampGroup, this.ampGroup);

        this.singleAmps = new DropAmps(this);

        this.bullets = new Bullets(this)

        this.physics.add.overlap(this.ampGroup, this.bullets, this.hitAmphibian, null, this)


        // Our amphibian bullet pool holds all the bullets shot by the amphibians

        this.amphBullets = new AmpBullets(this)

        // this.amphBullets = this.physics.add.group({
        //     defaultKey: kSPRITE_ATLAS,
        //     classType: AmpBullet, // this could be the problem!
        //     maxSize: 12,
        //     runChildUpdate: true
        // });

        // this.amphBullets.create(12);

        // this.streaks = this.add.group({
        //     defaultKey: kSPRITE_ATLAS,
        //     defaultFrame: 'streak.png',
        //     maxSize: 16,
        //     active: false
        // });

        // Set up where the ship will be. 
        this.heroFloor = 30;
        // Add the ship to the scene with arcade physics
        this.hero = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height - this.heroFloor, kSPRITE_ATLAS, 'ship.png');

        this.hero.setBodySize(this.hero.frame.width - 8, this.hero.frame.height, true);

        this.shield = this.physics.add.image(this.hero.x, this.hero.y, kSPRITE_ATLAS, 'shield.png');
        this.shield.setVisible(false)

        // this is for one button mode which I don't like but keeping here just in case
        // this.hero.setVelocityX(-100);

        this.physics.add.overlap(this.hero, this.amphBullets, this.hitHero, null, this)

        //  The explosion pool is used for eveything exploding in the game.
        // This line creates the group and adds it to the game
        //this.explosionGroup = this.add.group();
        //
        // This function will create and add 10 sprites to the group.  Notice how we don't pass in the sprite name this time.
        // This is because we will wil up the explosion with an animation in the next line...
        //this.explosionGroup.createMultiple(10, kSPRITE_ATLAS);
        //
        // ...setupExplosions get called for each sprite in the group. Look at function setupExplosions() for more info
        //this.explosionGroup.forEach(this.setupExplosions, this);


        this.explosionPool = this.add.group({
            defaultKey: kSPRITE_ATLAS,
            defaultFrame: 'starParticle.png',
            maxSize: 15,
            active: false
        });


        this.explosionPool.create(2)

        this.explosionPool.getChildren().forEach(function (child: Phaser.GameObjects.Sprite) {
            child.y = -500;
            child.visible = false;
        });

        this.anims.remove('explodeAmp');
        this.anims.create({ key: 'explodeAmp', frames: this.anims.generateFrameNames(kSPRITE_ATLAS, { prefix: 'exp', start: 1, end: 4, suffix: '.png' }), frameRate: 12 });

        // Set up the initial game variables
        // here wil initialize the time between each amphibian drop.  
        this.dropTime = this.time.now + this.dropDelay;
        //
        //  Here we initilize the time bewteen amphibian shots
        this.ampShootTime = this.time.now + this.ampShotDelay;

        this.bonus = this.physics.add.image(-50, -50, kSPRITE_ATLAS, 'bonus_upgrade.png');

        // this.physics.add.image(-50, -50, kSPRITE_ATLAS, 'bonus_upgrade.png');
        this.bonus.setDataEnabled()
        this.physics.add.overlap(this.bonus, this.hero, this.bonusCollide, null, this)

        this.displayLives()

        this.explodeEmitter = this.add.particles(kSPRITE_ATLAS, 'explosionParticle.png').createEmitter({
            x: 400,
            y: 300,
            speed: { min: 80, max: 300 },
            angle: { min: 180, max: 359 },
            scale: { start: 1.3, end: 0 },
            blendMode: 'SCREEN',
            //active: false,
            lifespan: 1500,
            gravityY: 200,

        });
        this.explodeEmitter.stop();


    }

    
    explodeEmitter;
    spaceEmitter;

    explode(_x, _y) {
        var expl = this.explosionPool.get();//FirstDead(false, _x, _y);//get(_x, _y);


        if (expl != null) {

            //if (!expl) return; // None free
            expl.setPosition(_x, _y);

            expl.setActive(true)
                .setVisible(true)
                .play('explodeAmp');

            expl.on('animationcomplete', function () { expl.setActive(false).setVisible(false); }, this);


            // this.explodeparticle.active = true;
            // this.explodeparticle.explode();


        }
    }

    expoldeParticle() {
        this.explodeEmitter.setPosition(this.hero.x, this.hero.y);
        this.explodeEmitter.explode(25);
    }

    displayLives() {
        this.lives.push(this.add.image(10, this.game.canvas.height - 8, kSPRITE_ATLAS, 'bonus_life.png'))
        this.lives.push(this.add.image(10 + 25, this.game.canvas.height - 8, kSPRITE_ATLAS, 'bonus_life.png'))
    }

    addLife() {

        if (this.lives.length == 5) {
            return
        }

        var it = this.add.image(-25, this.game.canvas.height - 8, kSPRITE_ATLAS, 'bonus_life.png')

        if (this.lives.length > 0) {
            it.x = this.lives[this.lives.length - 1].x + 25
            this.lives.push(it)
        } else {
            it.x = 10
        }

        this.tweens.add({
            targets: it,
            alpha: 0,
            duration: 50,
            repeat: 5,
            yoyo: true
        });
    }

    removeLife() {
        //every time we get hit the gun resets

        this.updateGun(0)

        if (this.lives.length > 0) {
            var l = this.lives.pop()
            l.destroy()
            return this.lives.length;
        } else {
            return 0
        }

    }

    heroAmpCollide(amp, shp) {

        this.explode(amp.x, amp.y)
        amp.body.x = -150
        // amp.destroy()
        if (amp) {
            amp.kill()
        }
        if (AAPrefs.playAudio) { this.sfx_explode_amp.play(); }
        if (this.shield.visible == false) {
            if (this.removeLife() == 0) {
                this.gameover()
            }
            // shp.destroy()
        }
        // this.gameover()
    }

    bonusCollide(bonus, hero) {

        var item = this.bonus.getData('bonus');
        // reuse recycle
        this.bonus.body.x = -100 //destroy()
        this.bonus.body.y = -100 //

        if (AAPrefs.playAudio) { this.sfx_reward_catch.play(); }


        switch (item) {

            case "points":
                this.score += 100;
                (<MenuOverlay>this.scene.get("MenuOverlay")).displayScore(this.score);
                break;

            case "upgrade": //upgrade gun
                this.updateGun(1)
                break;

            case "life": // add tra life up to 4
                this.addLife()
                break;

            case "shield": //active shield
                this.shield.setVisible(true)
                this.shield.alpha = 1
                this.tweens.add({
                    targets: this.shield,
                    alpha: .25,
                    duration: 500,
                    repeat: 5,
                    yoyo: true,
                    onUpdate: () => {
                        this.shield.x = this.hero.x
                        this.shield.y = this.hero.y - 5
                    },
                    onComplete: (who) => {
                        this.shield.setVisible(false)
                    }
                });
                break;

            default:
                break;

        }


    }

    hitHero(ship, bul) {

        if (this.shield.visible == false) {

            if (AAPrefs.playAudio) { this.sfx_loseLife.play(); }

            if (this.removeLife() == 0) {
                this.gameover()
            }
        }

        bul.kill()

    }

    hitAmphibian(amp, bul) {

        var hit = amp.getData('hits')
        if (--hit > 0) {
            amp.setTint(Phaser.Display.Color.GetColor(255, 255, 40))
            amp.setData('hits', hit)
            this.score += 1;
            (<MenuOverlay>this.scene.get("MenuOverlay")).displayScore(this.score);
            if (AAPrefs.playAudio) { this.sfx_explode_amp.play(); }
        } else {
            this.score += 10;
            (<MenuOverlay>this.scene.get("MenuOverlay")).displayScore(this.score);

            if (AAPrefs.playAudio) { this.sfx_explode_amp.play(); }

            this.explode(amp.x, amp.y)

            amp.kill()

            // amp.destroy()
        }

        bul.kill()
        // check for end of level
        // if (this.ampGroup.getLength() == 0) {
        //     this.gameover() //testing only
        // }
    }

    updateGun(howMuch) {

        if (howMuch == 0) {
            this.gun = 1
        } else {
            this.gun += howMuch
            if (this.gun > 3) {
                this.gun = 3
            }
        }
        this.updateAmpDropAndShots()
    }
    updateAmpDropAndShots() {
        this.stopAmpDropAndShot()

        this.dropAmpTimer = this.time.addEvent({
            delay: this.dropDelay / this.gun,
            callback: function () {
                this.dropAmps()
            },
            callbackScope: this,
            repeat: -1

        });

        this.ampShootTimer = this.time.addEvent({
            delay: this.ampShotDelay / this.gun,
            callback: function () {
                this.ampShoot()
            },
            callbackScope: this

        });

        this.dropSingleAmpTimer = this.time.addEvent({
            delay: this.ampDropDelay / this.gun,
            callback: function () {
                this.ampDrop()
            },
            callbackScope: this,
            repeat: -1

        });


    }
    launchBonus() {

        var x = Phaser.Math.RND.integerInRange(10, this.game.canvas.width - 10)
        var y = 20;
        this.bonus.x = x
        this.bonus.y = y
        var bonuses = ["upgrade", "life", "shield", "points"]
        var it = Phaser.Utils.Array.GetRandom(bonuses)

        var ang = 360 * 2
        if (it == "life") {
            if (this.lives.length == 5) {
                it = "points"
                ang = 0
            }
        }

        this.bonus.setData("bonus", it)
        this.bonus.setFrame("bonus_" + it + ".png")

        if (AAPrefs.playAudio) { this.sfx_reward_launch.play(); }


        this.tweens.add({
            targets: this.bonus,
            props: {
                tint: Math.random() * 0xffffff,
                angle: ang,
                y: this.hero.y
            },
            duration: 4000,
            onUpdate: () => {
                this.bonus.tint = Math.random() * 0xffffff;

            },
            onComplete: (who) => {

                this.bonus.y = -100 //destroy();
                this.bonus.x = -100 //

                if (gGameState == states.kSTATE_PLAYING) {
                    this.bonusTimer = this.time.addEvent({
                        delay: 3000,
                        callback: function () {
                            this.launchBonus()
                        },
                        callbackScope: this

                    });
                }
            },
            onCompleteScope: this
        });



    }




    setUpAudio() {
        this.sfx_explode_amp = this.sound.add("explode_amp");
        this.sfx_explode_hero = this.sound.add("explode_hero");
        this.sfx_loseLife = this.sound.add("loseLife");
        this.sfx_reward_catch = this.sound.add("reward_catch");
        this.sfx_reward_launch = this.sound.add("reward_launch");
        this.sfx_shoot_amp = this.sound.add("shoot_amp");
        this.sfx_shoot_hero = this.sound.add("shoot_hero");
        this.sfx_ampDropAll = this.sound.add("ampDrop_all");
        this.sfx_ampDropSingle = this.sound.add("ampDrop_single");
    }
    setUpUI() {

        (<MenuOverlay>this.scene.get('MenuOverlay')).showScores(true);
        //(<MenuOverlay>this.scene.get('MenuOverlay')).showResetButton(true);
    }
    
    onWorldBounds(it) {
        it.setActive(false);
        it.setVisible(false);
    }


    // This function set up the explosions used by the amphibians and the ship
    setupExplosions(exp) {
        // 'exp' parameter stores the sprite we need to add the animation too.

        // set the anchor to the middle of the expolsion
        exp.origin.x = 0.5;
        exp.origin.y = 0.5;

        // generate the frames for the animation
        // var frameNames = Phaser.Animation.generateFrameNames('exp', 1, 4, '.png', 0);

        //
        // pass that list just created to the animation.add() function of the explosion and set the speed to 15 frames per second
        // exp.animations.add('boom', frameNames, 15, true);

    }
    
}
