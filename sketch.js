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
    'matter-attractors'
  );

var engine;
var world;
var particles = [];
var mConstraint;


function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight);
  engine = Engine.create();
  Engine.run(engine);
  world = engine.world;
  world.bodies = [];
  world.gravity.scale = 0;
  engine.timing.timeScale = 1.5;
  //Engine.run(engine);

  var opts = {
    method: 'GET',
    headers: new Headers({
      /* While debugging, you can use the below line (with your github username + password)
       * so that your API rate limit is upped to 5000 per hour, otherwise
       * it's 60 per hour. Don't worry, as long as the fetch URL uses HTTPS,
       * these credentials are safe.
       * However, if you chose to do this, take GREAT CARE not to commit your credentials!
      **/
      //'Authorization': 'Basic '+btoa('username:password'),
      'Accept': 'application/vnd.github.squirrel-girl-preview'
    }),
    mode: 'cors',
    cache: 'default'
  };

  url = "https://api.github.com/repos/CodingTrain/Rainbow-Topics/issues?state=open&per_page=100&page="

  const flatten = function(arr){
    arr.reduce(
      function(acc, val){
        return acc.concat(
          Array.isArray(val) ? flatten(val) : val
        )
      },
      []
    );
    return arr
  }

  requests = []
  for(var i = 1; i < 5; i++){
    console.log(url + i)
    requests.push(fetch(url + i, opts))
  }

  Promise.all(requests)
    .then(function(responses){
      console.log(responses)
      return Promise.all(responses.map(
        function(response){
          return response.json()
        }
      ))
    })
    .then(function(arrays){
      var json = []
      arrays.forEach(function(array){
        json = json.concat(array)
      })
      json.forEach(function(issue, i){
        console.log("hi")
        console.log(issue)
        //Machine Learning issue
        fixed = issue.number == 20

        // Take the log of the popularity, and cube it.
        var growth = pow(log(issue.reactions['+1'] - issue.reactions['-1']), 3)

        //Make a new Issue Particle with some random displacement
        var p = new Particle(
          window.innerWidth / 2 + random(-i * 10, i * 10),
          window.innerHeight / 2 + random(-i * 10, i * 10),
          10 + growth,
          fixed,
          issue
        );

        //Add to all particles
        particles.push(p);
      })
    })

  var canvasmouse = Mouse.create(canvas.elt);
  canvasmouse.pixelRatio = pixelDensity();
  var options = {
    mouse: canvasmouse
  }
  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);
  console.log(mConstraint);
}


function draw() {
  background(255);

  for (var i = 0; i < particles.length; i++) {
    particles[i].show();
  }

  if (mConstraint.body) {
    var pos = mConstraint.body.position;
    var offset = mConstraint.constraint.pointB;
    var m = mConstraint.mouse.position;
    stroke(0, 255, 0);
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
  }
}
