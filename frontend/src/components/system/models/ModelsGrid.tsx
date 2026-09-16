import type { ModelInfo } from '../../../types/system'
import ModelCard from './ModelCard'

export default function ModelsGrid({ models }: { models: ModelInfo[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {models.map((m) => <ModelCard key={m.name} model={m} />)}
    </div>
  )
}
