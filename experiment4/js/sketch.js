// sketch.js - Infinite Tile Dungeon and Overworld
// Author: Zosia Trela
// Date: 04/28/25

"use strict";

/* global XXH */
/* exported -- 
    p3_preload 
    p3_setup 
    p3_worldKeyChanged 
    p3_tileWidth 
    p3_tileHeight 
    p3_tileClicked 
    p3_drawBefore 
    p3_drawTile 
    p3_drawSelectedTile 
    p3_drawAfter
*/

let tw = 32;  // tile width
let th = 16;  // tile height

let smallDirt, mediumDirt, largeDirt, grass, water;
let tree1, tree2, tree3, tree4, tree5, tree6;
let tent;
let grass1, grass2, flower2, flower3;

let tileType = {};
let clicks = {};
let worldSeed;
let cameraPos = { x: 0, y: 0 };  // camera position to track player's view

function p3_preload() {
  // load ground tiles
  grass = loadImage('../img/grass.png');
  smallDirt = loadImage('../img/smallDirt.png');
  mediumDirt = loadImage('../img/mediumDirt.png');
  largeDirt = loadImage('../img/largeDirt.png');
  water = loadImage('../img/water.png');
  
  // load tree assets
  tree1 = loadImage('../img/tree1.png');
  tree2 = loadImage('../img/tree2.png');
  tree3 = loadImage('../img/tree3.png');
  tree4 = loadImage('../img/tree4.png');
  tree5 = loadImage('../img/tree5.png');
  tree6 = loadImage('../img/tree6.png');
  
  // load decor assets
  grass1 = loadImage('../img/grass1.png');
  grass2 = loadImage('../img/grass2.png');
  flower2 = loadImage('../img/flower2.png');
  flower3 = loadImage('../img/flower3.png');
  tent = loadImage('../img/tent.png');
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('s1');

  setSeed("default");

  // setup button click
  let button = document.getElementById("setSeedButton");
  button.addEventListener("click", () => {
    let val = document.getElementById("seedInput").value;
    if (val.trim().length > 0) {
      setSeed(val.trim());
    }
  });
}

function draw() {
  background(200);
  
  let mouseXPos = mouseX - width / 2;
  let mouseYPos = mouseY - height / 2;

  // adjust camera position based on mouse position (or implement player movement logic)
  cameraPos.x = mouseXPos;
  cameraPos.y = mouseYPos;

  let viewRadiusX = Math.ceil(width / tw) + 2;  // calculate visible tiles on the X-axis
  let viewRadiusY = Math.ceil(height / th) + 2; // calculate visible tiles on the Y-axis

  translate(width / 2, height / 2);

  // loop through tiles based on the camera position
  for (let i = -viewRadiusX; i <= viewRadiusX; i++) {
    for (let j = -viewRadiusY; j <= viewRadiusY; j++) {
      push();
      translate((i - j) * tw, (i + j) * th / 2);
      drawTile(i, j);
      pop();
    }
  }

    // draw hover highlight after tiles are drawn
    let mx = cameraPos.x;
    let my = cameraPos.y;
    let isoI = Math.round((mx / tw + my / (th / 2)) / 2);
    let isoJ = Math.round((my / (th / 2) - mx / tw) / 2);
  
    push();
    translate((isoI - isoJ) * tw, (isoI + isoJ) * th / 2);
    p3_drawSelectedTile(isoI, isoJ);
    pop();
}

function drawTile(i, j) {
  noStroke();
  imageMode(CENTER);

  // generate terrain using noise
  let n = noise(i * 0.1, j * 0.1);
  let isWater = n < 0.25;
  let isFlat = n < 0.35;
  let isSmall = n < 0.55;
  let isMedium = n < 0.85;
  let isLarge = n < 1;

  tileType[[i, j]] = { isWater: isWater };

  if (isWater) {
    image(water, 0, 0, water.width / 2, water.height / 2);
  } else if (isFlat) {
    image(grass, 0, 0, grass.width / 2, grass.height / 2);
  } else if (isSmall) {
    image(smallDirt, 0, 0, smallDirt.width / 2, smallDirt.height / 2);
  } else if (isMedium) {
    image(mediumDirt, 0, 0, mediumDirt.width / 2, mediumDirt.height / 2);
  } else if (isLarge) {
    image(largeDirt, 0, 0, largeDirt.width / 2, largeDirt.height / 2);
  }

  if (!isWater) {
    let trees = [tree1, tree2, tree3, tree4, tree5, tree6, grass1, grass2, flower2, flower3];
    let treeChance = noise(i * 0.5, j * 0.5);

    if (treeChance > 0.45) {
      let treeIndex = XXH.h32("tree:" + [i, j], worldSeed) % trees.length;
      let selectedTree = trees[treeIndex];

      let xOffset = map(noise(i * 0.7, j * 0.7), 0, 1, -10, 10);
      let yOffset = map(noise(i * 0.9, j * 0.9), 0, 1, -10, 10);

      if (isSmall) yOffset += -5;
      else if (isMedium) yOffset += -16;
      else if (isLarge) yOffset += -32;

      image(selectedTree, xOffset, yOffset, selectedTree.width / 2, selectedTree.height / 2);
    }
  }

  let c = clicks[`${i},${j}`] ?? 0;
  if (c % 2 === 1) {
    let yOffset = 0;
    if (isSmall) yOffset = -5;
    else if (isMedium) yOffset = -16;
    else if (isLarge) yOffset = -32;
    image(tent, 0, yOffset, tent.width / 2, tent.height / 2);
  }

  let mx = cameraPos.x;
let my = cameraPos.y;

// Convert screen coordinates to tile coordinates
let isoI = Math.round((mx / tw + my / (th / 2)) / 2);
let isoJ = Math.round((my / (th / 2) - mx / tw) / 2);

push();
translate((isoI - isoJ) * tw, (isoI + isoJ) * th / 2);
p3_drawSelectedTile(isoI, isoJ);
pop();

}

function mousePressed() {
  let x = mouseX - width / 2;
  let y = mouseY - height / 2;

  // loop through tiles near the mouse click position
  for (let i = -50; i <= 50; i++) {
    for (let j = -50; j <= 50; j++) {
      let tx = (i - j) * tw;
      let ty = (i + j) * th / 2;

      if (dist(x, y, tx, ty) < tw / 2) {
        let tile = tileType[[i, j]];
        let isWater = tile ? tile.isWater : (noise(i * 0.1, j * 0.1) < 0.25);
        if (!isWater) {
          clicks[`${i},${j}`] = 1 + (clicks[`${i},${j}`] || 0);
        }
        return;
      }
    }
  }
}

function p3_drawSelectedTile(i, j) {
  push();

  let tile = tileType[[i-1, j-1]];
  let isWater;
  if (tile !== undefined) {
    isWater = tile.isWater;
  } else {
    let n = noise(i * 0.1, j * 0.1);
    isWater = (n < 0.25);
  }

  noFill();
  if (isWater) {
    stroke(255, 0, 0, 128);
  } else {
    stroke(0, 255, 0, 128);
  }

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(100);
  text("tile " + [i, j], 0, 0);

  pop();
}


function setSeed(str) {
  worldSeed = XXH.h32(str, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);

  // clear previous world state
  tileType = {};
  clicks = {};
}
