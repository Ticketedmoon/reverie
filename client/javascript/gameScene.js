import NetworkManager from './networkManager.js';
import ImageLoader from './imageLoader.js';
import AnimationManager from './animationManager.js';
import TextBoxManager from './text-box-manager.js';

export default class GameScene extends Phaser.Scene {

    constructor() {
        super('game');
    }

    init(name) {
        this.userName = name;
    }

    preload() {
        this.imageLoader = new ImageLoader();
        this.animationManager = new AnimationManager();
        this.textBoxManager = new TextBoxManager();
        this.networkManager = new NetworkManager();
        this.imageLoader.loadAnimationImageSets(this);
    }

    create() {
        // Store this keyword for later callbacks.
        const self = this;

        // Setup socket for each client
        this.socket = io();

        // Register text box
        this.textBoxManager.registerChatBox(this.socket);
        this.textBoxManager.registerChatBoxVisibilityControls();

        // Phaser group - Great for performing multiple operations at the same time.
        this.otherPlayers = this.physics.add.group();
        this.otherPlayers.enableBody = true;

        this.animationManager.initializeAnimationGroup(this);
        // Set background
        this.background = this.add.image(0, 0, "background")
            .setOrigin(0, 0);
        // Emit to server to start the socket connection to server
        this.socket.emit('initializeSocketConnection', this.userName);

        // Update current players with new player details.
        this.socket.on('currentPlayers', function(players) {
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === self.socket.id) {
                    self.networkManager.addPlayer(self, id, players[id]);
                    self.cameras.main.setBounds(0, 0, self.background.displayWidth, self.background.displayHeight);
                    self.cameras.main.startFollow(self.networkManager.player);
                }
                else {
                    self.networkManager.addOtherPlayer(self, id, players[id]);
                }
            });
        });

        // Update new player with all other current player details.
        this.socket.on('newPlayer', function(id, playerInfo) {
            self.networkManager.addOtherPlayer(self, id, playerInfo);
        });

        // Connect user to chat
        this.socket.on('chatUpdate', function(message, colour, userName) {
            self.textBoxManager.updateChatLog(message, colour, userName);
        });

        // Remove player from otherPlayers group if disconnect.
        this.socket.on('disconnect', function(playerId) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                    otherPlayer.entityText.destroy();
                }
            });
        });

        this.socket.on('playerMoved', function (playerInfo) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.rotation = playerInfo.rotation;
                    otherPlayer.x = playerInfo.x;
                    otherPlayer.y = playerInfo.y;
                    otherPlayer.boostActive = playerInfo.boostActive;
                    self.networkManager.updateNameTagLocation(otherPlayer);
                    self.networkManager.checkForOtherPlayerBoostThrusters(otherPlayer);
                }
            });
        });
        // Initialize default ship cursor key inputs
        this.cursors = this.input.keyboard.addKeys('up, down, left, right, shift');
    }

    update() {
        // Check the ship has been instantiated
        if (this.networkManager.player) {
            this.networkManager.checkForPlayerMovement(this);
            this.networkManager.publishPlayerMovement(this);
        }
    }
}