export default class AnimationManager {

    playerSocketToAnimNameMap = new Map();

    initializePlayerAnimations(scene, player) {
        if (player.characterIndex === 0) {
            this.initializeAnimationGroup(scene, player,0, 2, 12, 14, 24, 26, 36, 38, 1)
        } else if (player.characterIndex === 1) {
            this.initializeAnimationGroup(scene, player,3, 5, 15, 17, 27, 29, 39, 41, 4)
        } else if (player.characterIndex === 2) {
            this.initializeAnimationGroup(scene, player,6, 8, 18, 20, 30, 32, 42, 44, 7)
        } else if (player.characterIndex === 3) {
            this.initializeAnimationGroup(scene, player,9, 11, 21, 23, 33, 35, 45, 47, 10)
        } else {
            throw "Character not selected correctly - error - character index: " + player.characterIndex;
        }
    }

    initializeAnimationGroup(scene, player, downStart, downEnd, leftStart, leftEnd, rightStart, rightEnd, upStart, upEnd, idlePos) {
        if (!this.playerSocketToAnimNameMap.has(player.socketId)) {
            this.playerSocketToAnimNameMap.set(player.socketId, {
                walkLeft: 'walk-left-' + player.socketId,
                walkRight: 'walk-right-' + player.socketId,
                walkUp: 'walk-up-' + player.socketId,
                walkDown: 'walk-down-' + player.socketId,
                idle: 'idle-' + player.socketId
            });
            this.initializePlayerMovementAnimation(scene, this.playerSocketToAnimNameMap.get(player.socketId).walkLeft, leftStart, leftEnd, 4);
            this.initializePlayerMovementAnimation(scene, this.playerSocketToAnimNameMap.get(player.socketId).walkRight, rightStart, rightEnd, 4)
            this.initializePlayerMovementAnimation(scene, this.playerSocketToAnimNameMap.get(player.socketId).walkUp, upStart, upEnd, 4);
            this.initializePlayerMovementAnimation(scene, this.playerSocketToAnimNameMap.get(player.socketId).walkDown, downStart, downEnd, 4);
            this.initializePlayerMovementAnimation(scene, this.playerSocketToAnimNameMap.get(player.socketId).idle, idlePos, 4);
        }
    }

    initializePlayerMovementAnimation(scene, key, start, end, frameRate) {
        let config = {
            key: key,
            frames: scene.anims.generateFrameNumbers('player_anim_1', { start: start, end: end }),
            frameRate: frameRate,
            yoyo: false,
            repeat: -1
        };
        scene.anims.create(config);
    }
}