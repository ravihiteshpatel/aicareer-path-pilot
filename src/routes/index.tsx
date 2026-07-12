import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  BookOpen,
  Hammer,
  Award,
  FileText,
  Cpu,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const WEBHOOK_URL = "https://ravipatel1994.app.n8n.cloud/webhook-test/career-roadmap";

const CAREERS = [
  "AI Engineer","Data Scientist","Machine Learning Engineer","Software Developer",
  "Frontend Developer","Backend Developer","Full Stack Developer","Cloud Engineer",
  "Cyber Security","UI/UX Designer","DevOps Engineer","Blockchain Developer",
  "Mobile App Developer","Prompt Engineer","Digital Marketing","Business Analyst",
  "Chartered Accountant","Doctor","Lawyer","Teacher","Civil Engineer",
  "Mechanical Engineer","Other",
];

const FEATURES = [
  { icon: Sparkles, title: "Personalized Roadmaps", desc: "AI generates a roadmap based on your career and experience." },
  { icon: BookOpen, title: "Best Learning Resources", desc: "Curated YouTube videos, websites, books, and official docs." },
  { icon: Hammer, title: "Projects", desc: "Hands-on project ideas to build your portfolio." },
  { icon: Award, title: "Certifications", desc: "Recommended certifications for your chosen field." },
  { icon: FileText, title: "PDF Delivery", desc: "Receive a professional PDF directly in your inbox." },
  { icon: Cpu, title: "AI Powered", desc: "Built with AI and automation for fast, personalized guidance." },
];

const STEPS = [
  "Enter your details",
  "AI generates your roadmap",
  "PDF is created automatically",
  "Roadmap is emailed to you",
];

const LOADING_MESSAGES = [
  "Analyzing your career...",
  "Finding the best learning resources...",
  "Preparing your roadmap...",
  "Generating PDF...",
  "Sending email...",
  "Please wait...",
];

type Status = "idle" | "loading" | "success" | "error";

function Index() {
  const [status, setStatus] = useState<Status>("idle");
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [career, setCareer] = useState("");
  const [customCareer, setCustomCareer] = useState("");
  const [level, setLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status !== "loading") return;
    const id = setInterval(() => setLoadingIdx((i) => (i + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(id);
  }, [status]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!career) e.career = "Select a career";
    if (career === "Other" && !customCareer.trim()) e.career = "Enter your career";
    if (!level) e.level = "Select an experience level";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === "loading") return;
    if (!validate()) return;
    setStatus("loading");
    setLoadingIdx(0);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          career: career === "Other" ? customCareer.trim() : career,
          level,
          goal: goal.trim(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setName(""); setEmail(""); setCareer(""); setCustomCareer(""); setLevel(""); setGoal("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="#top" className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg text-white shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
              <Rocket className="h-4 w-4" />
            </span>
            <span>CareerPilot AI</span>
          </a>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#form" className="hover:text-foreground">Get roadmap</a>
          </nav>
          <a href="#form">
            <Button size="sm" className="text-white shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
              Get Started
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-40" style={{ background: "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 70%)" }} />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-accent/40 px-3 py-1 text-xs font-medium text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered career guidance
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Build Your Career{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
                Roadmap with AI
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tell us your dream career and current experience level. Our AI creates a personalized learning roadmap with the best courses, YouTube videos, projects, and certifications — emailed to you as a beautiful PDF.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#form">
                <Button size="lg" className="text-white shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
                  Generate My Roadmap <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </a>
              <a href="#features">
                <Button size="lg" variant="outline">Learn More</Button>
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl opacity-30 blur-3xl" style={{ background: "var(--gradient-hero)" }} />
            <img
              src={heroImg}
              alt="AI career learning roadmap illustration"
              width={1280}
              height={1024}
              className="relative rounded-3xl border border-border shadow-[var(--shadow-card)]"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to grow</h2>
          <p className="mt-3 text-muted-foreground">A complete AI learning plan, curated for your goals.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
              <div className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-border" style={{ background: "var(--gradient-soft)" }}>
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-3 text-muted-foreground">From your details to a polished PDF, in four steps.</p>
          </div>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s} className="relative rounded-2xl border border-border bg-card p-6">
                <div className="text-sm font-semibold text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-primary)" }}>
                  Step {i + 1}
                </div>
                <div className="mt-2 font-medium">{s}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Form */}
      <section id="form" className="mx-auto max-w-3xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Generate your roadmap</h2>
          <p className="mt-3 text-muted-foreground">Takes less than a minute. No signup required.</p>
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-10">
          {status === "success" ? (
            <SuccessView onReset={reset} />
          ) : status === "error" ? (
            <ErrorView onRetry={() => setStatus("idle")} />
          ) : status === "loading" ? (
            <LoadingView message={LOADING_MESSAGES[loadingIdx]} />
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <Field label="Full Name" error={errors.name} htmlFor="name">
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" maxLength={100} />
              </Field>
              <Field label="Email Address" error={errors.email} htmlFor="email">
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" maxLength={255} />
              </Field>
              <Field label="Career Interest" error={errors.career} htmlFor="career">
                <Select value={career} onValueChange={setCareer}>
                  <SelectTrigger id="career"><SelectValue placeholder="Select a career" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {CAREERS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {career === "Other" && (
                  <Input
                    className="mt-2"
                    value={customCareer}
                    onChange={(e) => setCustomCareer(e.target.value)}
                    placeholder="Type your career"
                    maxLength={100}
                  />
                )}
              </Field>
              <Field label="Experience Level" error={errors.level} htmlFor="level">
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Optional Goal" htmlFor="goal">
                <Textarea
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder={'Example:\n"I want to become job-ready within 6 months."'}
                  rows={4}
                  maxLength={500}
                />
              </Field>
              <Button
                type="submit"
                size="lg"
                className="w-full text-white shadow-[var(--shadow-glow)] text-base"
                style={{ background: "var(--gradient-primary)" }}
              >
                🚀 Generate My Roadmap
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="grid h-6 w-6 place-items-center rounded-md text-white" style={{ background: "var(--gradient-primary)" }}>
              <Rocket className="h-3 w-3" />
            </span>
            CareerPilot AI
          </div>
          <div>Built with Lovable · n8n · AI — Hackathon 2026</div>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, error, htmlFor, children }: { label: string; error?: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function LoadingView({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full opacity-30" style={{ background: "var(--gradient-primary)" }} />
        <div className="relative grid h-16 w-16 place-items-center rounded-full text-white shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      </div>
      <p className="mt-6 text-lg font-medium">{message}</p>
      <p className="mt-2 text-sm text-muted-foreground">This usually takes 20–40 seconds.</p>
    </div>
  );
}

function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full text-white shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h3 className="mt-6 text-2xl font-bold">Your personalized roadmap is being generated</h3>
      <p className="mt-2 text-muted-foreground">Check your email in the next few minutes.</p>
      <ul className="mt-6 space-y-2 text-left text-sm">
        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Email received</li>
        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> AI roadmap generated</li>
        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> PDF delivery in progress</li>
      </ul>
      <Button onClick={onReset} className="mt-8 text-white" style={{ background: "var(--gradient-primary)" }}>
        Generate Another Roadmap
      </Button>
    </div>
  );
}

function ErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="mt-6 text-2xl font-bold">Something went wrong</h3>
      <p className="mt-2 text-muted-foreground">Please try again.</p>
      <Button onClick={onRetry} className="mt-6" variant="outline">Retry</Button>
    </div>
  );
}
