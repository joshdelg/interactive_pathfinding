// Sketch constants
const canvasSize = 600;
const gridSize = 50;
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
	'E': '#ffffff',
	'O': '#000000',
	'S': '#ff1919',
	'G': '#6eff2b',
	'V': '#ababab',
	'P': '#6bf0ff',
};

// Initialize grid
let grid = [];

function defineGrid() {
	// Fill grid
	for(row = 0; row < gridSize; row++) {
		let gridRow = [];
		for(col = 0; col < gridSize; col++) {
			gridRow.push('E');
		}
		grid.push(gridRow);
	}
}

function setRandomObstacles(numObstacles) {
	for(i = 0; i < numObstacles; i++) {
		grid[~~random(gridSize - 1)][~~random(gridSize - 1)] = 'O';
	}
}

function search(cell) {
	let x = cell.x;
	let y = cell.y;

	let neighbors = [createVector(x, y + 1), createVector(x, y - 1),
					 createVector(x + 1, y), createVector(x - 1, y)];

	neighbors.forEach(function(v) {
		if(v.x >= 0 && v.x <= gridSize - 1 && v.y >= 0 && v.y <= gridSize - 1) {
			if(v.x == goal.x && v.y == goal.y) {
				goalFound = true;
				cameFrom[v.x + ',' + v.y] = x + ',' + y;
			} else if(grid[v.y][v.x] == 'E') {
				grid[v.y][v.x] = 'V';
				cameFrom[v.x + ',' + v.y] = x + ',' + y;
				frontier.push(v);
			}
		}
	})
}

function retrace() {
	let current = goal.x + ',' + goal.y;
	while(current != (start.x + ',' + start.y)) {
		next = cameFrom[current];
		x = parseInt(next.slice(0, next.search(',')), 10);
		y = parseInt(next.slice(next.search(',') + 1, next.length), 10);
        grid[y][x] = 'P';
        current = next;
	}
	pathFound = true;
}

function setup() {
	createCanvas(canvasSize, canvasSize);

	defineGrid();
	setRandomObstacles(obstacles);

	// Define start and goal
	start = createVector(~~random(gridSize - 1), ~~random(gridSize - 1));
	grid[start.y][start.x] = 'S';
	cameFrom[start.x + ',' + start.y] = '';

	goal = createVector(~~random(gridSize - 1), ~~random(gridSize - 1));
	grid[goal.y][goal.x] = 'G';

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
			fill(cellColors[grid[y][x]]);
			rect(x * gridScale, y * gridScale, gridScale, gridScale);
		}
	}
}