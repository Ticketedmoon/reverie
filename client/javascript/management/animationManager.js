export default class AnimationManager {

    initializeAnimationGroup(self) {
        this.initializeWalkLeftAnimation(self);
        this.initializeWalkRightAnimation(self)
        this.initializeWalkIdleAnimation(self);
    }

    initializeWalkLeftAnimation(self) {
        let config = {
            key: 'walk-left',
            frames: self.anims.generateFrameNumbers('player_anim_1', { start: 12, end: 14 }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        self.anims.create(config);
    }

    initializeWalkRightAnimation(self) {
        let config = {
            key: 'walk-right',
            frames: self.anims.generateFrameNumbers('player_anim_1', { start: 24, end: 26 }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        self.anims.create(config);
    }

    // TODO: Currently this isn't an animation, just an image.
    initializeWalkIdleAnimation(self) {
        let config = {
            key: 'idle',
            frames: self.anims.generateFrameNumbers('player_anim_1', { start: 1, end: 1 }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        self.anims.create(config);
    }
}