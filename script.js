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
const rirLastForm = document.getElementById("rir-last-form");
const rirLastWeightInput = document.getElementById("rir-last-weight");
const rirLastRepsInput = document.getElementById("rir-last-reps");
const rirLastRirInput = document.getElementById("rir-last-rir");
const rirLastOutput = document.getElementById("rir-last-output");
const rirNextForm = document.getElementById("rir-next-form");
const rirNextRepsInput = document.getElementById("rir-next-reps");
const rirNextRirInput = document.getElementById("rir-next-rir");
const rirNextOutput = document.getElementById("rir-next-output");

const textElements = {
  tagline: document.getElementById("tagline"),
  heroHeading: document.getElementById("hero-title"),
  heroTagline: document.getElementById("hero-tagline"),
  heroPrimaryCta: document.getElementById("hero-primary-cta"),
  heroSecondaryCta: document.getElementById("hero-secondary-cta"),
  heroPercentCta: document.getElementById("hero-percent-cta"),
  heroRirCta: document.getElementById("hero-rir-cta"),
  heroHighlightOne: document.getElementById("hero-highlight-1"),
  heroHighlightTwo: document.getElementById("hero-highlight-2"),
  heroHighlightThree: document.getElementById("hero-highlight-3"),
  heroHighlightFour: document.getElementById("hero-highlight-4"),
  heroCardTitle: document.getElementById("hero-card-title"),
  heroSnapshotInputsTitle: document.getElementById("hero-snapshot-inputs-title"),
  heroSnapshotInputsDesc: document.getElementById("hero-snapshot-inputs-desc"),
  heroSnapshotSetsTitle: document.getElementById("hero-snapshot-sets-title"),
  heroSnapshotSetsDesc: document.getElementById("hero-snapshot-sets-desc"),
  heroSnapshotWarmupTitle: document.getElementById("hero-snapshot-warmup-title"),
  heroSnapshotWarmupDesc: document.getElementById("hero-snapshot-warmup-desc"),
  heroSnapshotRirTitle: document.getElementById("hero-snapshot-rir-title"),
  heroSnapshotRirDesc: document.getElementById("hero-snapshot-rir-desc"),
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
  rirTitle: document.getElementById("rir-title"),
  rirDescription: document.getElementById("rir-description"),
  rirLastTitle: document.getElementById("rir-last-title"),
  rirLastWeightLabel: document.getElementById("rir-last-weight-label"),
  rirLastRepsLabel: document.getElementById("rir-last-reps-label"),
  rirLastRirLabel: document.getElementById("rir-last-rir-label"),
  rirLastSubmit: document.querySelector('[data-i18n="rirLastSubmit"]'),
  rirNextTitle: document.getElementById("rir-next-title"),
  rirNextRepsLabel: document.getElementById("rir-next-reps-label"),
  rirNextRirLabel: document.getElementById("rir-next-rir-label"),
  rirNextSubmit: document.querySelector('[data-i18n="rirNextSubmit"]'),
  rirNote: document.getElementById("rir-note"),
  footerRights: document.getElementById("footer-rights"),
};

