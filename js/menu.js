var menuState = {
    create: function() {
        game.add.image(0, 0, 'background');

        this.intro = game.add.audio('intro');
        this.intro.loop = true;
        this.intro.play();

        if(!localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', 0);
        }

        if(game.global.score > localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', game.global.score);
        }

        var nameLabel = game.add.text(game.world.centerX, -50,
            'Pega-pixel', {
                font: '50px Geo',
                fill: '#ffffff'
            });
        nameLabel.anchor.setTo(0.5, 0.5);

        var tween = game.add.tween(nameLabel);
        tween.to({ y: 80 }, 1000).easing(Phaser.Easing.Bounce.Out);
        tween.start();

        var text = 'placar: ' + game.global.score + '\nmelhor: ' + localStorage.getItem('bestScore');
        var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text, {
                font: '25px Geo',
                fill: '#ffffff'
            });
        scoreLabel.anchor.setTo(0.5, 0.5);

        var text = 'seta para cima para começar';
        if(!game.device.desktop) {
            text = 'toque na tela para começar';
        }
        var startLabel = game.add.text(game.world.centerX, game.world.height - 80, text, {
                font: '25px Geo',
                fill: '#ffffff'
            });
        startLabel.anchor.setTo(0.5, 0.5);
        var tween = game.add.tween(startLabel);
        tween.to({ angle: -2 }, 500);
        tween.to({ angle: 2 }, 500);
        tween.loop();
        tween.start();

        //this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        //this.muteButton.input.useHandCursor = true;

        if(!game.global.sound) {
            this.muteButton.frame = 1;
        }

        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.addOnce(this.start, this);

        game.input.onDown.addOnce(this.start, this);
    },

    toggleSound: function() {
        game.global.sound = !game.global.sound;
        this.muteButton.frame = game.global.sound ? 0 : 1;
    },

    start: function() {
        this.intro.stop();
        game.state.start('play');
    }
}