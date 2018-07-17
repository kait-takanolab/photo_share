const DISPLAY_IMAGE_WIDTH = 640;
// "https://tblg.k-img.com/restaurant/images/Rvw/56676/640x640_rect_56676551.jpg";

//クエリで渡される画像名を取得
let query=location.search;
query=query.split('?');
query=query[1].split('=');
const IMAGE_SOURCE = query[1];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Display the image
const img = new Image();
img.src = IMAGE_SOURCE;
let originalImageData = null;
img.onload = () => {
  // Resize the image
  const srcImgWidth = img.width;
  const srcImgHeight = img.height;
  const dstImgWidth = DISPLAY_IMAGE_WIDTH;
  const scale = DISPLAY_IMAGE_WIDTH / srcImgWidth;
  const dstImgHeight = srcImgHeight * scale;

  // Specify the canvas size
  canvas.width = dstImgWidth;
  canvas.height = dstImgHeight;

  // Display the image
  // cf. https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  ctx.drawImage(
    img,
    0,
    0,
    srcImgWidth,
    srcImgHeight,
    0,
    0,
    dstImgWidth,
    dstImgHeight
  );

  originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

function gaussianFilter(radius) {
  // Use https://github.com/flozz/StackBlur
  StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, radius);
}

function contrastFilter(parcent) {
  // cf. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const factor = (259 * (parcent + 255)) / (255 * (259 - parcent));
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // cf. https://www.dfstudios.co.uk/articles/programming/image-programming-algorithms/image-processing-algorithms-part-5-contrast-adjustment/
    data[i] = parseInt(factor * (r - 128) + 128); // R
    data[i + 1] = parseInt(factor * (g - 128) + 128); // G
    data[i + 2] = parseInt(factor * (b - 128) + 128); // B
  }
  ctx.putImageData(imageData, 0, 0);
}

function grayscaleFilter(parcent) {
  parcent /= 100;
  // cf. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Conversion formula from RGB to YCbCr
    // cf. ITU-R BT.601
    // cf. https://en.wikipedia.org/wiki/Luma_(video)
    const gray = parseInt((r * 299 + g * 587 + b * 114) / 1000);

    data[i] = parseInt(r * (1 - parcent) + gray * parcent); // R
    data[i + 1] = parseInt(g * (1 - parcent) + gray * parcent); // G
    data[i + 2] = parseInt(b * (1 - parcent) + gray * parcent); // B
  }
  ctx.putImageData(imageData, 0, 0);
}

function sepiaFilter(parcent) {
  parcent /= 100;
  // cf. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Color parameters from https://www.techrepublic.com/blog/how-do-i/how-do-i-convert-images-to-grayscale-and-sepia-tone-using-c/
    const sepiaR = r * 0.393 + g * 0.769 + b * 0.189;
    const sepiaG = r * 0.349 + g * 0.686 + b * 0.168;
    const sepiaB = r * 0.272 + g * 0.534 + b * 0.131;

    data[i] = parseInt(r * (1 - parcent) + sepiaR * parcent); // R
    data[i + 1] = parseInt(g * (1 - parcent) + sepiaG * parcent); // G
    data[i + 2] = parseInt(b * (1 - parcent) + sepiaB * parcent); // B
  }
  ctx.putImageData(imageData, 0, 0);
}

function invertFilter(parcent) {
  parcent /= 100;
  // cf. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = parseInt((255 - data[i]) * parcent + data[i] * (1 - parcent)); // R
    data[i + 1] = parseInt(
      (255 - data[i + 1]) * parcent + data[i + 1] * (1 - parcent)
    ); // G
    data[i + 2] = parseInt(
      (255 - data[i + 2]) * parcent + data[i + 2] * (1 - parcent)
    ); // B
  }
  ctx.putImageData(imageData, 0, 0);
}

function hueRotateFilter(degree) {
  // cf. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const hls = rgbToHLS(data[i], data[i + 1], data[i + 2]);
    let h = hls[0] + degree;
    if (h > 360) {
      h -= 360;
    }
    const rgb = hlsToRGB(h, hls[1], hls[2]);
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
  }
  ctx.putImageData(imageData, 0, 0);
}

function lightnessFilter(parcent) {
  parcent /= 100;
  // cf. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const hls = rgbToHLS(data[i], data[i + 1], data[i + 2]);
    const l = hls[1] * parcent;
    const rgb = hlsToRGB(hls[0], l, hls[2]);
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
  }
  ctx.putImageData(imageData, 0, 0);
}

function saturationFilter(parcent) {
  parcent /= 100;
  // cf. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const hls = rgbToHLS(data[i], data[i + 1], data[i + 2]);
    const s = hls[2] * parcent;
    const rgb = hlsToRGB(hls[0], hls[1], s);
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
  }
  ctx.putImageData(imageData, 0, 0);
}

