export default class AnimationManager {

    initializeAnimationGroup(self) {
        this.initializeMovementAnimation(self);
    }

    initializeMovementAnimation(self) {
        let config = {
            key: 'walk',
            frames: self.anims.generateFrameNumbers('player_anim_1'),
            frameRate: 8,
            yoyo: true,
            repeat: -1
        };
        self.anims.create(config);
    }
}