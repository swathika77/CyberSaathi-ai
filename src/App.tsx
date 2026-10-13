import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Scenario = {
  id: string
  title: string
  category: string
  difficulty: string
  situation: string
  options: string[]
  correct_option: string
  safer_response: string
  explanation: string
  risk_indicators: string[]
  recommended_action: string
  learning_objective: string
}

type StudentSummary = {
  studentName: string
  missionsCompleted: number
  points: number
  quizCompletion: number
  earnedBadges: string[]
  topicProgress: { topic: string; mastery: number }[]
  recommendedTopics: string[]
  tipOfTheDay: string
  modules: { title: string; progress: number; status: string }[]
}

type TeacherSummary = {
  className: string
  averageProgress: number
  students: { name: string; progress: number; points: number }[]
  topicMastery: { topic: string; mastery: number }[]
  commonMistakes: string[]
  moduleAssignments: { module: string; status: string }[]
}

type SubmissionResult = {
  is_correct: boolean
  score_awarded: number
  points_total: number
  response: {
    selected_option: string
    correct_option: string
    safer_response: string
  }
  ai_feedback: {
    verdict: string
    why_it_matters: string
    warning_signs: string[]
    what_to_do: string
    takeaway: string
    source: string
  }
}

const categoryColors: Record<string, string> = {
  'Cyberbullying': '#4f46e5',
  'Phishing and suspicious links': '#0ea5e9',
  'Privacy and personal information': '#22c55e',
  'Online strangers and manipulation': '#8b5cf6',
  'Password and account security': '#f59e0b',
  'Scams in online games': '#ef4444',
  'Threats and blackmail': '#ec4899',
  'Misinformation and deepfakes': '#14b8a6',
}

const categories = Object.keys(categoryColors)

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

const defaultStudentSummary: StudentSummary = {
  studentName: 'Aarav',
  missionsCompleted: 4,
  points: 312,
  quizCompletion: 72,
  earnedBadges: ['Safety Scout', 'Think Before You Click', 'Privacy Protector'],
  topicProgress: [
    { topic: 'Cyberbullying', mastery: 84 },
    { topic: 'Phishing', mastery: 76 },
    { topic: 'Privacy', mastery: 88 },
    { topic: 'Strangers', mastery: 69 },
    { topic: 'Passwords', mastery: 80 },
    { topic: 'Games', mastery: 73 },
    { topic: 'Threats', mastery: 64 },
    { topic: 'Misinformation', mastery: 78 },
  ],
  recommendedTopics: ['Threats', 'Phishing', 'Misinformation'],
  tipOfTheDay:
    'Pause before you click. If a message feels urgent or unsafe, check it through an official app or a trusted adult.',
  modules: [
    { title: 'Password Protection Basics', progress: 68, status: 'In progress' },
    { title: 'Spotting Fake Messages', progress: 44, status: 'In progress' },
    { title: 'Safe Social Media Habits', progress: 86, status: 'Ready to review' },
  ],
}

