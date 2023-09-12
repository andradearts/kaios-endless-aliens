class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, kSPRITE_ATLAS, 'bullet.png');
        this.active = false

    }

    fire(x, y, dir = 0) {
        this.active = true
        this.visible = true
        this.x = x
        this.y = y
        this.body.reset(x, y);

        // this.setActive(true);
        // this.setVisible(true);

        this.setVelocityY(-300);
        this.setVelocityX(dir * 10);

    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.active) {
            if (this.y <= 0) {
                this.kill()
            }
        }
    }
    
    kill() {
        this.body.y = -1000
        this.body.x = -100
        this.active = false
        this.visible = false
        // this.destroy();
        //this.setActive(false);
        // this.setVisible(false);
    }
}