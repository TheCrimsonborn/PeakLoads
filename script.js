const oneRmForm = document.getElementById("one-rm-form");
const oneRmOutput = document.getElementById("one-rm-output");
const baseWeightInput = document.getElementById("base-weight-input");
const percentForm = document.getElementById("percent-form");
const percentTableBody = document.querySelector("#percent-table tbody");
const incrementSlider = document.getElementById("increment-input");
const incrementDisplay = document.getElementById("increment-display");
const warmupForm = document.getElementById("warmup-form");
const warmupTableBody = document.querySelector("#warmup-table tbody");
const warmupTemplateSelect = document.getElementById("warmup-template-select");
const warmupTemplateDescription = document.getElementById("warmup-template-description");
const topWeightInput = document.getElementById("top-weight-input");
const topRepsInput = document.getElementById("top-reps-input");
const barWeightInput = document.getElementById("bar-weight-input");
const warmupIncrementInput = document.getElementById("warmup-increment-input");

const FORMULAS = {
  epley: (weight, reps) => weight * (1 + reps / 30),
  brzycki: (weight, reps) => weight * (36 / (37 - reps)),
  lombardi: (weight, reps) => weight * Math.pow(reps, 0.1),
};

const WARMUP_TEMPLATES = {
  heavySingle: {
    label: "Heavy Single",
    description: "Dial in a top single with focused ramp-up singles.",
    defaultReps: 1,
    steps: [
      { pct: 0.35, reps: 8, note: "Groove the pattern" },
      { pct: 0.55, reps: 5 },
      { pct: 0.7, reps: 3 },
      { pct: 0.8, reps: 2 },
      { pct: 0.87, reps: 1 },
      { pct: 0.93, reps: 1 },
    ],
    topNote: "@RPE 8-9",
  },
  strengthTopSet: {
    label: "Strength Top Set",
    description: "Prime for a heavy triple or set of five.",
    defaultReps: 4,
    steps: [
      { pct: 0.4, reps: 8 },
      { pct: 0.55, reps: 5 },
      { pct: 0.65, reps: 3 },
      { pct: 0.75, reps: 2 },
      { pct: 0.82, reps: 1 },
      { pct: 0.9, reps: 1 },
    ],
    topNote: "Aim for RPE 8",
  },
  volumeBuilder: {
    label: "Volume Builder",
    description: "Smooth ramp into higher-rep working sets.",
    defaultReps: 8,
    steps: [
      { pct: 0.3, reps: 10, note: "Controlled tempo" },
      { pct: 0.45, reps: 8 },
      { pct: 0.6, reps: 6 },
      { pct: 0.7, reps: 4 },
      { pct: 0.8, reps: 2 },
    ],
    topNote: "Keep the final set snappy",
  },
};

const roundToIncrement = (value, increment = 0.5) => {
  if (!Number.isFinite(value) || !Number.isFinite(increment) || increment <= 0) {
    return 0;
  }
  return Math.round(value / increment) * increment;
};

const formatWeight = (value, increment = 0.5) =>
  `${roundToIncrement(value, increment).toFixed(1)} kg`;

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

const updateWarmupTemplateUI = () => {
  const template = WARMUP_TEMPLATES[warmupTemplateSelect.value];
  if (!template) {
    warmupTemplateDescription.textContent = "Choose a template to see the warm-up flow.";
    return;
  }

  warmupTemplateDescription.textContent = template.description;

  if (
    template.defaultReps &&
    (!topRepsInput.dataset.dirty || !topRepsInput.value)
  ) {
    topRepsInput.value = template.defaultReps;
  }
};

warmupTemplateSelect.addEventListener("change", () => {
  setError(warmupTemplateSelect);
  updateWarmupTemplateUI();
});

topRepsInput.addEventListener("input", () => {
  topRepsInput.dataset.dirty = "true";
});

if (baseWeightInput && topWeightInput) {
  baseWeightInput.addEventListener("input", () => {
    if (!topWeightInput.value) {
      topWeightInput.value = baseWeightInput.value;
    }
  });
}

