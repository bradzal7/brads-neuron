'use client';

import React, { useState } from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { DecisionNeededItem } from '../../../lib/types';

type DecisionsSectionProps = {
  items: DecisionNeededItem[];
  onChange: (items: DecisionNeededItem[]) => void;
};

export default function DecisionsSection({ items, onChange }: DecisionsSectionProps) {
  const [decisionItem, setDecisionItem] = useState('');
  const [decisionNeeds, setDecisionNeeds] = useState('');

  const handleAddDecision = () => {
    if (decisionItem.trim() && decisionNeeds.trim()) {
      const newDecision: DecisionNeededItem = {
        item: decisionItem.trim(),
        needs: decisionNeeds.trim()
      };
      
      onChange([...items, newDecision]);
      setDecisionItem('');
      setDecisionNeeds('');
    }
  };

  const handleRemoveDecision = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  return (
    <CollapsibleSection
      title="What decisions need to be made?"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      }
    >
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        List decisions that need to be made and who needs to be involved.
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="decisionItem" className="block mb-1 font-medium">
              Decision Needed
            </label>
            <input
              id="decisionItem"
              type="text"
              value={decisionItem}
              onChange={(e) => setDecisionItem(e.target.value)}
              className="input"
              placeholder="What decision is needed?"
            />
          </div>
          
          <div>
            <label htmlFor="decisionNeeds" className="block mb-1 font-medium">
              Input From
            </label>
            <input
              id="decisionNeeds"
              type="text"
              value={decisionNeeds}
              onChange={(e) => setDecisionNeeds(e.target.value)}
              className="input"
              placeholder="Who needs to provide input?"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddDecision}
            disabled={!decisionItem.trim() || !decisionNeeds.trim()}
            className="btn-primary"
          >
            Add Decision
          </button>
        </div>
      </div>
      
      {items.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Pending decisions:</h4>
          <ul className="space-y-3">
            {items.map((decision, index) => (
              <li key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex justify-between">
                <div>
                  <div className="font-medium">{decision.item}</div>
                  <div className="text-gray-600 dark:text-gray-300 mt-1">
                    <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                      Input from:
                    </span>{' '}
                    {decision.needs}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDecision(index)}
                  className="text-red-500 hover:text-red-700 self-start"
                  aria-label="Remove decision"
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