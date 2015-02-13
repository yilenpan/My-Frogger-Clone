//array of all possible enemy.y locations
var POSSIBLE_Y = [320, 240, 160, 80];

var Enemy = function() {
    y = POSSIBLE_Y[Math.floor(Math.random() * 4)];
    this.speed = Math.floor(Math.random() * 50) + 50;
    this.sprite = 'images/enemy-bug.png';
    this.begin(-100,y)
};

Enemy.prototype.begin = function(x,y){
    this.x = x;
    this.y = y;
};

Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    y = POSSIBLE_Y[Math.floor(Math.random() * 4)];
    if (this.x >= 505){
        this.begin(-100, y);
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(){
    Enemy.call(this);
    this.sprite = 'images/char-boy.png';
    this.score = 0;
    this.lives = 5;
    this.begin(200, 400);
};

Player.prototype = Object.create(Enemy.prototype); //copies render and begin function

Player.prototype.update = function(){
    if (this.y == 0){
        this.score += 100;
        allEnemies.forEach(function (enemy){ //added functionality - if you make it to the end, the enemies get faster.
            enemy.speed += 50;
        });
        this.begin(200,400);
    }
    //update score and lives
    $('#lives').html(this.lives);
    $('#score').html(this.score);
    //if dead, pop up game-over modal
    if (this.lives <= 0){
        this.x = -400;
        $('#game-over').modal();
    }
};

Player.prototype.handleInput = function(key){
    //takes keyboard input and changes x,y coords.
    if (key === 'left') {
        this.x -= (this.x - 100 < 0) ? 0 : 100;
    } else if (key === 'right') {
        this.x += (this.x + 100 > 400) ? 0 : 100;
    } else if (key === 'up') {
        this.y -= (this.y - 80 < 0) ? 0 : 80;
    } else if (key === 'down') {
        this.y += (this.y + 80 > 400) ? 0 : 80;
    }
};

// Instantiate your objects and functions.

//if player x and y coord ==(ish) enemy x,y coord, lose one life, player.begin()
var checkCollisions = function (){
    allEnemies.forEach(function (enemy){
        if (enemy.y == player.y){
            if(enemy.x >= player.x - 30 && enemy.x <= player.x + 30){
                player.lives--;
                player.begin(200,400);
            }
        }
    });
};

//adds random number of enemies.
var addEnemies = function(x){
    var arr = new Array;
    for(var i = 0; i < x; i++){
        var y = new Enemy;
        arr.push(y);
    }
    return arr;
};
var allEnemies = addEnemies(4);
var player = new Player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