const defaultTeacherSummary: TeacherSummary = {
  className: 'Grade 7A Digital Safety',
  averageProgress: 81,
  students: [
    { name: 'Aarav', progress: 85, points: 312 },
    { name: 'Meera', progress: 79, points: 286 },
    { name: 'Rohit', progress: 74, points: 250 },
    { name: 'Sara', progress: 89, points: 340 },
  ],
  topicMastery: [
    { topic: 'Cyberbullying', mastery: 84 },
    { topic: 'Phishing', mastery: 76 },
    { topic: 'Privacy', mastery: 88 },
    { topic: 'Strangers', mastery: 69 },
    { topic: 'Passwords', mastery: 80 },
    { topic: 'Games', mastery: 73 },
    { topic: 'Threats', mastery: 64 },
    { topic: 'Misinformation', mastery: 78 },
  ],
  commonMistakes: [
    'Password sharing in games',
    'Clicking suspicious reward links',
    'Posting personal location publicly',
  ],
  moduleAssignments: [
    { module: 'Phishing Detectives', status: 'Assigned' },
    { module: 'Safe Privacy Settings', status: 'In review' },
    { module: 'Managing Online Friend Requests', status: 'Assigned' },
  ],
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/missions" element={<MissionExperience />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-lg font-bold text-white shadow-sm">
            C
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">CyberSaathi AI</div>
            <div className="text-xs text-slate-500">Think Smart. Stay Safe.</div>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-700 md:flex">
          <a href="#about" className="transition hover:text-blue-600">About</a>
          <a href="#resources" className="transition hover:text-blue-600">Learning Resources</a>
          <a href="#privacy" className="transition hover:text-blue-600">Privacy</a>
          <a href="#disclaimer" className="transition hover:text-blue-600">Disclaimer</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/student" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-700">
            Student
          </Link>
          <Link to="/teacher" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            Teacher
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-20 px-6 pb-20 pt-8">
        <section className="grid items-center gap-10 rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_15px_50px_rgba(15,23,42,0.08)] lg:grid-cols-2 lg:p-12">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              Digital safety learning
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl">
                Build Safer Digital Habits Through Interactive Learning
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                CyberSaathi AI helps children learn how to recognise cyberbullying, scams,
                privacy risks, and online manipulation through realistic decision-making practice.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/student" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/missions" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700">
                Explore Safety Missions
              </Link>
            </div>

            <div className="flex gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 25+ scenarios</div>
              <div className="flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-violet-500" /> AI coach feedback</div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] bg-gradient-to-br from-sky-100 via-white to-violet-100 p-6 shadow-[0_30px_80px_rgba(59,130,246,0.08)]">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <Shield className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">Safe</span>
                  </div>
                  <p className="text-sm text-slate-500">Current mission</p>
                  <p className="mt-2 text-xl font-bold text-slate-800">Spot the scam</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Points</span>
                    <Trophy className="h-4 w-4 text-yellow-300" />
                  </div>
                  <p className="mt-4 text-3xl font-black text-white">312</p>
                  <p className="mt-3 text-sm text-slate-300">Badges unlocked: 3</p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-4 ring-1 ring-violet-100 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">AI decision coach</p>
                      <p className="mt-1 text-lg font-bold text-slate-800">Why it matters</p>
                    </div>
                    <BrainCircuit className="h-5 w-5 text-violet-600" />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Unexpected reward links can be phishing traps. A safer response is to verify through the official app and never share your password.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Interactive missions', description: 'Practice real-world digital choices in fictional but realistic scenarios.' },
            { icon: BrainCircuit, title: 'AI guidance', description: 'Get supportive, age-appropriate feedback after every decision.' },
            { icon: BarChart3, title: 'Teacher insights', description: 'Understand common misconceptions and view class-level progress.' },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-blue-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
              <p className="text-slate-600">{description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[32px] bg-slate-900 p-8 text-white md:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                How AI helps
              </p>
              <h2 className="text-3xl font-black">Education-first feedback, not guesswork</h2>
            </div>
            <div className="space-y-4 text-slate-200">
              <p>
                CyberSaathi AI uses reviewed scenario answer keys and tailored explanations to guide
                safer decisions. The system explains why a choice is risky or safer in a calm,
                age-appropriate way without shaming incorrect answers.
              </p>
              <p>
                When AI is unavailable, the platform clearly uses a fallback explanation grounded in the
                scenario data and trusted educational guidance.
              </p>
            </div>
          </div>
        </section>

        <section id="privacy" className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Privacy and safety first</h2>
              <p className="mt-3 max-w-3xl text-slate-600">
                We do not collect children’s real names, personal contact details, exact locations, or private conversations. The platform is designed for educational scenarios and fictional student profiles only.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm text-slate-600 md:grid-cols-4">
          <div>
            <p className="text-base font-bold text-slate-900">CyberSaathi AI</p>
            <p className="mt-2">Learn to stay safe online through engaging practice.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">About</p>
            <ul className="mt-2 space-y-2">
              <li>Mission-based learning</li>
              <li>Student and teacher views</li>
              <li>Privacy by design</li>
            </ul>
          </div>
          <div id="resources">
            <p className="font-semibold text-slate-900">Learning Resources</p>
            <ul className="mt-2 space-y-2">
              <li>Online safety guides</li>
              <li>Family safety tips</li>
              <li>School lesson planning</li>
            </ul>
          </div>
          <div id="disclaimer">
            <p className="font-semibold text-slate-900">Legal</p>
            <ul className="mt-2 space-y-2">
              <li>Privacy</li>
              <li>Disclaimer</li>
              <li>Educational use only</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StudentDashboard() {
  const [summary, setSummary] = useState<StudentSummary | null>(null)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchJson<StudentSummary>('/api/student-summary')
        setSummary(data)
      } catch {
        setSummary(defaultStudentSummary)
      }
    }

    void loadSummary()
  }, [])

  const resolvedSummary = summary ?? defaultStudentSummary

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Student dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Welcome back, {resolvedSummary.studentName}!</h1>
          </div>
          <Link to="/missions" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
            Start Learning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Missions completed', value: resolvedSummary.missionsCompleted, icon: Target },
            { label: 'Total learning points', value: `${resolvedSummary.points}`, icon: Trophy },
            { label: 'Quiz completion', value: `${resolvedSummary.quizCompletion}%`, icon: BookOpen },
            { label: 'Earned badges', value: resolvedSummary.earnedBadges.length, icon: Award },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{label}</p>
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-5 text-3xl font-black text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Learning overview</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">On track</span>
            </div>
            <div className="space-y-4">
              {resolvedSummary.topicProgress.map((entry) => (
                <div key={entry.topic}>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                    <span>{entry.topic}</span>
                    <span>{entry.mastery}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-violet-500"
                      style={{ width: `${entry.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-slate-900">
              <Sparkles className="h-5 w-5 text-violet-500" />
              <h2 className="text-xl font-bold">Safety tip of the day</h2>
            </div>
            <p className="text-slate-600">{resolvedSummary.tipOfTheDay}</p>
          </aside>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Continue learning</h2>
            </div>
            <div className="space-y-4">
              {resolvedSummary.modules.map((module) => (
                <div key={module.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{module.title}</p>
                      <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{module.status}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-600">{module.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500" style={{ width: `${module.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900">Recommended learning</h2>
            </div>
            <div className="space-y-3">
              {resolvedSummary.recommendedTopics.map((topic, index) => (
                <div key={topic} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-700">{topic}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {resolvedSummary.earnedBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {badge}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function MissionExperience() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  const visibleScenarios = useMemo(
    () => scenarios.filter((scenario) => scenario.category === selectedCategory),
    [scenarios, selectedCategory],
  )

  const currentScenario = visibleScenarios[currentIndex] ?? null

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const data = await fetchJson<Scenario[]>('/api/scenarios')
        setScenarios(data)
      } catch {
        setScenarios([])
      } finally {
        setLoading(false)
      }
    }

    void loadScenarios()
  }, [])

  useEffect(() => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setResult(null)
  }, [selectedCategory])

  const handleSubmitAnswer = async () => {
    if (!currentScenario || !selectedAnswer) return

    const payload = {
      scenario_id: currentScenario.id,
      selected_option: selectedAnswer,
    }

    try {
      const evaluation = await fetchJson<SubmissionResult>('/api/submit-scenario', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setResult(evaluation)
      setPoints((previous) => previous + evaluation.score_awarded)
    } catch {
      const fallback: SubmissionResult = {
        is_correct: selectedAnswer.toUpperCase() === currentScenario.correct_option.toUpperCase(),
        score_awarded: selectedAnswer.toUpperCase() === currentScenario.correct_option.toUpperCase() ? 15 : 0,
        points_total: points + (selectedAnswer.toUpperCase() === currentScenario.correct_option.toUpperCase() ? 15 : 0),
        response: {
          selected_option: selectedAnswer.toUpperCase(),
          correct_option: currentScenario.correct_option.toUpperCase(),
          safer_response: currentScenario.safer_response.toUpperCase(),
        },
        ai_feedback: {
          verdict: selectedAnswer.toUpperCase() === currentScenario.correct_option.toUpperCase() ? 'Safer choice' : 'This choice could be risky',
          why_it_matters: currentScenario.explanation,
          warning_signs: currentScenario.risk_indicators,
          what_to_do: currentScenario.recommended_action,
          takeaway: 'Think before you click, share, or meet online. Safety tools and trusted adults help keep you protected.',
          source: 'fallback-explanation',
        },
      }
      setResult(fallback)
      setPoints((previous) => previous + fallback.score_awarded)
    }
  }

  const handleNextScenario = () => {
    if (!visibleScenarios.length) return
    const nextIndex = currentIndex + 1
    if (nextIndex < visibleScenarios.length) {
      setCurrentIndex(nextIndex)
      setSelectedAnswer(null)
      setResult(null)
      return
    }

    setCurrentIndex(0)
    setSelectedAnswer(null)
    setResult(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-lg font-semibold text-slate-700">
        Loading safety missions...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">AI safety missions</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Practice safer digital decisions</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
            <Trophy className="h-4 w-4" />
            {points} points
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.4fr]">
          <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Choose a category</h2>
            <div className="mt-4 space-y-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    selectedCategory === category
                      ? 'border-violet-400 bg-violet-50 text-violet-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{category}</span>
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: categoryColors[category] }} />
                </button>
              ))}
            </div>
          </aside>

          <main className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            {currentScenario ? (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700" style={{ backgroundColor: `${categoryColors[selectedCategory]}20`, color: categoryColors[selectedCategory] }}>
                      {selectedCategory}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                      {currentScenario.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Scenario {Math.min(currentIndex + 1, visibleScenarios.length)} of {visibleScenarios.length}
                  </p>
                </div>

                <h2 className="text-2xl font-black text-slate-900">{currentScenario.title}</h2>
                <p className="mt-4 text-base leading-7 text-slate-700">{currentScenario.situation}</p>

                <div className="mt-6 space-y-3">
                  {currentScenario.options.map((option) => {
                    const optionKey = option[0]?.toUpperCase() ?? 'A'
                    const isSelected = selectedAnswer === optionKey
                    const isCorrect = result && optionKey === result.response.correct_option
                    const isChosenWrong = result && selectedAnswer === optionKey && !result.is_correct

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSelectedAnswer(optionKey)}
                        className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        } ${
                          result && isCorrect ? 'border-emerald-400 bg-emerald-50' : ''
                        } ${
                          isChosenWrong ? 'border-rose-300 bg-rose-50' : ''
                        }`}
                        disabled={Boolean(result)}
                      >
                        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                          {optionKey}
                        </span>
                        <span className="text-sm leading-6 text-slate-700">{option.replace(/^[A-D]\./, '')}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {!result ? (
                    <button
                      type="button"
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Check my answer
                      <ShieldCheck className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextScenario}
                      className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
                    >
                      Next scenario
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                  <div className="text-sm text-slate-500">Learning objective: {currentScenario.learning_objective}</div>
                </div>

                {result && (
                  <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      {result.is_correct ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{result.ai_feedback.verdict}</h3>
                        <p className="text-sm text-slate-500">{result.ai_feedback.source === 'fallback-explanation' ? 'Fallback explanation used' : 'AI explanation'}</p>
                      </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Why this matters</p>
                        <p className="text-slate-700">{result.ai_feedback.why_it_matters}</p>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">What to do</p>
                        <p className="text-slate-700">{result.ai_feedback.what_to_do}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                      <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Warning signs</p>
                        <ul className="space-y-2 text-slate-700">
                          {result.ai_feedback.warning_signs.map((sign) => (
                            <li key={sign} className="flex items-start gap-2">
                              <span className="mt-1 h-2 w-2 rounded-full bg-violet-500" />
                              <span>{sign}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Takeaway</p>
                        <p className="text-slate-700">{result.ai_feedback.takeaway}</p>
                        <div className="mt-4 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                          Correct safer response: {result.response.correct_option}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
                No scenarios available for this category yet.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function TeacherDashboard() {
  const [summary, setSummary] = useState<TeacherSummary | null>(null)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchJson<TeacherSummary>('/api/teacher-summary')
        setSummary(data)
      } catch {
        setSummary(defaultTeacherSummary)
      }
    }

    void loadSummary()
  }, [])

  const resolvedSummary = summary ?? defaultTeacherSummary

  const barData = resolvedSummary.topicMastery.map((entry) => ({
    name: entry.topic,
    mastery: entry.mastery,
  }))

  const pieData = [
    { name: 'Completed', value: 72 },
    { name: 'Needs review', value: 18 },
    { name: 'Not started', value: 10 },
  ]

  const pieColors = ['#4f46e5', '#22c55e', '#cbd5e1']

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Teacher dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">{resolvedSummary.className}</h1>
          </div>
          <Link to="/student" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
            Student view
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Average progress', value: `${resolvedSummary.averageProgress}%`, icon: BarChart3 },
            { label: 'Students tracked', value: resolvedSummary.students.length, icon: Users },
            { label: 'Common challenges', value: resolvedSummary.commonMistakes.length, icon: AlertTriangle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{label}</p>
                <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-5 text-3xl font-black text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Topic-wise progress</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-8} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="mastery" radius={[10, 10, 0, 0]} fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Class completion</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={4}>
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold text-slate-900">Student summary</h2>
            <div className="space-y-4">
              {resolvedSummary.students.map((student) => (
                <div key={student.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{student.name}</p>
                      <p className="text-sm text-slate-500">{student.points} points</p>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{student.progress}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${student.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold text-slate-900">Common misunderstandings</h2>
            <ul className="space-y-3">
              {resolvedSummary.commonMistakes.map((mistake) => (
                <li key={mistake} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="mb-3 text-lg font-bold text-slate-900">Module assignments</h3>
              <div className="space-y-2">
                {resolvedSummary.moduleAssignments.map((module) => (
                  <div key={module.module} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-medium text-slate-700">{module.module}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                      {module.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
