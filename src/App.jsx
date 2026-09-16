import { useRef, useState } from "react";
import JournalPage from "./components/journal/JournalPage";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  TrendingUp,
  BookOpen,
  Image,
  Sparkles,
  BarChart3,
  Settings,
  Plus,
  Flame,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Goals", icon: Target },
  { label: "Today", icon: CheckSquare },
  { label: "Progress", icon: TrendingUp },
  { label: "Journal", icon: BookOpen },
  { label: "Affirmations", icon: Sparkles },
  { label: "Vision Board", icon: Image },
  { label: "AI Visualize", icon: Sparkles },
  { label: "Analytics", icon: BarChart3 },
];

const getTodayDate = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;

  return new Date(today.getTime() - offset).toISOString().split("T")[0];
};

// const actions = [
//   { title: "Morning workout", completed: true },
//   { title: "Build Visual Tracker", completed: true },
//   { title: "Learn MERN", completed: true },
//   { title: "Create content", completed: false },
//   { title: "Read / journal", completed: false },
// ];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("visualTrackerTheme") || "dark";
  });
  const [actions, setActions] = useState(() => {
    const savedActions = localStorage.getItem("visualTrackerActions");

    if (savedActions) {
      const saved = JSON.parse(savedActions);

      return saved.map((action) => {
        if (action.goalId && action.date) return action;

        const goalMap = {
          "Morning workout": 2,
          "Build Visual Tracker": 3,
          "Learn MERN": 3,
          "Create content": 4,
          "Read / journal": 4,
        };

        return {
          ...action,
          goalId: action.goalId || goalMap[action.title] || null,
          date: action.date || getTodayDate(),
        };
      });
    }

    return [
      {
        id: 1,
        title: "Morning workout",
        completed: true,
        goalId: 2,
      },
      {
        id: 2,
        title: "Build Visual Tracker",
        completed: true,
        goalId: 3,
      },
      {
        id: 3,
        title: "Learn MERN",
        completed: true,
        goalId: 3,
      },
      {
        id: 4,
        title: "Create content",
        completed: false,
        goalId: 4,
      },
      {
        id: 5,
        title: "Read / journal",
        completed: false,
        goalId: 4,
      },
    ];
  });

  const todayDate = getTodayDate();

  const todayActions = actions.filter((action) => action.date === todayDate);

  const upcomingActions = actions.filter(
    (action) => action.date && action.date > todayDate,
  );

  const completedActions = todayActions.filter(
    (action) => action.completed,
  ).length;

  const totalActions = todayActions.length;
  const todayProgress =
    totalActions === 0
      ? 0
      : Math.round((completedActions / totalActions) * 100);

  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("visualTrackerGoals");

    if (savedGoals) {
      return JSON.parse(savedGoals);
    }

    return [
      {
        id: 1,
        title: "Wealth",
        description: "Build financial freedom",
        category: "Finance",
        progress: 72,
      },
      {
        id: 2,
        title: "Fitness",
        description: "Become my strongest self",
        category: "Health",
        progress: 64,
      },
      {
        id: 3,
        title: "Career",
        description: "Build exceptional products",
        category: "Career",
        progress: 81,
      },
      {
        id: 4,
        title: "Lifestyle",
        description: "Create my dream life",
        category: "Personal",
        progress: 58,
      },
    ];
  });

  const goalsWithProgress = goals.map((goal) => {
    const goalActions = actions.filter((action) => action.goalId === goal.id);

    const completedGoalActions = goalActions.filter(
      (action) => action.completed,
    ).length;

    const goalProgress =
      goalActions.length === 0
        ? 0
        : Math.round((completedGoalActions / goalActions.length) * 100);

    return {
      ...goal,
      progress: goalProgress,
    };
  });
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    localStorage.setItem("visualTrackerTheme", theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("visualTrackerGoals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("visualTrackerActions", JSON.stringify(actions));
  }, [actions]);

  const handleToggleAction = (id) => {
    setActions((currentActions) =>
      currentActions.map((action) =>
        action.id === id
          ? {
              ...action,
              completed: !action.completed,
            }
          : action,
      ),
    );
  };

  const handleCreateAction = () => {
    if (!newAction.title.trim() || !newAction.goalId) return;

    if (editingActionId) {
      setActions((currentActions) =>
        currentActions.map((action) =>
          action.id === editingActionId
            ? {
                ...action,
                title: newAction.title.trim(),
                goalId: Number(newAction.goalId),
                date: newAction.date,
              }
            : action,
        ),
      );
    } else {
      const action = {
        id: Date.now(),
        title: newAction.title.trim(),
        completed: false,
        goalId: Number(newAction.goalId),
        date: newAction.date,
      };

      setActions((currentActions) => [...currentActions, action]);
    }

    setNewAction({
      title: "",
      goalId: "",
      date: getTodayDate(),
    });

    setEditingActionId(null);
    setIsActionModalOpen(false);
  };

  const handleDeleteAction = (id) => {
    const confirmed = window.confirm("Delete this action?");

    if (!confirmed) return;

    setActions((currentActions) =>
      currentActions.filter((action) => action.id !== id),
    );
  };

  const handleEditAction = (id) => {
    const action = actions.find((action) => action.id === id);

    if (!action) return;

    setNewAction({
      title: action.title,
      goalId: action.goalId ? String(action.goalId) : "",
      date: action.date || getTodayDate(),
    });

    setEditingActionId(id);
    setIsActionModalOpen(true);
  };

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) return;

    if (editingGoalId) {
      setGoals((currentGoals) =>
        currentGoals.map((goal) =>
          goal.id === editingGoalId
            ? {
                ...goal,
                title: newGoal.title,
                description:
                  newGoal.description || "Build this part of my dream life.",
                category: newGoal.category,
                targetDate: newGoal.targetDate,
                image: newGoal.image,
              }
            : goal,
        ),
      );
    } else {
      const goal = {
        id: Date.now(),
        title: newGoal.title,
        description: newGoal.description || "Build this part of my dream life.",
        category: newGoal.category,
        targetDate: newGoal.targetDate,
        image: newGoal.image,
        progress: 0,
      };

      setGoals((currentGoals) => [...currentGoals, goal]);
    }

    setNewGoal({
      title: "",
      description: "",
      category: "Personal",
      targetDate: "",
      image: "",
    });

    setEditingGoalId(null);
    setIsGoalModalOpen(false);
  };

  const handleGoalImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setNewGoal((currentGoal) => ({
        ...currentGoal,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };
  const handleDeleteGoal = (id) => {
    const confirmed = window.confirm("Delete this goal?");

    if (!confirmed) return;

    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id));
  };

  const handleEditGoal = (id) => {
    const goal = goals.find((goal) => goal.id === id);

    if (!goal) return;

    setNewGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetDate: goal.targetDate || "",
      image: goal.image || "",
    });

    setEditingGoalId(id);
    setIsGoalModalOpen(true);
  };
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiStyle, setAiStyle] = useState("Photorealistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [visionImage, setVisionImage] = useState(
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const [newAction, setNewAction] = useState({
    title: "",
    goalId: "",
    date: getTodayDate(),
  });

  const [editingActionId, setEditingActionId] = useState(null);

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "Personal",
    targetDate: "",
    image: "",
  });

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [goalIntake, setGoalIntake] = useState({});
  const getGoalType = (category, title) => {
    const value = `${category} ${title}`.toLowerCase();

    if (/weight|lose|fat|fitness|workout|muscle|run|health|diet/.test(value))
      return "health";
    if (
      /business|startup|saas|product|revenue|customer|company|sell/.test(value)
    )
      return "business";
    if (
      /learn|study|course|exam|skill|coding|javascript|react|python/.test(value)
    )
      return "learning";
    if (/job|career|interview|resume|promotion|portfolio/.test(value))
      return "career";
    if (/money|wealth|save|saving|invest|income|debt|finance/.test(value))
      return "finance";

    return "general";
  };

  const getGoalQuestions = (goalType) => {
    const common = [
      {
        id: "success",
        label: "What would success look like?",
        placeholder: "Describe the outcome you want in measurable terms.",
        type: "text",
      },
    ];

    const questions = {
      health: [
        {
          id: "currentWeight",
          label: "What's your current weight?",
          placeholder: "e.g. 68 kg",
          type: "text",
        },
        {
          id: "routine",
          label: "What's your current routine?",
          placeholder: "e.g. strength training 4 days/week",
          type: "text",
        },
        {
          id: "preferences",
          label: "Any food or routine preferences?",
          placeholder: "e.g. vegetarian, simple meals, morning workouts",
          type: "text",
        },
      ],
      business: [
        {
          id: "currentStage",
          label: "Where are you right now?",
          placeholder: "Idea, MVP, launched, first customers, etc.",
          type: "text",
        },
        {
          id: "audience",
          label: "Who is this for?",
          placeholder: "Describe your ideal customer.",
          type: "text",
        },
        {
          id: "resources",
          label: "What resources do you already have?",
          placeholder: "Skills, audience, budget, existing product, etc.",
          type: "text",
        },
      ],
      learning: [
        {
          id: "currentLevel",
          label: "What's your current level?",
          placeholder: "Beginner, intermediate, advanced, or describe it.",
          type: "text",
        },
        {
          id: "timePerDay",
          label: "How much time can you give this?",
          placeholder: "e.g. 90 minutes/day",
          type: "text",
        },
        {
          id: "proof",
          label: "How will you know you've learned it?",
          placeholder: "Project, exam score, interview performance, etc.",
          type: "text",
        },
      ],
      career: [
        {
          id: "currentRole",
          label: "Where are you starting from?",
          placeholder: "Current role, experience, or job-search stage.",
          type: "text",
        },
        {
          id: "target",
          label: "What role or outcome are you targeting?",
          placeholder: "e.g. Senior Full-Stack Engineer",
          type: "text",
        },
        {
          id: "timePerDay",
          label: "How much time can you give this?",
          placeholder: "e.g. 3 hours/day",
          type: "text",
        },
      ],
      finance: [
        {
          id: "currentSituation",
          label: "What's your current situation?",
          placeholder: "Income, savings, debt, business, etc.",
          type: "text",
        },
        {
          id: "targetAmount",
          label: "What's your measurable target?",
          placeholder: "e.g. ₹2L/month income",
          type: "text",
        },
        {
          id: "route",
          label: "What route are you considering?",
          placeholder: "Job, business, freelance, investing, or a mix.",
          type: "text",
        },
      ],
      general: [
        {
          id: "currentState",
          label: "Where are you starting from?",
          placeholder: "Describe your current situation.",
          type: "text",
        },
        {
          id: "constraints",
          label: "What constraints should the plan respect?",
          placeholder: "Time, budget, skills, schedule, etc.",
          type: "text",
        },
      ],
    };

    return [...common, ...questions[goalType]];
  };

  const handleGeneratePlan = () => {
    if (!newGoal.title.trim()) return;

    const goalType = getGoalType(newGoal.category, newGoal.title);
    setGoalIntake({});
    setGeneratedPlan(null);
    setIsGoalModalOpen(false);
    setIsIntakeModalOpen(true);
    setGoalIntake((current) => ({
      ...current,
      goalType,
    }));
  };

  const handleBuildPlan = () => {
    if (!newGoal.title.trim()) return;

    setIsGeneratingPlan(true);

    setTimeout(() => {
      const title = newGoal.title.trim();
      const goalType =
        goalIntake.goalType || getGoalType(newGoal.category, title);
      const intake = goalIntake;

      const templates = {
        health: {
          approach:
            "Use your baseline, routine, and preferences to build a sustainable training, nutrition, recovery, and tracking system.",
          milestones: [
            [
              "Establish baseline",
              "Capture your starting point and define a measurable target.",
            ],
            [
              "Build the routine",
              "Set the minimum weekly training, nutrition, movement, and recovery habits.",
            ],
            [
              "Execute and track",
              "Follow the plan consistently and track the few metrics that matter.",
            ],
            [
              "Review and adjust",
              "Use the trend and adherence data to adjust the next cycle instead of guessing.",
            ],
          ],
          weekly: [
            "Establish your baseline and measurable target",
            "Complete the planned training and daily habits",
            "Review adherence and progress at the end of the week",
          ],
          today: [
            "Record your starting baseline",
            "Set your first three non-negotiable habits",
            "Complete today's planned workout or movement session",
          ],
          effort: "1–2 focused hours",
        },
        business: {
          approach:
            "Work backward from the desired outcome through customer, problem, validation, product, and revenue milestones.",
          milestones: [
            [
              "Define the customer",
              "Identify the specific person and painful problem you want to solve.",
            ],
            [
              "Validate the problem",
              "Talk to users and test whether the problem is worth solving.",
            ],
            [
              "Build the MVP",
              "Ship the smallest useful version and get it into real users' hands.",
            ],
            [
              "Reach first revenue",
              "Convert early users into paying customers and learn what drives retention.",
            ],
          ],
          weekly: [
            "Define the ideal customer and problem",
            "Validate the problem with real people",
            "Ship one small but usable product improvement",
          ],
          today: [
            "Write your ideal customer's problem in one sentence",
            "List three assumptions that must be true",
            "Create the first MVP task and start a 25-minute focus session",
          ],
          effort: "2–3 focused hours",
        },
        learning: {
          approach:
            "Turn the topic into a measurable curriculum, deliberate practice, and proof-of-skill loop.",
          milestones: [
            [
              "Baseline",
              "Identify what you already know and the exact skill gap.",
            ],
            [
              "Learn",
              "Follow a focused sequence of concepts instead of consuming everything.",
            ],
            [
              "Practice",
              "Apply the concepts through exercises and increasingly realistic problems.",
            ],
            [
              "Prove the skill",
              "Complete a project, assessment, or other concrete demonstration.",
            ],
          ],
          weekly: [
            "Define the skill outcome and baseline",
            "Complete the highest-priority learning block",
            "Produce one piece of evidence that you can apply the skill",
          ],
          today: [
            "Define the exact skill you need to demonstrate",
            "Choose today's highest-value learning resource",
            "Complete one focused practice block",
          ],
          effort: intake.timePerDay || "1–2 focused hours",
        },
        career: {
          approach:
            "Build the smallest set of skills, proof, and interview readiness that moves you toward the target role.",
          milestones: [
            [
              "Position",
              "Define the target role and the evidence the market expects.",
            ],
            [
              "Close skill gaps",
              "Prioritize the few technical or professional gaps that matter most.",
            ],
            [
              "Build proof",
              "Create or improve projects, resume evidence, and interview stories.",
            ],
            [
              "Convert opportunities",
              "Apply selectively, interview, learn from feedback, and iterate.",
            ],
          ],
          weekly: [
            "Define the target role and skill gaps",
            "Create one strong piece of proof",
            "Complete one interview/application improvement cycle",
          ],
          today: [
            "Write the exact target role and top requirements",
            "Choose one skill gap to work on today",
            "Complete one focused portfolio or interview-prep task",
          ],
          effort: intake.timePerDay || "2–3 focused hours",
        },
        finance: {
          approach:
            "Map the current situation, define the target, choose the primary income/savings route, and track measurable progress.",
          milestones: [
            [
              "Baseline",
              "Understand your current cash flow, obligations, and starting position.",
            ],
            [
              "Choose the lever",
              "Identify the highest-impact income, spending, or savings lever.",
            ],
            [
              "Execute",
              "Run the chosen strategy consistently and measure the result.",
            ],
            [
              "Strengthen",
              "Improve what works and build a more resilient financial system.",
            ],
          ],
          weekly: [
            "Write down your current financial baseline",
            "Choose one high-impact financial lever",
            "Review the numbers and adjust next week's action",
          ],
          today: [
            "Record your current measurable financial baseline",
            "Choose the single highest-impact lever",
            "Take one concrete action on that lever",
          ],
          effort: "1–2 focused hours",
        },
        general: {
          approach:
            "Clarify the outcome, identify the critical path, execute the smallest useful actions, and review the result.",
          milestones: [
            [
              "Clarify",
              "Define the measurable outcome and what success means.",
            ],
            [
              "Prepare",
              "Identify the resources, constraints, and first actions.",
            ],
            [
              "Execute",
              "Turn the plan into repeatable weekly and daily actions.",
            ],
            ["Review", "Use results to improve the next cycle."],
          ],
          weekly: [
            "Define the measurable outcome",
            "Complete the three highest-impact actions",
            "Review what worked and what needs changing",
          ],
          today: [
            "Define your measurable starting point",
            "Choose today's highest-impact action",
            "Complete one focused execution block",
          ],
          effort: "1–2 focused hours",
        },
      };

      const template = templates[goalType];

      setGeneratedPlan({
        goal: title,
        category: newGoal.category,
        outcome: newGoal.description.trim() || template.approach,
        approach: template.approach,
        goalType,
        intake,
        milestones: template.milestones.map(([title, description]) => ({
          title,
          description,
        })),
        weekly: template.weekly,
        today: template.today,
        effort: template.effort,
      });

      setIsGeneratingPlan(false);
      setIsIntakeModalOpen(false);
      setIsPlanModalOpen(true);
    }, 900);
  };

  const handleStartPlan = () => {
    if (!generatedPlan) return;

    const goalId = Date.now();
    const today = getTodayDate();

    const goal = {
      id: goalId,
      title: generatedPlan.goal,
      description: generatedPlan.outcome,
      category: generatedPlan.category,
      targetDate: newGoal.targetDate,
      image: newGoal.image,
      progress: 0,
    };

    const planActions = generatedPlan.today.map((title, index) => ({
      id: goalId + index + 1,
      title,
      completed: false,
      goalId,
      date: today,
    }));

    setGoals((currentGoals) => [...currentGoals, goal]);
    setActions((currentActions) => [...currentActions, ...planActions]);
    setGeneratedPlan(null);
    setIsPlanModalOpen(false);
    setActivePage("Today");

    setNewGoal({
      title: "",
      description: "",
      category: "Personal",
      targetDate: "",
      image: "",
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUseVision = () => {
    if (!previewImage) return;

    setVisionImage(previewImage);
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setPreviewImage(null);
  };
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setVisionImage(imageUrl);
  };
  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      {" "}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className="hidden w-64 p-5 transition-colors duration-200 lg:flex lg:flex-col"
          style={{
            backgroundColor: "var(--app-surface)",
            borderColor: "var(--app-border)",
          }}
        >
          {" "}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500">
              <Sparkles size={20} />
            </div>

            <div>
              <h1 className="font-semibold">Visual Tracker</h1>
              <p className="text-xs text-white/40">Design your future</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActivePage(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    activePage === item.label
                      ? "bg-purple-500/15 text-purple-300"
                      : "text-white/55 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto">
            <button
              type="button"
              onClick={() =>
                setTheme((currentTheme) =>
                  currentTheme === "dark" ? "light" : "dark",
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              {theme === "dark" ? "☀️" : "🌙"}

              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {activePage === "Today" ? (
            <TodayPage
              todayActions={todayActions}
              goals={goals}
              completedActions={completedActions}
              handleToggleAction={handleToggleAction}
              handleEditAction={handleEditAction}
              handleDeleteAction={handleDeleteAction}
              setIsActionModalOpen={setIsActionModalOpen}
            />
          ) : activePage === "Affirmations" ? (
            <AffirmationsPage />
          ) : activePage === "Journal" ? (
            <JournalPage />
          ) : (
            <>
              {/* Header */}
              <header
                className="flex items-center justify-between border-b px-6 py-5 transition-colors duration-200 lg:px-10"
                style={{
                  borderColor: "var(--app-border)",
                }}
              >
                {" "}
                <div>
                  {/* <p className="text-sm text-white/40">Friday, August 21</p> */}
                  <p className="text-sm text-white/40">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Good morning, Tanvi ✨
                  </h2>
                </div>
                {/* LIVE CLOCK */}
                <div className="ml-auto mr-6 hidden items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/[0.06] px-4 py-2.5 sm:flex">
                  <span className="text-sm text-purple-300">◷</span>

                  <span className="text-sm font-medium text-white/80">
                    {currentTime.toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                {/* <button className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium transition hover:bg-purple-400">
              <Plus size={17} />
              New Goal
            </button> */}
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium transition hover:bg-purple-400"
                >
                  <Plus size={17} />
                  New Goal
                </button>
              </header>

              <div className="space-y-8 p-6 lg:p-10">
                {/* Vision Hero */}
                <section className="relative overflow-hidden rounded-3xl border border-white/10">
                  <div
                    className="min-h-[360px] bg-cover bg-center"
                    style={{
                      backgroundImage: `
 linear-gradient(
  to right,
  rgba(10,10,15,.96),
  rgba(10,10,15,.35)
),
  url('${visionImage}')
`,
                    }}
                  >
                    <div className="flex min-h-[360px] max-w-xl flex-col justify-center p-8 lg:p-12">
                      <span className="vision-hero-muted mb-4 w-fit rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs">
                        {" "}
                        MY VISION
                      </span>

                      <h3 className="vision-hero-text text-4xl font-semibold leading-tight lg:text-5xl">
                        {" "}
                        Build the life
                        <br />
                        you can already see.
                      </h3>

                      <p className="vision-hero-muted mt-4 max-w-md text-sm leading-6">
                        {" "}
                        Turn your biggest dreams into visible goals and daily
                        actions.
                      </p>

                      <div className="mt-7 flex gap-3">
                        {/* <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black">
                      <Sparkles size={17} />
                      AI Visualize
                    </button> */}
                        <button
                          type="button"
                          onClick={() => setIsAiModalOpen(true)}
                          className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                        >
                          <Sparkles size={17} />
                          AI Visualize
                        </button>

                        <>
                          {/* <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
  >
    Change Image
  </button> */}
                          <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(true)}
                            className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
                          >
                            Change Image
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Metrics */}
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {/* <Metric
                label="Today's Progress"
                value="78%"
                detail="7 / 9 actions"
              /> */}
                  <Metric
                    label="Today's Progress"
                    value={`${todayProgress}%`}
                    detail={`${completedActions} / ${totalActions} actions`}
                  />

                  <Metric
                    label="Current Streak"
                    value="12"
                    detail="days"
                    icon={<Flame size={17} />}
                  />

                  <Metric label="Goals" value="4" detail="active" />

                  <Metric
                    label="Vision Score"
                    value="86%"
                    detail="this month"
                  />
                </section>

                {/* Goals */}
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">My Goals</h3>
                      <p className="mt-1 text-sm text-white/40">
                        Your future, broken into achievable pieces.
                      </p>
                    </div>

                    <button className="flex items-center gap-1 text-sm text-purple-300">
                      View all
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {goalsWithProgress.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        {...goal}
                        onEdit={() => handleEditGoal(goal.id)}
                        onDelete={() => handleDeleteGoal(goal.id)}
                      />
                    ))}
                  </div>
                </section>

                {/* Today's Actions */}
                <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                  <div className="mb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Today's Actions
                        </h3>

                        <p className="mt-1 text-sm text-white/40">
                          Small actions create the bigger identity.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsActionModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium transition hover:bg-purple-400"
                      >
                        <Plus size={16} />
                        Add Action
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-3">
                      {todayActions.map((action) => (
                        <div
                          key={action.id}
                          className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:bg-white/[0.05]"
                        >
                          <input
                            type="checkbox"
                            checked={action.completed}
                            onChange={() => handleToggleAction(action.id)}
                            className="h-5 w-5 accent-purple-500"
                          />

                          <span
                            className={
                              action.completed
                                ? "flex-1 text-white/40 line-through"
                                : "flex-1 text-white/80"
                            }
                          >
                            {action.title}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleEditAction(action.id)}
                            className="rounded-lg px-2 py-1 text-xs text-white/40 transition hover:bg-white/5 hover:text-white"
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAction(action.id)}
                            className="rounded-lg px-2 py-1 text-xs text-red-300/60 transition hover:bg-red-500/10 hover:text-red-300"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {todayActions.length === 0 && (
                        <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/35">
                          No actions planned for today. ✨
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">Upcoming</h3>

                    <p className="mt-1 text-sm text-white/40">
                      Things you're planning for the days ahead.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {upcomingActions.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-white/80">
                            {action.title}
                          </p>

                          <p className="mt-1 text-xs text-purple-300/70">
                            {new Date(action.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>

                        <span className="text-xs text-white/30">
                          {goals.find((goal) => goal.id === action.goalId)
                            ?.title || "No goal"}
                        </span>
                      </div>
                    ))}

                    {upcomingActions.length === 0 && (
                      <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/35">
                        Nothing planned yet. Add something for a future day. ✨
                      </div>
                    )}
                  </div>
                </section>
              </div>
              {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
                  <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#14141c] p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          Change your vision
                        </h3>

                        <p className="mt-1 text-sm text-white/40">
                          Upload an image that represents the life you're
                          building.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(false)}
                        className="rounded-lg px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <label className="mt-6 flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-center transition hover:border-purple-500/50">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Vision preview"
                          className="h-64 w-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                            <Image size={26} />
                          </div>

                          <p className="font-medium">Upload your vision</p>

                          <p className="mt-2 text-sm text-white/35">
                            PNG, JPG or WEBP
                          </p>
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>

                    {selectedFile && (
                      <p className="mt-3 truncate text-sm text-white/40">
                        {selectedFile.name}
                      </p>
                    )}

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(false)}
                        className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 hover:bg-white/5"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={!previewImage}
                        onClick={handleUseVision}
                        className="flex-1 rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Use This Vision
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#14141c] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  {editingGoalId ? "Edit goal" : "Create a new goal"}
                </h3>

                <p className="mt-1 text-sm text-white/40">
                  Turn something you want into something you can track.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="rounded-lg px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-medium">Goal name</label>

                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Build my dream company"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>

                <textarea
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      description: e.target.value,
                    })
                  }
                  placeholder="What does achieving this goal mean to you?"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Goal visual</label>

                <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  {newGoal.image ? (
                    <div className="relative">
                      <img
                        src={newGoal.image}
                        alt="Goal visual"
                        className="h-48 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setNewGoal((currentGoal) => ({
                            ...currentGoal,
                            image: "",
                          }))
                        }
                        className="absolute right-3 top-3 rounded-lg bg-black/60 px-3 py-2 text-xs text-white backdrop-blur transition hover:bg-black/80"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-48 cursor-pointer flex-col items-center justify-center text-center transition hover:bg-white/[0.04]">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                        <Image size={22} />
                      </div>

                      <p className="text-sm font-medium">
                        Upload a visual for this goal
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        PNG, JPG or WEBP
                      </p>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleGoalImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!newGoal.title.trim() || isGeneratingPlan}
                  onClick={handleGeneratePlan}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm text-purple-300 transition hover:bg-purple-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sparkles size={16} />
                  {isGeneratingPlan
                    ? "Building your plan..."
                    : "Generate My Plan"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Category</label>

                  <select
                    value={newGoal.category}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        category: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#14141c] px-4 py-3 text-sm outline-none focus:border-purple-500/50"
                  >
                    <option>Personal</option>
                    <option>Career</option>
                    <option>Finance</option>
                    <option>Health</option>
                    <option>Relationships</option>
                    <option>Travel</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Target date</label>

                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        targetDate: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#14141c] px-4 py-3 text-sm outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!newGoal.title.trim()}
                onClick={handleCreateGoal}
                className="flex-1 rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {editingGoalId ? "Save Changes" : "Create Goal"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isPlanModalOpen && generatedPlan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-[#14141c] p-6 lg:p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-purple-300">
                  <Sparkles size={18} />
                  <span className="text-xs font-medium uppercase tracking-[0.18em]">
                    AI Plan
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-semibold">
                    {generatedPlan.goal}
                  </h3>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/50">
                    {generatedPlan.category}
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
                  {generatedPlan.outcome}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="rounded-lg px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <section className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-purple-300/80">
                How the plan works
              </p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {generatedPlan.approach}
              </p>
            </section>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
              <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Milestones</h4>
                  <span className="text-xs text-white/30">4 stages</span>
                </div>
                <div className="mt-4 space-y-3">
                  {generatedPlan.milestones.map((milestone, index) => (
                    <div
                      key={milestone.title}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-xs text-purple-300">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium">
                            {milestone.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/35">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="space-y-5">
                <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <h4 className="font-semibold">This week</h4>
                  <div className="mt-4 space-y-3">
                    {generatedPlan.weekly.map((item, index) => (
                      <div
                        key={item}
                        className="flex gap-3 text-sm text-white/70"
                      >
                        <span className="text-purple-300">0{index + 1}</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.06] p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Today</h4>
                    <span className="text-xs text-purple-300">
                      {generatedPlan.effort}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {generatedPlan.today.map((item, index) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 text-sm text-white/75"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-purple-400/40 text-[10px] text-purple-300">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsPlanModalOpen(false);
                  setIsGoalModalOpen(true);
                }}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 hover:bg-white/5"
              >
                Edit Goal
              </button>
              <button
                type="button"
                onClick={handleStartPlan}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium transition hover:bg-purple-400"
              >
                <Sparkles size={17} />
                Start My Plan
              </button>
            </div>
          </div>
        </div>
      )}
      {isIntakeModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#14141c] p-6 lg:p-8">
            {(() => {
              const goalType =
                goalIntake.goalType ||
                getGoalType(newGoal.category, newGoal.title);
              const questions = getGoalQuestions(goalType);

              return (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-purple-300">
                        <Sparkles size={18} />
                        <span className="text-xs font-medium uppercase tracking-[0.18em]">
                          Understand your goal
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold">
                        Let's make this personal.
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/40">
                        I detected this as a{" "}
                        <span className="text-white/70">{goalType}</span> goal.
                        A few details will help create a useful plan instead of
                        a generic checklist.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsIntakeModalOpen(false)}
                      className="rounded-lg px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-7 space-y-5">
                    {questions.map((question) => (
                      <div key={question.id}>
                        <label className="text-sm font-medium">
                          {question.label}
                        </label>
                        <input
                          type={question.type}
                          value={goalIntake[question.id] || ""}
                          onChange={(event) =>
                            setGoalIntake((current) => ({
                              ...current,
                              [question.id]: event.target.value,
                            }))
                          }
                          placeholder={question.placeholder}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-purple-500/50"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsIntakeModalOpen(false);
                        setIsGoalModalOpen(true);
                      }}
                      className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 hover:bg-white/5"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={
                        isGeneratingPlan ||
                        questions.some(
                          (question) =>
                            !String(goalIntake[question.id] || "").trim(),
                        )
                      }
                      onClick={handleBuildPlan}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Sparkles size={17} />
                      {isGeneratingPlan
                        ? "Building your plan..."
                        : "Build My Plan"}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      {isActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#14141c] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  {editingActionId ? "Edit action" : "Add an action"}
                </h3>

                <p className="mt-1 text-sm text-white/40">
                  Turn your goal into something you can do today.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsActionModalOpen(false)}
                className="rounded-lg px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {/* Action name */}
              <div>
                <label className="text-sm font-medium">
                  What do you want to do?
                </label>

                <input
                  type="text"
                  value={newAction.title}
                  onChange={(e) =>
                    setNewAction({
                      ...newAction,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Go to the gym"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium">When?</label>

                <input
                  type="date"
                  value={newAction.date}
                  onChange={(e) =>
                    setNewAction({
                      ...newAction,
                      date: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#14141c] px-4 py-3 text-sm outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Goal */}
              <div>
                <label className="text-sm font-medium">
                  Which goal does this support?
                </label>

                <select
                  value={newAction.goalId}
                  onChange={(e) =>
                    setNewAction({
                      ...newAction,
                      goalId: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#14141c] px-4 py-3 text-sm outline-none focus:border-purple-500/50"
                >
                  <option value="">Select a goal</option>

                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setIsActionModalOpen(false)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!newAction.title.trim() || !newAction.goalId}
                onClick={handleCreateAction}
                className="flex-1 rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {editingActionId ? "Save Changes" : "Add Action"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#14141c] p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                    <Sparkles size={18} />
                  </div>

                  <h3 className="text-xl font-semibold">
                    Visualize Your Future
                  </h3>
                </div>

                <p className="mt-2 text-sm text-white/40">
                  Describe the life you want to see.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="rounded-lg px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium">
                What do you want to visualize?
              </label>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Example: Me as a successful tech entrepreneur working in my dream office overlooking a beautiful city..."
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-500/50"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium">Visual style</label>

              <div className="mt-3 grid grid-cols-3 gap-3">
                {["Photorealistic", "Cinematic", "Editorial"].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setAiStyle(style)}
                    className={`rounded-xl border px-3 py-3 text-sm transition ${
                      aiStyle === style
                        ? "border-purple-500 bg-purple-500/15 text-purple-200"
                        : "border-white/10 text-white/50 hover:bg-white/5"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {generatedImage && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={generatedImage}
                  alt="Generated vision"
                  className="max-h-80 w-full object-cover"
                />
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!aiPrompt.trim() || isGenerating}
                // onClick={() => {
                //   setIsGenerating(true);

                //   setTimeout(() => {
                //     setGeneratedImage(
                //       "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
                //     );

                //     setIsGenerating(false);
                //   }, 1500);
                // }}
                onClick={() => {
                  console.log("Prompt:", aiPrompt);
                  console.log("Style:", aiStyle);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles size={17} />

                {isGenerating ? "Creating your vision..." : "Generate Vision"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, detail, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center gap-2 text-sm text-white/40">
        {icon}
        {label}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-semibold">{value}</span>
        <span className="mb-1 text-xs text-white/30">{detail}</span>
      </div>
    </div>
  );
}
function GoalCard({
  title,
  description,
  category,
  image,
  progress,
  onEdit,
  onDelete,
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition hover:-translate-y-1 hover:border-purple-500/30">
      {/* Visual */}
      <div className="relative h-44 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500/20 via-white/[0.03] to-black">
            <div className="text-center">
              <Image size={28} className="mx-auto text-purple-300/60" />
              <p className="mt-2 text-xs text-white/30">Add a visual</p>
            </div>
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Category */}
        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] text-white/70 backdrop-blur-md">
          {category}
        </div>

        {/* Goal icon */}
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-md">
          <Target size={15} className="text-purple-300" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="font-medium">{title}</h4>

        <p className="mt-2 min-h-[40px] text-sm leading-5 text-white/40">
          {description}
        </p>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-white/35">Progress</span>
            <span className="font-medium text-white/70">{progress}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            ✏️ Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex-1 rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/10"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function TodayPage({
  todayActions,
  goals,
  completedActions,
  handleToggleAction,
  handleEditAction,
  handleDeleteAction,
  setIsActionModalOpen,
}) {
  const totalTodayActions = todayActions.length;

  const progress =
    totalTodayActions === 0
      ? 0
      : Math.round((completedActions / totalTodayActions) * 100);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      {/* Header */}
      <section>
        <p className="text-sm text-white/40">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold">Today's Focus</h2>

            <p className="mt-2 text-sm text-white/40">
              Small actions create the bigger identity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsActionModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium transition hover:bg-purple-400"
          >
            <Plus size={16} />
            Add Action
          </button>
        </div>
      </section>

      {/* Progress */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-white/40">Today's Progress</p>

            <p className="mt-2 text-4xl font-semibold">{progress}%</p>
          </div>

          <p className="text-sm text-white/40">
            {completedActions} / {totalTodayActions} completed
          </p>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Actions */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Your Actions</h3>

          <p className="mt-1 text-sm text-white/40">
            Focus on what you can do today.
          </p>
        </div>

        <div className="space-y-3">
          {todayActions.map((action) => {
            const goal = goals.find((goal) => goal.id === action.goalId);

            return (
              <div
                key={action.id}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:bg-white/[0.05]"
              >
                <input
                  type="checkbox"
                  checked={action.completed}
                  onChange={() => handleToggleAction(action.id)}
                  className="h-5 w-5 accent-purple-500"
                />

                <div className="flex-1">
                  <p
                    className={
                      action.completed
                        ? "text-white/40 line-through"
                        : "text-white/90"
                    }
                  >
                    {action.title}
                  </p>

                  <p className="mt-1 text-xs text-purple-300/60">
                    {goal?.title || "No goal"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleEditAction(action.id)}
                  className="rounded-lg px-2 py-1 text-xs text-white/40 transition hover:bg-white/5 hover:text-white"
                >
                  ✏️
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteAction(action.id)}
                  className="rounded-lg px-2 py-1 text-xs text-red-300/60 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  🗑️
                </button>
              </div>
            );
          })}

          {todayActions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-sm text-white/40">
                Nothing planned for today.
              </p>

              <button
                type="button"
                onClick={() => setIsActionModalOpen(true)}
                className="mt-4 text-sm text-purple-300 hover:text-purple-200"
              >
                + Add your first action
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
function AffirmationsPage() {
  const [affirmations, setAffirmations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState("");
  const [activeAffirmation, setActiveAffirmation] = useState("");
  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* Page Header */}
      <div>
        <p className="text-sm text-white/35">
          Words for the woman you're becoming
        </p>

        <h2 className="mt-2 text-4xl font-semibold tracking-tight">
          Affirmations
        </h2>

        <p className="mt-3 text-sm text-white/40">
          Return to the thoughts you choose to believe.
        </p>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium transition hover:bg-purple-400"
        >
          <Plus size={16} />
          Add Affirmation
        </button>
      </div>

      {/* Main Affirmation */}
      <section className="relative mt-12 flex min-h-[560px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02]">
        {/* Soft purple glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/[0.08] blur-3xl" />

        <div className="relative max-w-4xl px-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-purple-300/60">
            Today
          </p>

          <h3 className="mt-10 max-w-4xl text-4xl font-medium leading-[1.15] tracking-tight text-white transition-all duration-300 sm:text-5xl lg:text-6xl">
            {activeAffirmation}
          </h3>

          <p className="mt-10 text-sm text-white/25">
            Read it. Feel it. Become it.
          </p>
        </div>
      </section>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#14141c] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Add Affirmation</h3>

                <p className="mt-1 text-sm text-white/40">
                  Write something you want to believe.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <textarea
              value={newAffirmation}
              onChange={(e) => setNewAffirmation(e.target.value)}
              placeholder="I am..."
              rows={5}
              className="mt-6 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm outline-none placeholder:text-white/25 focus:border-purple-500/50"
            />

            <button
              type="button"
              disabled={!newAffirmation.trim()}
              onClick={() => {
                const affirmation = newAffirmation.trim();

                setAffirmations((current) => [...current, affirmation]);

                setActiveAffirmation(affirmation);
                setNewAffirmation("");
                setShowAddModal(false);
              }}
              className="mt-4 w-full rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save Affirmation
            </button>
          </div>
        </div>
      )}
      {/* Affirmation Collection */}
      <section className="mt-10">
        <div className="mb-5">
          <h3 className="text-lg font-semibold">Your affirmations</h3>

          <p className="mt-1 text-sm text-white/35">
            Thoughts you choose to carry with you.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {affirmations.map((affirmation, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveAffirmation(affirmation)}
              className="group min-h-[170px] cursor-pointer rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-purple-400/30 hover:bg-white/[0.04]"
            >
              <span className="text-xs text-white/20">
                {String(index + 1).padStart(2, "0")}
              </span>

              <p className="mt-8 text-sm leading-6 text-white/55 transition-colors duration-300 group-hover:text-white/90">
                {affirmation}
              </p>
              <div className="mt-5 flex gap-2 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // edit logic will go here
                  }}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:bg-white/5 hover:text-white"
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // delete logic will go here
                  }}
                  className="rounded-lg border border-red-400/10 px-3 py-1.5 text-xs text-red-300/50 hover:bg-red-500/10 hover:text-red-300"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export default App;
