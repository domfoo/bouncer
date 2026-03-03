const bouncers = []

class Bouncer {
  constructor({
    position = createVector(width/2, height/2),
    velocity = createVector(random(-1, 1), random(-1, 1)),
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
  }

  draw() {
    // collision with walls
    if (this.position.x < 0 + this.radius || this.position.x > width - this.radius) {
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.y < 0 + this.radius || this.position.y > height - this.radius) {
        this.velocity.y = -this.velocity.y;
    }
    
    // collision with other bouncers
    for (let b of bouncers) {
      if (this === b) {
        continue;
      }
      if (this.position.dist(b.position) < this.radius+ b.radius) {
        //console.log("Distance: " + this.position.dist(b.position));
        break;
      }
    }

    // position_i+1 = position_i + speed*velocity
    this.position.add(p5.Vector.mult(this.velocity, this.speed));
    this.position.add(p5.Vector.div(this.gravity, this.mass));

    fill(this.c);
    noStroke();
    circle(this.position.x, this.position.y, this.radius * 2);
  }
}


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