const COPY = {
  en: {
    tagline: "Your modern command center for one-rep maxes and training percentages.",
    heroHeading: "Plan Every Session With Confidence",
    heroTagline:
      "Estimate your 1RM, map working sets, and walk onto the platform with a purpose-built warm-up sequence.",
    heroPrimaryCta: "Start Calculating",
    heroSecondaryCta: "Plan Warm-Up",
    heroPercentCta: "Build Percentages",
    heroRirCta: "Translate RIR",

    heroHighlightOne: "Trusted Epley, Brzycki, and Lombardi estimators",
    heroHighlightTwo: "Auto-built warm-up templates for heavy singles or volume days",
    heroHighlightThree: "Instant unit and language toggles for global lifters",
    heroHighlightFour: "RIR-based projections for autoregulated training",
    heroCardTitle: "Session Snapshot",
    heroSnapshotInputsTitle: "1RM Inputs",

    heroSnapshotInputsDesc: "Weight, reps, and formula of your choice",
    heroSnapshotSetsTitle: "Working Sets",
    heroSnapshotSetsDesc: "Custom percent range with flexible increments",
    heroSnapshotWarmupTitle: "Warm-Up Flow",
    heroSnapshotWarmupDesc: "Progressive sets tailored to your top weight",
    heroSnapshotRirTitle: "RIR Translator",
    heroSnapshotRirDesc: "Convert last-set data into target weights for the next effort",
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
    footerRights: "All rights reserved",
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
    rirTitle: "RIR Translator",
    rirDescription: "Convert last set data into estimated 1RM and target weights using Reps In Reserve.",
    rirLastTitle: "Last Set",
    rirLastWeightLabel: "Weight",
    rirLastRepsLabel: "Reps",
    rirLastRirLabel: "RIR",
    rirLastSubmit: "Translate Set",
    rirNextTitle: "Next Set",
    rirNextRepsLabel: "Target Reps",
    rirNextRirLabel: "Target RIR",
    rirNextSubmit: "Calculate Weight",
    rirNote:
      "RPE (Rate of Perceived Exertion) and RIR (Reps In Reserve) help you autoregulate training stress based on how many reps you have left in the tank.",
    rirLastResultPrefix: "Estimated e1RM: {value}",
    rirNextResultPrefix: "Suggested working weight: {value}",
    rirNeedLastSet: "Log your last set above to unlock the next set recommendation.",
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
      invalidRir: "RIR must be between 0 and 10.",
    },
  },
  tr: {
    tagline:
      "Tek tekrar maksimumlarınızı ve antrenman yüzdelerinizi yönetmek için modern kontrol merkeziniz.",
    heroHeading: "Her Antrenmanı Güvenle Planlayın",
    heroTagline:
      "1TM'inizi tahmin edin, çalışma setlerini planlayın ve amaca yönelik bir ısınmayla platforma çıkın.",
    heroPrimaryCta: "Hesaplamaya Başla",
    heroSecondaryCta: "Isınmayı Planla",
    heroPercentCta: "Yüzde Tablosu Oluştur",
    heroRirCta: "RIR Çevir",

    heroHighlightOne: "Epley, Brzycki ve Lombardi formüllerine güvenin",
    heroHighlightTwo: "Ağır tekler veya hacim günleri için hazır ısınma şablonları",
    heroHighlightThree: "Global sporcular için anında birim ve dil değişimi",
    heroHighlightFour: "RIR tabanlı hedef ağırlık önerileri",

    heroCardTitle: "Seans Özeti",
    heroSnapshotInputsTitle: "1TM Girdileri",
    heroSnapshotInputsDesc: "Seçtiğiniz ağırlık, tekrar ve formül",
    heroSnapshotSetsTitle: "Çalışma Setleri",
    heroSnapshotSetsDesc: "Esnek artışlarla özelleştirilebilir yüzdeler",
    heroSnapshotWarmupTitle: "Isınma Akışı",
    heroSnapshotWarmupDesc: "Üst setinize göre kademeli ısınma setleri",
    heroSnapshotRirTitle: "RIR Çevirici",
    heroSnapshotRirDesc: "Son set verilerini bir sonraki set için önerilen ağırlığa çevirin",

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
    footerRights: "Tüm hakları saklıdır",
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
    rirTitle: "RIR Çevirici",
    rirDescription: "Son set verilerini RIR kullanarak tahmini 1TM ve hedef ağırlıklara dönüştürün.",
    rirLastTitle: "Son Set",
    rirLastWeightLabel: "Ağırlık",
    rirLastRepsLabel: "Tekrar",
    rirLastRirLabel: "RIR",
    rirLastSubmit: "Seti Çevir",
    rirNextTitle: "Sonraki Set",
    rirNextRepsLabel: "Hedef Tekrar",
    rirNextRirLabel: "Hedef RIR",
    rirNextSubmit: "Ağırlığı Hesapla",
    rirNote:
      "RPE (Algılanan Zorluk Derecesi) ve RIR (Rezerve Tekrar) günlük performansınıza göre antrenman yükünü ayarlamaya yardımcı olur.",
    rirLastResultPrefix: "Tahmini 1TM: {value}",
    rirNextResultPrefix: "Önerilen çalışma ağırlığı: {value}",
    rirNeedLastSet: "Sonraki set önerisi için önce son setinizi girin.",
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
      invalidRir: "RIR 0 ile 10 arasında olmalıdır.",
    },
  },
  ru: {
    tagline:
      "Современный центр управления для расчета 1ПМ и тренировочных процентов.",
    heroHeading: "Планируйте каждую тренировку с уверенностью",
    heroTagline:
      "Оцените 1ПМ, распишите рабочие подходы и выходите на помост с продуманной разминкой.",
    heroPrimaryCta: "Начать расчёт",
    heroSecondaryCta: "Построить разминку",
    heroPercentCta: "Построить проценты",
    heroRirCta: "Перевести RIR",

    heroHighlightOne: "Надёжные формулы Эпли, Бжицкого и Ломбарди",
    heroHighlightTwo: "Готовые шаблоны разминки для тяжёлых одиночных и объёмных дней",
    heroHighlightThree: "Мгновенное переключение единиц и языка для спортсменов по всему миру",
    heroHighlightFour: "RIR-проекции для авторегулируемых тренировок",

    heroCardTitle: "Краткий обзор сессии",
    heroSnapshotInputsTitle: "Данные 1ПМ",
    heroSnapshotInputsDesc: "Вес, повторы и выбранная формула",
    heroSnapshotSetsTitle: "Рабочие подходы",
    heroSnapshotSetsDesc: "Гибкие диапазоны процентов с настраиваемым шагом",
    heroSnapshotWarmupTitle: "Разминочный план",
    heroSnapshotWarmupDesc: "Постепенные подходы, привязанные к основному весу",
    heroSnapshotRirTitle: "Переводчик RIR",
    heroSnapshotRirDesc: "Переводит данные последнего подхода в рекомендуемый вес следующего",

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
    footerRights: "Все права защищены",
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
    rirTitle: "Переводчик RIR",
    rirDescription: "Переведите данные последнего подхода в оценочный 1ПМ и рабочие веса с помощью RIR.",
    rirLastTitle: "Последний подход",
    rirLastWeightLabel: "Вес",
    rirLastRepsLabel: "Повторы",
    rirLastRirLabel: "RIR",
    rirLastSubmit: "Перевести подход",
    rirNextTitle: "Следующий подход",
    rirNextRepsLabel: "Целевые повторы",
    rirNextRirLabel: "Целевой RIR",
    rirNextSubmit: "Рассчитать вес",
    rirNote:
      "RPE (Rate of Perceived Exertion) и RIR (Reps In Reserve) позволяют регулировать нагрузку в зависимости от того, сколько повторов осталось в запасе.",
    rirLastResultPrefix: "Оценочный 1ПМ: {value}",
    rirNextResultPrefix: "Рекомендуемый рабочий вес: {value}",
    rirNeedLastSet: "Сначала внесите данные последнего подхода, чтобы получить рекомендацию.",
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
      invalidRir: "Введите корректный RIR от 0 до 10.",
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

const formatTemplateWithValue = (template, value) => {
  if (typeof template !== "string") {
    return String(value);
  }
  return template.includes("{value}") ? template.replace("{value}", value) : `${template} ${value}`;
};

let currentUnit = "kg";
let currentLang = "en";
let lastOneRmKg = null;
let percentTableState = null;
let warmupState = null;
let rirState = { last: null, next: null, nextMessageKey: null };

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
  if (rirLastWeightInput) {
    rirLastWeightInput.step = step;
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
  const weightHeaderLabel = `${dict.tableWeightHeader} (${UNIT_CONFIG[currentUnit].label})`;
  const rows = [];
  for (let pct = startPercent; pct <= endPercent + 1e-9; pct += increment) {
    const percentLabel = `${Math.round(pct)}%`;
    const weightKg = baseWeightKg * (pct / 100);
    rows.push(`
      <tr>
        <td data-label="${dict.tablePercentHeader}">${percentLabel}</td>
        <td data-label="${weightHeaderLabel}">${formatWeightForDisplay(weightKg)}</td>
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

  const warmupWeightHeaderLabel = `${dict.warmupWeightHeader} (${UNIT_CONFIG[currentUnit].label})`;
  const rows = template.sets.map((set, index) => {
    const percentValue = set.percent;
    const weightKg = warmupState.topWeightKg * (percentValue / 100);
    const weightLabel = formatWeightForDisplay(weightKg);
    const percentLabel = `${percentValue.toFixed(0)}%`;
    const repsLabel = `${set.reps}`;

    return `
      <tr>
        <td data-label="${dict.warmupStageHeader}">${dict.warmupSetLabel} ${index + 1}</td>
        <td data-label="${dict.warmupPercentHeader}">${percentLabel}</td>
        <td data-label="${warmupWeightHeaderLabel}">${weightLabel}</td>
        <td data-label="${dict.warmupRepsHeader}">${repsLabel}</td>
      </tr>
    `.trim();
  });

  warmupTableBody.innerHTML = rows.join("");
};

const calculateE1rmFromRir = (weightKg, reps, rir) => {
  const repsToFailure = reps + rir;
  return weightKg * (1 + repsToFailure / 30);
};

const calculateWeightFromRir = (e1rmKg, reps, rir) => {
  const repsToFailure = reps + rir;
  return e1rmKg / (1 + repsToFailure / 30);
};

const renderRirOutputs = () => {
  if (!rirLastOutput || !rirNextOutput) {
    return;
  }

  const dict = getDictionary();

  if (rirState.last) {
    const displayValue = formatWeightForDisplay(rirState.last.e1rmKg);
    rirLastOutput.textContent = formatTemplateWithValue(dict.rirLastResultPrefix, displayValue);
  } else {
    rirLastOutput.textContent = "";
  }

  if (rirState.next) {
    const displayValue = formatWeightForDisplay(rirState.next.weightKg);
    rirNextOutput.textContent = formatTemplateWithValue(dict.rirNextResultPrefix, displayValue);
  } else if (rirState.nextMessageKey === "needLastSet") {
    rirNextOutput.textContent = dict.rirNeedLastSet;
  } else {
    rirNextOutput.textContent = "";
  }
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
  textElements.heroHeading.textContent = dict.heroHeading;
  textElements.heroTagline.textContent = dict.heroTagline;
  textElements.heroPrimaryCta.textContent = dict.heroPrimaryCta;
  textElements.heroSecondaryCta.textContent = dict.heroSecondaryCta;
  textElements.heroPercentCta.textContent = dict.heroPercentCta;
  textElements.heroRirCta.textContent = dict.heroRirCta;
  textElements.heroHighlightOne.textContent = dict.heroHighlightOne;
  textElements.heroHighlightTwo.textContent = dict.heroHighlightTwo;
  textElements.heroHighlightThree.textContent = dict.heroHighlightThree;
  textElements.heroHighlightFour.textContent = dict.heroHighlightFour;
  textElements.heroCardTitle.textContent = dict.heroCardTitle;
  textElements.heroSnapshotInputsTitle.textContent = dict.heroSnapshotInputsTitle;
  textElements.heroSnapshotInputsDesc.textContent = dict.heroSnapshotInputsDesc;
  textElements.heroSnapshotSetsTitle.textContent = dict.heroSnapshotSetsTitle;
  textElements.heroSnapshotSetsDesc.textContent = dict.heroSnapshotSetsDesc;
  textElements.heroSnapshotWarmupTitle.textContent = dict.heroSnapshotWarmupTitle;
  textElements.heroSnapshotWarmupDesc.textContent = dict.heroSnapshotWarmupDesc;
  textElements.heroSnapshotRirTitle.textContent = dict.heroSnapshotRirTitle;
  textElements.heroSnapshotRirDesc.textContent = dict.heroSnapshotRirDesc;
  textElements.rirTitle.textContent = dict.rirTitle;
  textElements.rirDescription.textContent = dict.rirDescription;
  textElements.rirLastTitle.textContent = dict.rirLastTitle;
  textElements.rirLastWeightLabel.textContent = dict.rirLastWeightLabel;
  textElements.rirLastRepsLabel.textContent = dict.rirLastRepsLabel;
  textElements.rirLastRirLabel.textContent = dict.rirLastRirLabel;
  textElements.rirLastSubmit.textContent = dict.rirLastSubmit;
  textElements.rirNextTitle.textContent = dict.rirNextTitle;
  textElements.rirNextRepsLabel.textContent = dict.rirNextRepsLabel;
  textElements.rirNextRirLabel.textContent = dict.rirNextRirLabel;
  textElements.rirNextSubmit.textContent = dict.rirNextSubmit;
  textElements.rirNote.textContent = dict.rirNote;
  textElements.footerRights.textContent = dict.footerRights;
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
  renderRirOutputs();
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
  if (rirLastWeightInput) {
    convertInputValue(rirLastWeightInput, previousUnit, nextUnit);
  }
  currentUnit = nextUnit;
  setActiveToggle(unitToggleButtons, "unit", currentUnit);
  applyUnitToInputs();
  updateUnitMarkers();
  renderOneRmOutput();
  renderPercentTable();
  renderWarmupTable();
  renderRirOutputs();
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

if (rirLastForm) {
  rirLastForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const weightValue = Number(rirLastWeightInput.value);
    const repsValue = Number(rirLastRepsInput.value);
    const rirValue = Number(rirLastRirInput.value);

    let hasError = false;

    if (!Number.isFinite(weightValue) || weightValue <= 0) {
      hasError = true;
      setError(rirLastWeightInput, "invalidWeight");
    } else {
      setError(rirLastWeightInput);
    }

    if (!Number.isFinite(repsValue) || repsValue < 1 || repsValue > 30) {
      hasError = true;
      setError(rirLastRepsInput, "invalidReps");
    } else {
      setError(rirLastRepsInput);
    }

    if (!Number.isFinite(rirValue) || rirValue < 0 || rirValue > 10) {
      hasError = true;
      setError(rirLastRirInput, "invalidRir");
    } else {
      setError(rirLastRirInput);
    }

    if (hasError) {
      rirState = { last: null, next: null, nextMessageKey: null };
      renderRirOutputs();
      return;
    }

    const weightKg = toKg(weightValue, currentUnit);
    const repsToFailure = repsValue + rirValue;

    if (!Number.isFinite(repsToFailure) || repsToFailure <= 0) {
      setError(rirLastRirInput, "invalidRir");
      rirState = { last: null, next: null, nextMessageKey: null };
      renderRirOutputs();
      return;
    }

    const e1rmKg = calculateE1rmFromRir(weightKg, repsValue, rirValue);

    rirState = {
      last: { weightKg, reps: repsValue, rir: rirValue, e1rmKg },
      next: null,
      nextMessageKey: null,
    };

    renderRirOutputs();
  });
}

if (rirNextForm) {
  rirNextForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const repsValue = Number(rirNextRepsInput.value);
    const rirValue = Number(rirNextRirInput.value);

    let hasError = false;

    if (!Number.isFinite(repsValue) || repsValue < 1 || repsValue > 30) {
      hasError = true;
      setError(rirNextRepsInput, "invalidReps");
    } else {
      setError(rirNextRepsInput);
    }

    if (!Number.isFinite(rirValue) || rirValue < 0 || rirValue > 10) {
      hasError = true;
      setError(rirNextRirInput, "invalidRir");
    } else {
      setError(rirNextRirInput);
    }

    if (!rirState.last) {
      rirState = { ...rirState, next: null, nextMessageKey: "needLastSet" };
      renderRirOutputs();
      return;
    }

    if (hasError) {
      return;
    }

    const weightKg = calculateWeightFromRir(rirState.last.e1rmKg, repsValue, rirValue);
    rirState = {
      ...rirState,
      next: { reps: repsValue, rir: rirValue, weightKg },
      nextMessageKey: null,
    };

    renderRirOutputs();
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
