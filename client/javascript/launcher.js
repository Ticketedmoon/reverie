import GameConfig from './gameConfig.js';

class Launcher {
    initialize() {
        let config = new GameConfig().getConfig();
        this.game = new Phaser.Game(config);
    }
}

// Instantiate Launcher
$(document).ready(function() {
    let launcher = new Launcher();
    launcher.initialize();
});
