export default class AnimationManager {

    playerSocketToAnimNameMap = new Map();

    initializePlayerAnimations(scene, player) {
        if (player.characterIndex === 0) {
            this.initializeAnimationGroup(scene, player,12, 14, 24, 26, 1)
        } else if (player.characterIndex === 1) {
            this.initializeAnimationGroup(scene, player,15, 17, 27, 29, 4)
        } else if (player.characterIndex === 2) {
            this.initializeAnimationGroup(scene, player,18, 20, 30, 32, 7)
        } else if (player.characterIndex === 3) {
            this.initializeAnimationGroup(scene, player,21, 23, 33, 35, 10)
        } else {
            throw "Character not selected correctly - error";
        }
    }

    initializeAnimationGroup(scene, player, leftStart, leftEnd, rightStart, rightEnd, idlePos) {
        if (!this.playerSocketToAnimNameMap.has(player.socketId)) {
            this.playerSocketToAnimNameMap.set(player.socketId, {
                walkLeft: 'walk-left-' + player.socketId,
                walkRight: 'walk-right-' + player.socketId,
                idle: 'idle-' + player.socketId
            });
            this.initializeWalkLeftAnimation(scene, player, leftStart, leftEnd);
            this.initializeWalkRightAnimation(scene, player, rightStart, rightEnd)
            this.initializeWalkIdleAnimation(scene, player, idlePos);
        }
    }

    initializeWalkLeftAnimation(scene, player, start, end) {
        let config = {
            key: this.playerSocketToAnimNameMap.get(player.socketId).walkLeft,
            frames: scene.anims.generateFrameNumbers('player_anim_1', { start: start, end: end }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        scene.anims.create(config);
    }

    initializeWalkRightAnimation(scene, player, start, end) {
        let config = {
            key: this.playerSocketToAnimNameMap.get(player.socketId).walkRight,
            frames: scene.anims.generateFrameNumbers('player_anim_1', { start: start, end: end }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        scene.anims.create(config);
    }

    // TODO: Currently this isn't an animation, just an image.
    initializeWalkIdleAnimation(self, player, value) {
        let config = {
            key: this.playerSocketToAnimNameMap.get(player.socketId).idle,
            frames: self.anims.generateFrameNumbers('player_anim_1', { start: value, end: value }),
            frameRate: 4,
            yoyo: false,
            repeat: -1
        };
        self.anims.create(config);
    }
}