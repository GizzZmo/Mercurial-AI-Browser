export interface HistoryEntry {
  url: string;
  timestamp: number;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  }
}