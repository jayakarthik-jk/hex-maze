const nodeWidth = 25;
let maze;
let finder;
function setup() {
  createCanvas(windowWidth, windowHeight);
  maze = new HexMaze(nodeWidth, width * 0.05);
  finder = new PathFinder(maze.nodes[0]);
}
function draw() {
  translate(maze.padding, maze.padding);
  background(255);
  noStroke();

  maze.draw();
  if (maze.completed) {
    finder.run(maze);
    finder.draw();
  }
  if (finder.completed) {
    noLoop();
  }
}
