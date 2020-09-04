export default class ImageLoader {

    loadAnimationImageSets(self) {
        this.loadBackgroundAnimationImageSet(self);
        this.loadLaunchAnimationImageSet(self);
    }

    loadBackgroundAnimationImageSet(self) {
        self.load.path = 'assets/resources/background/';
        self.load.image('background', 'background-X.jpg');
    }

    loadLaunchAnimationImageSet(self) {
        self.load.path = 'assets/spritesheets/';
        self.load.spritesheet("player_anim_1", "players.png", {
            frameWidth: 75.8333,
            frameHeight: 103.75
        })
    }
}