updateWarmupTemplateUI();

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

  if (!topWeightInput.value) {
    topWeightInput.value = roundedOneRm.toFixed(1);
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

warmupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const topWeight = Number(warmupForm.elements.topWeight.value);
  const topReps = Number(warmupForm.elements.topReps.value);
  const barWeight = Number(warmupForm.elements.barWeight.value);
  const increment = Number(warmupForm.elements.increment.value);
  const templateKey = warmupForm.elements.template.value;
  const template = WARMUP_TEMPLATES[templateKey];

  let hasError = false;

  if (!Number.isFinite(topWeight) || topWeight <= 0) {
    hasError = true;
    setError(topWeightInput, "Enter a valid top set weight.");
  } else {
    setError(topWeightInput);
  }

  if (!Number.isFinite(topReps) || topReps < 1 || topReps > 20 || !Number.isInteger(topReps)) {
    hasError = true;
    setError(topRepsInput, "Reps must be between 1 and 20.");
  } else {
    setError(topRepsInput);
  }

  if (!Number.isFinite(barWeight) || barWeight < 0) {
    hasError = true;
    setError(barWeightInput, "Enter a valid bar weight.");
  } else {
    setError(barWeightInput);
  }

  if (!Number.isFinite(increment) || increment <= 0) {
    hasError = true;
    setError(warmupIncrementInput, "Increment must be greater than zero.");
  } else {
    setError(warmupIncrementInput);
  }

  if (!template) {
    hasError = true;
    setError(warmupTemplateSelect, "Choose a warm-up template.");
  } else {
    setError(warmupTemplateSelect);
  }

  if (
    Number.isFinite(topWeight) &&
    Number.isFinite(barWeight) &&
    topWeight < barWeight
  ) {
    hasError = true;
    setError(topWeightInput, "Top set must exceed the bar weight.");
    setError(barWeightInput, "Bar weight should be lighter than the top set.");
  }

  if (hasError) {
    return;
  }

  const roundedTopWeight = Math.max(roundToIncrement(topWeight, increment), barWeight);
  const rows = [];

  template.steps.forEach((step) => {
    const percentValue = step.pct;
    const percentLabel = `${Math.round(percentValue * 100)}%`;
    const rawWeight = topWeight * percentValue;
    let roundedWeight = roundToIncrement(rawWeight, increment);

    roundedWeight = Math.min(roundedWeight, roundedTopWeight);
    roundedWeight = Math.max(roundedWeight, barWeight);

    if (
      rows.length &&
      Math.abs(rows[rows.length - 1].weight - roundedWeight) < 0.0001
    ) {
      return;
    }

    rows.push({
      percent: percentLabel,
      weight: roundedWeight,
      reps: step.reps,
      note: step.note || "",
    });
  });

  rows.push({
    percent: "100%",
    weight: roundedTopWeight,
    reps: topReps,
    note: template.topNote || "",
    isTop: true,
  });

  warmupTableBody.innerHTML =
    rows.length > 0
      ? rows
          .map(
            (row, index) => `
        <tr${row.isTop ? ' class="top-set-row"' : ""}>
          <td>${row.isTop ? "Top Set" : `Set ${index + 1}`}</td>
          <td>${row.percent}</td>
          <td>${formatWeight(row.weight, increment)}</td>
          <td>${row.reps}</td>
          <td>${row.note || ""}</td>
        </tr>
      `.trim()
          )
          .join("")
      : `
        <tr>
          <td colspan="5" class="placeholder">No warm-up sets generated.</td>
        </tr>
      `.trim();
});

document.addEventListener("input", (event) => {
  const field = event.target;
  if (field.matches("input, select") && field.hasAttribute("data-error")) {
    setError(field);
  }
});

document.addEventListener("change", (event) => {
  const field = event.target;
  if (field.matches("select") && field.hasAttribute("data-error")) {
    setError(field);
  }
});
