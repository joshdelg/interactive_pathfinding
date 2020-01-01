// Cell class (add new file for this)
class Cell {
	constructor(x, y, cellType, color) {
		this.x = x;
		this.y = y;
		this.cellType = cellType;
		this.color = color;
	}

	setAsStart() {
		this.cellType = 'start';
		this.color = colorScheme['start'];
		cameFrom[this.x + ',' + this.y] = '';
		frontier.push(this);
	}

	setAsGoal() {
		this.cellType = 'goal';
		this.color = colorScheme['goal'];
	}

	makeObstacle() {
		this.cellType = 'obstacle';
		this.color = colorScheme['dark-cyan'];
	}

	makeEmpty() {
		this.cellType = 'empty';
		this.color = colorScheme['off-white'];
	}

	visit(originCell) {
		this.cellType = 'visited';
		this.color = colorScheme['light-green'];
		cameFrom[this.x + ',' + this.y] = originCell.x + ',' + originCell.y;
		frontier.push(this);
	}

	addToPath() {
		this.cellType = 'path';
		this.color = colorScheme['cyan'];
	}

}