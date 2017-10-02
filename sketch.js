var database;

var drawing = [];
var currentPath = [];
var isDrawing = false;

function setup() {
	canvas = createCanvas(500, 500);
	
	canvas.mousePressed(startPath);
	canvas.parent('canvascontainer');
	canvas.mouseReleased(endPath);

	var saveButton = select('#saveButton');
	saveButton.mousePressed(saveDrawing);

	var clearButton = select('#clearButton');
	clearButton.mousePressed(clearDraw);
	
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyA_Qa-mN-GDcbLrv4OwbiSqbuACPNUibss",
		authDomain: "supergame-52d47.firebaseapp.com",
		databaseURL: "https://supergame-52d47.firebaseio.com",
		//projectId: "supergame-52d47",
		storageBucket: "supergame-52d47.appspot.com",
		messagingSenderId: "582887177093"
	};
	firebase.initializeApp(config);
	database = firebase.database();

	var params = getURLParams();
	console.log(params);
	if (params.id) {
	  console.log(params.id);
	  showDrawing(params.id);
	}

	var ref = database.ref('drawings');
	ref.on('value', gotData, errData);
}

function clearDraw() {
	drawing = [];
}

function showDrawing(key) {

	if (key instanceof MouseEvent) {
		key = this.html();
	}

	var ref = database.ref('drawings/' + key);
	ref.once('value', oneDrawing, errData);
	// console.log(key);
}

function oneDrawing(data) {
	var dbdrawing = data.val();
	drawing = dbdrawing.drawing;
	//console.log(dbdrawing);
}



function saveDrawing() {
	var ref = database.ref('drawings');
	var nameInput = select('#name').value();

	var drawName = select('#drawName').value();

	var data = {
		name: nameInput,
		drawname: drawName,
		drawing: drawing
	}
	var result = ref.push(data, dataSent);
	console.log(result.key);

	function dataSent(err, status) {
		console.log(status);
	}
	
}

function gotData(data) {

	// clear the listing
	var elts = selectAll('.listing');
	for (var i = 0; i < elts.length; i++) {
		elts[i].remove();
	}

	var drawings = data.val();
	//console.log(drawings);
	var keys = Object.keys(drawings);
	for (var i=0;i<keys.length;i++) {
		var key = keys[i];
		var filename = drawings[key].drawname; 
		console.log(filename);
	 	var li = createElement('li', '');
		li.class('listing');
		var ahref = createA('#', key);
		
	 	ahref.mouseClicked(showDrawing);
	 	ahref.parent(li);

		var perma = createA('?id=' + key, 'permalink');
		perma.parent(li);
		perma.style('padding', '4px');

	 	li.parent('drawinglist');
	}
}

function errData(err) {
	console.log(err);
}


function startPath() {
	isDrawing = true;
	currentPath = [];
	drawing.push(currentPath);
}

function endPath() {
	isDrawing = false;
}



function draw() {
	background(0);

	if(isDrawing) {
		var point = {
			x: mouseX,
			y: mouseY
		}
		currentPath.push(point);
	}

	
	stroke(255);
	strokeWeight(4);
	noFill();
	for (var i=0;i<drawing.length;i++) {
		beginShape();
		for (var j=0;j<drawing[i].length;j++) {
			vertex(drawing[i][j].x, drawing[i][j].y);
		}
		endShape();
	}
}