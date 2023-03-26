class HexMaze {
  radius;
  nodes = [];
  total_columns;
  total_rows;
  current;
  stack = [];
  constructor(radius, padding) {
    this.padding = padding;
    this.radius = radius;
    this.singleWidth = floor(sqrt(3) * this.radius);
    this.singleHeight = floor(2 * this.radius);
    this.total_columns = floor((width - this.padding * 2) / this.singleWidth);
    this.total_rows = floor(
      (height - this.padding * 2) / (this.singleHeight - this.radius / 2)
    );
  }
  draw() {
    for (let i = 0; i < this.nodes.length; i++) {
      fill(90, 219, 181, 200);
      this.nodes[i].draw();
    }
    this.current.visited = true;
    fill(219, 174, 237);
    this.current.draw();
    const next = this.checkNeighbors();
    if (next && !next.visited) {
      next.visited = true;
      this.removeWalls(this.current, next);
      this.stack.push(this.current);
      this.current = next;
    } else if (this.stack.length > 0) {
      this.current = this.stack.pop();
    }
  }

  checkNeighbors() {
    const neighbors = [];
    const index = this.current.index;
    if (
      index % this.total_columns != this.total_columns - 1 &&
      this.nodes[index + 1] &&
      !this.nodes[index + 1].visited
    ) {
      neighbors.push(this.nodes[index + 1]);
    }
    if (
      index % this.total_columns != 0 &&
      this.nodes[index - 1] &&
      !this.nodes[index - 1].visited
    ) {
      neighbors.push(this.nodes[index - 1]);
    }

    // bottom right
    if (index % this.total_columns != this.total_columns - 1) {
      if (floor(index / this.total_columns) % 2 == 0) {
        if (
          this.nodes[index + this.total_columns] &&
          !this.nodes[index + this.total_columns].visited
        ) {
          neighbors.push(this.nodes[index + this.total_columns]);
        }
      } else {
        if (
          this.nodes[index + this.total_columns + 1] &&
          !this.nodes[index + this.total_columns + 1].visited
        ) {
          neighbors.push(this.nodes[index + this.total_columns + 1]);
        }
      }
    }
    // bottom left
    if (index % this.total_columns != 0) {
      if (floor(index / this.total_columns) % 2 == 0) {
        if (
          this.nodes[index + this.total_columns - 1] &&
          !this.nodes[index + this.total_columns - 1].visited
        ) {
          neighbors.push(this.nodes[index + this.total_columns - 1]);
        }
      } else {
        if (
          this.nodes[index + this.total_columns] &&
          !this.nodes[index + this.total_columns].visited
        ) {
          neighbors.push(this.nodes[index + this.total_columns]);
        }
      }
    }
    // top left
    if (index % this.total_columns != 0) {
      if (floor(index / this.total_columns) % 2 == 0) {
        if (
          this.nodes[index - this.total_columns - 1] &&
          !this.nodes[index - this.total_columns - 1].visited
        ) {
          neighbors.push(this.nodes[index - this.total_columns - 1]);
        }
      } else {
        if (
          this.nodes[index - this.total_columns] &&
          !this.nodes[index - this.total_columns].visited
        ) {
          neighbors.push(this.nodes[index - this.total_columns]);
        }
      }
    }
    // top right
    if (index % this.total_columns != this.total_columns - 1) {
      if (floor(index / this.total_columns) % 2 == 0) {
        if (
          this.nodes[index - this.total_columns] &&
          !this.nodes[index - this.total_columns].visited
        ) {
          neighbors.push(this.nodes[index - this.total_columns]);
        }
      } else {
        if (
          this.nodes[index - this.total_columns + 1] &&
          !this.nodes[index - this.total_columns + 1].visited
        ) {
          neighbors.push(this.nodes[index - this.total_columns + 1]);
        }
      }
    }
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
