import { useRef, useState } from "react";

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
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Goals", icon: Target },
  { label: "Today", icon: CheckSquare },
  { label: "Progress", icon: TrendingUp },
  { label: "Journal", icon: BookOpen },
  { label: "Vision Board", icon: Image },
  { label: "AI Visualize", icon: Sparkles },
  { label: "Analytics", icon: BarChart3 },
];

// const goals = [
//   {
//     title: "Wealth",
//     description: "Build financial freedom",
//     progress: 72,
//   },
//   {
//     title: "Fitness",
//     description: "Become my strongest self",
//     progress: 64,
//   },
//   {
//     title: "Career",
//     description: "Build exceptional products",
//     progress: 81,
//   },
//   {
//     title: "Lifestyle",
//     description: "Create my dream life",
//     progress: 58,
//   },
// ];

const actions = [
  { title: "Morning workout", completed: true },
  { title: "Build Visual Tracker", completed: true },
  { title: "Learn MERN", completed: true },
  { title: "Create content", completed: false },
  { title: "Read / journal", completed: false },
];

function App() {
  const [goals, setGoals] = useState([
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
  ]);
  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description || "Build this part of my dream life.",
      category: newGoal.category,
      targetDate: newGoal.targetDate,
      progress: 0,
    };

    setGoals((currentGoals) => [...currentGoals, goal]);

    setNewGoal({
      title: "",
      description: "",
      category: "Personal",
      targetDate: "",
    });

    setIsGoalModalOpen(false);
  };
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

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "Personal",
    targetDate: "",
  });
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
    <div className="min-h-screen bg-[#0b0b10] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-white/10 bg-[#0f0f15] p-5 lg:flex lg:flex-col">
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
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    item.active
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
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/50 hover:bg-white/5 hover:text-white">
              <Settings size={18} />
              Settings
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 lg:px-10">
            <div>
              <p className="text-sm text-white/40">Friday, August 21</p>
              <h2 className="mt-1 text-xl font-semibold">
                Good morning, Tanvi ✨
              </h2>
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
    rgba(10,10,15,.92),
    rgba(10,10,15,.25)
  ),
  url('${visionImage}')
`,
                }}
              >
                <div className="flex min-h-[360px] max-w-xl flex-col justify-center p-8 lg:p-12">
                  <span className="mb-4 w-fit rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/60">
                    MY VISION
                  </span>

                  <h3 className="text-4xl font-semibold leading-tight lg:text-5xl">
                    Build the life
                    <br />
                    you can already see.
                  </h3>

                  <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
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
              <Metric
                label="Today's Progress"
                value="78%"
                detail="7 / 9 actions"
              />

              <Metric
                label="Current Streak"
                value="12"
                detail="days"
                icon={<Flame size={17} />}
              />

              <Metric label="Goals" value="4" detail="active" />

              <Metric label="Vision Score" value="86%" detail="this month" />
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
                {goals.map((goal) => (
                  <GoalCard key={goal.title} {...goal} />
                ))}
              </div>
            </section>

            {/* Today's Actions */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Today's Actions</h3>
                <p className="mt-1 text-sm text-white/40">
                  Small actions create the bigger identity.
                </p>
              </div>

              <div className="space-y-3">
                {actions.map((action) => (
                  <label
                    key={action.title}
                    className="flex cursor-pointer items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:bg-white/[0.05]"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={action.completed}
                      className="h-5 w-5 accent-purple-500"
                    />

                    <span
                      className={
                        action.completed
                          ? "text-white/40 line-through"
                          : "text-white/80"
                      }
                    >
                      {action.title}
                    </span>
                  </label>
                ))}
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
                      Upload an image that represents the life you're building.
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
        </main>
      </div>
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#14141c] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Create a new goal</h3>

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
                Create Goal
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
                onClick={() => {
                  setIsGenerating(true);

                  setTimeout(() => {
                    setGeneratedImage(
                      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
                    );

                    setIsGenerating(false);
                  }, 1500);
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

function GoalCard({ title, description, progress }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-purple-500/30">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>

        <Target size={17} className="text-purple-300" />
      </div>

      <p className="mt-2 text-sm text-white/40">{description}</p>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-white/35">Progress</span>
          <span className="text-white/70">{progress}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-purple-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
