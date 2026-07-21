"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Screen =
  | "tour"
  | "assessment"
  | "placement"
  | "dashboard"
  | "practice"
  | "practice-feedback"
  | "exam-ready"
  | "exam"
  | "review";

type Mode = "normal" | "exam";

const assessmentQuestions = [
  { question: "What is 3,408 + 2,795?", unit: "" },
  { question: "Write one fraction that is equivalent to 3/4.", unit: "" },
  { question: "Find 25% of 320.", unit: "" },
  { question: "A rectangle is 9 cm long and 4 cm wide. Find its area.", unit: "cm²" },
  { question: "Express 2.35 as a mixed number.", unit: "" },
  { question: "The ratio of red to blue marbles is 2 : 5. There are 35 blue marbles. How many red marbles are there?", unit: "marbles" },
  { question: "A bus left at 14:35 and travelled for 1 h 50 min. At what time did it arrive?", unit: "" },
  { question: "Round 48.736 to the nearest tenth.", unit: "" },
  { question: "Five identical books cost $42.50. What is the cost of eight books?", unit: "dollars" },
  { question: "A tank was 3/5 full. After 24 L were added, it was 3/4 full. What is its capacity?", unit: "litres" },
];

const tourSteps = [
  {
    eyebrow: "Welcome to PaperLoop",
    title: "Practice that learns with you.",
    copy: "PaperLoop notices the ideas behind each mistake, then chooses the right next question—not simply more questions.",
    visual: "path",
  },
  {
    eyebrow: "Your first 10 questions",
    title: "Find your starting tier.",
    copy: "A short placement check lets you show your working for every question. Only your final answer is typed, and it is not graded.",
    visual: "tier",
  },
  {
    eyebrow: "Two ways to learn",
    title: "Build confidence, then test it.",
    copy: "Practise with guidance in Normal Mode. When you reach Solver tier, Exam Mode unlocks for a realistic timed paper.",
    visual: "modes",
  },
];

const tierNames = ["Explorer", "Builder", "Solver", "Strategist", "Mastery"];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="PaperLoop home">
      <span className="brand-mark">P</span>
      {!compact && <span>PaperLoop</span>}
    </div>
  );
}

