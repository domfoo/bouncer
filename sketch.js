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

        this.collisionCounter = 0;
        this.maxCollisions = 5;
        this.velocity.mult(this.speed);
    }

    update() {
        this.position.add(this.velocity);
    }

    checkBounds() {
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
    }

    checkCollision(other) {
        let n = p5.Vector.sub(this.position, other.position);
        let dist = n.mag();
        let radiusSum = this.radius + other.radius;

        if (dist >= radiusSum || dist === 0) {
            return;
        }

        n.normalize();

        // Relative velocity
        let relativeVelocity = p5.Vector.sub(this.velocity, other.velocity);
        let velocityAlongNormal = p5.Vector.dot(relativeVelocity, n);

        // Do not resolve if separating
        if (velocityAlongNormal > 0) {
            return;
        }

        let m1 = this.mass;
        let m2 = other.mass;

        // elastic impulse
        let e = 0.9;
        let j = -(1 + e) * velocityAlongNormal / (1 / m1 + 1 / m2);

        let impulse = p5.Vector.mult(n, j);

        this.velocity.add(p5.Vector.mult(impulse, 1 / m1));
        other.velocity.sub(p5.Vector.mult(impulse, 1 / m2));

        // Positional correction
        let overlap = radiusSum - dist;
        let correction = overlap / (m1 + m2);

        this.position.add(p5.Vector.mult(n, correction * m2));
        other.position.sub(p5.Vector.mult(n, correction * m1));

        this.collisionCounter++;
        other.collisionCounter++;
    }

    draw() {
        fill(this.c);
        noStroke();
        circle(this.position.x, this.position.y, this.radius * 2);
    }

    isDead() {
        return this.collisionCounter < this.maxCollisions;
    }
}

let bouncers = []

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
        b.update();
        b.checkBounds();
    }

    for (let i = 0; i < bouncers.length; i++) {
        for (let j = i + 1; j < bouncers.length; j++) {
            bouncers[i].checkCollision(bouncers[j]);
        }
    }

    for (let b of bouncers) {
        b.draw();
    }
    
    bouncers = bouncers.filter(b => b.isDead());
}

function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        bouncers.push(new Bouncer({position: createVector(mouseX, mouseY)}))
    }
}
