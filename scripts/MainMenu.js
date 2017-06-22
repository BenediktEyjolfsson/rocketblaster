BasicGame.MainMenu = function (game) { };

var startButton;
var starfield;
var logo;

BasicGame.MainMenu.prototype = {

	create: function () {
        //we've already loaded the assets so we'll move into the main menu
        //Here all we are doing is playing music,adding a pictuere and a button
        //I will modify the main menu to suit my game
        
        //output sky, ship, score, lives, total and start time to the screen
        //the scrolling starfield background
        starfield = this.add.tileSprite(0, 0, 800, 600, 'starfield');
        logo = this.add.sprite((this.world.width / 2), (this.world.height / 2) - 150, 'logo');
        logo.anchor.setTo(0.5,0.5);
        startButton = this.add.button((this.world.width / 2), (this.world.height / 2) + 50, 'startButton', this.startGame);
        startButton.anchor.setTo(0.5,0.5);  
	},

	update: function () {
		//	Do some nice funky main menu effect here
        
	},
    
    startGame: function () {
    //start the game
    this.game.state.start('Game');
}

};