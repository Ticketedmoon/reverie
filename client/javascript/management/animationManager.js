export default class AnimationManager {

    initializePlayerAnimations(self) {
        if (self.characterIndex === 0) {
            this.initializeAnimationGroup(self, 12, 14, 24, 26, 1)
        } else if (self.characterIndex === 1) {
            this.initializeAnimationGroup(self, 15, 17, 27, 29, 4)
        } else if (self.characterIndex === 2) {
            this.initializeAnimationGroup(self, 18, 20, 30, 32, 7)
        } else if (self.characterIndex === 3) {
            this.initializeAnimationGroup(self, 21, 23, 33, 35, 10)
        } else {
            throw "Character not selected correctly - error";
        }
    }

    initializeAnimationGroup(self, leftStart, leftEnd, rightStart, rightEnd, idlePos) {
        this.initializeWalkLeftAnimation(self, leftStart, leftEnd);
        this.initializeWalkRightAnimation(self, rightStart, rightEnd)
        this.initializeWalkIdleAnimation(self, idlePos);
    }

    initializeWalkLeftAnimation(self, start, end) {
        let config = {
            key: 'walk-left',
            frames: self.anims.generateFrameNumbers('player_anim_1', { start: start, end: end }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        self.anims.create(config);
    }

    initializeWalkRightAnimation(self, start, end) {
        let config = {
            key: 'walk-right',
            frames: self.anims.generateFrameNumbers('player_anim_1', { start: start, end: end }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        self.anims.create(config);
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