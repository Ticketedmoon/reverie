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
        this.background = this.add.image(0, 0, "background")
            .setOrigin(0, 0);

        this.physics.world.setBounds(0, 0, this.background.width, this.background.height - 300);

        let staticPlatforms = this.physics.add.staticGroup();
        staticPlatforms.create(1300, 800, 'platform');
        staticPlatforms.create(1500, 700, 'platform');
        staticPlatforms.create(1700, 600, 'platform');

        let dynamicPlatforms = this.physics.add.group({
            key: 'platform',
            frameQuantity: 3,
            setXY: { x: 1500, y: 0, stepX: 300, stepY: 200 },
            velocityX: 10,
            immovable: true
        });

        dynamicPlatforms.getChildren()[0].setFrictionX(1);
        dynamicPlatforms.getChildren()[1].setFrictionX(1);
        dynamicPlatforms.getChildren()[2].setFrictionX(1);

        console.log(dynamicPlatforms);
        this.add.text(1600, 200, "If you see this, you're a gimp");

        // Emit to server to start the socket connection to server
        this.socket.emit('initializeSocketConnection', this.userName, this.characterIndex);

        // Update current players with new player details.
        this.socket.on('currentPlayers', function (players) {
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === self.socket.id) {
                    self.networkManager.addPlayer(self, id, players[id]);
                    self.cameras.main.setBounds(0, 0, self.background.width, self.background.height);
                    self.cameras.main.startFollow(self.networkManager.player);
                    self.physics.add.collider(self.networkManager.player, staticPlatforms);
                    self.physics.add.collider(self.networkManager.player, dynamicPlatforms);
                    self.createMovingPlatforms(dynamicPlatforms, self);
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

    createMovingPlatforms(dynamicPlatforms, self) {
        dynamicPlatforms.children.iterate(function (child) {
            self.configurePlatformAnimation(self, child);
        });
    }

    configurePlatformAnimation(self, child) {
        self.tweens.add({
            targets: child,
            x: 50,
            duration: 10000,
            ease: 'Linear',
            repeat: -1,
            delay: 1000,
            yoyo: true
        });
    }

    update() {
        // Check the player has been instantiated
        if (this.networkManager.player) {
            this.networkManager.checkForPlayerMovement(this);
            this.networkManager.publishPlayerMovement(this);
        }
    }
}