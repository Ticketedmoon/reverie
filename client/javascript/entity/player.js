import AnimationManager from "../management/animationManager.js";

export default class Player extends Phaser.GameObjects.Sprite {

    socketId = null;
    playerName = null;
    nameAlignX = -20;
    nameAlignY = 20;
    velocityX = 200;
    velocityY = 200;
    sprintRateByMs = 176;
    direction = "idle";
    characterIndex = null;

    constructor(scene, socketId, x, y, playerName, colour, direction, characterIndex) {
        super(scene, x, y);
        this.socketId = socketId;
        this.playerName = playerName;
        this.direction = direction;
        this.characterIndex = characterIndex;

        let style = { font: "16px Calibri, Arial", fill: colour, wordWrap: true, align: "center", stroke: '#000000', strokeThickness: 1 };
        this.entityText = scene.add.text(x + this.nameAlignX, y + this.nameAlignY, playerName, style);

        this.anims.load('walk-left-' + socketId);
        this.anims.load('walk-right-' + socketId);
        this.anims.load('sprint-left-' + socketId);
        this.anims.load('sprint-right-' + socketId);
        this.anims.load('idle-' + socketId);
        this.animationManager = new AnimationManager();
        this.animationManager.initializePlayerAnimations(scene, this);
        this.setPlayerProperties(scene);
    }

    setPlayerProperties(scene) {
        scene.physics.world.enable(this, Phaser.Physics.ARCADE);
        scene.add.existing(this)
            .setScale(0.85, 0.85)
            .setOrigin(0, -0.5)
            .play('idle-' + this.socketId);
        this.body.setCollideWorldBounds(true);
        this.body.setDrag(0);
        this.body.setAngularDrag(0);
        this.body.setMaxVelocity(500);
    }

    moveLeft() {
        this.setDirection("left")
        this.body.setVelocityX(-this.velocityX); // mov
        this.anims.play('walk-left-' + this.socketId, true);
    }

    moveRight() {
        this.setDirection("right");
        this.body.setVelocityX(this.velocityX); // mov
        this.anims.play('walk-right-' + this.socketId, true);
    }

    moveUp() {
        this.setDirection("up");
        this.body.setVelocityY(-this.velocityY); // mov
        this.anims.play('walk-up-' + this.socketId, true);
    }

    moveDown() {
        this.setDirection("down");
        this.body.setVelocityY(this.velocityY); // mov
        this.anims.play('walk-down-' + this.socketId, true);
    }

    setDirection(direction) {
        this.direction = direction;
    }

    sprint() {
        if (this.direction === "left") {
            this.body.setVelocityX(1.25 * -this.velocityX);
        } else if (this.direction === "right") {
            this.body.setVelocityX(1.25 * this.velocityX);
        } else if (this.direction === "up") {
            this.body.setVelocityY(1.25 * -this.velocityY);
        } else if (this.direction === "down") {
            this.body.setVelocityY(1.25 * this.velocityY);
        }
        this.anims.msPerFrame = this.sprintRateByMs;
    }

    showIdleAnimation() {
        this.direction = "idle";
        this.body.setAcceleration(0);
        this.resetPlayerVelocity();
        this.anims.play('idle-' + this.socketId, true);
    }

    resetPlayerVelocity() {
        this.body.setVelocityX(0); // mov
        this.body.setVelocityY(0); // mov
    }
}