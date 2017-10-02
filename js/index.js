$(document).ready(function () {
    var canvas = $('#canvas')[0];
    var c = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style.backgroundColor = 'lightblue';
		var mouse = {};

    addEventListener('mousemove', function () {
		mouse.x = event.clientX;
		mouse.y = event.clientY;
    });
    
    addEventListener('resize', function () {
		canvas.width = innerWidth;
		canvas.height = innerHeight;

		init();
    });

    var colors = [
		'#89FEFA',
		'#20D5F6',
		'#1873B9',
		'#2B3FB2',
		'#0B0A89'
	];
    
    function randomIntFromRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function randomColor(colors) {
		return colors[Math.floor(Math.random() * colors.length)];
	}

	function BeltLine(x, y, i, direction){
		this.x = x;
		this.y = y;
		this.i = i;
		this.dx = direction;
		this.dir = direction;

		this.update = function(){
			if(this.dx > 0){ // Conveyor belt moving to the right
				if(this.x + this.dir > innerWidth){ // Is line outside of the window?
					this.x = -10; // Reset x to just off the left side of the screen.
					this.dir = 1; // Reset this number just to keep it small.
				} else {
					this.dir += this.dx; // Move line one px to the right.
				}
			} else{ //Conveyor belt moving to the left
				if(this.x + this.dir < -10){ // Is line outside of the window?
					this.x = innerWidth + 10; // Reset x to just off the right side of the screen.
					this.dir = -1; // Reset this number just to keep it small.
				} else{
					this.dir += this.dx; // Move line one px to the left.
				}
			}
			
			this.draw();
		}

		this.draw = function(){
			c.beginPath();
			c.moveTo((this.x + this.dir), this.y);
			c.lineTo((this.x + 10 + this.dir), this.y + 10);
			c.stroke();
			c.closePath();
		}
	}

	function Conveyor(x, y, height){
		this.x = x;
		this.y = y;
		this.width = innerWidth + 20;
		this.height = height;

		this.update = function(){
			this.draw();
		}

		this.draw = function(){
			c.beginPath();
			c.fillStyle = '#404040';
			c.fillRect(this.x, this.y, this.width, this.height);
			c.closePath();

			c.beginPath();
			c.fillStyle = 'lightgray'
			c.fillRect(this.x, this.y, this.width, 10);
			c.closePath();
		}
	}

		var objects = [];
		var lines = [];
		var dir;
    function init(){
			for(var i = 0; i < 5; i++){
				objects.push(new Conveyor(-10, ((innerHeight / 5) * i) + (innerHeight / 5) - 20, 20));
			}
			objects.forEach(function(obj){
				if(objects.indexOf(obj) % 2 === 0){
					dir = 1;
				} else{
					dir = -1;
				}

				for(var i = 0; i < (innerWidth)  / 40; i++){
					lines.push(new BeltLine(obj.x * (-4) * i, obj.y, i, dir));
				}
			});
			
    }

    
    function animate() {
		requestAnimationFrame(animate);
		c.clearRect(0, 0, canvas.width, canvas.height);
		objects.forEach(function(obj){
			obj.update();
		});

		lines.forEach(function(line){
			line.update();
		});
	}

    init();
    animate();
});