Body = Matter.Body;

Matter.use(
  'matter-wrap', // not required, just for demo
  'matter-attractors' // PLUGIN_NAME
);

function Particle(x, y, r, fixed, issue) {
  if(isNaN(r)) {
    r = 10;
  }
  var options = {
    mass: r,
    frictionAir: 0.02,
    plugin: {
      attractors: fixed ? [
        function(bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
            y: (bodyA.position.y - bodyB.position.y) * 1e-6,
          }
        }
      ] : [],
      wrap: {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
      }
    }
  }
  console.log(x, y, r, fixed, issue);
  this.body = Bodies.circle(x, y, r, options);
  this.r = r;
  Body.setVelocity(this.body, {
    x: random(-1, 1),
    y: random(-1, 1)
  });
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
