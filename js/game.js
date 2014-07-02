var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');

game.global = {
    score: 0,
    gravityMultiplier: 1,
    sound: true,
};

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');