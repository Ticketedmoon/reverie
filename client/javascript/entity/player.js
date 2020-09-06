import AnimationManager from "../management/animationManager.js";

export default class Player extends Phaser.GameObjects.Sprite {

    socketId = null;
    playerName = null;
    nameAlignX = -10.5;
    nameAlignY = 20;
    jumpHeight = 1000;
    velocityX = 200;
    gravityY = 500;
    canJump = true;
    sprintRateByMs = 128;
    direction = "idle";
    characterIndex = null;

    constructor(scene, socketId, x, y, playerName, colour, direction, characterIndex) {
        super(scene, x, y);
        this.socketId = socketId;
        this.playerName = playerName;
        this.direction = direction;
        this.characterIndex = characterIndex;

        let style = { font: "16px Calibri, Arial", fill: colour, wordWrap: true, align: "center", stroke: '#000000', strokeThickness: 1 };
        this.entityText = scene.add.text(x - this.nameAlignX, y + this.nameAlignY, playerName, style);

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
        this.body.gravity.y = this.gravityY;
        this.body.setBounce(0.25);

        this.body.setDrag(100);
        this.body.setAngularDrag(100);
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

    setDirection(direction) {
        this.direction = direction;
    }

    sprint() {
        if (this.direction === "left") {
            this.body.setVelocityX(1.5 * -this.velocityX);
        } else if (this.direction === "right") {
            this.body.setVelocityX(1.5 * this.velocityX);
        }
        this.anims.msPerFrame = this.sprintRateByMs;
    }

    showIdleAnimation() {
        this.direction = "idle";
        this.body.setAcceleration(0);
        this.body.setVelocityX(0); // mov
        this.anims.play('idle-' + this.socketId, true);
    }

    jump(scene) {
        if (this.canJump) {
            this.direction = "jump";
            this.body.velocity.y -= this.jumpHeight;
            this.canJump = false;
            scene.time.delayedCall(1000, () => {
                this.canJump = true;
            }, [this], null);  // delay in ms
        }
    }

    onFloor() {
        return this.body.velocity.y < 0;
    }
}