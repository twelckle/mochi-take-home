import React, { useState, useEffect } from "react";
import "./index.css";
import { ResultsScreen } from "./components/ResultsScreen";
import type { Method, MethodId } from "./components/ResultsScreen";
import combinedPill from "./assets/combinedPill.png";
import progestinPill from "./assets/progestinPill.png";
import patch from "./assets/patch.png";
import nuvaring from "./assets/nuvaring.png";
import annovera from "./assets/annovera.png";
import shot from "./assets/shot.png";
import diaphragm from "./assets/diaphragm.png";

// ---- Question model ----

type Step = "intro" | "questions" | "results";

type YesNoAnswer = "yes" | "no";

type QuestionKind = "yesno" | "number";

interface BaseQuestion {
  id: string;
  prompt: string;
  kind: QuestionKind;
}

interface YesNoQuestion extends BaseQuestion {
  kind: "yesno";
}

interface NumberQuestion extends BaseQuestion {
  kind: "number";
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}

type Question = YesNoQuestion | NumberQuestion;

const QUESTIONS: Question[] = [
  {
    id: "age",
    prompt: "How old are you?",
    kind: "number",
    min: 13,
    max: 110,
    step: 1,
    defaultValue: 28
  },
  {
    id: "smoking",
    prompt: "Do you smoke cigarettes?",
    kind: "yesno"
  },
  {
    id: "clottingHistory",
    prompt: "Have you ever had a blood clot, stroke, or heart attack?",
    kind: "yesno"
  },
  {
    id: "hypertension",
    prompt: "Have you ever been told you have high blood pressure (hypertension)?",
    kind: "yesno"
  },
  {
    id: "migraineWithAura",
    prompt:
      "Do you get migraines with aura (flashing lights, zig-zag lines, or vision changes before the headache)?",
    kind: "yesno"
  },
  {
    id: "bmiHigh",
    prompt: "Is your BMI around 30 or higher?",
    kind: "yesno"
  },
  {
    id: "breastfeeding",
    prompt: "Are you currently breastfeeding?",
    kind: "yesno"
  },
  {
    id: "breastCancerHistory",
    prompt: "Have you ever been diagnosed with breast cancer?",
    kind: "yesno"
  },
  {
    id: "dailyPillStrict",
    prompt: "Can you reliably take a pill at around the same time every day?",
    kind: "yesno"
  },
  {
    id: "preferNoHormones",
    prompt: "Is using a non-hormonal birth control method a high priority for you?",
    kind: "yesno"
  },
  {
    id: "pregnantSoon",
    prompt: "Are you hoping to become pregnant in the next 1–2 years?",
    kind: "yesno"
  }
];

type AnswerValue = YesNoAnswer | number;

type Answers = {
  [id: string]: AnswerValue | undefined;
};

// ---- Methods (results) ----

