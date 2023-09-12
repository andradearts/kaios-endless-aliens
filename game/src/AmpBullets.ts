class AmpBullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: kSPRITE_ATLAS,
            frame:'bullet.png',
            active: false,
            visible: false,
            classType: AmpBullet
        });
    }

    fire(x, y,hx,hy)
    {
        let bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y, hx,hy);
        }
    }
}