function rgbToHLS(R, G, B) {
  const H = rgbToHue(R, G, B);
  const L = rgbToLightness(R, G, B);
  const S = rgbToSaturation(R, G, B);

  return [H, L, S];
}

// cf. https://en.wikipedia.org/wiki/HSL_and_HSV#Hue_and_chroma
function rgbToHue(R, G, B) {
  const M = Math.max(R, G, B);
  const m = Math.min(R, G, B);
  const C = M - m;

  let _H = 0;
  if (C !== 0) {
    switch (M) {
      case R:
        _H = ((G - B) / C) % 6;
        break;
      case G:
        _H = (B - R) / C + 2;
        break;
      case B:
        _H = (R - G) / C + 4;
        break;
    }
  }
  const H = parseInt(60 * _H);

  return H;
}

// cf. https://en.wikipedia.org/wiki/HSL_and_HSV#Saturation
function rgbToSaturation(R, G, B) {
  const M = Math.max(R, G, B);
  const m = Math.min(R, G, B);
  const C = M - m;

  const L = rgbToLightness(R, G, B);

  let S = 0;
  if (L !== 1) {
    S = C / (1 - Math.abs(2 * L - 1));
  }

  return S;
}

// cf. https://en.wikipedia.org/wiki/HSL_and_HSV#Lightness
function rgbToLightness(R, G, B) {
  const M = Math.max(R, G, B);
  const m = Math.min(R, G, B);

  const L = (M + m) / 2;

  return L;
}

// cf. https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL
function hlsToRGB(H, L, S) {
  const C = (1 - Math.abs(2 * L - 1)) * S;
  const _H = H / 60;
  const X = C * (1 - Math.abs((_H % 2) - 1));
  let _R = 0,
    _G = 0,
    _B = 0;

  if (0 <= _H && _H <= 1) {
    _R = C;
    _G = X;
    _B = 0;
  } else if (1 <= _H && _H <= 2) {
    _R = X;
    _G = C;
    _B = 0;
  } else if (2 <= _H && _H <= 3) {
    _R = 0;
    _G = C;
    _B = X;
  } else if (3 <= _H && _H <= 4) {
    _R = 0;
    _G = X;
    _B = C;
  } else if (4 <= _H && _H <= 5) {
    _R = X;
    _G = 0;
    _B = C;
  } else if (5 <= _H && _H <= 6) {
    _R = C;
    _G = 0;
    _B = X;
  }

  const m = L - C / 2;
  const R = Math.abs(_R + m);
  const G = Math.abs(_G + m);
  const B = Math.abs(_B + m);

  return [R, G, B];
}

// List of filters to apply
const filters = [
  {
    name: "saturation",
    initValue: 100,
    minValue: 0,
    maxValue: 200,
    currentValue: 100,
    step: 1,
    sliderElement: null,
    outputElement: null,
    func: function() {
      saturationFilter(this.currentValue);
    }
  },
  {
    name: "hue-rotate",
    initValue: 0,
    minValue: 0,
    maxValue: 360,
    currentValue: 0,
    step: 1,
    sliderElement: null,
    outputElement: null,
    func: function() {
      hueRotateFilter(this.currentValue);
    }
  },
  {
    name: "invert",
    initValue: 0,
    minValue: 0,
    maxValue: 100,
    currentValue: 0,
    step: 1,
    sliderElement: null,
    outputElement: null,
    func: function() {
      invertFilter(this.currentValue);
    }
  },
  {
    name: "grayscale",
    initValue: 0,
    minValue: 0,
    maxValue: 100,
    currentValue: 0,
    step: 1,
    sliderElement: null,
    outputElement: null,
    func: function() {
      grayscaleFilter(this.currentValue);
    }
  },
  {
    name: "sepia",
    initValue: 0,
    minValue: 0,
    maxValue: 100,
    currentValue: 0,
    step: 1,
    sliderElement: null,
    outputElement: null,
    func: function() {
      sepiaFilter(this.currentValue);
    }
  },
  {
    name: "gaussian",
    initValue: 0,
    minValue: 0,
    maxValue: 100,
    currentValue: 0,
    step: 1,
    sliderElement: null,
    outputElement: null,
    func: function() {
      gaussianFilter(this.currentValue);
    }
  },
  {
    name: "lightness",
    initValue: 100,
    minValue: 0,
    maxValue: 200,
    currentValue: 100,
    step: 1,
    sliderElement: null,
    outputElement: null,
    func: function() {
      lightnessFilter(this.currentValue);
    }
  },
  {
    name: "contrast",
    initValue: 0,
    minValue: -100,
    maxValue: 100,
    currentValue: 0,
    step: 1,
    sliderElement: null,
    outputElement: null,
    func: function() {
      contrastFilter(this.currentValue);
    }
  }
];
