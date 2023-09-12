class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: 'sptireAtals',
            frame:'bullet.png',
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    fire(x, y,dir=0)
    {
        let bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y, dir);
        }
    }
}