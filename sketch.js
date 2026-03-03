class Bouncer {
  constructor({
    position = createVector(width/2, height/2),
    velocity = p5.Vector.random2D(),
    radius = 15,
    c = color(random(255), random(255), random(255)),
    speed = random(1, 5),
    mass = 1,
  } = {}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.c = c;
    this.speed = speed;
    this.mass = mass;
    
    this.gravity = createVector(0, 0,1 * this.mass);
    this.collisionCounter = 0;
    this.maxCollisions = 3;
  }

  draw() {
    // collision with walls
    // left wall
    if (this.position.x < 0 + this.radius) {
        this.position.x = this.radius;
        this.velocity.x = -this.velocity.x;
        this.collisionCounter += 1;
    }
    // right wall
    if (this.position.x > width - this.radius) {
        this.position.x = width - this.radius;
        this.velocity.x = -this.velocity.x;
        this.collisionCounter += 1;
    }
    // top wall
    if (this.position.y < 0 + this.radius) {
        this.position.y = this.radius;
        this.velocity.y = -this.velocity.y;
        this.collisionCounter += 1;
    }
    // bottom wall
    if (this.position.y > height - this.radius) {
        this.position.y = height - this.radius;
        this.velocity.y = -this.velocity.y;
        this.collisionCounter += 1;
    }

    // collision with other bouncers
    for (let b of bouncers) {
      if (this === b) {
        continue;
      }
      if (this.position.dist(b.position) < this.radius + b.radius) {
        //console.log("Distance: " + this.position.dist(b.position));
        break;
      }
    }

    // break bouncer if it collided to many times
    if (this.collisionCounter > this.maxCollisions) {
        bouncers = bouncers.filter(item => item !== this)
    }

    // position_i+1 = position_i + speed*velocity
    this.position.add(p5.Vector.mult(this.velocity, this.speed));
    this.position.add(p5.Vector.div(this.gravity, this.mass));

    fill(this.c);
    noStroke();
    circle(this.position.x, this.position.y, this.radius * 2);
  }
}

var bouncers = []

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background('white');
  
  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("Bouncers: " + bouncers.length, 10, 10);
  
  for (let b of bouncers) {
    b.draw();
  }
}

function mousePressed() {
    bouncers.push(new Bouncer({position: createVector(mouseX, mouseY)}))
}
