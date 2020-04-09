class PieMeter extends Phaser.GameObjects.Graphics {

    //  pieMeter;
    myRadius;
    pieProgress = 0;
    direction = 0;
    endValue;

    color = 0x000000;
    opacity = .5;

    // _scene:  the scene you want to display the meter in
    // _x, _y:  the position to display the meter
    // _radi:   the fadius of the meter
    // _dir:    the direction of the meter.  Value is either 1 or 0
    // _flip:   flips the meter horizontially and is used in conjunction with the _dir
    constructor(_scene, _x, _y, _radi, _dir, _flip, _endValue) {
        super(_scene, { x: _x, y: _y });
        this.angle = 0;
        this.alpha = .75;
        this.scaleY = _flip;
        this.setActive(true);
        this.myRadius = _radi;
        this.direction = _dir;
        this.endValue = _endValue;

        _scene.add.existing(this);
    }

    setColor(_color,_opacity){
        this.color = _color;
        this.opacity = _opacity;
    }
    // constructor(_scene, _x: number, _y: number, _radi) {
    //     super(_scene, { x: _x, y: _y });
    //     // if error mode sure phaser.d.ts has Partial<GraphicsStyles> of graphicsOptions


    //     this.angle = 0;
    //     this.alpha = .15;
    //     this.scaleY = -1;
    //     this.setActive(true);
    //     this.myRadius = _radi;
    //     _scene.add.existing(this);
    // }

    drawPieStatic(amount) {
        if (this.visible == false)
            this.visible = true;

        this.pieProgress = amount;

        this.clear();
        this.fillStyle(this.color, this.opacity);
        let radius = this.myRadius;
        this.angle = -90;
        this.slice(0, 0, radius,
            Phaser.Math.DegToRad(0),
            Phaser.Math.DegToRad(360 * this.pieProgress),
            true);
        this.fillPath();

        return this.pieProgress;
    }

    //return number bt 0 and 1.0
    getValue() {
        return this.pieProgress / 360.0;
    }

    // should be bt 0 and 1.0
    setValue(howMuch) {
        this.pieProgress = howMuch * 360.0;
    }

    drawPie(howMuch, increase?: Boolean) {

        if (this.visible == false)
            this.visible = true;

        if ((increase == true) || (increase == null)) {
            this.pieProgress += howMuch;
        } else {
            this.pieProgress = howMuch;
        }
        this.clear();
        this.fillStyle(this.color, this.opacity);
        let radius = this.myRadius;
        this.angle = -90;
        this.slice(0, 0, radius,
            Phaser.Math.DegToRad(0),
            Phaser.Math.DegToRad(this.pieProgress),
            true);
        this.fillPath();

        return this.pieProgress / 360.0;
        // }
    }

    drawPie2(howMuch) {

        if (this.visible == false)
            this.visible = true;

        this.clear();
        this.fillStyle(this.color, this.opacity);
        let radius = this.myRadius;

        // Rotate to make 0 as 12 o'clock
        this.angle = -90;

        this.pieProgress = (360 / this.endValue * howMuch);

        if (this.direction == 0) {
            this.slice(0, 0, radius, 0, Phaser.Math.DegToRad(this.pieProgress), true);
        } else {
            this.slice(0, 0, radius, Phaser.Math.DegToRad(this.pieProgress), 0, true);
        }

        this.fillPath();

    }


    reset() {
        this.pieProgress = 0;
        // this.visible = false;
    }
}
