var playState = {
    create: function() {
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);

        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        }

        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);
        this.player.anchor.setTo(0.5, 0.5);

        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');
        this.diedSound = game.add.audio('died');
        
        this.music = game.add.audio('music');
        this.music.loop = true;
        this.music.play();
        this.music.volume = .5;

        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;

        this.emitter_coin = game.add.emitter(0, 0, 15);
        this.emitter_coin.makeParticles('pixel_coin');
        this.emitter_coin.setYSpeed(-150, 150);
        this.emitter_coin.setXSpeed(-150, 150);
        this.emitter_coin.gravity = 0;

        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500 * game.global.gravityMultiplier;
        this.player.body.bounce.y = .1;

        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin);
        this.coin.anchor.setTo(0.5, 0.5);

        this.emitter_coin.x = 60;
        this.emitter_coin.y = 140;
        this.emitter_coin.start(true, 500, null, 10);

        this.scoreLabel = game.add.text(30, 30, 'placar: 0', {
            font: '18px Geo',
            fill: '#ffffff'
        });
        game.global.score = 0;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');

        game.time.events.loop(2200, this.addEnemy, this);

        this.cursor = game.input.keyboard.createCursorKeys();
        this.createWorld();

        if (!game.device.desktop) {
            this.addMobileInputs();
        }
    },

    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();
        if (!enemy) {
            return;
        }

        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500 * game.global.gravityMultiplier;
        enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
        enemy.body.bounce.x = 1;
        enemy.body.bounce.y = .3;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.layer);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

        game.physics.arcade.collide(this.enemies, this.layer);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        this.movePlayer();

        if (!this.player.inWorld) {
            this.playerDie();
        }
    },

    takeCoin: function() {
        this.coin.scale.setTo(0, 0);
        game.add.tween(this.coin.scale).to({ x: 1, y: 1}, 300).start();
        game.add.tween(this.player.scale).to({ x: 1.3, y: 1.3}, 50).to({ x: 1, y: 1}, 150).start();

        game.global.score += 5;
        this.scoreLabel.text = 'placar: ' + game.global.score;
        if(game.global.sound) this.coinSound.play();

        this.updateCoinPosition();
    },

    updateCoinPosition: function() {
        var coinPosition = [
            { x: 140, y: 60 }, { x: 360, y: 60 }, // Top row
            { x: 60, y: 140 }, { x: 440, y: 140 }, // Middle row
            { x: 130, y: 300}, { x: 370, y: 300 } // Bottom row
        ];

        for (var i = 0; i < coinPosition.length; i++) {
            if (coinPosition[i].x === this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }

        var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length - 1)];

        this.emitter_coin.x = newPosition.x;
        this.emitter_coin.y = newPosition.y;
        this.emitter_coin.start(true, 500, null, 10);
        this.coin.reset(newPosition.x, newPosition.y);
    },

    movePlayer: function() {
        if(!this.player.alive) {
            return;
        }

        if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
            this.player.animations.play('left');
            this.player.body.velocity.x = -200;
        } else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
            this.player.animations.play('right');
            this.player.body.velocity.x = 200;
        } else {
            this.player.animations.stop();
            this.player.frame = 0;
            this.player.body.velocity.x = 0;
        }

        if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body.onFloor()) {
            this.jumpPlayer();
        }
    },

    createWorld: function() {
        this.map = game.add.tilemap('map');
        this.map.addTilesetImage('tileset');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
        this.map.setCollision(1);
    },

    playerDie: function() {
        if(!this.player.alive) {
            return;
        }
        
        this.music.stop();
        this.player.kill();
        if(game.global.sound) {
            this.deadSound.play();
        }
        
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);
        
        game.time.events.add(800, function() { this.diedSound.play(); }, this);
        game.time.events.add(3000, this.startMenu, this);
    },

    startMenu: function() {
        game.state.start('menu');
    },

    addMobileInputs: function() {
        this.jumpButton = game.add.sprite(350, 247, 'jumpButton');
        this.jumpButton.inputEnabled = true;
        this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);
        this.jumpButton.alpha = 0.3;

        this.moveLeft = false;
        this.moveRight = false;

        this.leftButton = game.add.sprite(50, 247, 'leftButton');
        this.leftButton.inputEnabled = true;
        this.leftButton.events.onInputOver.add(function(){ this.moveLeft = true; }, this);
        this.leftButton.events.onInputOut.add(function(){ this.moveLeft = false; }, this);
        this.leftButton.events.onInputDown.add(function(){ this.moveLeft = true; }, this);
        this.leftButton.events.onInputUp.add(function(){ this.moveLeft = false; }, this);
        this.leftButton.alpha = 0.3;

        this.rightButton = game.add.sprite(130, 247, 'rightButton');
        this.rightButton.inputEnabled = true;
        this.rightButton.events.onInputOver.add(function(){ this.moveRight = true; }, this);
        this.rightButton.events.onInputOut.add(function(){ this.moveRight = false; }, this);
        this.rightButton.events.onInputDown.add(function(){ this.moveRight = true; }, this);
        this.rightButton.events.onInputUp.add(function(){ this.moveRight = false; }, this);
        this.rightButton.alpha = 0.3;

    },

    jumpPlayer: function() {
        if (this.player.body.onFloor()) {
            this.player.body.velocity.y = -320;
            if (game.global.sound) {
                this.jumpSound.play();
            }
            this.emitter.x = this.player.x;
            this.emitter.y = this.player.y;
            this.emitter.start(true, 300, null, 15);
        }
    },

}