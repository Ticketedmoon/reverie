export default class Player extends Phaser.GameObjects.Sprite {

    socketId = null;
    playerName = null;
    nameAlignX = 12;
    nameAlignY = -45;
    jumpHeight = 80;

    preload() {
        this.anims.load('walk-left');
        this.anims.load('walk-right');
        this.anims.load('idle');
    }

    constructor(scene, socketId, x, y, rotation, playerName, colour) {
        super(scene, x, y);
        this.rotation = rotation;
        this.socketId = socketId;
        this.playerName = playerName;
        this.colour = colour;

        let style = { font: "13px Calibri, Arial", fill: colour, wordWrap: true, align: "center", stroke: '#000000', strokeThickness: 0.5 };
        this.entityText = scene.add.text(x - this.nameAlignX, y + this.nameAlignY, playerName, style);
        this.setShipProperties(scene);
    }

    setShipProperties(scene) {
        scene.physics.world.enable(this, Phaser.Physics.ARCADE);
        scene.add.existing(this).setOrigin(0, -0.5);
        this.body.setSize(200, 200).setOffset(0, 0);
        this.body.setCollideWorldBounds(true);
        this.body.gravity.y = 150;
        this.body.setBounce(0.25);

        this.body.setDrag(100);
        this.body.setAngularDrag(100);
        this.body.setMaxVelocity(500);
    }

    moveLeft(scene) {
        scene.physics.velocityFromRotation(this.rotation + 270, -50, this.body.acceleration);
        this.anims.play('walk-left', true);
    }

    moveRight(scene) {
        scene.physics.velocityFromRotation(this.rotation + 270, 50, this.body.acceleration);
        this.anims.play('walk-right', true);
    }

    showIdleAnimation() {
        console.log(this.body);
        this.body.setAcceleration(0);
        this.anims.play('idle', true);
    }

    jump() {
        console.log(this.body.y);
        this.body.y -= this.jumpHeight;
        console.log(this.body.y);
    }

    isJumping() {
        console.log(this.body.y);
        return this.body.y < 400;
    }
}