class SingleAmp extends Phaser.Physics.Arcade.Sprite {

    targetY;
    dropping;

    constructor(scene, x, y) {
        super(scene, x, y, kSPRITE_ATLAS, 'amp1.png');
        this.active = false
        this.dropping = false;
    }



    preUpdate(time, delta) {
        super.preUpdate(time, delta);


        if (this.dropping) {
            if (this.y >= this.targetY) {
                this.setVelocityY(0)
                this.dropping = false
                this.y = this.targetY
                this.wait()
            }
        }
    }

    wait() {
        this.scene.time.addEvent({
            delay: Phaser.Math.RND.integerInRange(1000, 2000),
            callback: function () {
                this.kill();
            },
            callbackScope: this,
        });
    }

    kill() {
        this.dropping = false
        this.body.y = -100
        this.active = false
        this.visible = false
    }

    drop(lx, ly, heroY) {

        this.active = true
        this.visible = true
        this.x = lx
        this.y = ly

        this.targetY = heroY
        this.dropping = true

        this.setTint(Phaser.Display.Color.GetColor(255, 83, 80))
        this.setBodySize(this.frame.width - 9, this.frame.height - 4, true);

        this.scene.physics.add.overlap(this, (<GameScene>this.scene).hero, (<GameScene>this.scene).heroAmpCollide, null, this.scene)
        this.scene.physics.add.overlap(this, (<GameScene>this.scene).bullets, (<GameScene>this.scene).hitAmphibian, null, this.scene)

        this.body.reset(lx, ly);

        this.setVelocityY(200)

    }
}