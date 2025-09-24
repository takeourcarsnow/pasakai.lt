export interface StoryRequest {
  time: string;
  place: string;
  characters: string;
  mood: string;
  ageGroup: string;
}

export interface StoryResponse {
  story: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface ComplexityConfig {
  wordCount: string;
  style: string;
}

export interface AgeRange {
  text: string;
  emoji: string;
}

export interface StoryOptions {
  time: string[];
  place: string[];
  character: string[];
  mood: string[];
}