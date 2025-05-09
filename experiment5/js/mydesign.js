/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

let shapeStyle = 'box';

$('#shape-style').on('change', function () {
  shapeStyle = $(this).val();
  if (currentInspiration) {
    currentDesign = initDesign(currentInspiration);
    redraw(); // force update
  }
});

function getInspirations() {
    return [
      {
        name: "Yosemite Waterfall", 
        assetUrl: "../img/photo2.png",
        credit: "Yosemite Waterfall and Rainbow by Zosia Trela, 2024"
      },
      {
        name: "Selfie", 
        assetUrl: "../img/photo1.png",
        credit: "Selfie by Zosia Trela, 2024"
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
    fg: [],
    shapeStyle: shapeStyle
  };

  for (let i = 0; i < 100; i++) {
    let x = floor(random(canvasWidth));
    let y = floor(random(canvasHeight));
    let idx = 4 * (y * canvasWidth + x);
    let pixels = inspiration.image.pixels;
    let r = pixels[idx];
    let g = pixels[idx + 1];
    let b = pixels[idx + 2];

  if (shapeStyle === 'triangle') {
    design.fg.push({
      points: [
        x, y,
        x + random(-100, 100), y + random(-100, 100),
        x + random(-100, 100), y + random(-100, 100)
      ],
      fill: [r, g, b]
    });
  } else if (shapeStyle === 'ellipse') {
    design.fg.push({
      x: x,
      y: y,
      rx: random(canvasWidth / 4),
      ry: random(canvasHeight / 4),
      fill: [r, g, b]
    });
  } else {
    design.fg.push({
      x: x,
      y: y,
      w: random(canvasWidth / 2),
      h: random(canvasHeight / 2),
      fill: [r, g, b]
    });
  }
}

  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();

  let shapeStyle = design.shapeStyle;

  for (let shape of design.fg) {
    fill(shape.fill[0], shape.fill[1], shape.fill[2], 128);

    if (shape.points) {
      beginShape();
      for (let i = 0; i < shape.points.length; i += 2) {
        vertex(shape.points[i], shape.points[i + 1]);
      }
      endShape(CLOSE);
    } else if (shape.w && shape.h) {
      rect(shape.x, shape.y, shape.w, shape.h);
    } else if (shape.rx && shape.ry) {
      ellipse(shape.x, shape.y, shape.rx * 2, shape.ry * 2);
    }
  }
}

function mutateDesign(design, inspiration, rate) {

let shapeStyle = design.shapeStyle;


  design.bg = mut(design.bg, 0, 255, rate);
  for (let shape of design.fg) {
    if (shape.fill) {
      shape.fill[0] = mut(shape.fill[0], 0, 255, rate);
      shape.fill[1] = mut(shape.fill[1], 0, 255, rate);
      shape.fill[2] = mut(shape.fill[2], 0, 255, rate);
    }

    if (shape.points) {
      for (let i = 0; i < shape.points.length; i++) {
        let maxVal = i % 2 === 0 ? width : height;
        shape.points[i] = mut(shape.points[i], 0, maxVal, rate);
      }
    } else {
      shape.x = mut(shape.x, 0, width, rate);
      shape.y = mut(shape.y, 0, height, rate);
      shape.w = mut(shape.w, 0, width / 2, rate);
      shape.h = mut(shape.h, 0, height / 2, rate);
    }
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}