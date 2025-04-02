import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Function to get today's log or create a new one
export async function getTodayLog() {
  const user = await getUserProfile();
  if (!user) return null;
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Try to get today's log
  const { data: existingLog, error: fetchError } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single();
  
  if (existingLog) return existingLog;
  
  // If no log exists for today, create a new one with default structure
  const newLogData = {
    date: today,
    accomplished: [],
    in_progress: [],
    not_done_reasoning: {},
    blockers: [],
    decisions_needed: [],
    tomorrow_priorities: [],
    loose_thoughts: [],
    cleanup: {
      cleared_desktop: false,
      closed_files_tabs: false,
      updated_calendar: false,
      desk_reset: false
    },
    shutdown_ritual: ""
  };
  
  const { data: newLog, error: insertError } = await supabase
    .from('daily_logs')
    .insert([
      { 
        user_id: user.id, 
        date: today, 
        log_data: newLogData 
      }
    ])
    .select()
    .single();
  
  if (insertError) {
    console.error('Error creating new log:', insertError);
    return null;
  }
  
  return newLog;
}

// Function to get user's log history
export async function getLogHistory() {
  const user = await getUserProfile();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('daily_logs')
    .select('id, date, log_data')
    .eq('user_id', user.id)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching log history:', error);
    return [];
  }
  
  return data || [];
}

// Function to update a log
export async function updateLog(logId: string, logData: any) {
  const { data, error } = await supabase
    .from('daily_logs')
    .update({ log_data: logData })
    .eq('id', logId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating log:', error);
    return null;
  }
  
  return data;
}

// Function to get a specific log by ID
export async function getLogById(logId: string) {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('id', logId)
    .single();
  
  if (error) {
    console.error('Error fetching log:', error);
    return null;
  }
  
  return data;
} 