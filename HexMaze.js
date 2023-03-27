class HexMaze {
  radius;
  nodes = [];
  total_columns;
  total_rows;
  current;
  stack = [];
  completed = false;

  constructor(radius, padding) {
    this.padding = padding;
    this.radius = radius;
    this.singleWidth = floor(sqrt(3) * this.radius);
    this.singleHeight = floor(2 * this.radius);
    this.total_columns = floor((width - this.padding * 2) / this.singleWidth);
    this.total_rows = floor(
      (height - this.padding * 2) / (this.singleHeight - this.radius / 2)
    );
    this.activeColor = color(0, 0, 255);
    this.visitedColor = color(90, 219, 181, 200);
    this.create();
    this.link();
  }
  link() {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].neighbors = this.getNeighbors(this.nodes[i]);
    }
  }
  getNeighbors(node) {
    const neighbors = [];
    const index = node.index;
    // right
    if (
      index % this.total_columns != this.total_columns - 1 &&
      this.nodes[index + 1]
    ) {
      neighbors.push(this.nodes[index + 1]);
    }
    // left
    if (index % this.total_columns != 0 && this.nodes[index - 1]) {
      neighbors.push(this.nodes[index - 1]);
    }

    // bottom right
    if (index % this.total_columns != this.total_columns - 1) {
      // even row
      if (floor(index / this.total_columns) % 2 == 0) {
        // if exists and not visited
        if (this.nodes[index + this.total_columns]) {
          neighbors.push(this.nodes[index + this.total_columns]);
        }
      }
      // odd row
      else {
        // if exists and not visited
        if (this.nodes[index + this.total_columns + 1]) {
          neighbors.push(this.nodes[index + this.total_columns + 1]);
        }
      }
    }
    // bottom left
    if (index % this.total_columns != 0) {
      // even row
      if (floor(index / this.total_columns) % 2 == 0) {
        // if exists and not visited
        if (this.nodes[index + this.total_columns - 1]) {
          neighbors.push(this.nodes[index + this.total_columns - 1]);
        }
      }
      // odd row
      else {
        // if exists and not visited
        if (this.nodes[index + this.total_columns]) {
          neighbors.push(this.nodes[index + this.total_columns]);
        }
      }
    }
    // top left
    if (index % this.total_columns != 0) {
      // even row
      if (floor(index / this.total_columns) % 2 == 0) {
        // if exists and not visited
        if (this.nodes[index - this.total_columns - 1]) {
          neighbors.push(this.nodes[index - this.total_columns - 1]);
        }
      }
      // odd row
      else {
        // if exists and not visited
        if (this.nodes[index - this.total_columns]) {
          neighbors.push(this.nodes[index - this.total_columns]);
        }
      }
    }
    // top right
    if (index % this.total_columns != this.total_columns - 1) {
      // even row
      if (floor(index / this.total_columns) % 2 == 0) {
        // if exists and not visited
        if (this.nodes[index - this.total_columns]) {
          neighbors.push(this.nodes[index - this.total_columns]);
        }
      }
      // odd row
      else {
        // if exists and not visited
        if (this.nodes[index - this.total_columns + 1]) {
          neighbors.push(this.nodes[index - this.total_columns + 1]);
        }
      }
    }
    return neighbors;
  }
  checkNeighbors(node) {
    let neighbors = node.neighbors;
    neighbors = neighbors.filter((neighbor) => !neighbor.visited);
    if (neighbors.length <= 0) {
      return null;
    }
    const rand = floor(random(neighbors.length));
    return neighbors[rand];
  }

  removeWalls(a, b) {
    if (a.index + 1 == b.index) {
      a.sides[5] = false;
      b.sides[2] = false;
    }
    if (a.index - 1 == b.index) {
      a.sides[2] = false;
      b.sides[5] = false;
    }
    if (a.index + this.total_columns == b.index) {
      if (floor(a.index / this.total_columns) % 2 == 0) {
        a.sides[0] = false;
        b.sides[3] = false;
      } else {
        a.sides[1] = false;
        b.sides[4] = false;
      }
    }
    if (a.index - this.total_columns == b.index) {
      if (floor(a.index / this.total_columns) % 2 == 0) {
        a.sides[4] = false;
        b.sides[1] = false;
      } else {
        a.sides[3] = false;
        b.sides[0] = false;
      }
    }
    if (a.index + this.total_columns + 1 == b.index) {
      a.sides[0] = false;
      b.sides[3] = false;
    }
    if (a.index - this.total_columns - 1 == b.index) {
      a.sides[3] = false;
      b.sides[0] = false;
    }
    if (a.index + this.total_columns - 1 == b.index) {
      a.sides[1] = false;
      b.sides[4] = false;
    }
    if (a.index - this.total_columns + 1 == b.index) {
      a.sides[4] = false;
      b.sides[1] = false;
    }
    a.path.push(b);
    b.path.push(a);
  }

  draw() {
    this.nodes[0].sides[3] = false;
    this.nodes[this.nodes.length - 1].sides[0] = false;
    for (let i = 0; i < this.nodes.length; i++) {
      fill(this.visitedColor);
      this.nodes[i].draw();
    }
    this.current.visited = true;
    if (!this.completed) {
      fill(this.activeColor);
      this.current.draw();
    }
    const next = this.checkNeighbors(this.current);
    if (next && !next.visited) {
      next.visited = true;
      this.removeWalls(this.current, next);
      this.stack.push(this.current);
      this.current = next;
    } else if (this.stack.length > 0) {
      this.current = this.stack.pop();
    } else {
      this.completed = true;
    }
  }

  create() {
    let x = 0;
    let y = 0;
    let offsetX = 0;
    let row_count = 0;
    let column_count = 0;
    for (let i = 0; i < this.total_columns * this.total_rows; i++) {
      const pos = x * this.singleWidth;
      const hex = new Hex(
        pos + offsetX + this.radius,
        y + this.radius,
        this.radius,
        i
      );
      x += 1;
      column_count += 1;
      if (column_count >= this.total_columns) {
        column_count = 0;
        row_count += 1;
        if (row_count % 2 === 0) {
          offsetX = 0;
        } else {
          offsetX = this.singleWidth / 2;
        }
        x = 0;
        y += this.singleHeight - this.radius / 2;
      }
      this.nodes.push(hex);
    }
    this.current = this.nodes[0];
  }
}
