'use client';

import React, { useState, useEffect } from 'react';
import { getTodayLog, updateLog } from '../../lib/supabase';
import type { DailyLog, LogData } from '../../lib/types';
import AccomplishedSection from './Sections/AccomplishedSection';
import InProgressSection from './Sections/InProgressSection';
import BlockersSection from './Sections/BlockersSection';
import DecisionsSection from './Sections/DecisionsSection';
import TomorrowSection from './Sections/TomorrowSection';
import ThoughtsSection from './Sections/ThoughtsSection';
import CleanupSection from './Sections/CleanupSection';
import ShutdownSection from './Sections/ShutdownSection';

export default function DailyLogForm() {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchTodayLog = async () => {
      try {
        const logData = await getTodayLog();
        setLog(logData);
      } catch (error) {
        console.error('Error fetching today\'s log:', error);
        setMessage({
          text: 'Failed to load today\'s log. Please try refreshing the page.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTodayLog();
  }, []);

  const handleUpdateLogData = async (newData: Partial<LogData>) => {
    if (!log) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const updatedLogData = {
        ...log.log_data,
        ...newData
      };
      
      const updated = await updateLog(log.id, updatedLogData);
      
      if (updated) {
        setLog(updated);
        setMessage({ text: 'Saved successfully', type: 'success' });
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating log:', error);
      setMessage({ text: 'Failed to save changes', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="card">
        <p className="text-red-500">Could not load today's log. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daily Shutdown Log: {log.date}</h1>
        
        {message && (
          <div 
            className={`px-4 py-2 rounded text-sm ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
        
        {saving && (
          <span className="text-sm text-gray-500">Saving...</span>
        )}
      </div>
      
      <div className="space-y-6">
        <AccomplishedSection 
          items={log.log_data.accomplished} 
          onChange={(accomplished) => handleUpdateLogData({ accomplished })} 
        />
        
        <InProgressSection 
          items={log.log_data.in_progress}
          reasoning={log.log_data.not_done_reasoning}
          onChange={(data) => handleUpdateLogData({ 
            in_progress: data.items, 
            not_done_reasoning: data.reasoning 
          })}
        />
        
        <BlockersSection 
          items={log.log_data.blockers}
          onChange={(blockers) => handleUpdateLogData({ blockers })}
        />
        
        <DecisionsSection 
          items={log.log_data.decisions_needed}
          onChange={(decisions_needed) => handleUpdateLogData({ decisions_needed })}
        />
        
        <TomorrowSection 
          items={log.log_data.tomorrow_priorities}
          onChange={(tomorrow_priorities) => handleUpdateLogData({ tomorrow_priorities })}
        />
        
        <ThoughtsSection 
          items={log.log_data.loose_thoughts}
          onChange={(loose_thoughts) => handleUpdateLogData({ loose_thoughts })}
        />
        
        <CleanupSection 
          status={log.log_data.cleanup}
          onChange={(cleanup) => handleUpdateLogData({ cleanup })}
        />
        
        <ShutdownSection 
          ritual={log.log_data.shutdown_ritual}
          onChange={(shutdown_ritual) => handleUpdateLogData({ shutdown_ritual })}
        />
      </div>
    </div>
  );
} 