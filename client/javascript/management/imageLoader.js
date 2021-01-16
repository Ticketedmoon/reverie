export default class ImageLoader {

    loadAnimationImageSets(self) {
        this.loadBackgroundAnimationImageSet(self);
        this.loadPlayerSpriteSheet(self);
        this.loadPlatformImage(self);
    }

    loadBackgroundAnimationImageSet(self) {
        self.load.path = 'assets/tiles/';
        self.load.image('tiles', 'age-of-conquest-map-A.png');
        self.load.tilemapTiledJSON('world', 'age-of-conquest-map-A.json');
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