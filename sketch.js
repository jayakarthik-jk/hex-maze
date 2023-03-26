let maze;
function setup() {
  createCanvas(windowWidth, windowHeight);
  maze = new HexMaze(25, 100);
  maze.create();
}
function draw() {
  translate(maze.padding, maze.padding);
  background(255);
  noStroke();
  maze.draw();
}
