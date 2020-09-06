import Player from '../entity/player.js';

export default class NetworkManager {

    addPlayer(self, socketId, playerInfo) {
        this.player = new Player(self, socketId, playerInfo.x, playerInfo.y, playerInfo.name, playerInfo.colour,
            playerInfo.direction, playerInfo.characterIndex);
    }

    addOtherPlayer(self, socketId, playerInfo) {
        const otherPlayer = new Player(self, socketId, playerInfo.x, playerInfo.y, playerInfo.name, playerInfo.colour,
            playerInfo.direction, playerInfo.characterIndex);
        otherPlayer.playerId = playerInfo.playerId;
        self.otherPlayers.add(otherPlayer);
    }

    checkForPlayerMovement(scene) {
        if (scene.cursors.left.isDown) {
            this.player.moveLeft();
        }
        if (scene.cursors.right.isDown) {
            this.player.moveRight();
        }
        if (scene.cursors.shift.isDown) {
            this.player.sprint();
        }

        if (scene.cursors.up.isDown && this.player.body.onFloor()) {
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

        if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
            if (this.player.oldPosition.x < this.player.x) {
                self.socket.emit('playerMovement', {x: this.player.x, y: this.player.y, direction: "right"});
            } else if (this.player.oldPosition.x > this.player.x) {
                self.socket.emit('playerMovement', {x: this.player.x, y: this.player.y, direction: "left"});
            }
        } else {
            self.socket.emit('playerMovement', {x: this.player.x, y: this.player.y, direction: "idle"});
        }

        // save old position data
        this.player.oldPosition = {
            x: this.player.x,
            y: this.player.y
        };
    }

    updateNameTagLocation(player) {
        player.entityText.x = player.x - player.nameAlignX;
        player.entityText.y = player.y + player.nameAlignY;
    }

    checkForOtherPlayerMovement(otherPlayer) {
        if (otherPlayer.direction === "left" && otherPlayer.oldDirection !== otherPlayer.direction) {
            otherPlayer.anims.play('walk-left-' + otherPlayer.socketId);
        } else if (otherPlayer.direction === "right" && otherPlayer.oldDirection !== otherPlayer.direction) {
            otherPlayer.anims.play('walk-right-' + otherPlayer.socketId);
        } else if (otherPlayer.direction === "idle") {
            otherPlayer.anims.play('idle-' + otherPlayer.socketId);
        }
        otherPlayer.oldDirection = otherPlayer.direction;
    }
}