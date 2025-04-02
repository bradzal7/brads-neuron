'use client';

import React from 'react';
import CollapsibleSection from '../CollapsibleSection';

type ShutdownSectionProps = {
  ritual: string;
  onChange: (ritual: string) => void;
};

export default function ShutdownSection({ ritual, onChange }: ShutdownSectionProps) {
  return (
    <CollapsibleSection
      title="Shutdown Ritual"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
        </svg>
      }
    >
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Describe your shutdown ritual - the final action that officially ends your workday.
      </p>
      
      <textarea
        value={ritual}
        onChange={(e) => onChange(e.target.value)}
        className="input min-h-[120px] w-full"
        placeholder="Ex: Closed laptop, turned off monitor, said 'I'm done for today' out loud, played music"
      />
      
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        A clear shutdown ritual helps your brain fully disconnect from work, reducing stress and improving recovery.
      </p>
    </CollapsibleSection>
  );
} 