const METHODS: Method[] = [
  {
    id: "combinedPill",
    name: "Pill (Combined Oral Contraceptives (COC))",
    type: "Estrogen + Progestin",
    tagline: "Daily",
    notes: "Must be taken daily at a consistent time.",
    icon: combinedPill,
    efficacyPerfectUse: "99%",
    efficacyTypicalUse: "93%",
    hormones: "Estrogen + Progestin",
    frequency: "Daily",
    mechanism:
      "Stopping ovulation, thickening cervical mucus, and thinning the uterine lining",
    pros: [
      "Provides flexibility in managing or suppressing periods",
      "Fertility typically returns quickly after stopping",
      "Can lead to lighter, more regular cycles",
      "Helps decrease menstrual cramps"
    ],
    cons: [
      "Daily adherence required",
      "Efficacy decreases when not taken regularly at the set time"
    ],
    shouldAvoid: [
      "Estrogen-related contraindications",
      "History of Breast Cancer"
    ],
    sideEffects: [
      "Headaches",
      "Nausea",
      "Sore breasts",
      "Bloating",
      "Spotting or bleeding between periods"
    ],
    bestFor: [
      "Want cycle control",
      "Prefer daily routines",
      "Can reliably take a daily pill"
    ]
  },
  {
    id: "progestinPill",
    name: "Pill (Progestin-only)",
    type: "Progestin",
    tagline: "Daily",
    notes: "",
    icon: progestinPill,
    efficacyPerfectUse: "99%",
    efficacyTypicalUse: "93%",
    hormones: "Progestin",
    frequency: "Daily",
    mechanism: "Thickens cervical mucus and stopping ovulation",
    pros: [
      "Safe to use while breastfeeding",
      "Estrogen-free option"
    ],
    cons: [
      "Requires very strict daily timing for effectiveness",
      "More sensitive to timing errors, which may reduce real-world effectiveness",
      "Not recommended for patients with a history of breast cancer"
    ],
    shouldAvoid: [
      "History of breast cancer",
      "Cannot commit to consistent, same-time daily dosing",
      "taking medications that interfere with progestin effectiveness"
    ],
    sideEffects: [
      "Breast tenderness.",
      "Nausea.",
      "Headaches.",
      "Weight changes.",
      "Acne.",
      "Increased hair growth"
    ],
    bestFor: [
      "Prefer or require an estrogen-free contraceptive",
      "Are breastfeeding",
      "Can reliably take the pill at the same time every day"
    ]
  },
  {
    id: "patch",
    name: "Patch",
    type: "Estrogen + Progestin",
    tagline: "Weekly",
    notes: "",
    icon: patch,
    efficacyPerfectUse: "99%",
    efficacyTypicalUse: "94%",
    hormones: "Estrogen + Progestin",
    frequency: "Weekly",
    mechanism: "Skin absorbs hormones which prevent ovulation",
    pros: [
      "Only needs to be changed once a week, making it more convenient than daily methods",
      "Provides consistent hormone dosing",
      "May improve acne",
      "May reduce menstrual cramps and make periods more regular"
    ],
    cons: [
      "May cause mild skin irritation at the patch site",
      "Visible on the skin, which some patients may not prefer",
      "Slightly less effective in patients where BMI >= 30 / LBS > 198",
      "Must be replaced on the same day each week to maintain effectiveness"
    ],
    shouldAvoid: [
      "Estrogen-related contraindications",
      "History of Breast Cancer"
    ],
    sideEffects: [
      "Nausea",
      "Irregular bleeding",
      "Sore breasts",
      "Headache",
      "Mood changes"
    ],
    bestFor: [
      "Want a low-maintenance method that doesn’t require daily action",
      "Prefer a method with consistent, steady hormone delivery"
    ]
  },
  {
    id: "nuvaring",
    name: "Vaginal Ring (NuvaRing)",
    type: "Estrogen + Progestin",
    tagline: "Monthly",
    notes: "",
    icon: nuvaring,
    efficacyPerfectUse: "99%",
    efficacyTypicalUse: "98%",
    hormones: "Estrogen + Progestin",
    frequency: "Monthly",
    mechanism: "Delivers hormones vaginally to block ovulation and thicken cervical mucus",
    pros: [
      "Only replaced once per month",
      "Generally covered by most private insurance",
      "Generic versions available (cheaper)"
    ],
    cons: [
      "Possible vaginal discomfort",
      "Mood changes (less commonly reported with the Annovera ring)"
    ],
    shouldAvoid: [
      "Estrogen-related contraindications",
      "History of Breast Cancer"
    ],
    sideEffects: [
      "Breast tenderness",
      "Headaches",
      "Weight gain",
      "Nausea and vomiting",
      "Depression or mood changes",
      "Spotting",
      "Increased vaginal discharge",
      "Acne",
      "Decreased sex drive"
    ],
    bestFor: [
      "Want a low-maintenance hormonal method (monthly instead of daily/weekly)",
      "Prefer a discreet, user-controlled option",
      "Are comfortable inserting and removing the ring themselves"
    ]
  },
  {
    id: "annovera",
    name: "Vaginal Ring (Annovera)",
    type: "Estrogen + Progestin",
    tagline: "Monthly/Yearly",
    notes: "",
    icon: annovera,
    efficacyPerfectUse: "99%",
    efficacyTypicalUse: "97%",
    hormones: "Estrogen + Progestin",
    frequency: "Monthly/Yearly",
    mechanism: "Delivers hormones vaginally to block ovulation and thicken cervical mucus",
    pros: [
      "Use the same ring for up to 13 menstrual cycles (~1 year)"
    ],
    cons: [
      "Possible vaginal discomfort",
      "More expensive, as a generic version is not yet available"
    ],
    shouldAvoid: [
      "Estrogen-related contraindications",
      "History of Breast Cancer"
    ],
    sideEffects: [
      "Breast tenderness",
      "Headaches",
      "Weight gain",
      "Nausea and vomiting",
      "Depression or mood changes",
      "Spotting",
      "Increased vaginal discharge",
      "Acne",
      "Decreased sex drive"
    ],
    bestFor: [
      "Prefer fewer pharmacy visits (once a year)",
      "Prefer a method that’s more environmentally friendly (one device per year)",
      "Prefer a discreet, user-controlled option",
      "Are comfortable inserting and removing the ring themselves"
    ]
  },
  {
    id: "shot",
    name: "Birth Control Shot (Depo-subQ Provera 104)",
    type: "Progestin",
    tagline: "12 weeks / 3 months",
    notes: "",
    icon: shot,
    efficacyPerfectUse: "99%",
    efficacyTypicalUse: "96%",
    hormones: "Progestin",
    frequency: "12 weeks / 3 months",
    mechanism: "Prevents ovulation, thickens cervical mucus, and thins the uterine lining",
    pros: [
      "Highly effective when injections are on schedule",
      "It doesn’t interfere with sexual activity",
      "Estrogen-free option"
    ],
    cons: [
      "Delay in getting pregnant (10 months on average) to conceive after your last injection",
      "Potential for weight gain"
    ],
    shouldAvoid: [
      "History of breast cancer",
      "Unexplained vaginal bleeding",
      "Severe liver disease"
    ],
    sideEffects: [
      "Bloating",
      "Bone density loss",
      "Depression",
      "Headaches and dizziness",
      "Irregular menstrual periods or no periods at all",
      "Nervousness",
      "Weight gain"
    ],
    bestFor: [
      "Want a long-acting method without daily or weekly maintenance",
      "Prefer an estrogen-free hormonal option",
      "Do not plan to become pregnant immediately after discontinuation"
    ]
  },
  {
    id: "diaphragm",
    name: "Vaginal Diaphragm",
    type: "Non Hormonal",
    tagline: "~2 years",
    notes: "",
    icon: diaphragm,
    efficacyPerfectUse: "94%",
    efficacyTypicalUse: "87%",
    hormones: "Non Hormonal",
    frequency: "~2 years",
    mechanism: "prevent pregnancy by blocking sperm from reaching uterus",
    pros: [
      "Not hormonal",
      "Reusable",
      "No systemic side effects",
      "Low maintenance, only used when sexually active"
    ],
    cons: [
      "Lower efficacy compared to hormonal methods",
      "Some users may experience discomfort during intercourse",
      "Can become dislodged during sexual activity",
      "Increase risk of urinary tract infections"
    ],
    shouldAvoid: [
      "History of frequent UTIs",
      "Allergies to silicone or spermicide",
      "Anatomical issues that make proper placement difficult"
    ],
    sideEffects: [
      "Vaginal irritation from spermicide",
      "Increased UTI risk"
    ],
    bestFor: [
      "Want a non-hormonal, on-demand contraceptive method",
      "Do not want systemic side effects",
      "Are comfortable inserting and removing the diaphragm",
      "Understand and accept the lower typical-use efficacy"
    ]
  }
];

