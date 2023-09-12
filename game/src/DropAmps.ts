class DropAmps extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: kSPRITE_ATLAS,
            frame:'amp1.png',
            active: false,
            visible: false,
            classType: SingleAmp
        });
    }

    drop(x, y,hx)
    {
        let amp = this.getFirstDead(false);

        if (amp)
        {
            amp.drop(x, y, hx);
        }
    }
}