import { Bouncer } from "./Bouncer.js";

let bouncers = [];

window.setup = function () {
    let canvas = createCanvas(10, 10);
    canvas.parent("canvas-container");

    let button_bullet = createButton("bullet");
    button_bullet.parent("input-container");
    button_bullet.mousePressed(bullet);

    let button_fireworks = createButton("fireworks");
    button_fireworks.parent("input-container");
    button_fireworks.mousePressed(fireworks);

    resizeCanvasToContainer();
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
        simple();
    }
};

window.windowResized = function () {
    resizeCanvasToContainer();
};

function resizeCanvasToContainer() {
    let canvasContainer = select("#canvas-container");
    resizeCanvas(canvasContainer.elt.clientWidth, canvasContainer.elt.clientHeight);
}

function simple() {
    bouncers.push(new Bouncer({position: createVector(mouseX, mouseY)}));
}

function fireworks() {
    let startX = random(0, width);
    let startY = random(0, height * 0.6);
    for (let i = 0; i < 30; ++i) {
        bouncers.push(new Bouncer({position: createVector(startX, startY), radius: 5, remainingCollisions: 1, remainingBursts: 0}));
    }
}

function bullet() {
        bouncers.push(new Bouncer({position: createVector(0, height * 0.5), velocity: createVector(90, -5), remainingCollisions: 1, remainingBursts: 3, radius: 30}))

}
