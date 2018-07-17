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

  // Slider input event
  // Note: jQueryObject[0] is DOM element
  // cf. https://learn.jquery.com/using-jquery-core/faq/how-do-i-pull-a-native-dom-element-from-a-jquery-object/
  slider[0].addEventListener("input", () => {
    // apply filters
    filter.currentValue = parseInt(slider[0].value);
    output[0].innerHTML = filter.currentValue;
    ctx.putImageData(originalImageData, 0, 0);
    filters.forEach(fl => {
      fl.func(fl.currentValue);
    });
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
    const initValue = filter.initValue;
    filter.currentValue = initValue;
    filter.sliderElement.val(initValue);
    filter.outputElement.html(initValue);
  });
  // reset filters
  ctx.putImageData(originalImageData, 0, 0);
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
