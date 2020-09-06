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
            throw "Character not selected correctly - error - character index: " + player.characterIndex;
        }
    }

    initializeAnimationGroup(scene, player, leftStart, leftEnd, rightStart, rightEnd, idlePos) {
        if (!this.playerSocketToAnimNameMap.has(player.socketId)) {
            this.playerSocketToAnimNameMap.set(player.socketId, {
                walkLeft: 'walk-left-' + player.socketId,
                walkRight: 'walk-right-' + player.socketId,
                idle: 'idle-' + player.socketId
            });
            this.initializeWalkLeftAnimation(scene, this.playerSocketToAnimNameMap.get(player.socketId).walkLeft, leftStart, leftEnd, 4);
            this.initializeWalkRightAnimation(scene, this.playerSocketToAnimNameMap.get(player.socketId).walkRight, rightStart, rightEnd, 4)
            this.initializeWalkIdleAnimation(scene, this.playerSocketToAnimNameMap.get(player.socketId).idle, idlePos, 4);
        }
    }

    initializeWalkLeftAnimation(scene, key, start, end, frameRate) {
        let config = {
            key: key,
            frames: scene.anims.generateFrameNumbers('player_anim_1', { start: start, end: end }),
            frameRate: frameRate,
            yoyo: false,
            repeat: -1
        };
        scene.anims.create(config);
    }

    initializeWalkRightAnimation(scene, key, start, end, frameRate) {
        let config = {
            key: key,
            frames: scene.anims.generateFrameNumbers('player_anim_1', { start: start, end: end }),
            frameRate: frameRate,
            yoyo: false,
            repeat: -1
        };
        scene.anims.create(config);
    }

    // TODO: Currently this isn't an animation, just an image.
    initializeWalkIdleAnimation(self, key, value, frameRate) {
        let config = {
            key: key,
            frames: self.anims.generateFrameNumbers('player_anim_1', { start: value, end: value }),
            frameRate: frameRate,
            yoyo: false,
            repeat: -1
        };
        self.anims.create(config);
    }
}