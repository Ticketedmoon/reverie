import LoginScene from '../scene/loginScene.js';
import GameScene from '../scene/gameScene.js';
import CharacterSelectScene from "../scene/CharacterSelectScene.js";

export default class GameConfig {

    getConfig() {
        return {
            type: Phaser.AUTO,
            parent: 'phaser-canvas',
            url: null,
            version: "0.0.2",
            fps: 30,

            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1200,
                height: 600
            },

            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                }
            },

            scene: [
                LoginScene,
                CharacterSelectScene,
                GameScene
            ],
        };
    }
}