function App() {
  const [step, setStep] = useState<Step>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const totalQuestions = QUESTIONS.length;
  const showProgress = step === "questions";
  const progressPercent = showProgress
    ? ((currentIndex + 1) / totalQuestions) * 100
    : step === "results"
    ? 100
    : 0;

  const currentQuestion = QUESTIONS[currentIndex];

  const goToNext = () => {
    if (currentIndex === totalQuestions - 1) {
      setStep("results");
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleYesNo = (answer: YesNoAnswer) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
    goToNext();
  };

  const handleNumberSubmit = (value: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value
    }));
    goToNext();
  };

  // ---- Recommendation logic based on answers ----

const getNumberAnswer = (id: string): number | undefined => {
  const v = answers[id];
  return typeof v === "number" ? v : undefined;
};

const isYes = (id: string): boolean => answers[id] === "yes";

const age = getNumberAnswer("age");

const estrogenContraindicated =
  isYes("clottingHistory") ||
  isYes("migraineWithAura") ||
  isYes("hypertension") ||
  isYes("bmiHigh") ||
  isYes("breastCancerHistory") ||
  (typeof age === "number" && age >= 35 && isYes("smoking"));

const prefersNoHormones = isYes("preferNoHormones");
const canDoStrictDailyPill = isYes("dailyPillStrict");
const breastfeeding = isYes("breastfeeding");
const breastCancerHistory = isYes("breastCancerHistory");
const pregnantSoon = isYes("pregnantSoon");

