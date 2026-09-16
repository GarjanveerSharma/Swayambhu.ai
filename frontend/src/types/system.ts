export interface ModelInfo {
  name: string
  role: 'fast' | 'reasoning' | 'vision' | 'embedding'
  size: string
  status: 'loaded' | 'idle'
}

export interface ServiceHealth {
  name: string
  up: boolean
}

export interface ResourceUsage {
  ramUsedGb: number
  ramTotalGb: number
  gpuUsedGb: number
  gpuTotalGb: number
}

export interface SystemStatus {
  models: ModelInfo[]
  services: ServiceHealth[]
  resources: ResourceUsage
}
