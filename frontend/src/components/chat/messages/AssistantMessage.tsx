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
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-panel p-3">
      {model && <ModelBadge model={model} durationMs={durationMs} />}
      {steps && steps.length > 0 && <AgentSteps steps={steps} />}
      {content ? <MarkdownRenderer content={content} /> : streaming && <TypingIndicator />}
      {error && <p className="text-sm text-err">Error: {error}</p>}
      {sources && sources.length > 0 && <SourcesPanel sources={sources} />}
      {files && files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f) => <FileCard key={f.id} file={f} />)}
        </div>
      )}
      {!streaming && content && <MessageActions content={content} canRegenerate={canRegenerate} onRegenerate={onRegenerate} />}
    </div>
  )
}
