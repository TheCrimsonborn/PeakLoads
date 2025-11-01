const oneRmForm = document.getElementById("one-rm-form");
const oneRmOutput = document.getElementById("one-rm-output");
const baseWeightInput = document.getElementById("base-weight-input");
const percentForm = document.getElementById("percent-form");
const percentTableBody = document.querySelector("#percent-table tbody");
const incrementSlider = document.getElementById("increment-input");
const incrementDisplay = document.getElementById("increment-display");
const unitToggleButtons = document.querySelectorAll("[data-unit]");
const languageSelect = document.getElementById("language-select");
const unitSuffixes = document.querySelectorAll("[data-unit-suffix]");
const tableWeightHeader = document.getElementById("table-weight-header");
const warmupForm = document.getElementById("warmup-form");
const warmupTopWeightInput = document.getElementById("warmup-top-weight-input");
const warmupTemplateSelect = document.getElementById("warmup-template-select");
const warmupTableBody = document.querySelector("#warmup-table tbody");
const warmupWeightHeader = document.getElementById("warmup-weight-header");

const textElements = {
  tagline: document.getElementById("tagline"),
  unitsLabel: document.getElementById("units-label"),
  languageLabel: document.getElementById("language-label"),
  oneRmTitle: document.getElementById("one-rm-title"),
  oneRmDescription: document.getElementById("one-rm-description"),
  weightLabel: document.getElementById("weight-label"),
  weightHelp: document.getElementById("weight-help"),
  repsLabel: document.getElementById("reps-label"),
  formulaLabel: document.getElementById("formula-label"),
  calculateButton: document.getElementById("calculate-button"),
  percentTitle: document.getElementById("percent-title"),
  percentDescription: document.getElementById("percent-description"),
  baseWeightLabel: document.getElementById("base-weight-label"),
  baseWeightHelp: document.getElementById("base-weight-help"),
  incrementLabel: document.getElementById("increment-label"),
  rangeLabel: document.getElementById("range-label"),
  rangeHelp: document.getElementById("range-help"),
  startSuffix: document.getElementById("start-suffix"),
  endSuffix: document.getElementById("end-suffix"),
  buildButton: document.getElementById("build-button"),
  tablePercentHeader: document.getElementById("table-percent-header"),
  footerText: document.getElementById("footer-text"),
  warmupTitle: document.getElementById("warmup-title"),
  warmupDescription: document.getElementById("warmup-description"),
  warmupTopWeightLabel: document.getElementById("warmup-top-weight-label"),
  warmupTopWeightHelp: document.getElementById("warmup-top-weight-help"),
  warmupTemplateLabel: document.getElementById("warmup-template-label"),
  warmupTemplateHelp: document.getElementById("warmup-template-help"),
  warmupBuildButton: document.getElementById("warmup-build-button"),
  warmupStageHeader: document.getElementById("warmup-stage-header"),
  warmupPercentHeader: document.getElementById("warmup-percent-header"),
  warmupRepsHeader: document.getElementById("warmup-reps-header"),
};

