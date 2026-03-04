class Bouncer {
    constructor({
        position = createVector(width/2, height/2),
        velocity = p5.Vector.random2D().mult(random(2,5)),
        radius = 15,
        colorValue = color(random(255), random(255), random(255)),
        mass = 10,
        remainingBursts = 1,
        remainingCollisions = 3,
    } = {}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.colorValue = colorValue;
        this.mass = mass;

        this.remainingBursts = remainingBursts;
        this.remainingCollisions = remainingCollisions;
    }

    update() {
        this.position.add(this.velocity);
    }

    checkBounds() {
        // left wall
        if (this.position.x < 0 + this.radius) {
            this.position.x = this.radius;
            this.velocity.x = -this.velocity.x;
            this.remainingCollisions -= 1;
        }
        // right wall
        if (this.position.x > width - this.radius) {
            this.position.x = width - this.radius;
            this.velocity.x = -this.velocity.x;
            this.remainingCollisions -= 1;
        }
        // top wall
        if (this.position.y < 0 + this.radius) {
            this.position.y = this.radius;
            this.velocity.y = -this.velocity.y;
            this.remainingCollisions -= 1;
        }
        // bottom wall
        if (this.position.y > height - this.radius) {
            this.position.y = height - this.radius;
            this.velocity.y = -this.velocity.y;
            this.remainingCollisions -= 1;
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

        this.remainingCollisions -= 1;
        other.remainingCollisions -= 1;
    }

    draw() {
        fill(this.colorValue);
        noStroke();
        circle(this.position.x, this.position.y, this.radius * 2);
    }

    isAlive() {
        return this.remainingCollisions > 0 ;
    }

    // burst into a bunch of smaller bouncers
    burst() {
        let children = [];
        if (this.remainingBursts > 0) {
            let parts = 5
            for (let i = 0; i < parts; ++i) {
                children.push(new Bouncer({
                    // add small offset so children don't perfectly overlap
                    position: p5.Vector.add(this.position, p5.Vector.random2D().mult(0.1)),
                    radius: this.radius / Math.sqrt(parts),
                    colorValue: this.colorValue,
                    mass: this.mass / parts,
                    remainingBursts: this.remainingBursts - 1,
                }))
            }
        }
        return children;
    }
}

let bouncers = []

function setup() {
    createCanvas(800, 600);
}

function draw() {
    background('white');

    // show counter of current number of bouncers
    fill(0);
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    text("Bouncers: " + bouncers.length, 10, 10);

    // basic update step and collision with walls
    for (let b of bouncers) {
        b.update();
        b.checkBounds();
    }

    // collisions between bouncers
    for (let i = 0; i < bouncers.length; i++) {
        for (let j = i + 1; j < bouncers.length; j++) {
            bouncers[i].checkCollision(bouncers[j]);
        }
    }

    // burst bouncers before they disappear after they max out on collisions
    let bouncer_children = [];
    for (let b of bouncers) {
        if (!b.isAlive()) {
            bouncer_children.push(...b.burst());
        }
    }

    bouncers = bouncers.filter(b => b.isAlive());
    bouncers.push(...bouncer_children);

    // draw current bouncers
    for (let b of bouncers) {
        b.draw();
    }
}

// spawn a new bouncer where the mouse clicks
function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        for (let i = 0; i < 100; i++)
            bouncers.push(new Bouncer({position: createVector(mouseX, mouseY)}))
    }
}
