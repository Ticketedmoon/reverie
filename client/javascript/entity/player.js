import AnimationManager from "../management/animationManager.js";

export default class Player extends Phaser.GameObjects.Sprite {

    socketId = null;
    playerName = null;
    nameAlignX = -10.5;
    nameAlignY = 20;
    jumpHeight = 150;
    canJumpAgain = true;
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
        this.body.gravity.y = 500;
        this.body.setBounce(0.25);

        this.body.setDrag(100);
        this.body.setAngularDrag(100);
        this.body.setMaxVelocity(500);
    }

    moveLeft() {
        this.direction = "left";
        this.body.setVelocityX(-200); // mov
        this.anims.play('walk-left-' + this.socketId, true);
    }

    moveRight() {
        this.direction = "right";
        this.body.setVelocityX(200); // mov
        this.anims.play('walk-right-' + this.socketId, true);
    }

    showIdleAnimation() {
        this.direction = "idle";
        this.body.setAcceleration(0);
        this.body.setVelocityX(0); // mov
        this.anims.play('idle-' + this.socketId, true);
    }

    jump(scene) {
        this.direction = "jump";
        this.body.y -= this.jumpHeight;
        this.canJumpAgain = false;
        scene.time.delayedCall(1000, this.resetJump, [this], null);
    }

    resetJump(player) {
        player.canJumpAgain = true;
    }

    isJumping() {
        return !this.canJumpAgain;
    }
}