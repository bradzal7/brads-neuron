'use client';

import React, { useState } from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { BlockerItem } from '../../../lib/types';

type BlockersSectionProps = {
  items: BlockerItem[];
  onChange: (items: BlockerItem[]) => void;
};

export default function BlockersSection({ items, onChange }: BlockersSectionProps) {
  const [blockerItem, setBlockerItem] = useState('');
  const [blockerNeeds, setBlockerNeeds] = useState('');

  const handleAddBlocker = () => {
    if (blockerItem.trim() && blockerNeeds.trim()) {
      const newBlocker: BlockerItem = {
        item: blockerItem.trim(),
        needs: blockerNeeds.trim()
      };
      
      onChange([...items, newBlocker]);
      setBlockerItem('');
      setBlockerNeeds('');
    }
  };

  const handleRemoveBlocker = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  return (
    <CollapsibleSection
      title="What's blocking you?"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
        </svg>
      }
    >
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        List issues that are blocking your progress and what you need to resolve them.
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="blockerItem" className="block mb-1 font-medium">
              Blocker
            </label>
            <input
              id="blockerItem"
              type="text"
              value={blockerItem}
              onChange={(e) => setBlockerItem(e.target.value)}
              className="input"
              placeholder="What's blocking you?"
            />
          </div>
          
          <div>
            <label htmlFor="blockerNeeds" className="block mb-1 font-medium">
              Needs
            </label>
            <input
              id="blockerNeeds"
              type="text"
              value={blockerNeeds}
              onChange={(e) => setBlockerNeeds(e.target.value)}
              className="input"
              placeholder="What do you need?"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddBlocker}
            disabled={!blockerItem.trim() || !blockerNeeds.trim()}
            className="btn-primary"
          >
            Add Blocker
          </button>
        </div>
      </div>
      
      {items.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Current blockers:</h4>
          <ul className="space-y-3">
            {items.map((blocker, index) => (
              <li key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex justify-between">
                <div>
                  <div className="font-medium">{blocker.item}</div>
                  <div className="text-gray-600 dark:text-gray-300 mt-1">
                    <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                      Needs:
                    </span>{' '}
                    {blocker.needs}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveBlocker(index)}
                  className="text-red-500 hover:text-red-700 self-start"
                  aria-label="Remove blocker"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CollapsibleSection>
  );
} 