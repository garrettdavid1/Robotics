$(document).ready(function () {
    var canvas = $('#canvas')[0];
	var c = canvas.getContext('2d');
	var siteContainer = $('#siteContainer');
	siteContainer.width = innerWidth * 80;
	siteContainer.css('height', innerHeight)

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
		objects = [];
		lines = [];
		legos = [];
		init();
    });

    var colors = [
		'red',
		'blue',
		'yellow',
		'green',
		'white'
	];
    
    function randomIntFromRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function randomColor(colors) {
		return colors[Math.floor(Math.random() * colors.length)];
	}

	function Lego(x, y, width, height, depth, color, dY){
		this.x = x;
		this.y = y - height;
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.color = color;
		this.dY = dY;

		this.update = function(){
			this.x += this.dY;
			if(this.x > innerWidth + 20){
				this.x = -20
			} else if(this.x < -20){
				this.x = innerWidth + 20;
			}
			this.draw();
		}

		this.draw = function(){
			c.beginPath();
			c.fillStyle = this.color;
			c.fillRect(this.x, this.y, this.width, this.height);
			c.closePath();

			c.beginPath();
			c.moveTo(this.x, this.y);
			c.lineTo(this.x + (-1 * this.depth), this.y + (-1 * this.depth));
			c.lineTo(this.x + (-1 * this.depth), this.y + this.height - this.depth);
			c.lineTo(this.x, this.y + this.height);
			c.lineTo(this.x, this.y);
			c.lineTo(this.x + this.width, this.y);
			c.lineTo(this.x + this.width, this.y + this.height);
			c.lineTo(this.x, this.y + this.height);
			c.fillStyle = this.color;
			c.fill();
			c.stroke();
			c.closePath();

			c.beginPath();
			c.moveTo(this.x - this.depth, this.y - this.depth);
			c.lineTo(this.x + this.width - this.depth, this.y - this.depth);
			c.lineTo(this.x + this.width, this.y);
			c.fillStyle = this.color;
			c.fill();
			c.stroke();
			c.strokeStyle = '#000';
			c.lineTo(this.x, this.y);
			c.fillStyle = this.color;
			c.fill();
			c.stroke();
			c.closePath();
		}
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
					this.x = -11; // Reset x to just off the left side of the screen.
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
		var legos = [];
		var dir;
		var rowNum;
		var dY;
		var width;
		var height;
		var legoCoords = new Array(5);
		for(var i = 0; i < legoCoords.length; i++){
			legoCoords[i] = new Array();
		}
		var x;
		var newX;
		var newXArray = [];
		var validX;
		var xTaken;
		var newMinX;
		var newMaxX;
    function init(){
		for (var i = 0; i < 5; i++) {
			objects.push(new Conveyor(-10, ((innerHeight / 5) * i) + (innerHeight / 5) - 20, 20));
		}
		objects.forEach(function (obj) {
			if (objects.indexOf(obj) % 2 === 0) {
				dir = 1;
			} else {
				dir = -1;
			}

			for (var i = 0; i < (innerWidth) / 40; i++) {
				lines.push(new BeltLine(obj.x * (-4) * i, obj.y, i, dir));
			}
		});
		

		for (var i = 0; i < randomIntFromRange(30, 50); i++) {
			rowNum = randomIntFromRange(1, 5);
			width = randomIntFromRange(15, 40);
			height = randomIntFromRange(10, 15);
			y = (((innerHeight / 5) * rowNum) - 12);
			x = getRandomX(-10, innerWidth, rowNum - 1, width);
			if (rowNum % 2 === 1) {
				dY = 1;
			} else {
				dY = -1;
			}
			legos.push(new Lego(x, y, width, height, 5, randomColor(colors), dY));
		}
	}
	
	
	function getRandomX(minX, maxX, rowNum, width){
		validX = false;
		while(validX === false){
			newX = randomIntFromRange(minX, maxX);
			newMinX = newX - 10;
			newMaxX = newX + width + 10;
			if(legoCoords[rowNum].length > 0){
				xTaken = pointIsTaken(newMinX, newMaxX, legoCoords[rowNum])
				if(xTaken === true){
					validX = false;
				} else{
					legoCoords[rowNum].push({xMin: newMinX, xMax: newMaxX});
					validX = true;
				}
			} else{
				legoCoords[rowNum].push({xMin: newMinX, xMax: newMaxX});
				validX = true;
			}
		}
		return newX;
	}

	function pointIsTaken(xMin, xMax, pointsTaken){
		for(var i = 0; i < pointsTaken.length; i++){
			if(pointIsInBetween(xMin, pointsTaken[i].xMin, pointsTaken[i].xMax) || pointIsInBetween(xMax, pointsTaken[i].xMin, pointsTaken[i].xMax) ) return true;
		}
		return false;
	}
	function pointIsInBetween(x, xMin, xMax){
		if(x >= xMin && x <= xMax) return true;
		return false;
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

		legos.forEach(function(lego){
			lego.update();
		});
	}

    init();
    animate();
});