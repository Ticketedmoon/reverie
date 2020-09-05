export default class AnimationManager {

    constructor() {
    }

    initializePlayerAnimations(scene, player) {
        if (player.characterIndex === 0) {
            this.initializeAnimationGroup(scene, 12, 14, 24, 26, 1)
        } else if (player.characterIndex === 1) {
            this.initializeAnimationGroup(scene, 15, 17, 27, 29, 4)
        } else if (player.characterIndex === 2) {
            this.initializeAnimationGroup(scene, 18, 20, 30, 32, 7)
        } else if (player.characterIndex === 3) {
            this.initializeAnimationGroup(scene, 21, 23, 33, 35, 10)
        } else {
            throw "Character not selected correctly - error";
        }
    }

    initializeAnimationGroup(scene, leftStart, leftEnd, rightStart, rightEnd, idlePos) {
        this.initializeWalkLeftAnimation(scene, leftStart, leftEnd);
        this.initializeWalkRightAnimation(scene, rightStart, rightEnd)
        this.initializeWalkIdleAnimation(scene, idlePos);
    }

    initializeWalkLeftAnimation(scene, start, end) {
        let config = {
            key: 'walk-left',
            frames: scene.anims.generateFrameNumbers('player_anim_1', { start: start, end: end }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        scene.anims.create(config);
    }

    initializeWalkRightAnimation(scene, start, end) {
        let config = {
            key: 'walk-right',
            frames: scene.anims.generateFrameNumbers('player_anim_1', { start: start, end: end }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        scene.anims.create(config);
    }

    // TODO: Currently this isn't an animation, just an image.
    initializeWalkIdleAnimation(self, value) {
        let config = {
            key: 'idle',
            frames: self.anims.generateFrameNumbers('player_anim_1', { start: value, end: value }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        self.anims.create(config);
    }
}