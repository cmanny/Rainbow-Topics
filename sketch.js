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


/*
{
    "url": "https://api.github.com/repos/CodingTrain/Rainbow-Topics/issues/420",
    "repository_url": "https://api.github.com/repos/CodingTrain/Rainbow-Topics",
    "labels_url": "https://api.github.com/repos/CodingTrain/Rainbow-Topics/issues/420/labels{/name}",
    "comments_url": "https://api.github.com/repos/CodingTrain/Rainbow-Topics/issues/420/comments",
    "events_url": "https://api.github.com/repos/CodingTrain/Rainbow-Topics/issues/420/events",
    "html_url": "https://github.com/CodingTrain/Rainbow-Topics/issues/420",
    "id": 208984856,
    "number": 420,
    "title": "P5JS and A-Frame for virtual Reality",
    "user": {
      "login": "fredericpierron",
      "id": 1943575,
      "avatar_url": "https://avatars2.githubusercontent.com/u/1943575?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/fredericpierron",
      "html_url": "https://github.com/fredericpierron",
      "followers_url": "https://api.github.com/users/fredericpierron/followers",
      "following_url": "https://api.github.com/users/fredericpierron/following{/other_user}",
      "gists_url": "https://api.github.com/users/fredericpierron/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/fredericpierron/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/fredericpierron/subscriptions",
      "organizations_url": "https://api.github.com/users/fredericpierron/orgs",
      "repos_url": "https://api.github.com/users/fredericpierron/repos",
      "events_url": "https://api.github.com/users/fredericpierron/events{/privacy}",
      "received_events_url": "https://api.github.com/users/fredericpierron/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "id": 550199345,
        "url": "https://api.github.com/repos/CodingTrain/Rainbow-Topics/labels/Unlikely",
        "name": "Unlikely",
        "color": "e99695",
        "default": false
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "assignees": [

    ],
    "milestone": null,
    "comments": 0,
    "created_at": "2017-02-20T21:23:57Z",
    "updated_at": "2017-03-01T00:51:35Z",
    "closed_at": null,
    "body": "This is in the title. The open source A-Frame framework lets build VR content through HTML tags. Integrating with P5JS would let create amazing creative content. #"
  }
]
*/

  //https://api.github.com/repos/CodingTrain/Rainbow-Topics/issues?state=open

  //curl -i "https://api.github.com/repos/CodingTrain/Rainbow-Topics/issues/162247421/reactions" -H "Accept: application/vnd.github.squirrel-girl-preview"

  //

  var opts = { method: 'GET',
               headers: new Headers({
                 'Accept': 'application/vnd.github.squirrel-girl-preview'
               }),
               mode: 'cors',
               cache: 'default' };

  fetch("https://api.github.com/repos/CodingTrain/Rainbow-Topics/issues?state=open&per_page=1000  ", opts)
    .then(function(response){
      return response.json()
    })
    .then(function(json){
      json.forEach(function(issue, i){
        console.log(i)
        fixed = i == 0
        var p = new Particle(200, 100, 10 + pow(issue.reactions['+1'], 2), fixed);
        console.log(issue)
        if(fixed){
          p.body.plugin = {
            attractors: [
              function(bodyA, bodyB) {
                return {
                  x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                  y: (bodyA.position.y - bodyB.position.y) * 1e-6,
                };
              }
            ]
          }
        }
        particles.push(p);
      })
    })

  // var prev = null;
  // for (var x = 200; x < 400; x += 20) {
  //
  //   var fixed = false;
  //   if (!prev) {
  //     fixed = true;
  //   }
  //   var p = new Particle(x, 100, 10, fixed);
  //   particles.push(p);
  //
  //   if (prev) {
  //
  //     // for(var i = 0; i < particles.length - 1; i++){
  //     //   var options = {
  //     //     bodyA: p.body,
  //     //     bodyB: particles[i].body,
  //     //     length: 20,
  //     //     stiffness: 0.4
  //     //   }
  //     //   var constraint = Constraint.create(options);
  //     //   World.add(world, constraint);
  //     // }
  //   }else{
  //     p.body.plugin = {
  //     attractors: [
  //       function(bodyA, bodyB) {
  //         return {
  //           x: (bodyA.position.x - bodyB.position.x) * 1e-6,
  //           y: (bodyA.position.y - bodyB.position.y) * 1e-6,
  //         };
  //       }
  //     ]
  //   }
  //   }
  //
  //   prev = p;
  // }

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
