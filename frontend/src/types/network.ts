export interface Connection {
  local: string
  remote: string
  process: string
  internal: boolean
}

export interface HistoryPoint {
  time: string
  outbound: number
}

export interface NetworkStatus {
  outbound: number
  airGapped: boolean
  connections: Connection[]
  history: HistoryPoint[]
}
