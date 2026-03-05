export class Bouncer {
    constructor({
        position = createVector(width/2, height/2),
        velocity = p5.Vector.random2D().mult(random(2,5)),
        radius = 15,
        colorValue = color(random(255), random(255), random(255)),
        mass = 10,
        remainingBursts = 2,
        burstParts = 5,
        remainingCollisions = 5,
    } = {}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.colorValue = colorValue;
        this.mass = mass;

        this.remainingBursts = remainingBursts;
        this.burstParts = burstParts;
        this.remainingCollisions = remainingCollisions;
        this.gravity = createVector(0, 0.4)
    }

    update() {
        this.position.add(this.velocity.add(this.gravity));
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
            this.velocity.y = -this.velocity.y * 0.8; // floor absorbs some of the force
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
            for (let i = 0; i < this.burstParts; ++i) {
                children.push(new Bouncer({
                    // add small offset so children don't perfectly overlap
                    position: p5.Vector.add(this.position, p5.Vector.random2D().mult(0.1)),
                    radius: this.radius / Math.sqrt(this.burstParts),
                    colorValue: this.colorValue,
                    mass: this.mass / this.burstParts,
                    remainingBursts: this.remainingBursts - 1,
                    burstParts: this.burstParts,
                }))
            }
        }
        return children;
    }
}
