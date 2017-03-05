function Particle(x, y, r, fixed, issue) {
  var options = {
    friction: 0,
    restitution: 0.95,
    isStatic: fixed
  }
  this.body = Bodies.circle(x, y, r, options);
  this.r = r;
  this.issue = issue;
  console.log(issue)
  World.add(world, this.body);

  this.isOffScreen = function() {
    var pos = this.body.position;
    return (pos.y > height + 100);
  }

  this.removeFromWorld = function() {
    World.remove(world, this.body);
  }

  this.show = function() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(this.issue.comments + 1);
    stroke(50, 244, 50);
    fill(127, 50, 190);
    ellipse(0, 0, this.r * 1.5);
    pop();
  }

}