function Tour({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const item = tourSteps[step];

  return (
    <main className="tour-shell">
      <header className="tour-header">
        <Logo />
        <button className="text-button" onClick={onFinish}>Skip tour</button>
      </header>
      <section className="tour-card">
        <div className="tour-copy">
          <span className="eyebrow">{item.eyebrow}</span>
          <h1>{item.title}</h1>
          <p>{item.copy}</p>
          <div className="tour-progress" aria-label={`Tour step ${step + 1} of 3`}>
            {tourSteps.map((_, index) => (
              <button
                key={index}
                className={index === step ? "dot active" : "dot"}
                onClick={() => setStep(index)}
                aria-label={`Go to tour step ${index + 1}`}
              />
            ))}
          </div>
          <div className="tour-actions">
            {step > 0 && <button className="secondary-button" onClick={() => setStep(step - 1)}>Back</button>}
            <button className="primary-button" onClick={() => step === 2 ? onFinish() : setStep(step + 1)}>
              {step === 2 ? "Start my placement" : "Continue"}
            </button>
          </div>
        </div>
        <div className={`tour-visual ${item.visual}`} aria-hidden="true">
          {item.visual === "path" && (
            <div className="path-map">
              <div className="path-node done"><span>✓</span><b>Try</b><small>Answer a question</small></div>
              <div className="path-line" />
              <div className="path-node current"><span>✦</span><b>Understand</b><small>Spot the misconception</small></div>
              <div className="path-line faint" />
              <div className="path-node"><span>↗</span><b>Grow</b><small>Meet the next challenge</small></div>
            </div>
          )}
          {item.visual === "tier" && (
            <div className="tier-stack">
              {tierNames.slice().reverse().map((tier, index) => <div key={tier} className={`tier-step step-${index}`}>{tier}<span>{5 - index}</span></div>)}
            </div>
          )}
          {item.visual === "modes" && (
            <div className="mode-preview">
              <div className="preview-card selected"><span className="mode-icon">✎</span><b>Normal Mode</b><small>Hints and guided feedback</small><em>Available now</em></div>
              <div className="preview-card locked"><span className="mode-icon">◷</span><b>Exam Mode</b><small>Timed and distraction-free</small><em>Unlock at Solver</em></div>
            </div>
          )}
        </div>
      </section>
      <p className="tour-note">Built for PSLE Standard Mathematics</p>
    </main>
  );
}

function Assessment({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const q = assessmentQuestions[index];
  const continueAssessment = () => {
    if (!answer.trim()) return;
    const next = [...answers, answer.trim()];
    setAnswers(next);
    setAnswer("");
    if (index === assessmentQuestions.length - 1) onComplete();
    else setIndex(index + 1);
  };

  return (
    <main className="assessment-shell">
      <header className="assessment-header">
        <Logo />
        <div className="quiet-badge">Placement check · Not graded</div>
      </header>
      <section className="assessment-card assessment-writing-card">
        <div className="assessment-meta">
          <span>Question {index + 1} of 10</span>
          <span>{Math.round(((index + 1) / 10) * 100)}% complete</span>
        </div>
        <div className="progress-track"><span style={{ width: `${((index + 1) / 10) * 100}%` }} /></div>
        <span className="topic-chip">Mixed skills</span>
        <h1>{q.question}</h1>
        <div className="assessment-working-label">
          <span>Show your working</span>
          <small>Use a mouse, touchscreen, or stylus.</small>
        </div>
        <HandwritingPad key={index} compact />
        <label className="assessment-final-answer">
          <span>Final answer</span>
          <div><input value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="text" placeholder="Type only your final answer" />{q.unit && <em>{q.unit}</em>}</div>
        </label>
        <div className="assessment-footer">
          <button
            className="secondary-button"
            disabled={index === 0}
            onClick={() => { setIndex(index - 1); setAnswer(answers[index - 1] ?? ""); setAnswers(answers.slice(0, -1)); }}
          >Back</button>
          <span>Your working helps us understand how you think.</span>
          <button className="primary-button" disabled={!answer.trim()} onClick={continueAssessment}>
            {index === 9 ? "See my tier" : "Next question"}
          </button>
        </div>
      </section>
    </main>
  );
}

function Placement({ onDashboard }: { onDashboard: () => void }) {
  return (
    <main className="placement-shell">
      <section className="placement-card">
        <span className="result-spark">✦</span>
        <span className="eyebrow">Your starting point</span>
        <h1>You’re a Builder</h1>
        <p>You have strong number foundations. Next, we’ll strengthen fractions and multi-step problem solving before Exam Mode.</p>
        <div className="placement-tier-row">
          {tierNames.map((tier, index) => (
            <div key={tier} className={index < 2 ? "placement-tier reached" : "placement-tier"}>
              <span>{index < 2 ? "✓" : index + 1}</span><small>{tier}</small>
            </div>
          ))}
        </div>
        <div className="strength-grid">
          <div><span className="skill-dot strong" /><p><small>Strongest skill</small><b>Whole numbers</b></p></div>
          <div><span className="skill-dot focus" /><p><small>First focus</small><b>Fractions</b></p></div>
          <div><span className="skill-dot growth" /><p><small>Path to Solver</small><b>3 practice sets</b></p></div>
        </div>
        <button className="primary-button wide" onClick={onDashboard}>Go to my dashboard</button>
      </section>
    </main>
  );
}

function AppHeader({ onTour }: { onTour: () => void }) {
  return (
    <header className="app-header">
      <Logo />
      <nav aria-label="Main navigation"><button className="nav-active">Learn</button><button>Progress</button></nav>
      <div className="header-actions">
        <button className="help-button" onClick={onTour}>?</button>
        <div className="avatar">AK</div>
      </div>
    </header>
  );
}

function Dashboard({
  tier,
  attempts,
  onPractice,
  onExam,
  onTour,
}: {
  tier: number;
  attempts: number;
  onPractice: () => void;
  onExam: () => void;
  onTour: () => void;
}) {
  const [mode, setMode] = useState<Mode>("normal");
  const examUnlocked = tier >= 3;

  return (
    <main className="app-shell">
      <AppHeader onTour={onTour} />
      <div className="dashboard-wrap">
        <section className="dashboard-title">
          <div><span className="eyebrow">Tuesday, 21 July</span><h1>Good morning, Alex.</h1><p>Small steps today become exam confidence tomorrow.</p></div>
          <div className="attempt-pill"><span>◷</span><p><small>Free exam attempts</small><b>{attempts} of 2 remaining</b></p></div>
        </section>

        <div className="mode-switch" role="tablist" aria-label="Learning mode">
          <button className={mode === "normal" ? "active" : ""} onClick={() => setMode("normal")}><span>✎</span><p><b>Normal Mode</b><small>Guided practice</small></p></button>
          <button className={mode === "exam" ? "active" : ""} onClick={() => setMode("exam")}><span>{examUnlocked ? "◷" : "⌑"}</span><p><b>Exam Mode</b><small>{examUnlocked ? "Ready when you are" : "Unlocks at Solver"}</small></p></button>
        </div>

        {mode === "normal" ? (
          <div className="dashboard-grid">
            <section className="today-card">
              <div className="today-top"><span className="topic-chip">Today’s recommended set</span><span>12 min</span></div>
              <div className="lesson-illustration"><span>3/5</span><i>+</i><span>1/4</span></div>
              <h2>Fractions in word problems</h2>
              <p>Practise finding the whole when you know a fraction of an amount.</p>
              <div className="lesson-tags"><span>5 questions</span><span>Personalised</span><span>Builder</span></div>
              <button className="primary-button" onClick={onPractice}>Start practice</button>
            </section>
            <aside className="tier-card">
              <div className="tier-card-head"><span>Tier {tier}</span><b>{tierNames[tier - 1]}</b></div>
              <div className="tier-ring" style={{ "--progress": tier >= 3 ? "100%" : "72%" } as React.CSSProperties}><div><b>{tier >= 3 ? "100%" : "72%"}</b><small>{tier >= 3 ? "Tier complete" : "to Solver"}</small></div></div>
              <p>{tier >= 3 ? "Exam Mode is unlocked. You’re ready to test your skills." : "Complete today’s practice to move closer to Solver and unlock Exam Mode."}</p>
              <div className="mini-stats"><span><b>4</b><small>day streak</small></span><span><b>28</b><small>questions</small></span></div>
            </aside>
            <section className="mastery-card">
              <div className="section-heading"><div><span className="eyebrow">Your mastery</span><h2>What we’re working on</h2></div><button>View all</button></div>
              {[["Whole numbers", 88, "Strong"], ["Fractions", tier >= 3 ? 74 : 62, "Focus"], ["Percentage", 58, "Growing"], ["Geometry", 47, "Next up"]].map(([name, score, label]) => (
                <div className="mastery-row" key={name}><span className="mastery-icon">{String(name).slice(0, 1)}</span><p><b>{name}</b><small>{label}</small></p><div className="skill-track"><span style={{ width: `${score}%` }} /></div><strong>{score}%</strong></div>
              ))}
            </section>
          </div>
        ) : (
          <section className={examUnlocked ? "exam-mode-card unlocked" : "exam-mode-card"}>
            <div className="exam-lock-visual"><span>{examUnlocked ? "✓" : "⌑"}</span></div>
            <div>
              <span className="eyebrow">Exam Mode</span>
              <h2>{examUnlocked ? "Your exam desk is ready." : "Build your skills to unlock Exam Mode."}</h2>
              <p>{examUnlocked ? "A timed PSLE-style paper with no hints. When you finish, PaperLoop will review every mistake with you like a teacher." : "Reach Solver tier by completing personalised practice. You’re 72% of the way there."}</p>
              {!examUnlocked && <div className="unlock-progress"><span style={{ width: "72%" }} /></div>}
              <div className="exam-facts"><span><b>{attempts}</b> free attempts</span><span><b>45 min</b> focused paper</span><span><b>Teacher-style</b> review</span></div>
              <button className={examUnlocked ? "primary-button" : "secondary-button"} onClick={examUnlocked ? onExam : () => setMode("normal")}>
                {examUnlocked ? "Enter Exam Mode" : "Continue practising"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

type Stroke = { tool: "pen" | "eraser"; points: Array<{ x: number; y: number }> };

function HandwritingPad({ compact = false }: { compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const drawing = useRef(false);
  const activeStroke = useRef<Stroke | null>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    if (canvas.width !== Math.floor(rect.width * ratio) || canvas.height !== Math.floor(rect.height * ratio)) {
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    [...strokes, ...(activeStroke.current ? [activeStroke.current] : [])].forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = stroke.tool === "eraser" ? "#fffdf8" : "#19324a";
      ctx.lineWidth = stroke.tool === "eraser" ? 18 : 2.4;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.stroke();
    });
  }, [strokes]);

  useEffect(() => { render(); }, [render]);
  useEffect(() => {
    const onResize = () => render();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [render]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  return (
    <div className={compact ? "pad-wrap compact" : "pad-wrap"}>
      <div className="pad-toolbar" role="toolbar" aria-label="Writing tools">
        <button className={tool === "pen" ? "active" : ""} onClick={() => setTool("pen")}><span>✎</span> Pen</button>
        <button className={tool === "eraser" ? "active" : ""} onClick={() => setTool("eraser")}><span>⌫</span> Eraser</button>
        <button onClick={() => setStrokes(strokes.slice(0, -1))} disabled={!strokes.length}><span>↶</span> Undo</button>
        <button onClick={() => setStrokes([])} disabled={!strokes.length}><span>×</span> Clear</button>
        <small>Saved</small>
      </div>
      <div className="paper-canvas">
        {!strokes.length && <div className="canvas-placeholder">Write your working here…</div>}
        <canvas
          ref={canvasRef}
          aria-label="Handwriting workspace"
          onPointerDown={(event) => {
            drawing.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            activeStroke.current = { tool, points: [pointFromEvent(event)] };
          }}
          onPointerMove={(event) => {
            if (!drawing.current || !activeStroke.current) return;
            activeStroke.current.points.push(pointFromEvent(event));
            render();
          }}
          onPointerUp={() => {
            drawing.current = false;
            if (activeStroke.current) setStrokes((current) => [...current, activeStroke.current as Stroke]);
            activeStroke.current = null;
          }}
        />
      </div>
    </div>
  );
}

function Practice({ onSubmit, onBack }: { onSubmit: () => void; onBack: () => void }) {
  const [answer, setAnswer] = useState("");
  return (
    <main className="practice-shell">
      <header className="practice-header"><Logo /><div className="practice-progress"><span>Question 3 of 5</span><div><i /></div></div><button className="text-button" onClick={onBack}>Save & exit</button></header>
      <div className="practice-layout">
        <section className="question-workspace">
          <div className="question-card">
            <div className="question-meta"><span className="topic-chip">Fractions · Builder</span><span>4 marks</span></div>
            <h1>A water tank was <b>3/5</b> full. After 24 litres of water were added, it was <b>3/4</b> full. What was the capacity of the tank?</h1>
            <button className="hint-link">Need a small hint?</button>
          </div>
          <HandwritingPad />
          <div className="final-answer-bar"><label>Final answer <div><input value={answer} onChange={(e) => setAnswer(e.target.value)} inputMode="decimal" placeholder="Type your answer" /><span>litres</span></div></label><button className="primary-button" disabled={!answer} onClick={onSubmit}>Check my work</button></div>
        </section>
        <aside className="practice-side">
          <span className="eyebrow">Today’s focus</span><h2>Fractions</h2>
          <div className="side-progress"><span style={{ width: "62%" }} /></div><p><b>62% mastery</b><small>You’re building steadily.</small></p>
          <hr />
          <div className="session-list"><span className="done">✓</span><p><b>Q1 · Equivalent fractions</b><small>Correct</small></p></div>
          <div className="session-list"><span className="done">✓</span><p><b>Q2 · Fraction of amount</b><small>Correct</small></p></div>
          <div className="session-list current"><span>3</span><p><b>Q3 · Finding the whole</b><small>In progress</small></p></div>
          <div className="session-list"><span>4</span><p><b>Q4 · Mixed operations</b><small>Up next</small></p></div>
        </aside>
      </div>
    </main>
  );
}

function PracticeFeedback({ onLevelUp }: { onLevelUp: () => void }) {
  const [exitAnswer, setExitAnswer] = useState("");
  return (
    <main className="feedback-shell">
      <header className="practice-header"><Logo /><div className="quiet-badge">Question review</div><span /></header>
      <div className="feedback-wrap">
        <section className="feedback-heading"><span className="feedback-mark">Almost there</span><h1>Your method started well. Let’s fix one idea.</h1><p>We’ll look at the first step that changed the meaning of the fractions.</p></section>
        <div className="feedback-grid">
          <section className="working-review">
            <div className="review-question"><span>Question 3</span><p>A tank went from 3/5 full to 3/4 full after 24 litres were added.</p></div>
            <div className="student-working"><span>Your working</span><p>3/4 − 3/5 = 3/1</p><p>24 × 3 = <b>72 litres</b></p><div className="error-underline">This subtraction step changed the denominator.</div></div>
          </section>
          <aside className="teacher-panel">
            <div className="teacher-label"><span>✦</span><p><small>PaperLoop teacher</small><b>Let’s reason it out</b></p></div>
            <p>The fractions describe the <strong>same tank</strong>, so first give them a common denominator.</p>
            <div className="teacher-step"><span>1</span><p><b>Rename both fractions</b><small>3/5 = 12/20 and 3/4 = 15/20</small></p></div>
            <div className="teacher-step"><span>2</span><p><b>Find the change</b><small>15/20 − 12/20 = 3/20</small></p></div>
            <div className="teacher-step"><span>3</span><p><b>Connect it to 24 litres</b><small>3/20 of the tank is 24 L, so 20/20 is 160 L.</small></p></div>
            <div className="misconception-chip"><span>We noticed</span><b>Subtracting unlike fractions</b></div>
          </aside>
        </div>
        <section className="exit-ticket">
          <div><span className="eyebrow">Quick confidence check</span><h2>If 2/9 of a container is 18 litres, what is its full capacity?</h2></div>
          <HandwritingPad compact />
          <div className="exit-answer"><label>Final answer</label><input placeholder="Type your answer" value={exitAnswer} onChange={(event) => setExitAnswer(event.target.value)} /><span>litres</span><button className="success-button" disabled={!exitAnswer.trim()} onClick={onLevelUp}>Finish set</button></div>
        </section>
      </div>
    </main>
  );
}

function ExamReady({ attempts, onStart, onBack }: { attempts: number; onStart: () => void; onBack: () => void }) {
  return (
    <main className="exam-ready-shell">
      <header className="practice-header"><Logo /><span className="exam-badge">Exam Mode</span><button className="text-button" onClick={onBack}>Back to dashboard</button></header>
      <section className="exam-ready-card">
        <div className="exam-ready-copy"><span className="eyebrow">PSLE Math · Focused simulation</span><h1>Ready to test what you know?</h1><p>There are no hints during the paper. When you finish, we’ll sit down with every mistake and work through it together.</p>
          <div className="exam-rule"><span>◷</span><p><b>45 minutes</b><small>The timer continues until submission.</small></p></div>
          <div className="exam-rule"><span>▤</span><p><b>10 questions</b><small>A balanced mix based on PSLE skills.</small></p></div>
          <div className="exam-rule"><span>✦</span><p><b>Teacher-style review</b><small>Understand each error after you finish.</small></p></div>
          <button className="exam-start-button" onClick={onStart}>Start exam attempt</button>
          <button className="text-button centered" onClick={onBack}>I’ll practise a little more</button>
        </div>
        <aside className="attempt-ticket"><span>Free attempts</span><strong>{attempts}</strong><p>of 2 remaining</p><hr /><small>One attempt is used only when you submit the paper.</small></aside>
      </section>
    </main>
  );
}

function Exam({ onSubmit }: { onSubmit: () => void }) {
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const questions = [
    "A shop reduced the price of a bag from $80 to $68. What was the percentage discount?",
    "The average mass of 5 parcels was 3.2 kg. A sixth parcel of mass 4.4 kg was added. Find the new average mass.",
    "A rectangular field has a perimeter of 86 m. Its length is 7 m more than its width. Find its area.",
    "Mei used 2/5 of her savings on a book and 1/4 of the remainder on stationery. She had $54 left. How much did she have at first?",
    "A tap fills 3/8 of a tank in 12 minutes. At the same rate, how long will it take to fill the whole tank?",
  ];
  return (
    <main className="exam-shell">
      <header className="exam-header"><Logo /><div className="exam-title"><span>PSLE Math Simulation</span><small>Exam Mode · No hints</small></div><div className="exam-timer"><span>◷</span><p><small>Time remaining</small><b>38:42</b></p></div></header>
      <div className="exam-body">
        <aside className="question-nav"><span>Questions</span><div>{Array.from({ length: 10 }, (_, index) => <button key={index} className={`${index === question ? "current" : ""} ${answers[index] ? "answered" : ""}`} onClick={() => index < 5 && setQuestion(index)}>{index + 1}</button>)}</div><p><i className="answered-key" /> Answered <i className="current-key" /> Current</p><button className="flag-button">◇ Flag for review</button></aside>
        <section className="exam-question">
          <div className="exam-question-meta"><span>Question {question + 1}</span><span>{question === 3 ? "5 marks" : "3 marks"}</span></div>
          <h1>{questions[question] ?? "This question will be available in the complete paper."}</h1>
          <HandwritingPad compact />
          <label className="exam-final-answer">Final answer <div><input value={answers[question] ?? ""} onChange={(e) => setAnswers({ ...answers, [question]: e.target.value })} placeholder="Enter your answer" /><span>{question === 0 ? "%" : ""}</span></div></label>
          <div className="exam-controls"><button className="secondary-button" disabled={question === 0} onClick={() => setQuestion(question - 1)}>Previous</button>{question < 4 ? <button className="primary-button" onClick={() => setQuestion(question + 1)}>Next question</button> : <button className="submit-exam-button" onClick={onSubmit}>Submit exam</button>}</div>
        </section>
      </div>
    </main>
  );
}

function Review({ onDashboard }: { onDashboard: () => void }) {
  const [active, setActive] = useState(3);
  const reviewItems = [
    { label: "Percentage discount", state: "correct", score: "3/3" },
    { label: "Average", state: "correct", score: "3/3" },
    { label: "Rectangle area", state: "partial", score: "2/3" },
    { label: "Fractions of remainder", state: "review", score: "1/5" },
    { label: "Rate and fractions", state: "correct", score: "3/3" },
  ];
  return (
    <main className="review-shell">
      <header className="practice-header"><Logo /><div className="quiet-badge">Exam review · 12/17 marks</div><button className="text-button" onClick={onDashboard}>Finish review</button></header>
      <div className="review-layout">
        <aside className="review-nav"><span className="eyebrow">Review together</span><h2>Let’s understand every mark.</h2><p>Start with the questions that will help you improve most.</p>{reviewItems.map((item, index) => <button key={item.label} className={active === index ? "active" : ""} onClick={() => setActive(index)}><span className={item.state}>{item.state === "correct" ? "✓" : item.state === "partial" ? "◐" : "!"}</span><p><b>Q{index + 1} · {item.label}</b><small>{item.score} marks</small></p></button>)}</aside>
        <section className="review-lesson">
          <div className="review-summary"><span>Question {active + 1}</span><span className={reviewItems[active].state}>{reviewItems[active].score} marks</span></div>
          {active === 3 ? <>
            <h1>Mei used 2/5 of her savings on a book and 1/4 of the remainder on stationery. She had $54 left. How much did she have at first?</h1>
            <div className="teacher-conversation"><div className="teacher-avatar">P</div><div><span>PaperLoop teacher</span><p>You correctly identified that Mei had 3/5 left after buying the book. The tricky part was that the stationery cost is <strong>1/4 of the remainder</strong>, not 1/4 of the original savings.</p></div></div>
            <div className="comparison-grid"><div><span>Your approach</span><p>1 − 2/5 − 1/4 = 7/20</p><p>54 ÷ 7 × 20 = $154.29</p><em>The fractions refer to different wholes.</em></div><div className="correct-way"><span>Let’s rebuild it</span><p>After book: 3/5 remains</p><p>After stationery: 3/4 × 3/5 = 9/20</p><p>9/20 is $54 → Whole is <b>$120</b></p></div></div>
            <div className="teacher-question"><span>Before we continue…</span><p>Why do we multiply 3/4 by 3/5 here?</p><div><button>Because both are removed</button><button className="selected">Because 3/4 is a fraction of the 3/5 remainder</button></div></div>
          </> : <div className="compact-review"><span>{reviewItems[active].state === "correct" ? "✓" : "◐"}</span><h1>{reviewItems[active].state === "correct" ? "Well done—your reasoning was clear." : "You earned method marks here."}</h1><p>{reviewItems[active].state === "correct" ? "Your method and final answer were both correct. We’ll keep this skill in your review rotation." : "Your setup was correct. Check the final calculation carefully to recover the last mark."}</p></div>}
          <div className="review-footer"><button className="secondary-button" disabled={active === 0} onClick={() => setActive(active - 1)}>Previous</button><span>{active + 1} of 5 reviewed</span><button className="primary-button" onClick={() => active === 4 ? onDashboard() : setActive(active + 1)}>{active === 4 ? "Finish review" : "Next question"}</button></div>
        </section>
      </div>
    </main>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("tour");
  const [tier, setTier] = useState(2);
  const [attempts, setAttempts] = useState(2);

  const dashboard = () => setScreen("dashboard");
  return (
    <div className="paperloop-app">
      {screen === "tour" && <Tour onFinish={() => setScreen("assessment")} />}
      {screen === "assessment" && <Assessment onComplete={() => setScreen("placement")} />}
      {screen === "placement" && <Placement onDashboard={dashboard} />}
      {screen === "dashboard" && <Dashboard tier={tier} attempts={attempts} onPractice={() => setScreen("practice")} onExam={() => setScreen("exam-ready")} onTour={() => setScreen("tour")} />}
      {screen === "practice" && <Practice onSubmit={() => setScreen("practice-feedback")} onBack={dashboard} />}
      {screen === "practice-feedback" && <PracticeFeedback onLevelUp={() => { setTier(3); dashboard(); }} />}
      {screen === "exam-ready" && <ExamReady attempts={attempts} onStart={() => setScreen("exam")} onBack={dashboard} />}
      {screen === "exam" && <Exam onSubmit={() => { setAttempts(Math.max(0, attempts - 1)); setScreen("review"); }} />}
      {screen === "review" && <Review onDashboard={dashboard} />}
    </div>
  );
}
