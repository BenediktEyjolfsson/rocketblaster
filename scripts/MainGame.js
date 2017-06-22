BasicGame.Game = function (game) {};

//Graphical oblects
var ship;
var ufos;
var lives;

var bullets;
var fireRate = 100;
var nextFire = 0;

var score;
var lifeTotal;
var scoreText;
var lifeTotalText;

var music;
var bulletAudio;
var explosionAudio;

var seconds;
var timer;
var timerText;


var cursors;
var gameOverText;
var restartButton;
var gameOver;

BasicGame.Game.prototype = {

	create: function () {
       //Specify the physics of the game to ARCADE
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //add the starfield and logo on screen
        this.starfield = this.add.tileSprite(0, 0, 800, 600, 'starfield');
        //Add the ship on to the screen, set physics and the boundaries
        ship = this.add.sprite((this.world.width / 2), this.world.height - 50, 'ship');
        ship.anchor.setTo(0.5, 0);
        this.physics.enable(ship, Phaser.Physics.ARCADE);
        ship.body.collideWorldBounds = true;
        
        ufos = this.add.group();
        this.physics.enable(ufos, Phaser.Physics.ARCADE);
        
        ufos.setAll('outOfBoundsKill', true);
        ufos.setAll('checkWorldBounds', true);
        ufos.setAll('anchor.x', 0.5);
        ufos.setAll('anchor.y', 0.5);
        
        lives = this.add.group();
        this.physics.enable(lives, Phaser.Physics.ARCADE);
        
        lives.setAll('outOfBoundsKill', true);
        lives.setAll('checkWorldBounds', true);
        lives.setAll('anchor.x', 0.5);
        lives.setAll('anchor.y', 0.5);
        
        bullets = this.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet', 0, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
        
        scoreText = this.add.text(16, 16, 'score: 0', {
            font: '32px arial',
            fill: '#fff'
        });
        score = 0;
        scoreText.text = "Score: " + score;
        
        lifeTotalText = this.add.text(this.world.width - 150, 16, 'Lives: 3', {
            font: '32px arial',
            fill: '#fff'
        });
        lifeTotal = 3;
        lifeTotalText.text = 'Lives: ' + lifeTotal;
        
        timerText = this.add.text(350, 16, 'Time: 0', {
            font: '32px arial',
            fill: '#fff'
        });
        timer = this.time.create(false);
        seconds = 0;
        timerText.text = 'Time: ' + seconds;
        
        gameOverText = this.add.text(this.world.centerX, this.world.centerY - 50, 'Game Over', {
            font: '96px arial',
            fill: '#fff',
            align: 'center'
        });
        gameOverText.anchor.set(0.5);
        gameOverText.visible = false;
        gameOver = false;
        
        restartButton = this.add.button((this.world.width / 2), (this.world.height / 2) + 50, 'startButton', this.restartGame);
        restartButton.anchor.set(0.5);
        restartButton.visible = false;
        
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);
        cursors = this.input.keyboard.createCursorKeys();
        
        bulletAudio = this.add.audio('bullet');
        explosionAudio = this.add.audio('explosion');
        music = this.add.audio('music', 1, true);
        music.play('', 0, 1, true);
        
        timer.loop(1000, this.updateTimer, this);
        timer.start();
	},

	update: function () {
        this.starfield.tilePosition.y += 2;
        
        if (lifeTotal < 1 || seconds == 60 || gameOver === true) {
            this.gameOver();
        }
            else {
		        this.createUfo();
                this.createLife();
                this.moveShip();
                this.collisionDetection();
            }
	},
    
    moveShip: function () {
        if(cursors.left.isDown) {
            ship.body.velocity.x = -200;
        }
        else if(cursors.right.isDown) {
            ship.body.velocity.x = 200;
        }
        else {
                ship.body.velocity.x = 0;
        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.fireBullet();
        }
    },
    createUfo: function () {
        var random = this.rnd.integerInRange(0, 20);
        if(random === 0) {
            var randomX = this.rnd.integerInRange(0, this.world.width - 150);
            var ufo = ufos.create(randomX, -50, 'ufo');
            this.physics.enable(ufo, Phaser.Physics.ARCADE);
            ufo.body.velocity.y = this.rnd.integerInRange(200, 300);
        }
    },
    createLife: function () {
        var random = this.rnd.integerInRange(0, 500);
        
        if (random === 0) {
            var randomX = this.rnd.integerInRange(0, this.world.width - 150);
            var life = lives.create(randomX, -50, 'life');
            this.physics.enable(life, Phaser.Physics.ARCADE);
            life.body.velocity.y = 150;
        }
    },
    
    fireBullet: function () {
    if (this.time.now > nextFire && bullets.countDead() > 0) {
        nextFire = this.time.now + fireRate;
        var bullet = bullets.getFirstExists(false);
        bullet.reset(ship.x, ship.y);
        bullet.body.velocity.y = -400;
        bulletAudio.play();    
        }
    },
    collisionDetection: function () {
            this.physics.arcade.overlap(ship, ufos, this.collideUfo, null, this);
            this.physics.arcade.overlap(ship, lives, this.collectLife, null, this);
            this.physics.arcade.overlap(bullets, ufos, this.destroyUfo, null, this);
        },
    collideUfo: function (ship,ufo) {
        explosionAudio.play();
        ufo.kill();
        var animation = this.add.sprite(ufo.body.x, ufo.body.y, 'kaboom');
        animation.animations.add('explode');
        animation.animations.play('explode', 30, false, true);
        lifeTotal--;
        lifeTotalText.text = 'Lives: ' + lifeTotal;
    },
    destroyUfo: function (bullet, ufo) {
        explosionAudio.play();
        ufo.kill();
        bullet.kill();
        var animation = this.add.sprite(ufo.body.x, ufo.body.y, 'kaboom');
        animation.animations.add('explode');
        animation.animations.play('explode', 30, false, true);
        score += 100;
        scoreText.text = 'Score: ' + score;
    },
    collectLife: function (ship, life) {
        life.kill();
        lifeTotal++;
        lifeTotalText.text = 'Lives: ' + lifeTotal;
        var animation = this.add.sprite(life.body.x, life.body.y, 'lifeAnimation');
        animation.animations.add('lifeAnimation');
        animation.animations.play('lifeAnimation', 30, false, true);
    },
    updateTimer: function () {
     seconds++;
        timerText.text = 'Time: ' + seconds;
    },
    gameOver: function () {
        ship.body.velocity.x = 0;
        ship.body.x = (this.world.width/2)-(ship.body.width/2);
        ufos.callAll('kill');
        lives.callAll('kill');
        bullets.callAll('kill');
        music.stop();
        gameOverText.visible = true;
        restartButton.visible = true;
        timer.stop();
    },
    restartGame: function () {
        this.game.state.start('Game')
    },
    //render: function() {
        //this.game.debug.bodyInfo(ship, 32, 100);
        //this.game.debug.spriteBounds(ship);
    //}
};