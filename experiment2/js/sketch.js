// sketch.js - purpose and description here
// Author: Zosia Trela
// Date: 04/`4/15

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

let seed = 239;

const grassColor = "#3d431d";
const skyColor = "#b5c8e6";
const stoneColor = "#aa959a";
const treeColor = "#3b4022";
const darkHill = "#3e4d31";
const lightHill = "#5d5d38";
const sunColor = "#fdfcf7";

const flowerColors = ["#b9429b", "#7f1962", "#e159c2", "#FF69B4"];
const flowerSize = 5;

// Globals


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// setup
function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  createButton("reimagine").mousePressed(() => seed++);

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
}

// draw
function draw() {
  randomSeed(seed);
  background(skyColor);

  // sun
  let sunY = height - (frameCount / 2 % (height + 100));
  let sunX = width / 2;

  noStroke();
  fill(255, 255, 255, 50);
  ellipse(sunX, sunY, 100, 100);
  fill(255, 255, 255, 30);
  ellipse(sunX, sunY, 200, 200);
  fill(sunColor);
  ellipse(sunX, sunY, 50, 50);

  // mountains
  fill(stoneColor);
  beginShape();
  vertex(0, height);
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    let x = (width * i) / steps;
    let y = height / 2 - (random() ** 3) * height / 2 - height / 20;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  // left hill
  let leftHillStartY = random(height / 10, height / 2);
  fill(darkHill);
  beginShape();
  for (let i = 0; i <= steps; i++) {
    let x = map(i, 0, steps, 0, width * 0.8);
    let baseY = map(x, 0, width * 0.8, leftHillStartY, height);
    let y = baseY + noise(seed + i * 0.5) * 20;
    vertex(x, y);
  }
  vertex(width * 0.8, height);
  vertex(0, height);
  endShape(CLOSE);

  // right hill
  let rightHillStartY = random(height / 10, height / 3);
  fill(lightHill);
  beginShape();
  for (let i = 0; i <= steps; i++) {
    let x = map(i, 0, steps, width, width * 0.2);
    let baseY = map(x, width, width * 0.2, rightHillStartY, height);
    let y = baseY + noise(seed + 100 + i * 0.5) * 20;
    vertex(x, y);
  }
  vertex(width * 0.2, height);
  vertex(width, height);
  endShape(CLOSE);

  // trees
  for (let i = 0; i < 15; i++) {
    let x = random(20, width - 20);
    let y = height - 40;
    drawTree(x, y);
  }

  // ground
  fill(grassColor);
  rect(0, height - 40, width, 50);
  addFlowers();
}

function addFlowers() {
  for (let i = 0; i < 200; i++) {
    let flowerX = random(width);
    let flowerY = random(height - 40, height);
    if (flowerY >= height - 40) {
      let flowerColor = random(flowerColors);
      fill(flowerColor);
      ellipse(flowerX, flowerY, flowerSize, flowerSize);
    }
  }
}

function drawTree(x, y) {
  fill(treeColor);
  let treeHeight = random(15, 30);
  triangle(x - 8, y, x + 8, y, x, y - treeHeight);
}