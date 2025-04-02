'use client';

import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import TagInput from '../TagInput';

type AccomplishedSectionProps = {
  items: string[];
  onChange: (items: string[]) => void;
};

export default function AccomplishedSection({ items, onChange }: AccomplishedSectionProps) {
  return (
    <CollapsibleSection
      title="What did you accomplish today?"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      }
    >
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        List tasks, projects, or goals you completed today.
      </p>
      <TagInput
        tags={items}
        onChange={onChange}
        placeholder="Add an accomplishment..."
      />
    </CollapsibleSection>
  );
} 