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
const gridSize = 10;
const gridScale = canvasSize / gridSize;
const obstacles = (gridSize * gridSize) / 4;

let frontier = [];
let cameFrom = {};
let start;
let goal;
let goalFound = false;
let pathFound = false;

// Cell types to colors mapping
let cellColors = {
	'empty': '#ffffff',
	'obstacle': '#000000',
	'start': '#ff1919',
	'goal': '#6eff2b',
	'visited': '#ababab',
	'path': '#6bf0ff',
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

function setup() {
	createCanvas(canvasSize, canvasSize);

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

	if(goalFound == false) {
		search(frontier.shift());
	} else if(pathFound == false) {
		retrace();
	}

	for(y = 0; y < gridSize; y++) {
		for(x = 0; x < gridSize; x++) {
			fill(cellColors[grid[y][x].cellType]);
			rect(x * gridScale, y * gridScale, gridScale, gridScale);
		}
	}
}