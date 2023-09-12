class AmpBullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, -100, -100, kSPRITE_ATLAS,'ampBullet.png');
        
    }

    fire (x, y,hx,hy)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        // this.setVelocityY(400);
        this.scene.physics.accelerateTo(this,hx,hy, 300, 50, 300);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.y >= this.scene.game.canvas.height)
        {
            this.kill()
        }
    }
    
    kill(){
        this.body.y = -100
        this.active = false
        this.visible = false

        // this.body.y = -100
        // this.destroy();
        // this.setActive(false);
        // this.setVisible(false);
    }
}