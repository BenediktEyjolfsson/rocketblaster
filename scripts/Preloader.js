var BasicGame = {};

BasicGame.Preloader = function (game) {
	this.ready = false;
};

BasicGame.Preloader.prototype = {

	preload: function () {
        //Displays a loading screen mwessage while the assets are loaded into the memory
        this.preloaderText = this.add.text(this.world.centerX, this.world.centerY, 'loading!', {
            fontSize: '96px',
            fill: '#fff',
            algin: 'center'
        });
        this.preloaderText.anchor.setTo(0.5, 0.5);
        //preload the images, sprites and audio assets into the memory
        this.load.image('logo', 'assets/PhaserLogo.png');
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('startButton', 'assets/startButton.png');
        this.load.image('ship', 'assets/ship.png');
        this.load.image('ufo', 'assets/ufo.png');
        this.load.image('life', 'assets/life.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.spritesheet('kaboom', 'assets/explode.png', 128, 128, 16);
        this.load.spritesheet('lifeAnimation', 'assets/lifeAnimation.png', 100, 100, 4);
        this.load.audio('music', ['assets/music.m4a', 'assets/music.mp3']);
        this.load.audio('bullet', ['assets/laser_human.mp3']);
        this.load.audio('explosion', ['assets/explosion.mp3']);
	},

	create: function () {

	},

	update: function () {
        if (this.cache.isSoundDecoded('music') && this.ready == false){
        this.ready = true;
        this.game.state.start('MainMenu');
        }
	}

};
