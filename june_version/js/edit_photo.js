// measure edited elapsed time
const start_time = new Date(); // ms

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

// reset button
const resetButtonControl = $("<div class='control'>").appendTo(".control-box");
const resetButton = $(
  "<button class='button is-outlined reset-button'>Filter Reset</button>"
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

// form group
const form = $(
  "<form method='POST' action='php/save_edited_photo_file.php' enctype='multipart/form-data'>"
).appendTo(".control-box");

// Photo name input field
const photoNameField = $("<div class='field'>").appendTo(form);
photoNameField
  .append("<label class='label'>Photo name</label>")
  .append("<div class='control'>");
const photoNameInputField = $(
  "<input name='photoname' class='input' type='text' placeholder='Photo name'>"
).appendTo(photoNameField);

// Display filters reset button and save button
const buttonField = $("<div class='field'>").appendTo(form);

// save button
const saveButtonControl = $("<div class='control'>").appendTo(buttonField);
const saveButton = $(
  "<input type='submit' class='button is-link' disabled>"
).appendTo(saveButtonControl);
saveButton.val("Save");

// disable button if there is not text in input field
photoNameInputField[0].addEventListener("input", () => {
  const inputText = photoNameInputField.val();
  if (inputText.length > 0) {
    saveButton.attr("disabled", false);
  } else {
    saveButton.attr("disabled", true);
  }
});

// send meta parameters of the photo when save button click
saveButton[0].addEventListener("click", () => {
  // send edited elapsed time
  const end_time = new Date(); // ms
  const elapsed_time = Math.round((end_time - start_time) / 1000); // sec
  $(
    `<input type='hidden' name='elapsed_time' value='${elapsed_time}'>`
  ).appendTo(form);

  // send canvas image
  const canvasImage = canvas.toDataURL("image/png").replace(/^.+?,/, "");
  $(
    `<input type='hidden' name='canvas_image' value='${canvasImage}'>`
  ).appendTo(form);

  // send filter parameters
  const filterParameters = JSON.stringify(getFilterParameters());
  $(
    `<input type='hidden' name='filter_parameters' value='${filterParameters}'>`
  ).appendTo(form);

  // send whether edited or
  $(`<input type='hidden' name='is_edited' value='${is_edited}'>`).appendTo(
    form
  );

  // send original photo name
  $(
    `<input type='hidden' name='original_photoname' value='${originalPhotoName}'>`
  ).appendTo(form);
});

// filter preset buttons
const filterPresetButtonBox = $("#filter-preset-button-box");
(async () => {
  // get filter presets
  const res = await fetch("/php/fetch_filter_preset.php");
  const filterPresets = await res.json();
  filterPresets.forEach(filter => {
    // create preset buttons
    const presetButton = $(
      `<button class='button filter-preset-button'>${filter.name}</button>`
    ).appendTo(filterPresetButtonBox);
    delete filter.id;
    delete filter.name;
    presetButton[0].addEventListener("click", () => {
      ctx.putImageData(originalImageData, 0, 0);
      filters.forEach(fl => {
        // set preset value
        const flname = fl.name;
        fl.currentValue = parseInt(filter[flname + "_filter"]);
        // reset slider position
        fl.sliderElement.val(fl.currentValue);
        fl.outputElement.html(fl.currentValue);
        // apply filters
        fl.func(fl.currentValue);
      });
    });
  });
})();
