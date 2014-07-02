var loadState = {
    preload: function() {
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', {
            font: '30px Geo',
            fill: '#ffffff'
        });
        loadingLabel.anchor.setTo(0.5, 0.5);

        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        game.load.image('tileset', 'assets/tileset.png');
        game.load.tilemap('map', 'assets/tiles.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.spritesheet('player', 'assets/player_sheet.png', 20, 20);
        game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
        game.load.image('coin', 'assets/coin.png');
        game.load.image('enemy', 'assets/enemy.png');

        // Audios
        game.load.audio('jump', ['assets/audio/jump.ogg', 'assets/audio/jump.mp3']);
        game.load.audio('coin', ['assets/audio/coin.ogg', 'assets/audio/coin.mp3']);
        game.load.audio('dead', ['assets/audio/dead.ogg', 'assets/audio/dead.mp3']);

        game.load.image('pixel', 'assets/pixel.png');
        game.load.image('pixel_coin', 'assets/pixel_coin.png');
        game.load.image('background', 'assets/background.png');

        game.load.image('jumpButton', 'assets/jumpButton.png');
        game.load.image('rightButton', 'assets/rightButton.png');
        game.load.image('leftButton', 'assets/leftButton.png');

    },

    create: function() {
        game.state.start('menu');
    }
}