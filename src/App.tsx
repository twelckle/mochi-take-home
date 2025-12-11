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
    id: "migraineWithAura",
    prompt: "Do you get migraines with aura?",
    kind: "yesno"
  },
  {
    id: "hypertension",
    prompt: "Have you ever been told you have high blood pressure (hypertension)?",
    kind: "yesno"
  },
  {
    id: "clotting",
    prompt: "Have you ever had a blood clot, stroke, or heart attack?",
    kind: "yesno"
  },
  {
    id: "bmiHigh",
    prompt: "Is your BMI around 30 or higher?",
    kind: "yesno"
  },
  {
    id: "postpartum6Weeks",
    prompt: "Are you less than 6 weeks postpartum?",
    kind: "yesno"
  },
  {
    id: "dailyPillOk",
    prompt: "Are you okay taking a pill every day around the same time?",
    kind: "yesno"
  },
  {
    id: "hateDailyPills",
    prompt: "Would you rather not think about birth control every day?",
    kind: "yesno"
  },
  {
    id: "preferLessHormones",
    prompt: "Would you prefer a method with fewer hormones if possible?",
    kind: "yesno"
  },
  {
    id: "preferNoHormones",
    prompt: "Would you prefer a non-hormonal method if it’s a good fit?",
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
    name: "Pill (Combination)",
    type: "Estrogen + Progestin",
    tagline: "Daily",
    notes: "Must be taken daily at a consistent time.",
    icon: combinedPill,
    pros: [
      "No interruption of sex",
      "User control over when or if you want your period",
      "Can get pregnant soon after stopping",
      "Lighter or more regular menstrual cycles",
      "Reduces cramping"
    ],
    cons: [
      "Estrogen — increased blood clot risk",
      "Less effective if not taken consistently at the same time",
      "Should not take if history of breast cancer"
    ]
  },
  {
    id: "progestinPill",
    name: "Pill (Progestin-only)",
    type: "Progestin",
    tagline: "Daily",
    notes: "Timing is more strict than combination pills.",
    icon: progestinPill,
    pros: [
      "Safe while breastfeeding",
      "Contains no estrogen"
    ],
    cons: [
      "Stricter timing required",
      "Less effective than combination pill",
      "Should not take if history of breast cancer"
    ]
  },
  {
    id: "patch",
    name: "Patch",
    type: "Estrogen + Progestin",
    tagline: "Weekly",
    notes: "Changed once weekly; applied to skin.",
    icon: patch,
    pros: [
      "Reversible — fertility returns quickly",
      "More convenient (once weekly)",
      "Consistent hormone dosage",
      "May improve acne",
      "Improves menstrual cramps"
    ],
    cons: [
      "Estrogen — increased blood clot risk",
      "Less effective for BMI ≥ 30 or weight > 198 lbs",
      "Skin irritation possible",
      "No STD prevention"
    ]
  },
  {
    id: "nuvaring",
    name: "Vaginal Ring (NuvaRing)",
    type: "Estrogen + Progestin",
    tagline: "Monthly",
    notes: "Insert monthly; widely covered by insurance.",
    icon: nuvaring,
    pros: [
      "New ring every month",
      "Most private insurance covers NuvaRing",
      "Generic version available"
    ],
    cons: [
      "Estrogen — increased blood clot risk",
      "Possible vaginal discomfort",
      "Mood changes may occur"
    ]
  },
  {
    id: "annovera",
    name: "Vaginal Ring (Annovera)",
    type: "Estrogen + Progestin",
    tagline: "yearly",
    notes: "One ring reused for 13 cycles (~1 year).",
    icon: annovera,
    pros: [
      "One ring reused for up to 1 year",
      "Once-monthly maintenance"
    ],
    cons: [
      "Estrogen — increased blood clot risk",
      "Possible vaginal discomfort",
      "More expensive — no generic available"
    ]
  },
  {
    id: "shot",
    name: "Birth Control Shot",
    type: "Progestin",
    tagline: "12 weeks/3 months",
    notes: "Very effective; requires returning for scheduled injections.",
    icon: shot,
    pros: [
      "Does not interfere with sexual activity",
      "No need to take daily",
      "Long-lasting per dose"
    ],
    cons: [
      "Side effects possible",
      "Delay in return to fertility after stopping",
      "Requires receiving a shot every 12 weeks"
    ]
  },
  {
    id: "diaphragm",
    name: "Diaphragm",
    type: "Non Hormonal",
    tagline: "~2 years",
    notes: "Used with spermicide; replaced every ~2 years.",
    icon: diaphragm,
    pros: [
      "No hormones",
      "Reusable",
      "No systemic side effects",
      "Low maintenance when not sexually active"
    ],
    cons: [
      "Lower efficacy than hormonal methods",
      "May feel uncomfortable during sex",
      "Can become dislodged",
      "May increase risk of urinary tract infections"
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
    isYes("clotting") ||
    isYes("migraineWithAura") ||
    isYes("hypertension") ||
    isYes("bmiHigh") ||
    isYes("postpartum6Weeks") ||
    (typeof age === "number" && age >= 35 && isYes("smoking"));

  const prefersNoHormones = isYes("preferNoHormones");
  const prefersLessHormones = isYes("preferLessHormones");
  const hatesDailyPills = isYes("hateDailyPills");
  const okWithDailyPill = isYes("dailyPillOk");

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

    if (hatesDailyPills) {
      ids.delete("combinedPill");
      ids.delete("progestinPill");
    }

    if (prefersNoHormones) {
      return new Set<MethodId>(["diaphragm"]);
    }

    if (prefersLessHormones) {
      ids.delete("combinedPill");
      ids.delete("patch");
      ids.delete("nuvaring");
      ids.delete("annovera");
    }

    // If they like daily pills and nothing else has filtered them out,
    // make sure pills stay in the set (this is mostly illustrative).
    if (okWithDailyPill && !hatesDailyPills) {
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
      <h1>Find the birth control that fits your lifestyle</h1>
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