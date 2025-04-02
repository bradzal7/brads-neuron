'use client';

import React, { useState, useEffect } from 'react';
import { getLogHistory, getLogById } from '../lib/supabase';
import type { LogHistoryItem, DailyLog } from '../lib/types';
import Link from 'next/link';

export default function HistoryPage() {
  const [logs, setLogs] = useState<LogHistoryItem[]>([]);
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const history = await getLogHistory();
        setLogs(history);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load log history. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const handleViewLog = async (logId: string) => {
    try {
      const log = await getLogById(logId);
      setSelectedLog(log);
    } catch (err) {
      console.error('Error fetching log:', err);
      setError('Failed to load the selected log. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="card p-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Log History</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Past Logs</h2>
            
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs found. Start by creating today's log.</p>
            ) : (
              <ul className="space-y-2">
                {logs.map((log) => (
                  <li key={log.id}>
                    <button
                      onClick={() => handleViewLog(log.id)}
                      className={`w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                        selectedLog?.id === log.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                      }`}
                    >
                      <div className="font-medium">{log.date}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {log.log_data.accomplished?.length || 0} accomplishments, {log.log_data.in_progress?.length || 0} in progress
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="mt-6">
              <Link href="/dashboard" className="btn-primary block text-center">
                Create Today's Log
              </Link>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedLog ? (
            <div className="card space-y-4">
              <h2 className="text-xl font-semibold">Log for {selectedLog.date}</h2>
              
              {selectedLog.log_data.accomplished.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-green-600 mb-2">Accomplished</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedLog.log_data.accomplished.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedLog.log_data.in_progress.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-orange-500 mb-2">In Progress</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedLog.log_data.in_progress.map((item, index) => (
                      <li key={index}>
                        {item}
                        {selectedLog.log_data.not_done_reasoning[item] && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Reason: {selectedLog.log_data.not_done_reasoning[item]}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedLog.log_data.blockers.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-red-500 mb-2">Blockers</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedLog.log_data.blockers.map((item, index) => (
                      <li key={index}>
                        {item.item}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Needs: {item.needs}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedLog.log_data.tomorrow_priorities.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-blue-500 mb-2">Tomorrow's Priorities</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedLog.log_data.tomorrow_priorities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedLog.log_data.loose_thoughts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-yellow-500 mb-2">Loose Thoughts</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedLog.log_data.loose_thoughts.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedLog.log_data.shutdown_ritual && (
                <div>
                  <h3 className="text-lg font-medium text-indigo-500 mb-2">Shutdown Ritual</h3>
                  <p>{selectedLog.log_data.shutdown_ritual}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="card flex items-center justify-center h-64 text-gray-500">
              Select a log to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 