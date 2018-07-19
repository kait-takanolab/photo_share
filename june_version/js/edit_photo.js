// measure edited elapsed time
const now = new Date();
const start_time = now.getSeconds();

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

// form group
const form = $(
  "<form method='POST' action='php/save_edited_photo_file.php' enctype='multipart/form-data'>"
).appendTo(".control-box");

// Photo name input field
const photoNameField = $("<div class='field'>").appendTo(form);
// const photoNameField = $("<div class='field'>").appendTo(".control-box");
photoNameField
  .append("<label class='label'>Photo name</label>")
  .append("<div class='control'>");
const photoNameInputField = $(
  "<input name='photoname' class='input' type='text' placeholder='Photo name'>"
).appendTo(photoNameField);

// Display filters reset button and save button
const buttonField = $("<div class='field is-grouped'>").appendTo(
  // ".control-box"
  form
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
// const saveButton = $("<a class='button is-link' disabled>Save</a>").appendTo(
const saveButton = $(
  "<input type='submit' class='button is-link' disabled>"
).appendTo(saveButtonControl);
saveButton.val("Save");

// Disable button if there is not text in input field
photoNameInputField[0].addEventListener("input", () => {
  const inputText = photoNameInputField.val();
  if (inputText.length > 0) {
    saveButton.attr("disabled", false);
  } else {
    saveButton.attr("disabled", true);
  }
});
saveButton[0].addEventListener("click", () => {
  // send edited elapsed time
  const now = new Date();
  const finished_time = now.getSeconds();
  const elapsed_time = finished_time - start_time;
  $(
    `<input type='hidden' name='elapsed_time' value='${elapsed_time}'>`
  ).appendTo(form);

  // send canvas image
  const canvasImage = canvas.toDataURL("image/png").replace(/^.+?,/, "");
  $(
    `<input type='hidden' name='canvas_image' value='${canvasImage}'>`
  ).appendTo(form);
});

// send filter parameters
const filterParameters = JSON.stringify(getFilterParameters());
$(
  `<input type='hidden' name='filter_parameters' value='${filterParameters}'>`
).appendTo(form);

// send whether edited or
$(`<input type='hidden' name='is_edited' value='${is_edited}'>`).appendTo(form);
