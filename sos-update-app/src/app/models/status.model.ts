export interface Status {
  id: number;
  message: string;
  timestamp: Date;
  author: string;
  options?: {
    important: boolean;
    urgent: boolean;
    completed: boolean;
    inProgress: boolean;
  };
  visibility?: 'public' | 'team' | 'private';
}

export interface StatusOptions {
  options?: {
    important: boolean;
    urgent: boolean;
    completed: boolean;
    inProgress: boolean;
  };
  visibility?: 'public' | 'team' | 'private';
}
