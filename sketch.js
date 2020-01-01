// Sketch constants
const canvasSize = 600;
const margin = 50;
let gridSize = 25;
let gridScale = canvasSize / gridSize;
//const obstacles = (gridSize * gridSize) / 4;
let cellStroke = gridScale / 8;

// Start button
let startButton;
let startButtonSize = {
	x: 75,
	y: 25,
};

let lockButton;

let gridSlider;

// Visualization state
let state = {
	gridResize: true,
	definingStartAndGoal: false,
	obstacleDraw: false,
	hasStarted: false,
	goalFound: false,
	pathFound: false,
};

// Pathfinding
let frontier = [];
let cameFrom = {};
let start;
let goal;

let lastCellInvert = 0;
let invertDelay = 50;

// https://colorhunt.co/palette/156039
let colorScheme = {
	'off-white': '#ecf4f3',
	'off-grey': '#cee3e0',
	'light-green': '#d1eecc',
	'cyan': '#76dbd1',
	'dark-cyan': '#57a99a',
	'start': '#ff1919',
	'goal': '#6eff2b',

};

// Initialize grid
let grid = [];

function defineGrid() {
	// Fill grid
	grid = [];
	for(row = 0; row < gridSize; row++) {
		let gridRow = [];
		for(col = 0; col < gridSize; col++) {
			gridRow.push(new Cell(col, row, 'empty', colorScheme['off-white']));
		}
		grid.push(gridRow);
	}
}

//function setRandomObstacles(numObstacles) {
//	for(i = 0; i < numObstacles; i++) {
//		grid[~~random(gridSize - 1)][~~random(gridSize - 1)].makeObstacle();
//	}
//}

function search(originCell) {
	let x = originCell.x;
	let y = originCell.y;

	let neighbors = [grid[y][x + 1], grid[y][x - 1]];

	if(y >= 1) {
		neighbors[2] = grid[y - 1][x];
	}
	if(y <= gridSize - 2) {
		neighbors[3] = grid[y + 1][x];
	}

	neighbors.forEach(function(c) {
		if(c != undefined) {
			if(c === goal) {
				state.goalFound = true;
				cameFrom[c.x + ',' + c.y] = x + ',' + y;
			} else if(c.cellType == 'empty') {
				c.visit(originCell);
			}
		}
	})
}

function retrace() {
	let current = goal.x + ',' + goal.y;
	while(true) {
		next = cameFrom[current];
		x = parseInt(next.slice(0, next.search(',')), 10);
		y = parseInt(next.slice(next.search(',') + 1, next.length), 10);
		if(grid[y][x].cellType != 'start') {
			grid[y][x].addToPath();
		} else {
			break;
		}
        current = next;
	}
	state.pathFound = true;
}

function startVisualization() {
	state.obstacleDraw = false;
	state.hasStarted = true;
}

function invertCell(x, y, callTime) {
	indexX = Math.floor(x / gridScale);
	indexY = Math.floor(y / gridScale);
	if (indexX >= 0 && indexX <= gridSize - 1 && indexY >= 0 && indexY <= gridSize - 1) {
		if(callTime - lastCellInvert >= invertDelay) {
			cell = grid[indexY][indexX];
			if(cell.cellType == 'empty')
				cell.makeObstacle();
			else if(cell.cellType == 'obstacle')
				cell.makeEmpty();
			lastCellInvert = callTime;
		}
	}
}

function mousePressed() {
	if(state.obstacleDraw) {
		invertCell(mouseX, mouseY, millis());
	}
}

function mouseDragged() {
	if(state.obstacleDraw) {
		invertCell(mouseX, mouseY, millis());
	}
}

function lockGridSize() {
	if(state.gridResize) {
		state.gridResize = false;
		state.definingStartAndGoal = true;
	}
}

function defineStartAndGoal() {
	// Define start and goal
	start = grid[~~random(gridSize - 1)][~~random(gridSize - 1)];
	start.setAsStart();

	goal = grid[~~random(gridSize - 1)][~~random(gridSize - 1)];
	goal.setAsGoal();

	state.definingStartAndGoal = false;
	state.obstacleDraw = true;
}

function setup() {
	createCanvas(canvasSize, canvasSize);

	startButton = createButton('Find Path');
	startButton.size(startButtonSize.x, startButtonSize.y);
	startButton.position((windowWidth - startButtonSize.x) / 2, (((windowHeight - canvasSize) / 2) - startButtonSize.y) / 2);
	startButton.mousePressed(startVisualization);

	lockButton = createButton('Lock Grid Size');
	lockButton.mousePressed(lockGridSize);

	gridSlider = createSlider(1, 50, 25);

	//defineGrid();
	//setRandomObstacles(obstacles);

}

function draw() {

	background(255);

	if(state.gridResize) {
		gridSize = gridSlider.value();
		gridScale = canvasSize / gridSize;
		defineGrid();
	} else if(state.definingStartAndGoal) {
		defineStartAndGoal();
	} else if(state.obstacleDraw) {

	} else if(state.hasStarted) {
		if(state.goalFound == false) {
			search(frontier.shift());
		} else if(state.pathFound == false) {
			retrace();
		}
	}

	for(y = 0; y < gridSize; y++) {
		for(x = 0; x < gridSize; x++) {
			strokeWeight(cellStroke);
			stroke(colorScheme['off-grey']);
			fill(grid[y][x].color);
			rect(x * gridScale, y * gridScale, gridScale, gridScale);
		}
	}

}