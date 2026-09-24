import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Lock,
} from 'lucide-react'

const SUGGESTED_PROMPTS = [
  {
    title: 'Maintenance Schedule',
    prompt: 'Pump P-101 ki servicing kab karni hai?',
    category: 'Operations',
    icon: FileText,
  },
  {
    title: 'Safety Compliance',
    prompt: 'Safety SOP ka summary do',
    category: 'Compliance',
    icon: ShieldCheck,
  },
  {
    title: 'Artifact Generation',
    prompt: 'Maintenance checklist ki Excel bana do',
    category: 'Automation',
    icon: FileSpreadsheet,
  },
]

const CAPABILITIES = [
  {
    icon: Lock,
    title: 'Air-Gapped Isolation',
    description:
      'Engineered specifically for Indian PSUs and defence units. Runs with zero external internet access, strictly confined to your secure local hardware.',
  },
  {
    icon: Database,
    title: 'Bilingual Technical OCR & RAG',
    description:
      'Ingests scanned technical manuals, engineering schematics, and SOPs in English and Hindi with high-precision local document retrieval.',
  },
  {
    icon: Cpu,
    title: 'Local Agentic Execution',
    description:
      'Autonomous multi-step reasoning models that generate downloadable spreadsheets, reports, and calculations on local GPUs without external APIs.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [inputQuery, setInputQuery] = useState('')
  const [selectedMode, setSelectedMode] = useState<'auto' | 'fast' | 'smart'>('auto')
  const [useKnowledge, setUseKnowledge] = useState(true)

  const handleStartChat = (query?: string) => {
    const text = (query ?? inputQuery).trim()
    if (text) {
      navigate('/chat', { state: { prefill: text } })
    } else {
      navigate('/chat')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleStartChat()
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-bg text-text selection:bg-accent selection:text-bg">
      {/* Hero Container */}
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Status Pill Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/30">
            <span className="h-2 w-2 rounded-full bg-ok animate-status-pulse" aria-hidden="true" />
            <span>Air-Gapped Operational AI · 100% Offline & Secure</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Autonomous intelligence for <br className="hidden sm:inline" />
            <span className="text-accent">mission-critical engineering.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Air-gapped AI assistant built for Indian PSUs and defence establishments. Query technical manuals,
            automate compliance SOPs, and generate spreadsheets completely offline on local infrastructure.
          </p>
        </div>

        {/* Primary Action Buttons (Get Started) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleStartChat()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-bg shadow-sm transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          >
            Get Started
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/system')}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-bg px-5 text-sm font-medium text-text transition-colors duration-150 hover:bg-panel"
          >
            <ShieldCheck size={16} className="text-ok" />
            System Monitor
          </button>
          <button
            type="button"
            onClick={() => navigate('/knowledge')}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-bg px-5 text-sm font-medium text-text transition-colors duration-150 hover:bg-panel"
          >
            <Database size={16} className="text-muted" />
            Knowledge Base
          </button>
        </div>

        {/* Floating Quick Prompt Box */}
        <div className="mx-auto mt-10 w-full max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="relative rounded-2xl border border-line bg-panel/60 p-3 shadow-sm transition-all duration-150 focus-within:border-accent/40 focus-within:shadow-md"
          >
            <div className="flex items-center gap-3 rounded-xl border border-line bg-bg px-4 py-2.5">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask a technical question, query equipment manuals, or request an Excel report..."
                className="w-full bg-transparent text-sm text-text placeholder:text-muted outline-none"
              />
              <button
                type="submit"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-opacity duration-150 hover:opacity-85 disabled:opacity-30"
                aria-label="Send query"
                title="Send query"
              >
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Quick Controls Bottom Bar */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted">Mode:</span>
                <div className="flex items-center rounded-lg bg-bg p-0.5" role="radiogroup" aria-label="Model mode">
                  {(['auto', 'fast', 'smart'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={selectedMode === m}
                      onClick={() => setSelectedMode(m)}
                      className={`rounded-md px-2.5 py-0.5 capitalize transition-all duration-150 ${
                        selectedMode === m
                          ? 'bg-panel text-text font-medium shadow-sm'
                          : 'text-muted hover:text-text'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 text-muted select-none">
                  <span className="relative inline-flex h-4 w-7 shrink-0 items-center">
                    <input
                      type="checkbox"
                      checked={useKnowledge}
                      onChange={(e) => setUseKnowledge(e.target.checked)}
                      className="sr-only peer"
                    />
                    <span
                      className="absolute inset-0 rounded-full bg-line transition-colors duration-150 peer-checked:bg-accent"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute left-0.5 h-3 w-3 rounded-full bg-bg shadow-sm transition-transform duration-150 peer-checked:translate-x-3"
                      aria-hidden="true"
                    />
                  </span>
                  <span className={useKnowledge ? 'text-text font-medium' : ''}>Use company documents</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Suggestion Prompt Cards */}
        <div className="mx-auto mt-6 w-full max-w-3xl">
          <div className="grid gap-3 sm:grid-cols-3">
            {SUGGESTED_PROMPTS.map(({ title, prompt, category, icon: Icon }) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleStartChat(prompt)}
                className="group flex flex-col justify-between rounded-xl border border-line bg-panel/40 p-3.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-panel"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted">{category}</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-bg text-muted transition-colors group-hover:text-text">
                    <Icon size={13} />
                  </div>
                </div>
                <div className="mt-3">
                  <h2 className="text-xs font-semibold text-text">{title}</h2>
                  <p className="mt-1 line-clamp-2 text-xs text-muted leading-relaxed group-hover:text-text/80">
                    "{prompt}"
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-muted group-hover:text-text">
                  <span>Try prompt</span>
                  <ArrowRight size={11} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="mx-auto mt-16 w-full max-w-4xl">
          <div className="text-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Architecture & Security</h2>
            <p className="mt-1 text-base font-semibold tracking-tight text-text">
              Zero cloud telemetry. Designed for sensitive defence enclaves.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {CAPABILITIES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col rounded-2xl border border-line bg-panel/30 p-5 transition-colors duration-150 hover:border-line"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-panel text-text">
                  <Icon size={18} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-text">{title}</h3>
                <p className="mt-1.5 text-xs text-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick System Bar */}
        <div className="mx-auto mt-12 mb-4 flex w-full max-w-3xl items-center justify-between rounded-xl border border-line bg-panel/50 px-4 py-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-ok" />
            <span className="font-medium text-text">Local Engine Verified</span>
            <span>· All ports firewalled</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono tabular-nums">0 outbound</span>
            <button
              onClick={() => handleStartChat()}
              className="font-medium text-text underline underline-offset-4 transition-colors hover:text-link"
            >
              Open Workbench →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
