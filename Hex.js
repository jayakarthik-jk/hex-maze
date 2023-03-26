class Hex {
  constructor(x, y, radius, index) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.sides = [true, true, true, true, true, true];
    this.visited = false;
    this.index = index;
  }
  draw() {
    let angle = TWO_PI / 6;
    if (!this.visited) {
      fill(255);
    }
    beginShape();
    let vertices = [];
    for (let a = PI / 6; a < TWO_PI + PI / 6; a += angle) {
      let sx = this.x + cos(a) * this.radius;
      let sy = this.y + sin(a) * this.radius;
      vertices.push([sx, sy]);
      vertex(sx, sy);
    }

    for (let i = 0; i < vertices.length - 1; i++) {
      if (this.sides[i]) {
        stroke(0);
        strokeWeight(1);
        line(
          vertices[i][0],
          vertices[i][1],
          vertices[i + 1][0],
          vertices[i + 1][1]
        );
        noStroke();
      }
    }
    endShape(CLOSE);
  }
}
