/*
 *
 * Rainbow Topics visualisation, based on Daniel Shiffmans matter.js video
 *
*/

var Engine = Matter.Engine,
  // Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint;

  Matter.use(
    'matter-attractors' // PLUGIN_NAME
  );

var engine;
var world;
var particles = [];
var mConstraint;


function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight);
  engine = Engine.create();
  world = engine.world;
  //Engine.run(engine);

  var prev = null;
  for (var x = 200; x < 400; x += 20) {

    var fixed = false;
    if (!prev) {
      fixed = true;
    }
    var p = new Particle(x, 100, 10, fixed);
    // var p2 = new Particle(200, 150, 10);
    particles.push(p);

    if (prev) {
      var options = {
        bodyA: p.body,
        bodyB: prev.body,
        length: 20,
        stiffness: 0.4
      }
      var constraint = Constraint.create(options);
      World.add(world, constraint);
    }else{
      p.body.plugin = {
      attractors: [
        function(bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * 1e-5,
            y: (bodyA.position.y - bodyB.position.y) * 1e-5,
          };
        }
      ]
    }
    }

    prev = p;
  }

  var canvasmouse = Mouse.create(canvas.elt);
  canvasmouse.pixelRatio = pixelDensity();
  //console.log(canvasmouse);
  var options = {
    mouse: canvasmouse
  }
  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);
  console.log(mConstraint);
}


function draw() {
  background(255);
  Engine.update(engine);

  for (var i = 0; i < particles.length; i++) {
    particles[i].show();
  }

  //line(particles[0].body.position.x, particles[0].body.position.y, particles[1].body.position.x, particles[1].body.position.y);

  if (mConstraint.body) {
    var pos = mConstraint.body.position;
    var offset = mConstraint.constraint.pointB;
    var m = mConstraint.mouse.position;
    stroke(0, 255, 0);
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
  }
}
