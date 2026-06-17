export interface TaskReward {
  experience: number;
  items?: Array<{ type: string; amount: number }>;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  type: 'feed' | 'play' | 'explore' | 'stat' | 'time';
  target: number;
  progress: number;
  completed: boolean;
  rewards: TaskReward;
}

export interface TaskState {
  dailyTasks: DailyTask[];
  lastRefreshDate: string;
  completedToday: number;
}
