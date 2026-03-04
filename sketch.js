import { Bouncer } from "./Bouncer.js";

let bouncers = [];

window.setup = function () {
    createCanvas(windowWidth, windowHeight);
};

window.draw = function () {
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
};

// spawn a new bouncer where the mouse clicks
window.mousePressed = function () {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        bouncers.push(new Bouncer({position: createVector(mouseX, mouseY)}))
    }
};

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
