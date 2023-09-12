
class Amp extends Phaser.Physics.Arcade.Sprite { //Phaser.GameObjects.Sprite {

    speed = .75

    constructor(scene: Phaser.Scene) {
        super(scene, -100, -100, kSPRITE_ATLAS, 'amp1.png');
        // scene.add.sprite(100, 100, kSPRITE_ATLAS, 'amp1.png')
        // this.active = false
        // this.visible = false;

        return this
    }

    // preUpdate(time, delta) {

    //     super.preUpdate(time, delta);

    //     // this.x = this.x + this.speed

    //     // if (this.x >= 220){
    //     //     this.body.x = 219
    //     //     this.body.velocity.x *= -1
    //     // }else if (this.x <= 10) {
    //     //     this.body.x = 11
    //     //     this.body.velocity.x *= -1
    //     // }
       
    // }

    launch(x, y) {
        // this.body.reset(x, y);
        this.active = true
        this.visible = true
        this.x = x;
        this.y = y;
    }

    kill() {
        this.y = -100
        this.active = false
        this.visible = false
    }

}