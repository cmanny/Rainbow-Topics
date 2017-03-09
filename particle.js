Body = Matter.Body;

Matter.use(
  'matter-wrap', // not required, just for demo
  'matter-attractors' // PLUGIN_NAME
);

function Particle(x, y, r, fixed, issue) {
  if(isNaN(r)) {
    r = 10;
  }
  if(r > 9) {
    fixed = true
  }
  var options = {
    mass: r,
    friction: 0,
    frictionAir: 1e-3,
    plugin: {
      attractors: fixed ? [
        function(bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * 1e-9 * r,
            y: (bodyA.position.y - bodyB.position.y) * 1e-9 * r,
          }
        }
      ] : [],
      wrap: {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
      }
    }
  }
  this.body = Bodies.circle(x, y, r, options);
  this.r = r;
  Body.setVelocity(this.body, {
    x: random(-10, 10),
    y: random(-10, 10)
  });
  this.issue = issue;
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

    if(overCircle(pos.x, pos.y, this.r * 1.5)) {
      var tips = document.querySelectorAll('.tooltip');
      tips[0].style.top = mouseY;
      tips[0].style.left = mouseX;
      tips[0].innerHTML = this.issue.number + " " + this.issue.title;
    }
  }
}

var overCircle = function(x, y, diameter) {
  var disX = x - mouseX;
  var disY = y - mouseY;
  return (sqrt(sq(disX) + sq(disY)) < diameter / 2)
}
