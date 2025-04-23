// project.js - Experiment 3 - Tile Dungeon and Overworld
// Author: Zosia Trela
// Date: 4/22/25

// overworld sketch using instance mode
var overworldSketch = function(p) {
  let grid;
  let frameCounter = 0;
  let waterTiles = {};
  let tileset;
  let tileSize = 32;

  // load tilesheet
  p.preload = function() {
    tileset = p.loadImage('../img/tileset.png');
  };

  p.setup = function() {
    p.createCanvas(400, 400);
    grid = generateGrid(20, 20);
    tileSize = p.floor(p.width / grid[0].length);
    p.noSmooth();
  };

  p.draw = function() {
    p.background("#6dc2ca");
    drawGrid(grid);
    frameCounter++;
  };

  function generateGrid(numCols, numRows) {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push("_");
      }
      grid.push(row);
    }

    // lake 1
    let x1 = p.floor(p.random(2, numCols - 5));
    let y1 = p.floor(p.random(2, numRows - 5));
    let x2 = p.floor(p.random(x1 + 3, numCols - 1));
    let y2 = p.floor(p.random(y1 + 3, numRows - 1));

    for (let i = y1; i <= y2; i++) {
      for (let j = x1; j <= x2; j++) {
        grid[i][j] = ".";
      }
    }

    // lake 2
    let x3, y3, x4, y4;
    do {
      x3 = p.floor(p.random(2, numCols - 5));
      y3 = p.floor(p.random(2, numRows - 5));
      x4 = p.floor(p.random(x3 + 3, numCols - 1));
      y4 = p.floor(p.random(y3 + 3, numRows - 1));
    } while (isRoomOverlap(x1, y1, x2, y2, x3, y3, x4, y4));

    for (let i = y3; i <= y4; i++) {
      for (let j = x3; j <= x4; j++) {
        grid[i][j] = ".";
      }
    }

    return grid;
  }

  //prevents animated grass
  let grassVariants = {};

  function drawGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        let code = grid[i][j];
  
        if (code === ".") {
          let top = grid[i - 1]?.[j];
          let bottom = grid[i + 1]?.[j];
          let left = grid[i]?.[j - 1];
          let right = grid[i]?.[j + 1];
  
          if (top === "_" || bottom === "_" || left === "_" || right === "_") {
            handleWalls(grid, i, j);
          } else {
            let key = `${i},${j}`;
            if (!waterTiles[key]) {
              waterTiles[key] = {
                frameOffset: p.floor(p.random(0, 1000)),
              };
            }
            let offset = waterTiles[key].frameOffset;
            let options = [[0, 13], [1, 13], [2, 13]];
            let index = p.floor(((frameCounter + offset) / 70) % options.length);
            let choice = options[index];
            placeTile(i, j, choice[0], choice[1]);
          }
        } else {
          // grass tile
          let key = `${i},${j}`;
          if (!(key in grassVariants)) {
            grassVariants[key] = p.floor(p.random(0, 3));
          }
          let randI = grassVariants[key];
          placeTile(i, j, randI, 0);
        }
      }
    }
  }
  
  //wall tiles
  function handleWalls(grid, i, j) {
    let top = grid[i - 1]?.[j];
    let bottom = grid[i + 1]?.[j];
    let left = grid[i]?.[j - 1];
    let right = grid[i]?.[j + 1];

    if (top === "_" && left === "_") {
      placeTile(i, j, 9, 0);
    } else if (top === "_" && right === "_") {
      placeTile(i, j, 11, 0);
    } else if (bottom === "_" && left === "_") {
      placeTile(i, j, 9, 2);
    } else if (bottom === "_" && right === "_") {
      placeTile(i, j, 11, 2);
    } else if (top === "_") {
      placeTile(i, j, 10, 0);
    } else if (bottom === "_") {
      placeTile(i, j, 10, 2);
    } else if (left === "_") {
      placeTile(i, j, 9, 1);
    } else if (right === "_") {
      placeTile(i, j, 11, 1);
    }
  }

  function isRoomOverlap(x1, y1, x2, y2, x3, y3, x4, y4) {
    return !(x2 < x3 || x4 < x1 || y2 < y3 || y4 < y1);
  }

  function placeTile(row, col, spriteX, spriteY) {
    p.noStroke();
    p.image(tileset, col * tileSize, row * tileSize, tileSize, tileSize, spriteX * 8, spriteY * 8, 8, 8);
  }

  // reseed method
  p.reseed = function() {
    grid = generateGrid(20, 20);
    waterTiles = {};
    grassVariants = {};
  };
};

console.log(document.getElementById("overworldSketch")); // should not be null
var overworldCanvas = new p5(overworldSketch, 's1');

// reseed button
document.addEventListener("DOMContentLoaded", function() {
  let button = document.getElementById("reseed");
  if (button) {
    button.addEventListener("click", function() {
      if (overworldCanvas.reseed) {
        overworldCanvas.reseed();
      }
    });
  }
});