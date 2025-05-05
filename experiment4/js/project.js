// // project.js - Experiment 4 - Forest Stages
// // Author: Zosia Trela
// // Date: 4/29/25

// //camping forest sketch in instance mode
// var campingSketch = function(p) {

//   let smallDirt, mediumDirt, largeDirt, grass, water;
//   let tree1, tree2, tree3, tree4, tree5, tree6;
//   let tent;
//   let grass1, grass2, flower2, flower3;

//   let tileType = {};

//   // load tilesheet
//   p.preload = function() {
//     //ground tiles
//     grass = p.loadImage('../img/grass.png');
//     smallDirt = p.loadImage('../img/smallDirt.png');
//     mediumDirt = p.loadImage('../img/mediumDirt.png');
//     largeDirt = p.loadImage('../img/largeDirt.png');
//     water = p.loadImage('../img/water.png');
//     //tree assets
//     tree1 = p.loadImage('../img/tree1.png');
//     tree2 = p.loadImage('../img/tree2.png');
//     tree3 = p.loadImage('../img/tree3.png');
//     tree4 = p.loadImage('../img/tree4.png');
//     tree5 = p.loadImage('../img/tree5.png');
//     tree6 = p.loadImage('../img/tree6.png');
//     //decor assets
//     grass1 = p.loadImage('../img/grass1.png');
//     grass2 = p.loadImage('../img/grass2.png');
//     flower2 = p.loadImage('../img/flower2.png');
//     flower3 = p.loadImage('../img/flower3.png');

//     tent = p.loadImage('../img/tent.png');
//   };

//   p.setup = function(){
//     tw = p3_tileWidth();
//     th = p3_tileHeight();
//   }

//   p.draw = function() {
 
//   };
  
//   function p3_tileWidth() {
//     return 32;
//   }
//   function p3_tileHeight() {
//     return 16;
//   }

//   p.worldKeyChanged = function(key){
//     worldSeed = XXH.h32(key, 0);
//     p.noiseSeed(worldSeed);
//     p.randomSeed(worldSeed);    
    
//     //reseting tents
//     let clicks = {};
  
//     // initialize tileType
//     tileType = {}; // clear previous
//     for (let i = -50; i <= 50; i++) {
//       for (let j = -50; j <= 50; j++) {
//         let n = p.noise(i * 0.1, j * 0.1);
//         let isWater = (n < 0.25);
//         tileType[[i, j]] = {isWater: isWater};
//       }
//     }
//   }

//   let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

//   let clicks = {};

//   p.tileClicked = function(i, j) {
//     // tile type for the current tile
//     let key = [i-1, j-1];
//     let tile = tileType[key];
//     let isWater = tile ? tile.isWater : (noise(i * 0.1, j * 0.1) < 0.25);

//     // place the tent if its not on water
//     if (!isWater) {
//       clicks[key] = 1 + (clicks[key] | 0);
//     }
//   }

//   p.drawTile = function(i, j) {
//     p.noStroke();
//     p.push();
//     p.imageMode(p.CENTER);

//     // noise value for this tile
//     let n = p.noise(i * 0.1, j * 0.1);

//     // determine if this tile is water, and size
//     let isWater = (n < 0.25);
//     let isFlat = (n < 0.35);
//     let isSmall = (n < 0.55);
//     let isMedium = (n < 0.85);
//     let isLarge = (n < 1);
    
//     tileType[[i, j]] = {isWater: isWater};

//     // draw ground tile
//     if (isWater) {
//       p.image(water, 0, 0, water.width/2, water.height/2);
//     } 
//     else if (isFlat) {
//       p.image(grass, 0, 0, grass.width/2, grass.height/2);
//     }
//     else if (isSmall) {
//       p.image(smallDirt, 0, 0, smallDirt.width/2, smallDirt.height/2);
//     }
//     else if (isMedium) {
//       p.image(mediumDirt, 0, 0, mediumDirt.width/2, mediumDirt.height/2);
//     }
//     else if (isLarge){
//       p.image(largeDirt, 0, 0, largeDirt.width/2, largeDirt.height/2);
//     }

//     // draw trees not on water tiles
//     if (!isWater) {
//       let trees = [tree1, tree2, tree3, tree4, tree5, tree6, grass1, grass2, flower2, flower3,];
//       let treeChance = p.noise(i * 0.5, j * 0.5);

//       if (treeChance > 0.45) {
//         let treeIndex = XXH.h32("tree:" + [i, j], worldSeed) % trees.length;
//         let selectedTree = trees[treeIndex];

//         let xOffset = map(p.noise(i * 0.7, j * 0.7), 0, 1, -10, 10);
//         let yOffset = map(p.noise(i * 0.9, j * 0.9), 0, 1, -10, 10);

//         //adjusting tree heights based on tile height
//         if (isSmall) {
//           yOffset += -5;
//         }
//         else if (isMedium) {
//           yOffset += -16;
//         }
//         else if (isLarge){
//           yOffset += -32;
//         }

//         p.image(selectedTree, xOffset, yOffset, selectedTree.width/2, selectedTree.height/2);
//       }
//     }
    
//     //adjusting tent heights based on tile height
//     let c = clicks[`${i},${j}`] ?? 0;
//     if (c % 2 === 1) {
//       let yOffset = 0;

//       if (isFlat) {
//         yOffset = 0;
//       }
//       else if (isSmall) {
//         yOffset = -5;
//       }
//       else if (isMedium) {
//         yOffset = -16;
//       }
//       else if (isLarge){
//         yOffset = -32;
//       }

//       p.image(tent, 0, yOffset, tent.width/2, tent.height/2);
//     }


//     p.pop();
//   }

//   p.drawSelectedTile = function(i, j) {
//     push();

//     let tile = tileType[[i-1, j-1]];
//     let isWater;
//     if (tile !== undefined) {
//       isWater = tile.isWater;
//     } else {
//       let n = p.noise(i * 0.1, j * 0.1);
//       isWater = (n < 0.25);
//     }

//     noFill();
//     if (isWater) {
//       stroke(255, 0, 0, 128);
//     } else {
//       stroke(0, 255, 0, 128);
//     }

//     beginShape();
//     vertex(-tw, 0);
//     vertex(0, th);
//     vertex(tw, 0);
//     vertex(0, -th);
//     endShape(CLOSE);

//     noStroke();
//     fill(100);
//     text("tile " + [i, j], 0, 0);

//     p.pop();
//   }

// };

// //for html button