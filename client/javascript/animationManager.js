export default class AnimationManager {

    initializeAnimationGroup(self) {
        this.launchAnim = this.initializeMovementAnimation(self);
    }

    initializeMovementAnimation(self) {
        // Normal Launch Animation
        return self.anims.create({
            key: 'movement',
            frames: [
                { key: 'player_anim_1', duration: 10 }
            ],
            frameRate: 16,
            repeat: -1
        });
    }
}