const COPY = {
  en: {
    tagline: "Your modern command center for one-rep maxes and training percentages.",
    unitsLabel: "UNITS",
    languageLabel: "LANGUAGE",
    languageOptions: {
      en: "English",
      tr: "Turkish",
      ru: "Russian",
    },
    oneRmTitle: "1RM Estimator",
    oneRmDescription: "Estimate your one-rep max using common formulas.",
    weightLabel: "Weight Lifted",
    weightHelp: "Enter the heaviest successful set.",
    repsLabel: "Repetitions",
    formulaLabel: "Formula",
    calculateButton: "Calculate 1RM",
    percentTitle: "Percentage Chart",
    percentDescription: "Generate working sets from your max or a target weight.",
    baseWeightLabel: "Base Weight",
    baseWeightHelp: "Use your estimated 1RM or any anchor weight.",
    incrementLabel: "Increment (%)",
    rangeLabel: "Range (%)",
    rangeHelp: "Common working sets fall between 60% and 90%.",
    startSuffix: "start",
    endSuffix: "end",
    buildButton: "Build Table",
    tablePercentHeader: "Percentage",
    tableWeightHeader: "Weight",
    tablePlaceholder: "Enter a base weight to see your working sets.",
    tableEmptyRange: "No values generated for that range.",
    oneRmResultPrefix: "Estimated 1RM",
    footerText: "PeakLoad keeps your training precise, intentional, and progressive.",
    warmupTitle: "Warm-Up Planner",
    warmupDescription: "Map out progressive sets before your heavy attempts.",
    warmupTopWeightLabel: "Top Set Weight",
    warmupTopWeightHelp: "Usually today's heaviest working weight or second-to-last single.",
    warmupTemplateLabel: "Template",
    warmupTemplateHelp: "Pick the pattern that fits the day's focus. You can tweak weights afterward.",
    warmupBuildButton: "Build Warm-Up",
    warmupStageHeader: "Set",
    warmupPercentHeader: "Percent",
    warmupWeightHeader: "Weight",
    warmupRepsHeader: "Reps",
    warmupPlaceholder: "Set your top set to see suggested warm-up sets.",
    warmupSetLabel: "Set",
    warmupTemplates: {
      classic: "Classic Ramp",
      topSingle: "Heavy Single Prep",
      volume: "Volume Builder",
    },
    errors: {
      invalidWeight: "Enter a valid weight.",
      invalidReps: "Reps must be between 1 and 20.",
      invalidFormula: "Select a formula.",
      invalidBaseWeight: "Enter a valid base weight.",
      invalidPercent: "Enter valid percentages.",
      startBelowEnd: "Start must be lower than end.",
      invalidIncrement: "Choose a positive increment.",
      invalidTopWeight: "Enter a valid top set weight.",
      invalidTemplate: "Select a warm-up template.",
    },
  },
  tr: {
    tagline:
      "Tek tekrar maksimumlarınızı ve antrenman yüzdelerinizi yönetmek için modern kontrol merkeziniz.",
    unitsLabel: "BİRİMLER",
    languageLabel: "DİL",
    languageOptions: {
      en: "İngilizce",
      tr: "Türkçe",
      ru: "Rusça",
    },
    oneRmTitle: "1TM Tahminleyici",
    oneRmDescription: "Yaygın formüllerle tek tekrar maksimumunuzu tahmin edin.",
    weightLabel: "Kaldırılan Ağırlık",
    weightHelp: "Başarıyla tamamladığınız en ağır seti girin.",
    repsLabel: "Tekrar",
    formulaLabel: "Formül",
    calculateButton: "1TM Hesapla",
    percentTitle: "Yüzde Tablosu",
    percentDescription: "Maksimumunuzdan veya hedef ağırlıktan çalışma setleri oluşturun.",
    baseWeightLabel: "Baz Ağırlık",
    baseWeightHelp: "Tahmini 1TM değerini veya referans alacağınız herhangi bir ağırlığı kullanın.",
    incrementLabel: "Artış (%)",
    rangeLabel: "Aralık (%)",
    rangeHelp: "Çalışma setleri genelde %60 ile %90 arasında olur.",
    startSuffix: "başlangıç",
    endSuffix: "bitiş",
    buildButton: "Tablo Oluştur",
    tablePercentHeader: "Yüzde",
    tableWeightHeader: "Ağırlık",
    tablePlaceholder: "Çalışma setlerini görmek için baz ağırlık girin.",
    tableEmptyRange: "Bu aralık için değer oluşturulamadı.",
    oneRmResultPrefix: "Tahmini 1TM",
    footerText: "PeakLoad antrenmanınızı tutarlı, hedefli ve ilerlemeci tutar.",
    warmupTitle: "Isınma Planlayıcı",
    warmupDescription: "Ağır denemelerden önce kademeli setlerinizi planlayın.",
    warmupTopWeightLabel: "Üst Set Ağırlığı",
    warmupTopWeightHelp: "Genellikle günün en ağır çalışma seti veya sondan bir önceki tek tekrar.",
    warmupTemplateLabel: "Şablon",
    warmupTemplateHelp: "Günün odağına uyan deseni seçin. Ağırlıkları sonradan ayarlayabilirsiniz.",
    warmupBuildButton: "Isınmayı Oluştur",
    warmupStageHeader: "Set",
    warmupPercentHeader: "Yüzde",
    warmupWeightHeader: "Ağırlık",
    warmupRepsHeader: "Tekrar",
    warmupPlaceholder: "Önerilen ısınma setlerini görmek için üst seti girin.",
    warmupSetLabel: "Set",
    warmupTemplates: {
      classic: "Klasik Ramp",
      topSingle: "Ağır Tek Hazırlığı",
      volume: "Hacim Yapıcı",
    },
    errors: {
      invalidWeight: "Geçerli bir ağırlık girin.",
      invalidReps: "Tekrar sayısı 1 ile 20 arasında olmalıdır.",
      invalidFormula: "Bir formül seçin.",
      invalidBaseWeight: "Geçerli bir baz ağırlık girin.",
      invalidPercent: "Geçerli yüzdeler girin.",
      startBelowEnd: "Başlangıç değeri bitişten düşük olmalıdır.",
      invalidIncrement: "Pozitif bir artış seçin.",
      invalidTopWeight: "Geçerli bir üst set ağırlığı girin.",
      invalidTemplate: "Bir ısınma şablonu seçin.",
    },
  },
  ru: {
    tagline:
      "Современный центр управления для расчета 1ПМ и тренировочных процентов.",
    unitsLabel: "ЕДИНИЦЫ",
    languageLabel: "ЯЗЫК",
    languageOptions: {
      en: "Английский",
      tr: "Турецкий",
      ru: "Русский",
    },
    oneRmTitle: "Калькулятор 1ПМ",
    oneRmDescription: "Оцените свой одноразовый максимум по распространенным формулам.",
    weightLabel: "Вес подхода",
    weightHelp: "Введите самый тяжелый успешно выполненный подход.",
    repsLabel: "Повторения",
    formulaLabel: "Формула",
    calculateButton: "Рассчитать 1ПМ",
    percentTitle: "Таблица процентов",
    percentDescription: "Сформируйте рабочие подходы от максимума или целевого веса.",
    baseWeightLabel: "Базовый вес",
    baseWeightHelp: "Используйте оценку 1ПМ или любой опорный вес.",
    incrementLabel: "Шаг (%)",
    rangeLabel: "Диапазон (%)",
    rangeHelp: "Рабочие подходы обычно находятся в пределах 60%–90%.",
    startSuffix: "начало",
    endSuffix: "конец",
    buildButton: "Построить таблицу",
    tablePercentHeader: "Процент",
    tableWeightHeader: "Вес",
    tablePlaceholder: "Введите базовый вес, чтобы увидеть рабочие подходы.",
    tableEmptyRange: "Для указанного диапазона значения не получены.",
    oneRmResultPrefix: "Оценочный 1ПМ",
    footerText: "PeakLoad помогает тренироваться точно, осознанно и прогрессивно.",
    warmupTitle: "Планировщик разминки",
    warmupDescription: "Составьте последовательность подходов перед тяжелыми попытками.",
    warmupTopWeightLabel: "Вес основного подхода",
    warmupTopWeightHelp: "Обычно самый тяжелый рабочий подход или предпоследний одиночный.",
    warmupTemplateLabel: "Шаблон",
    warmupTemplateHelp: "Выберите схему под задачу тренировки. Вес можно скорректировать позже.",
    warmupBuildButton: "Создать разминку",
    warmupStageHeader: "Подход",
    warmupPercentHeader: "Процент",
    warmupWeightHeader: "Вес",
    warmupRepsHeader: "Повторы",
    warmupPlaceholder: "Введите основной вес, чтобы получить предложения по разминке.",
    warmupSetLabel: "Подход",
    warmupTemplates: {
      classic: "Классическая пирамида",
      topSingle: "Выход на одиночный",
      volume: "Объемная подготовка",
    },
    errors: {
      invalidWeight: "Введите корректный вес.",
      invalidReps: "Количество повторений должно быть от 1 до 20.",
      invalidFormula: "Выберите формулу.",
      invalidBaseWeight: "Введите корректный базовый вес.",
      invalidPercent: "Введите корректные проценты.",
      startBelowEnd: "Начальное значение должно быть меньше конечного.",
      invalidIncrement: "Выберите положительный шаг.",
      invalidTopWeight: "Введите корректный вес основного подхода.",
      invalidTemplate: "Выберите шаблон разминки.",
    },
  },
};

