export default class ImageLoader {

    loadAnimationImageSets(self) {
        this.loadBackgroundAnimationImageSet(self);
        this.loadPlayerSpriteSheet(self);
        this.loadPlatformImage(self);
    }

    loadBackgroundAnimationImageSet(self) {
        self.load.path = 'assets/resources/background/';
        self.load.image('background', 'background.jpg');
    }

    loadPlayerSpriteSheet(self) {
        self.load.path = 'assets/spritesheets/';
        self.load.spritesheet("player_anim_1", "players.png", {
            frameWidth: 75.8333,
            frameHeight: 103.75
        })
    }

    loadPlatformImage(self) {
        self.load.path = 'assets/platform/';
        self.load.image("platform", "grassy-platform.png");
    }
}