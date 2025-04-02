export interface User {
  id: string;
  email: string;
}

export interface BlockerItem {
  item: string;
  needs: string;
}

export interface DecisionNeededItem {
  item: string;
  needs: string;
}

export interface CleanupStatus {
  cleared_desktop: boolean;
  closed_files_tabs: boolean;
  updated_calendar: boolean;
  desk_reset: boolean;
}

export interface LogData {
  date: string;
  accomplished: string[];
  in_progress: string[];
  not_done_reasoning: Record<string, string>;
  blockers: BlockerItem[];
  decisions_needed: DecisionNeededItem[];
  tomorrow_priorities: string[];
  loose_thoughts: string[];
  cleanup: CleanupStatus;
  shutdown_ritual: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  log_data: LogData;
  created_at: string;
  updated_at: string;
}

export type LogHistoryItem = Pick<DailyLog, 'id' | 'date'> & { 
  log_data: Pick<LogData, 'accomplished' | 'in_progress'> 
}; 