const recommendedMethodIds: Set<MethodId> = (() => {
  const ids = new Set<MethodId>();

  METHODS.forEach((m) => {
    const methodHasEstrogen =
      m.type === "Estrogen" || m.type === "Estrogen + Progestin";

    // Avoid any method that contains estrogen if contraindicated
    if (estrogenContraindicated && methodHasEstrogen) {
      return;
    }

    ids.add(m.id);
  });

  // If patient strongly prefers non-hormonal, only keep diaphragm
  if (prefersNoHormones) {
    return new Set<MethodId>(["diaphragm"]);
  }

  // Breast cancer history: avoid all hormonal methods
  if (breastCancerHistory) {
    ids.delete("combinedPill");
    ids.delete("progestinPill");
    ids.delete("patch");
    ids.delete("nuvaring");
    ids.delete("annovera");
    ids.delete("shot");
  }

  // If breastfeeding, steer away from estrogen-containing methods
  if (breastfeeding) {
    ids.delete("combinedPill");
    ids.delete("patch");
    ids.delete("nuvaring");
    ids.delete("annovera");
  }

  // If they cannot reliably take a pill on a strict schedule, avoid progestin-only pill
  if (!canDoStrictDailyPill) {
    ids.delete("progestinPill");
    ids.delete("combinedPill");
  }

  // If they hope to be pregnant soon, avoid methods with delayed return to fertility (shot)
  if (pregnantSoon) {
    ids.delete("shot");
  }

  // If they CAN do strict daily pills and do not strongly prefer non-hormonal methods,
  // make sure pills are still considered as options.
  if (canDoStrictDailyPill && !prefersNoHormones) {
    ids.add("combinedPill");
    ids.add("progestinPill");
  }

  return ids;
})();

  return (
    <div className="app-root">
      {showProgress && (
        <div className="global-question-progress-bar">
          <div
            className="global-question-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      <div className="app-card">
        {step === "intro" && (
          <IntroScreen
            onStart={() => {
              setStep("questions");
              setCurrentIndex(0);
              setAnswers({});
            }}
          />
        )}

        {step === "questions" && currentQuestion && (
          <QuestionScreen
            question={currentQuestion}
            index={currentIndex}
            total={totalQuestions}
            onYesNo={handleYesNo}
            onNumberSubmit={handleNumberSubmit}
          />
        )}

        {step === "results" && (
          <ResultsScreen
            methods={METHODS}
            recommended={recommendedMethodIds}
            estrogenContraindicated={estrogenContraindicated}
          />
        )}
      </div>
    </div>
  );
}

// ---- Intro ----

interface IntroProps {
  onStart: () => void;
}

function IntroScreen({ onStart }: IntroProps) {
  return (
    <div className="step step-intro" style={{ textAlign: "center" }}>
      <h1>Find the birth control that fits you</h1>
      <p>
        Answer a few quick questions to see which options might be a better fit
        for you and your lifestyle.
      </p>
      <button className="primary-btn" onClick={onStart}>
        Get started
      </button>
    </div>
  );
}

// ---- Question screen ----

interface QuestionScreenProps {
  question: Question;
  index: number;
  total: number;
  onYesNo: (answer: YesNoAnswer) => void;
  onNumberSubmit: (value: number) => void;
}

function QuestionScreen({
  question,
  onYesNo,
  onNumberSubmit
}: QuestionScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Whenever the question changes, reset to fade-in state
    setIsFadingOut(false);
  }, [question.id]);

  const triggerFadeAndAnswer = (answer: YesNoAnswer) => {
    setIsFadingOut(true);
    setTimeout(() => {
      onYesNo(answer);
    }, 1000); // matches CSS duration
  };

  const triggerFadeAndNumber = (value: number) => {
    setIsFadingOut(true);
    setTimeout(() => {
      onNumberSubmit(value);
    }, 1000);
  };

  return (
    <div className={`step step-question ${isFadingOut ? "fade-out" : "fade-in"}`}>
      <div className="question-content">
        <h2>{question.prompt}</h2>

        {question.kind === "yesno" ? (
          <div className="button-row">
            <button
              className="secondary-btn"
              onClick={() => triggerFadeAndAnswer("no")}
            >
              No
            </button>
            <button
              className="primary-btn"
              onClick={() => triggerFadeAndAnswer("yes")}
            >
              Yes
            </button>
          </div>
        ) : question.id === "age" ? (
          <AgeSliderControls question={question} onSubmit={triggerFadeAndNumber} />
        ) : (
          <NumberQuestionControls
            question={question}
            onSubmit={triggerFadeAndNumber}
          />
        )}
      </div>
    </div>
  );
}

