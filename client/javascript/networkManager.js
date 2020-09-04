import Player from './player.js';

export default class NetworkManager {

    addPlayer(self, socketId, playerInfo) {
        this.player = new Player(self, socketId, playerInfo.x, playerInfo.y, playerInfo.rotation, playerInfo.name, playerInfo.colour);
    }

    addOtherPlayer(self, socketId, playerInfo) {
        const otherPlayer = new Player(self, socketId, playerInfo.x, playerInfo.y, playerInfo.rotation, playerInfo.name, playerInfo.colour)
        otherPlayer.playerId = playerInfo.playerId;
        self.otherPlayers.add(otherPlayer);
    }

    checkForPlayerMovement(scene) {
        if (scene.cursors.left.isDown) {
            this.player.moveLeft(scene);
        }
        if (scene.cursors.right.isDown) {
            this.player.moveRight(scene);
        }

        if (scene.cursors.up.isDown && !this.player.isJumping()) {
            this.player.jump();
        }

        if (scene.cursors.down.isDown) {
            console.log("Cursor down pushed");
        }

        if (!scene.cursors.left.isDown && !scene.cursors.right.isDown && !scene.cursors.up.isDown && !scene.cursors.down.isDown) {
            this.player.showIdleAnimation();
        }
        this.updateNameTagLocation(this.player);
    }

    publishPlayerMovement(self) {
        const x = this.player.x;
        const y = this.player.y;
        const r = this.player.rotation;

        if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y || r !== this.player.oldPosition.rotation)) {
            self.socket.emit('playerMovement', { x: this.player.x, y: this.player.y, rotation: this.player.rotation });
        }
        
        // save old position data
        this.player.oldPosition = {
            x: this.player.x,
            y: this.player.y,
            rotation: this.player.rotation,
        };
    }

    updateNameTagLocation(player) {
        player.entityText.x = player.x - player.nameAlignX;
        player.entityText.y = player.y + player.nameAlignY;
    }
}