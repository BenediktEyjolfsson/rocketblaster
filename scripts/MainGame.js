BasicGame.Game = function (game) {};

//Graphical oblects
var ship;
var ufos;
var lives;

var bullets;
var fireRate = 100;
var nextFire = 0;

var cursors;

BasicGame.Game.prototype = {

	create: function () {
       //Specify the physics of the game to ARCADE
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //add the starfield and logo on screen
        this.starfield = this.add.tileSprite(0, 0, 800, 600, 'starfield');
        //Add the ship on to the screen, set physics and the boundaries
        ship = this.add.sprite((this.world.width / 2),this.world.height - 50, 'ship');
        ship.anchor.setTo(0.5,0);
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
        
        bullets =this.add.group();
        bullets.enableBody =true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet', 0, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
        
        this.input.keyboard.addKeyCapture([Phaser.keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.keyboard.SPACEBAR]);
            cursors = this.input .keyboard.createCursorKeys();
	},

	update: function () {

		this.createUfo();
        this.createLife();
        this.moveShip();
	},
    
    moveShip: function() {
        if(cursors.left.isDown) {
            ship.body.velocity.x = -200;
        }
        else if(cursors.right.isDown) {
            ship.body.velocity.x = 200
        }
        else {
            ship.body.velocity.x = 0
        }
        if (this.input.keyboard.isDown(Phaser.keyboard.SPACEBAR)) {
            this.fireBUllet();
        }
    },
    createUfo () {
        var random = this.rnd.integerInRange(0, 20);
        if(random === 0) {
            var randomX = this.rnd.integerInRange(o, this.world.width - 150);
            var ufo = ufos.create(randomX, -50, 'ufo');
            this.physics.enable(ufo, Phaser.Physics.ARCADE);
            ufo.body.velocity.y = this.rnd.integerInRange(100, 600);
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
    
    fireBullet: funtion () {
    if(this.time.now > nextFire && bullets.countDead() > 0) {
        nextFire = this.time.now + fireRate;
        var bullet = bullets.getFirstExists(false);
        bullet.reset(ship.x, ship.y);
        bullet.body.velocity.y = -400;
        }
    }
};