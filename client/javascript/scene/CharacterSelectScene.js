export default class CharacterSelectScene extends Phaser.Scene {

    characterIndex = 0;

    constructor() {
        super('character-select');
        this.goldenKnightId = "#golden-armoured-knight";
        this.chainMailKnightId = "#chain-mail-knight";
        this.plateArmourKnightId = "#plate-armour-knight";
        this.greenLeatherRogueId = "#green-leather-rogue";
    }

    preload() {
        this.load.path = 'assets/player/';
    }

    init(name) {
        this.userName = name;
        this.setCallbackForCharacterSelect(this.goldenKnightId, 0)
        this.setCallbackForCharacterSelect(this.chainMailKnightId, 1)
        this.setCallbackForCharacterSelect(this.plateArmourKnightId, 2)
        this.setCallbackForCharacterSelect(this.greenLeatherRogueId, 3)
    }

    create() {
        let self = this;
        $('.character-select-interface').show();
    }

    setCallbackForCharacterSelect(elementId, index) {
        let scene = this;
        $(elementId).click(() => {
            this.characterIndex = index;
            scene.enterWorld(scene);
        });
    }

    enterWorld(self) {
        $('.character-select-interface').hide();
        self.scene.start('game', {
            name: this.userName,
            characterIndex: this.characterIndex
        });
    }

}