interface NumberQuestionControlsProps {
  question: NumberQuestion;
  onSubmit: (value: number) => void;
}

function NumberQuestionControls({
  question,
  onSubmit
}: NumberQuestionControlsProps) {
  const { min = 0, max = 100, step = 1, defaultValue = min } = question;
  const [value, setValue] = useState<number>(defaultValue);

  const decrement = () => {
    setValue((prev) => Math.max(min, prev - step));
  };

  const increment = () => {
    setValue((prev) => Math.min(max, prev + step));
  };

  const handleSubmit = () => {
    onSubmit(value);
  };

  return (
    <div className="number-question-controls">
      <div className="number-input-row">
        <button type="button" className="secondary-btn" onClick={decrement}>
          −
        </button>
        <span className="number-display">{value}</span>
        <button type="button" className="secondary-btn" onClick={increment}>
          +
        </button>
      </div>
      <button type="button" className="primary-btn" onClick={handleSubmit}>
        Next
      </button>
    </div>
  );
}

function AgeSliderControls({
  question,
  onSubmit
}: NumberQuestionControlsProps) {
  const { min = 13, max = 55, step = 1, defaultValue = 25 } = question;
  const [value, setValue] = useState<number>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const handleSubmit = () => {
    onSubmit(value);
  };

  return (
    <div className="number-question-controls">
      <div className="age-slider-wrapper">
        <div className="number-display-large">{value}</div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="age-slider"
        />
      </div>
      <button type="button" className="primary-btn" onClick={handleSubmit}>
        Next
      </button>
    </div>
  );
}

export default App;