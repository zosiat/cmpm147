/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
    return [
      {
        name: "Selfie", 
        assetUrl: "../img/photo1.png",
        credit: "Selfie by Zosia Trela, 2024"
      },
      {
        name: "Yosemite Waterfall", 
        assetUrl: "../img/photo2.png",
        credit: "Yosemite Waterfall and Rainbow by Zosia Trela, 2024"
      },
      {
        name: "Above the Waterfall", 
        assetUrl: "../img/photo3.png",
        credit: "Me on a rock by Zosia Trela, 2024"
      },
    ];
  }

function initDesign(inspiration) {
  // set fixed canvas width
  let canvasWidth = 300;

  // calculate height using the original image's aspect ratio
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio;

  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit);

  // display original image at 300px width
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:300px;">`;
  $('#original').empty();
  $('#original').append(imgHTML);

  // resize and access pixel data
  inspiration.image.resize(canvasWidth, canvasHeight);
  inspiration.image.loadPixels();

  // initialize design with random boxes within the same 300px canvas
  let design = {
    bg: 128,
    fg: []
  };

  for (let i = 0; i < 100; i++) {
    let x = floor(random(canvasWidth));
    let y = floor(random(canvasHeight));
    let idx = 4 * (y * canvasWidth + x);
    let pixels = inspiration.image.pixels;
    let r = pixels[idx];
    let g = pixels[idx + 1];
    let b = pixels[idx + 2];
    design.fg.push({
      x: x,
      y: y,
      w: random(canvasWidth / 2),
      h: random(canvasHeight / 2),
      fill: [r, g, b]
    });
  }

  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  for (let box of design.fg) {
    fill(box.fill[0], box.fill[1], box.fill[2], 128);
    rect(box.x, box.y, box.w, box.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for (let box of design.fg) {
    box.fill[0] = mut(box.fill[0], 0, 255, rate);
    box.fill[1] = mut(box.fill[1], 0, 255, rate);
    box.fill[2] = mut(box.fill[2], 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width / 2, rate);
    box.h = mut(box.h, 0, height / 2, rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}