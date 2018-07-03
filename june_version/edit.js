const DISPLAY_IMAGE_WIDTH = 640;
const IMAGE_SOURCE = "gyoza.jpeg";
// "https://tblg.k-img.com/restaurant/images/Rvw/56676/640x640_rect_56676551.jpg";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Display the image
const img = new Image();
img.src = IMAGE_SOURCE;
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
};

// List of filters to apply
const filters = [
  {
    name: "saturate",
    initValue: 100,
    minValue: 0,
    maxValue: 200,
    currentValue: 100,
    step: 1,
    valueUnit: "%",
    sliderElement: null,
    outputElement: null
  },
  {
    name: "hue-rotate",
    initValue: 0,
    minValue: 0,
    maxValue: 360,
    currentValue: 0,
    step: 1,
    valueUnit: "deg",
    sliderElement: null,
    outputElement: null
  },
  {
    name: "invert",
    initValue: 0,
    minValue: 0,
    maxValue: 100,
    currentValue: 0,
    step: 1,
    valueUnit: "%",
    sliderElement: null,
    outputElement: null
  },
  {
    name: "grayscale",
    initValue: 0,
    minValue: 0,
    maxValue: 100,
    currentValue: 0,
    step: 1,
    valueUnit: "%",
    sliderElement: null,
    outputElement: null
  },
  {
    name: "sepia",
    initValue: 0,
    minValue: 0,
    maxValue: 100,
    currentValue: 0,
    step: 1,
    valueUnit: "%",
    sliderElement: null,
    outputElement: null
  },
  {
    name: "blur",
    initValue: 0,
    minValue: 0,
    maxValue: 100,
    currentValue: 0,
    step: 1,
    valueUnit: "px",
    sliderElement: null,
    outputElement: null
  },
  {
    name: "brightness",
    initValue: 100,
    minValue: 0,
    maxValue: 200,
    currentValue: 100,
    step: 1,
    valueUnit: "%",
    sliderElement: null,
    outputElement: null
  },
  {
    name: "contrast",
    initValue: 100,
    minValue: 0,
    maxValue: 200,
    currentValue: 100,
    step: 1,
    valueUnit: "%",
    sliderElement: null,
    outputElement: null
  }
];

// Display filter sliders
filters.forEach(filter => {
  let field = $("<div class='field'>").appendTo(".control-box");
  const label = filter.name.charAt(0).toUpperCase() + filter.name.slice(1);
  $("<label class='label'>" + label + "</label>").appendTo(field);
  const control = $("<div class='control'>").appendTo(field);

  let slider = $("<input>").appendTo(control);
  slider.attr({
    id: filter.name + "-slider",
    class: "slider has-output is-fullwidth",
    type: "range",
    value: filter.initValue.toString(),
    min: filter.minValue.toString(),
    max: filter.maxValue.toString(),
    step: filter.step.toString()
  });
  filter.sliderElement = slider;

  let output = $("<output>").appendTo(control);
  output.attr("id", filter.name + "-output");
  output.html(filter.initValue);
  filter.outputElement = output;

  // Note: jQueryObject[0] is DOM element
  // cf. https://learn.jquery.com/using-jquery-core/faq/how-do-i-pull-a-native-dom-element-from-a-jquery-object/
  slider[0].addEventListener("input", () => {
    filter.currentValue = slider[0].value;
    output[0].innerHTML = filter.currentValue;
    const cssFilterStr = filters
      .map(fl => {
        return `${fl.name}(${fl.currentValue}${fl.valueUnit})`;
      })
      .join(" ");
    $("#canvas").css({ filter: cssFilterStr });
  });
});

// Display filters reset button and save button
const buttonField = $("<div class='field is-grouped'>").appendTo(
  ".control-box"
);

// reset button
const resetButtonControl = $("<div class='control'>").appendTo(buttonField);
const resetButton = $(
  "<button class='button is-outlined'>Reset</button>"
).appendTo(resetButtonControl);
resetButton[0].addEventListener("click", () => {
  // reset slider position
  filters.forEach(filter => {
    const initValue = filter.initValue.toString();
    filter.currentValue = initValue;
    filter.sliderElement.val(initValue);
    filter.outputElement.html(initValue);
  });
  // reset filters
  $("#canvas").css({ filter: "" });
});

// save button
const saveButtonControl = $("<div class='control'>").appendTo(buttonField);
const saveButton = $("<a class='button is-link'>Save</a>").appendTo(
  saveButtonControl
);
saveButton[0].addEventListener("click", () => {
  saveButton.attr({
    href: canvas.toDataURL("image/png"),
    download: "canvas-image"
  });
});
