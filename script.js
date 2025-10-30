const oneRmForm = document.getElementById("one-rm-form");
const oneRmOutput = document.getElementById("one-rm-output");
const baseWeightInput = document.getElementById("base-weight-input");
const percentForm = document.getElementById("percent-form");
const percentTableBody = document.querySelector("#percent-table tbody");
const incrementSlider = document.getElementById("increment-input");
const incrementDisplay = document.getElementById("increment-display");

const FORMULAS = {
  epley: (weight, reps) => weight * (1 + reps / 30),
  brzycki: (weight, reps) => weight * (36 / (37 - reps)),
  lombardi: (weight, reps) => weight * Math.pow(reps, 0.1),
};

const formatWeight = (value) => `${(Math.round(value * 2) / 2).toFixed(1)} kg`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const setError = (field, message) => {
  const container = field.closest(".field");
  let errorEl = container ? container.querySelector(".error-text") : null;

  if (!message) {
    field.removeAttribute("data-error");
    if (errorEl) {
      errorEl.remove();
    }
    return;
  }

  field.setAttribute("data-error", message);

  if (!container) {
    return;
  }

  if (!errorEl) {
    errorEl = document.createElement("span");
    errorEl.classList.add("error-text");
    container.appendChild(errorEl);
  }

  errorEl.textContent = message;
};

incrementSlider.addEventListener("input", () => {
  incrementDisplay.textContent = `${incrementSlider.value}%`;
});

oneRmForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const weightField = oneRmForm.elements.weight;
  const repsField = oneRmForm.elements.reps;
  const formulaField = oneRmForm.elements.formula;

  const weight = Number(weightField.value);
  const reps = Number(repsField.value);
  const formulaKey = formulaField.value;

  let hasError = false;

  if (!Number.isFinite(weight) || weight <= 0) {
    hasError = true;
    setError(weightField, "Enter a valid weight.");
  } else {
    setError(weightField);
  }

  if (!Number.isFinite(reps) || reps < 1 || reps > 20) {
    hasError = true;
    setError(repsField, "Reps must be between 1 and 20.");
  } else {
    setError(repsField);
  }

  if (!FORMULAS[formulaKey]) {
    hasError = true;
    setError(formulaField, "Select a formula.");
  } else {
    setError(formulaField);
  }

  if (hasError) {
    oneRmOutput.textContent = "";
    return;
  }

  const estimatedOneRm = FORMULAS[formulaKey](weight, reps);
  const normalizedOneRm = Math.max(estimatedOneRm, weight);
  const roundedOneRm = Math.round(normalizedOneRm * 10) / 10;

  oneRmOutput.textContent = `Estimated 1RM: ${roundedOneRm.toFixed(1)} kg`;

  if (!baseWeightInput.value) {
    baseWeightInput.value = roundedOneRm.toFixed(1);
  }
});

percentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const baseWeight = Number(percentForm.elements.baseWeight.value);
  const startPercent = Number(percentForm.elements.startPercent.value);
  const endPercent = Number(percentForm.elements.endPercent.value);
  const increment = Number(percentForm.elements.increment.value);

  let hasError = false;

  if (!Number.isFinite(baseWeight) || baseWeight <= 0) {
    hasError = true;
    setError(percentForm.elements.baseWeight, "Enter a valid base weight.");
  } else {
    setError(percentForm.elements.baseWeight);
  }

  if (!Number.isFinite(startPercent) || !Number.isFinite(endPercent)) {
    hasError = true;
    setError(percentForm.elements.startPercent, "Enter valid percentages.");
    setError(percentForm.elements.endPercent, "Enter valid percentages.");
  } else {
    setError(percentForm.elements.startPercent);
    setError(percentForm.elements.endPercent);
  }

  if (startPercent >= endPercent) {
    hasError = true;
    setError(percentForm.elements.startPercent, "Start must be lower than end.");
  }

  if (!Number.isFinite(increment) || increment <= 0) {
    hasError = true;
    setError(percentForm.elements.increment, "Choose a positive increment.");
  } else {
    setError(percentForm.elements.increment);
  }

  if (hasError) {
    return;
  }

  const boundedStart = clamp(startPercent, 40, 120);
  const boundedEnd = clamp(endPercent, boundedStart + increment, 120);

  const rows = [];
  for (let pct = boundedStart; pct <= boundedEnd; pct += increment) {
    const weightAtPercent = baseWeight * (pct / 100);
    rows.push({
      percentLabel: `${pct.toFixed(0)}%`,
      weightLabel: formatWeight(weightAtPercent),
    });
  }

  percentTableBody.innerHTML =
    rows.length > 0
      ? rows
          .map(
            (row) => `
        <tr>
          <td>${row.percentLabel}</td>
          <td>${row.weightLabel}</td>
        </tr>
      `.trim()
          )
          .join("")
      : `
        <tr>
          <td colspan="2" class="placeholder">No values generated for that range.</td>
        </tr>
      `.trim();
});

document.addEventListener("input", (event) => {
  const field = event.target;
  if (field.matches("input, select") && field.hasAttribute("data-error")) {
    setError(field);
  }
});
