export default class Player extends Phaser.GameObjects.Sprite {

    socketId = null;
    playerName = null;
    nameAlignX = -10.5;
    nameAlignY = 20;
    jumpHeight = 80;
    direction = "idle";

    preload() {
        this.anims.load('walk-left');
        this.anims.load('walk-right');
        this.anims.load('idle');
    }

    constructor(scene, socketId, x, y, playerName, colour, direction) {
        super(scene, x, y);
        this.socketId = socketId;
        this.playerName = playerName;
        this.colour = colour;
        this.direction = direction;

        let style = { font: "16px Calibri, Arial", fill: colour, wordWrap: true, align: "center", stroke: '#000000', strokeThickness: 1 };
        this.entityText = scene.add.text(x - this.nameAlignX, y + this.nameAlignY, playerName, style);
        this.setPlayerProperties(scene);
    }

    setPlayerProperties(scene) {
        scene.physics.world.enable(this, Phaser.Physics.ARCADE);
        scene.add.existing(this)
            .setScale(0.85, 0.85)
            .setOrigin(0, -0.5)
            .play('idle');
        this.body.setCollideWorldBounds(true);
        this.body.gravity.y = 500;
        this.body.setBounce(0.25);

        this.body.setDrag(100);
        this.body.setAngularDrag(100);
        this.body.setMaxVelocity(500);
    }

    moveLeft() {
        this.direction = "left";
        this.body.setVelocityX(-200); // mov
        this.anims.play('walk-left', true);
    }

    moveRight() {
        this.direction = "right";
        this.body.setVelocityX(200); // mov
        this.anims.play('walk-right', true);
    }

    showIdleAnimation() {
        this.direction = "idle";
        this.body.setAcceleration(0);
        this.body.setVelocityX(0); // mov
        this.anims.play('idle', true);
    }

    jump() {
        this.direction = "jump";
        this.body.y -= this.jumpHeight;
    }

    isJumping() {
        return this.body.y < 872.8;
    }
}