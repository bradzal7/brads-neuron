'use client';

import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { CleanupStatus } from '../../../lib/types';

type CleanupSectionProps = {
  status: CleanupStatus;
  onChange: (status: CleanupStatus) => void;
};

export default function CleanupSection({ status, onChange }: CleanupSectionProps) {
  const handleCheckboxChange = (field: keyof CleanupStatus) => {
    onChange({
      ...status,
      [field]: !status[field]
    });
  };

  return (
    <CollapsibleSection
      title="Workspace Cleanup"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      }
    >
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Check off your end-of-day cleanup tasks to clear both your physical and digital workspaces.
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="cleared_desktop"
            checked={status.cleared_desktop}
            onChange={() => handleCheckboxChange('cleared_desktop')}
            className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label htmlFor="cleared_desktop" className="ml-3 text-gray-700 dark:text-gray-300">
            Cleared physical desktop
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="closed_files_tabs"
            checked={status.closed_files_tabs}
            onChange={() => handleCheckboxChange('closed_files_tabs')}
            className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label htmlFor="closed_files_tabs" className="ml-3 text-gray-700 dark:text-gray-300">
            Closed all files and browser tabs
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="updated_calendar"
            checked={status.updated_calendar}
            onChange={() => handleCheckboxChange('updated_calendar')}
            className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label htmlFor="updated_calendar" className="ml-3 text-gray-700 dark:text-gray-300">
            Updated calendar events for tomorrow
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="desk_reset"
            checked={status.desk_reset}
            onChange={() => handleCheckboxChange('desk_reset')}
            className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label htmlFor="desk_reset" className="ml-3 text-gray-700 dark:text-gray-300">
            Reset desk to starting position
          </label>
        </div>
      </div>
    </CollapsibleSection>
  );
} 