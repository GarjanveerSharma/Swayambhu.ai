import type { Message } from '../../../types/chat'
import ModelBadge from './ModelBadge'
import AgentSteps from './AgentSteps'
import MarkdownRenderer from './MarkdownRenderer'
import SourcesPanel from './SourcesPanel'
import FileCard from './FileCard'
import MessageActions from './MessageActions'
import TypingIndicator from './TypingIndicator'

interface Props {
  message: Message
  streaming: boolean
  canRegenerate: boolean
  onRegenerate: () => void
}

export default function AssistantMessage({ message, streaming, canRegenerate, onRegenerate }: Props) {
  const { model, durationMs, steps, content, sources, files, error } = message
  return (
    <div className="group flex flex-col gap-3">
      {/* Model meta line — small, muted, above the response */}
      {model && <ModelBadge model={model} durationMs={durationMs} />}

      {/* Agent steps */}
      {steps && steps.length > 0 && <AgentSteps steps={steps} streaming={streaming} />}

      {/* Main content — NO card, NO border, plain text on page */}
      <div className="flex flex-col gap-3">
        {content ? (
          <MarkdownRenderer content={content} />
        ) : streaming ? (
          <TypingIndicator />
        ) : null}
        {error && <p className="text-sm text-err">Error: {error}</p>}
      </div>

      {/* Sources */}
      {sources && sources.length > 0 && <SourcesPanel sources={sources} />}

      {/* Generated files */}
      {files && files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f) => <FileCard key={f.id} file={f} />)}
        </div>
      )}

      {/* Actions — muted, visible on group-hover (always visible on touch) */}
      {!streaming && content && (
        <MessageActions
          content={content}
          canRegenerate={canRegenerate}
          onRegenerate={onRegenerate}
        />
      )}
    </div>
  )
}
