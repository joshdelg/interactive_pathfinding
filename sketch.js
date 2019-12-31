// Cell class
class Cell {
	constructor(x, y, cellType) {
		this.x = x;
		this.y = y;
		this.cellType = cellType;
	}
}

// Sketch constants
const canvasSize = 600;
const margin = 50;
const gridSpace = canvasSize - 2 * margin;
const gridSize = 25;
const gridScale = gridSpace / gridSize;
const obstacles = (gridSize * gridSize) / 4;
const cellStroke = gridScale / 8;

let startButton;
let startButtonSize = {
	x: 75,
	y: 25,
};
let hasStarted = false;

let frontier = [];
let cameFrom = {};
let start;
let goal;
let goalFound = false;
let pathFound = false;

let colorScheme = {
	'off-white': '#ecf4f3',
	'off-grey': '#cee3e0',
	'light-green': '#d1eecc',
	'cyan': '#76dbd1',
	'dark-cyan': '#57a99a'

};

// Cell types to colors mapping
let cellColors = {
	'empty': '#ecf4f3',
	'obstacle': '#57a99a',
	'start': '#ff1919',
	'goal': '#6eff2b',
	'visited': '#d1eecc',
	'path': '#76dbd1',
};

// Initialize grid
let grid = [];

function defineGrid() {
	// Fill grid
	for(row = 0; row < gridSize; row++) {
		let gridRow = [];
		for(col = 0; col < gridSize; col++) {
			gridRow.push(new Cell(col, row, 'empty'));
		}
		grid.push(gridRow);
	}
}

function setRandomObstacles(numObstacles) {
	for(i = 0; i < numObstacles; i++) {
		grid[~~random(gridSize - 1)][~~random(gridSize - 1)].cellType = 'obstacle';
	}
}

function search(cell) {
	let x = cell.x;
	let y = cell.y;

	let neighbors = [grid[y][x + 1], grid[y][x - 1]];

	if(y >= 1) {
		neighbors[2] = grid[y - 1][x];
	}
	if(y <= gridSize - 2) {
		neighbors[3] = grid[y + 1][x];
	}

	neighbors.forEach(function(c) {
		if(c != undefined) {
			if(c.x == goal.x && c.y == goal.y) {
				goalFound = true;
				cameFrom[c.x + ',' + c.y] = x + ',' + y;
			} else if(grid[c.y][c.x].cellType == 'empty') {
				grid[c.y][c.x].cellType = 'visited';
				cameFrom[c.x + ',' + c.y] = x + ',' + y;
				frontier.push(c);
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
			grid[y][x].cellType = 'path';
		} else {
			break;
		}
        current = next;
	}
	pathFound = true;
}

function startVisualization() {
	hasStarted = true;
}

function setup() {
	createCanvas(canvasSize, canvasSize);

	startButton = createButton('Find Path');
	startButton.size(startButtonSize.x, startButtonSize.y);
	startButton.position((canvasSize - startButtonSize.x) / 2, (margin - startButtonSize.y) / 2);
	startButton.mousePressed(startVisualization);

	defineGrid();
	setRandomObstacles(obstacles);

	// Define start and goal
	start = grid[~~random(gridSize - 1)][~~random(gridSize - 1)];
	start.cellType = 'start';
	cameFrom[start.x + ',' + start.y] = '';

	goal = grid[~~random(gridSize - 1)][~~random(gridSize - 1)];
	goal.cellType = 'goal';

	frontier.push(start);
}

function draw() {

	background(255);

	if(hasStarted) {
		if(goalFound == false) {
			search(frontier.shift());
		} else if(pathFound == false) {
			retrace();
		}
	}

	for(y = 0; y < gridSize; y++) {
		for(x = 0; x < gridSize; x++) {
			strokeWeight(cellStroke);
			stroke(colorScheme['off-grey']);
			fill(cellColors[grid[y][x].cellType]);
			rect(x * gridScale + margin, y * gridScale + margin, gridScale, gridScale);
		}
	}

}