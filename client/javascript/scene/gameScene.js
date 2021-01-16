import NetworkManager from '../management/networkManager.js';
import ImageLoader from '../management/imageLoader.js';
import TextBoxManager from '../management/text-box-manager.js';

export default class GameScene extends Phaser.Scene {

    constructor() {
        super('game');
    }

    init(data) {
        this.userName = data.name;
        this.characterIndex = data.characterIndex;
    }

    preload() {
        this.imageLoader = new ImageLoader();
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

        // Set background
        this.background = this.add.image(0, 0, "tiles")
            .setOrigin(0, 0);

        const map = this.make.tilemap({ key: 'world' });
        const tileset = map.addTilesetImage('background', 'tiles');
        // TODO: Find out why this console log is null and when discovered, ensure collision detection from tiled is working.
        this.backgroundLayer = map.createStaticLayer('Tile Layer 1', tileset, 0, 200);
        console.log(this.backgroundLayer);
        this.physics.world.setBounds(0, -20, this.background.width, this.background.height);

        // Emit to server to start the socket connection to server
        this.socket.emit('initializeSocketConnection', this.userName, this.characterIndex);

        // Update current players with new player details.
        this.socket.on('currentPlayers', function (players) {
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === self.socket.id) {
                    self.networkManager.addPlayer(self, id, players[id]);
                    self.cameras.main.setBounds(0, 0, self.background.width, self.background.height);
                    self.cameras.main.startFollow(self.networkManager.player);
                } else {
                    self.networkManager.addOtherPlayer(self, id, players[id]);
                }
            });
        });

        // Update new player with all other current player details.
        this.socket.on('newPlayer', function (id, playerInfo) {
            self.networkManager.addOtherPlayer(self, id, playerInfo);
        });

        // Connect user to chat
        this.socket.on('chatUpdate', function (message, colour, userName) {
            self.textBoxManager.updateChatLog(message, colour, userName);
        });

        // Remove player from otherPlayers group if disconnect.
        this.socket.on('disconnect', function (playerId) {
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
                    otherPlayer.x = playerInfo.x;
                    otherPlayer.y = playerInfo.y;
                    otherPlayer.direction = playerInfo.direction;
                    self.networkManager.checkForOtherPlayerMovement(otherPlayer)
                    self.networkManager.updateNameTagLocation(otherPlayer);
                }
            });
        });
        // Initialize default ship cursor key inputs
        this.cursors = this.input.keyboard.addKeys('up, down, left, right, shift');
    }

    update() {
        // Check the player has been instantiated
        if (this.networkManager.player) {
            this.networkManager.checkForPlayerMovement(this);
            this.networkManager.publishPlayerMovement(this);
        }
    }
}