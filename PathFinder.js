class PathFinder {
  openSet = [];
  closedSet = [];
  completed = false;
  constructor(node) {
    this.openSet.push(node);
    this.current = node;
    this.activeColor = color(0, 0, 255);
  }
  draw() {
    const path = [];
    let temp = this.current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
    for (let i = 0; i < path.length - 1; i++) {
      stroke(this.activeColor);
      strokeWeight(5);
      line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
    }
  }

  heuristic(a, b) {
    let d = dist(a.x, a.y, b.x, b.y);
    return d;
  }
  run(maze) {
    if (this.openSet.length > 0) {
      let winner = 0;
      for (let i = 0; i < this.openSet.length; i++) {
        if (this.openSet[i].f < this.openSet[winner].f) {
          winner = i;
        }
      }
      this.current = this.openSet[winner];

      if (this.current == maze.nodes[maze.nodes.length - 1]) {
        this.completed = true;
        noLoop();
      }
      this.openSet.splice(winner, 1);
      this.closedSet.push(this.current);
      let neighbors = this.current.path;
      for (let neighbor of neighbors) {
        if (!this.closedSet.includes(neighbor)) {
          let tempG = this.current.g + 1;
          if (this.openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
            }
          } else {
            neighbor.g = tempG;
            this.openSet.push(neighbor);
          }
          neighbor.h = this.heuristic(
            neighbor,
            maze.nodes[maze.nodes.length - 1]
          );
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = this.current;
        }
      }
    }
  }
}
