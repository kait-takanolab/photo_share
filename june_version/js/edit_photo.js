// measure edited elapsed time
const start_time = new Date(); // ms

// parameters control box
const controlBox = $(".control-box");

// Display filter sliders
filters.forEach(filter => {
  let field = $("<div class='field'>").appendTo(controlBox);
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
const resetButtonField = $("<div class='field'>").appendTo(controlBox);
const resetButtonControl = $("<div class='control'>").appendTo(
  resetButtonField
);
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

// field to input filter preset name
const presetNameFormField = $("<div class='field'>").appendTo(controlBox);
const presetNameFormControl = $("<div class='control'>").appendTo(
  presetNameFormField
);
presetNameFormControl.append("<label class='label'>Preset name</label>");
const presetNameFormInput = $(
  "<input name='filter_preset_name' class='input' type='text' placeholder='Filter Preset name'>"
).appendTo(presetNameFormControl);

// button to save filter preset
const savePresetNameButtonField = $("<div class='field'>").appendTo(controlBox);
const savePresetNameButtonControl = $("<div class='control'>").appendTo(
  savePresetNameButtonField
);
const saveFilterPresetButton = $(
  "<button class='button is-warning reset-button' disabled>Save</button>"
).appendTo(savePresetNameButtonControl);
saveFilterPresetButton[0].addEventListener("click", () => {
  // send filter values to server
  (async () => {
    const filterParameters = getFilterParameters();
    const presetName = presetNameFormInput.val();
    const res = await fetch("php/register_filter_preset.php", {
      method: "POST",
      body: JSON.stringify({
        name: presetName,
        filter_parameters: filterParameters
      }),
      headers: {
        "content-type": "application/json"
      }
    });
    const filterPresets = await res.json();
    displayFilterPresetButtons(filterPresets);
  })();
});
// disable button if there is not text in input field
presetNameFormInput[0].addEventListener("input", () => {
  const inputText = presetNameFormInput.val();
  if (inputText.length > 0) {
    saveFilterPresetButton.attr("disabled", false);
  } else {
    saveFilterPresetButton.attr("disabled", true);
  }
});

// form group
const form = $(
  "<form method='POST' action='php/save_edited_photo_file.php' enctype='multipart/form-data'>"
).appendTo(controlBox);

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
(async () => {
  // get filter presets
  const res = await fetch("php/fetch_filter_preset.php");
  const filterPresets = await res.json();
  displayFilterPresetButtons(filterPresets);
})();

function displayFilterPresetButtons(filterPresets) {
  const filterPresetButtonBox = $("#filter-preset-button-box");

  // init
  filterPresetButtonBox.empty();

  // display buttons
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
}