const KG_TO_LB = 2.2046226218;
const UNIT_CONFIG = {
  kg: { label: "kg", step: 0.5, precision: 1, scale: 1 },
  lb: { label: "lb", step: 1, precision: 0, scale: KG_TO_LB },
};

const WARMUP_TEMPLATES = {
  classic: {
    sets: [
      { percent: 40, reps: 5 },
      { percent: 55, reps: 5 },
      { percent: 65, reps: 3 },
      { percent: 75, reps: 3 },
      { percent: 85, reps: 2 },
    ],
  },
  topSingle: {
    sets: [
      { percent: 30, reps: 5 },
      { percent: 50, reps: 3 },
      { percent: 65, reps: 3 },
      { percent: 75, reps: 2 },
      { percent: 85, reps: 1 },
      { percent: 92, reps: 1 },
    ],
  },
  volume: {
    sets: [
      { percent: 35, reps: 8 },
      { percent: 45, reps: 6 },
      { percent: 55, reps: 5 },
      { percent: 65, reps: 5 },
      { percent: 70, reps: 3 },
    ],
  },
};

const FORMULAS = {
  epley: (weight, reps) => weight * (1 + reps / 30),
  brzycki: (weight, reps) => weight * (36 / (37 - reps)),
  lombardi: (weight, reps) => weight * Math.pow(reps, 0.1),
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const toKg = (value, unit) => (unit === "kg" ? value : value / KG_TO_LB);
const fromKg = (valueKg, unit) => (unit === "kg" ? valueKg : valueKg * KG_TO_LB);

let currentUnit = "kg";
let currentLang = "en";
let lastOneRmKg = null;
let percentTableState = null;
let warmupState = null;

const getDictionary = () => COPY[currentLang] || COPY.en;

const formatWeightForDisplay = (valueKg) => {
  const config = UNIT_CONFIG[currentUnit];
  const valueInUnit = fromKg(valueKg, currentUnit);
  const rounded = Math.round(valueInUnit / config.step) * config.step;
  return `${rounded.toFixed(config.precision)} ${config.label}`;
};

const formatWeightForInput = (valueKg, unit = currentUnit) => {
  const config = UNIT_CONFIG[unit];
  const valueInUnit = fromKg(valueKg, unit);
  return valueInUnit.toFixed(config.precision);
};

const setActiveToggle = (buttons, datasetKey, activeValue) => {
  buttons.forEach((button) => {
    const value = button.dataset[datasetKey];
    const isActive = value === activeValue;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
};

const applyUnitToInputs = () => {
  const step = UNIT_CONFIG[currentUnit].step;
  oneRmForm.elements.weight.step = step;
  baseWeightInput.step = step;
  if (warmupTopWeightInput) {
    warmupTopWeightInput.step = step;
  }
};

const updateUnitMarkers = () => {
  const dict = getDictionary();
  const unitLabel = UNIT_CONFIG[currentUnit].label;
  unitSuffixes.forEach((suffix) => {
    suffix.textContent = unitLabel;
  });
  if (tableWeightHeader) {
    tableWeightHeader.textContent = `${dict.tableWeightHeader} (${unitLabel})`;
  }
  if (warmupWeightHeader) {
    warmupWeightHeader.textContent = `${dict.warmupWeightHeader} (${unitLabel})`;
  }
};

const refreshErrorMessages = () => {
  const dict = getDictionary();
  document.querySelectorAll("[data-error-key]").forEach((field) => {
    const key = field.getAttribute("data-error-key");
    if (!key) {
      return;
    }
    const container = field.closest(".field");
    const errorEl = container ? container.querySelector(".error-text") : null;
    if (errorEl && dict.errors[key]) {
      errorEl.textContent = dict.errors[key];
    }
  });
};

const renderOneRmOutput = () => {
  if (lastOneRmKg == null) {
    oneRmOutput.textContent = "";
    return;
  }
  const dict = getDictionary();
  oneRmOutput.textContent = `${dict.oneRmResultPrefix}: ${formatWeightForDisplay(lastOneRmKg)}`;
};

const renderPercentTable = () => {
  const dict = getDictionary();
  if (!percentTableState) {
    percentTableBody.innerHTML = `
      <tr>
        <td colspan="2" class="placeholder">${dict.tablePlaceholder}</td>
      </tr>
    `.trim();
    return;
  }

  const { baseWeightKg, startPercent, endPercent, increment } = percentTableState;
  const rows = [];
  for (let pct = startPercent; pct <= endPercent + 1e-9; pct += increment) {
    const percentLabel = `${Math.round(pct)}%`;
    const weightKg = baseWeightKg * (pct / 100);
    rows.push(`
      <tr>
        <td>${percentLabel}</td>
        <td>${formatWeightForDisplay(weightKg)}</td>
      </tr>
    `.trim());
  }

  percentTableBody.innerHTML =
    rows.length > 0
      ? rows.join("")
      : `
      <tr>
        <td colspan="2" class="placeholder">${dict.tableEmptyRange}</td>
      </tr>
      `.trim();
};

const updateLanguageOptions = (dict) => {
  if (!languageSelect || !dict.languageOptions) {
    return;
  }

  Array.from(languageSelect.options).forEach((option) => {
    const key = option.value;
    if (dict.languageOptions[key]) {
      option.textContent = dict.languageOptions[key];
    }
  });
};

const updateWarmupTemplateOptions = (dict) => {
  if (!warmupTemplateSelect || !dict.warmupTemplates) {
    return;
  }
  Array.from(warmupTemplateSelect.options).forEach((option) => {
    const key = option.value;
    if (dict.warmupTemplates[key]) {
      option.textContent = dict.warmupTemplates[key];
    }
  });
};

const renderWarmupTable = () => {
  if (!warmupTableBody) {
    return;
  }
  const dict = getDictionary();

  if (!warmupState) {
    warmupTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="placeholder">${dict.warmupPlaceholder}</td>
      </tr>
    `.trim();
    return;
  }

  const template = WARMUP_TEMPLATES[warmupState.templateKey];
  if (!template) {
    warmupState = null;
    renderWarmupTable();
    return;
  }

  const rows = template.sets.map((set, index) => {
    const percentValue = set.percent;
    const weightKg = warmupState.topWeightKg * (percentValue / 100);
    const weightLabel = formatWeightForDisplay(weightKg);
    const percentLabel = `${percentValue.toFixed(0)}%`;
    const repsLabel = `${set.reps}`;

    return `
      <tr>
        <td>${dict.warmupSetLabel} ${index + 1}</td>
        <td>${percentLabel}</td>
        <td>${weightLabel}</td>
        <td>${repsLabel}</td>
      </tr>
    `.trim();
  });

  warmupTableBody.innerHTML = rows.join("");
};

const prefillWarmupTopWeight = (weightKg, { allowOverwrite = false } = {}) => {
  if (!warmupTopWeightInput || !Number.isFinite(weightKg)) {
    return;
  }
  const hasExistingValue =
    typeof warmupTopWeightInput.value === "string" && warmupTopWeightInput.value.trim() !== "";
  if (hasExistingValue && !allowOverwrite) {
    return;
  }

  setWeightInputValue(warmupTopWeightInput, weightKg);

  if (warmupState) {
    warmupState = { ...warmupState, topWeightKg: weightKg };
    renderWarmupTable();
  }
};

const applyLocale = () => {
  const dict = getDictionary();
  textElements.tagline.textContent = dict.tagline;
  textElements.unitsLabel.textContent = dict.unitsLabel;
  textElements.languageLabel.textContent = dict.languageLabel;
  textElements.oneRmTitle.textContent = dict.oneRmTitle;
  textElements.oneRmDescription.textContent = dict.oneRmDescription;
  textElements.weightLabel.textContent = dict.weightLabel;
  textElements.weightHelp.textContent = dict.weightHelp;
  textElements.repsLabel.textContent = dict.repsLabel;
  textElements.formulaLabel.textContent = dict.formulaLabel;
  textElements.calculateButton.textContent = dict.calculateButton;
  textElements.percentTitle.textContent = dict.percentTitle;
  textElements.percentDescription.textContent = dict.percentDescription;
  textElements.baseWeightLabel.textContent = dict.baseWeightLabel;
  textElements.baseWeightHelp.textContent = dict.baseWeightHelp;
  textElements.incrementLabel.textContent = dict.incrementLabel;
  textElements.rangeLabel.textContent = dict.rangeLabel;
  textElements.rangeHelp.textContent = dict.rangeHelp;
  textElements.startSuffix.textContent = dict.startSuffix;
  textElements.endSuffix.textContent = dict.endSuffix;
  textElements.buildButton.textContent = dict.buildButton;
  textElements.tablePercentHeader.textContent = dict.tablePercentHeader;
  textElements.footerText.textContent = dict.footerText;
  textElements.warmupTitle.textContent = dict.warmupTitle;
  textElements.warmupDescription.textContent = dict.warmupDescription;
  textElements.warmupTopWeightLabel.textContent = dict.warmupTopWeightLabel;
  textElements.warmupTopWeightHelp.textContent = dict.warmupTopWeightHelp;
  textElements.warmupTemplateLabel.textContent = dict.warmupTemplateLabel;
  textElements.warmupTemplateHelp.textContent = dict.warmupTemplateHelp;
  textElements.warmupBuildButton.textContent = dict.warmupBuildButton;
  textElements.warmupStageHeader.textContent = dict.warmupStageHeader;
  textElements.warmupPercentHeader.textContent = dict.warmupPercentHeader;
  textElements.warmupRepsHeader.textContent = dict.warmupRepsHeader;

  updateLanguageOptions(dict);
  updateWarmupTemplateOptions(dict);
  if (languageSelect) {
    languageSelect.value = currentLang;
  }
  updateUnitMarkers();
  refreshErrorMessages();
  renderOneRmOutput();
  renderPercentTable();
  renderWarmupTable();
};

const setError = (field, messageKey) => {
  const container = field.closest(".field");
  let errorEl = container ? container.querySelector(".error-text") : null;

  if (!messageKey) {
    field.removeAttribute("data-error");
    field.removeAttribute("data-error-key");
    if (errorEl) {
      errorEl.remove();
    }
    return;
  }

  const dict = getDictionary();
  const message = dict.errors[messageKey] || messageKey;
  field.setAttribute("data-error", "true");
  field.setAttribute("data-error-key", messageKey);

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

const convertInputValue = (input, fromUnit, toUnit) => {
  if (!input.value) {
    return;
  }
  const numericValue = Number(input.value);
  if (!Number.isFinite(numericValue)) {
    return;
  }
  const valueKg = toKg(numericValue, fromUnit);
  const converted = fromKg(valueKg, toUnit);
  input.value = converted.toFixed(UNIT_CONFIG[toUnit].precision);
};

const setWeightInputValue = (input, valueKg) => {
  input.value = formatWeightForInput(valueKg);
};

const handleUnitChange = (nextUnit) => {
  const previousUnit = currentUnit;
  if (previousUnit === nextUnit) {
    return;
  }
  convertInputValue(oneRmForm.elements.weight, previousUnit, nextUnit);
  convertInputValue(baseWeightInput, previousUnit, nextUnit);
  if (warmupTopWeightInput) {
    convertInputValue(warmupTopWeightInput, previousUnit, nextUnit);
  }
  currentUnit = nextUnit;
  setActiveToggle(unitToggleButtons, "unit", currentUnit);
  applyUnitToInputs();
  updateUnitMarkers();
  renderOneRmOutput();
  renderPercentTable();
  renderWarmupTable();
};

const handleLanguageChange = (nextLang) => {
  if (!nextLang || currentLang === nextLang) {
    if (languageSelect && languageSelect.value !== currentLang) {
      languageSelect.value = currentLang;
    }
    return;
  }

  currentLang = nextLang;
  if (languageSelect && languageSelect.value !== currentLang) {
    languageSelect.value = currentLang;
  }
  applyLocale();
};

incrementSlider.addEventListener("input", () => {
  incrementDisplay.textContent = `${incrementSlider.value}%`;
});

unitToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedUnit = button.dataset.unit;
    if (selectedUnit) {
      handleUnitChange(selectedUnit);
    }
  });
});

if (languageSelect) {
  languageSelect.addEventListener("change", (event) => {
    handleLanguageChange(event.target.value);
  });
}

oneRmForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const weightField = oneRmForm.elements.weight;
  const repsField = oneRmForm.elements.reps;
  const formulaField = oneRmForm.elements.formula;

  const weightValue = Number(weightField.value);
  const reps = Number(repsField.value);
  const formulaKey = formulaField.value;

  let hasError = false;
  let weightKg = Number.isFinite(weightValue) ? toKg(weightValue, currentUnit) : NaN;

  if (!Number.isFinite(weightValue) || weightValue <= 0) {
    hasError = true;
    setError(weightField, "invalidWeight");
  } else {
    setError(weightField);
  }

  if (!Number.isFinite(reps) || reps < 1 || reps > 20) {
    hasError = true;
    setError(repsField, "invalidReps");
  } else {
    setError(repsField);
  }

  if (!FORMULAS[formulaKey]) {
    hasError = true;
    setError(formulaField, "invalidFormula");
  } else {
    setError(formulaField);
  }

  if (hasError) {
    oneRmOutput.textContent = "";
    return;
  }

  const estimatedOneRmKg = FORMULAS[formulaKey](weightKg, reps);
  const normalizedOneRmKg = Math.max(estimatedOneRmKg, weightKg);
  const roundedOneRmKg = Math.round(normalizedOneRmKg * 10) / 10;

  lastOneRmKg = roundedOneRmKg;
  renderOneRmOutput();

  if (!baseWeightInput.value) {
    setWeightInputValue(baseWeightInput, roundedOneRmKg);
  }

  prefillWarmupTopWeight(roundedOneRmKg);
});

percentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const baseWeightField = percentForm.elements.baseWeight;
  const startPercentField = percentForm.elements.startPercent;
  const endPercentField = percentForm.elements.endPercent;
  const incrementField = percentForm.elements.increment;

  const baseWeightValue = Number(baseWeightField.value);
  const startPercent = Number(startPercentField.value);
  const endPercent = Number(endPercentField.value);
  const increment = Number(incrementField.value);

  let hasError = false;
  const baseWeightKg = Number.isFinite(baseWeightValue) ? toKg(baseWeightValue, currentUnit) : NaN;

  if (!Number.isFinite(baseWeightValue) || baseWeightValue <= 0) {
    hasError = true;
    setError(baseWeightField, "invalidBaseWeight");
  } else {
    setError(baseWeightField);
  }

  if (!Number.isFinite(startPercent) || !Number.isFinite(endPercent)) {
    hasError = true;
    setError(startPercentField, "invalidPercent");
    setError(endPercentField, "invalidPercent");
  } else {
    setError(startPercentField);
    setError(endPercentField);
  }

  if (Number.isFinite(startPercent) && Number.isFinite(endPercent) && startPercent >= endPercent) {
    hasError = true;
    setError(startPercentField, "startBelowEnd");
  }

  if (!Number.isFinite(increment) || increment <= 0) {
    hasError = true;
    setError(incrementField, "invalidIncrement");
  } else {
    setError(incrementField);
  }

  if (hasError) {
    return;
  }

  const boundedStart = clamp(startPercent, 40, 120);
  const boundedEnd = clamp(endPercent, boundedStart + increment, 120);

  percentTableState = {
    baseWeightKg,
    startPercent: boundedStart,
    endPercent: boundedEnd,
    increment,
  };

  const warmupTopWeightKg = baseWeightKg * (boundedEnd / 100);
  prefillWarmupTopWeight(warmupTopWeightKg);

  renderPercentTable();
});

if (warmupForm) {
  warmupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const topWeightField = warmupForm.elements.topWeight;
    const templateField = warmupForm.elements.template;

    const topWeightValue = Number(topWeightField.value);
    const templateKey = templateField.value;

    let hasError = false;

    if (!Number.isFinite(topWeightValue) || topWeightValue <= 0) {
      hasError = true;
      setError(topWeightField, "invalidTopWeight");
    } else {
      setError(topWeightField);
    }

    if (!WARMUP_TEMPLATES[templateKey]) {
      hasError = true;
      setError(templateField, "invalidTemplate");
    } else {
      setError(templateField);
    }

    if (hasError) {
      return;
    }

    const topWeightKg = toKg(topWeightValue, currentUnit);

    warmupState = {
      topWeightKg,
      templateKey,
    };

    renderWarmupTable();
  });
}

if (warmupTemplateSelect) {
  warmupTemplateSelect.addEventListener("change", () => {
    if (!warmupState) {
      return;
    }
    const templateKey = warmupTemplateSelect.value;
    if (!WARMUP_TEMPLATES[templateKey]) {
      return;
    }
    warmupState = { ...warmupState, templateKey };
    renderWarmupTable();
  });
}

if (warmupTopWeightInput) {
  warmupTopWeightInput.addEventListener("input", () => {
    if (!warmupState) {
      return;
    }
    const topWeightValue = Number(warmupTopWeightInput.value);
    if (!Number.isFinite(topWeightValue) || topWeightValue <= 0) {
      return;
    }
    warmupState = { ...warmupState, topWeightKg: toKg(topWeightValue, currentUnit) };
    renderWarmupTable();
  });
}

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

const init = () => {
  setActiveToggle(unitToggleButtons, "unit", currentUnit);
  if (languageSelect) {
    languageSelect.value = currentLang;
  }
  applyUnitToInputs();
  applyLocale();
};

init();
