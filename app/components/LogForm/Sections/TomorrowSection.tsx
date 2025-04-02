'use client';

import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import TagInput from '../TagInput';

type TomorrowSectionProps = {
  items: string[];
  onChange: (items: string[]) => void;
};

export default function TomorrowSection({ items, onChange }: TomorrowSectionProps) {
  return (
    <CollapsibleSection
      title="Tomorrow's Priorities"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      }
    >
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        List your priorities for tomorrow to give yourself a head start.
      </p>
      <TagInput
        tags={items}
        onChange={onChange}
        placeholder="Add a priority for tomorrow..."
      />
    </CollapsibleSection>
  );
} 