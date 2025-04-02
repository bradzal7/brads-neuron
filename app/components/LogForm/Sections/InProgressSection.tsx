'use client';

import React, { useState } from 'react';
import CollapsibleSection from '../CollapsibleSection';
import TagInput from '../TagInput';

type InProgressSectionProps = {
  items: string[];
  reasoning: Record<string, string>;
  onChange: (data: { items: string[]; reasoning: Record<string, string> }) => void;
};

export default function InProgressSection({ 
  items, 
  reasoning,
  onChange 
}: InProgressSectionProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState('');

  const handleAddReason = () => {
    if (selectedItem && reasonText.trim()) {
      const newReasoning = {
        ...reasoning,
        [selectedItem]: reasonText.trim()
      };
      
      onChange({ items, reasoning: newReasoning });
      setReasonText('');
      setSelectedItem(null);
    }
  };

  const handleRemoveItem = (item: string) => {
    const newItems = items.filter(i => i !== item);
    const newReasoning = { ...reasoning };
    delete newReasoning[item];
    
    onChange({ items: newItems, reasoning: newReasoning });
  };

  return (
    <CollapsibleSection
      title="What's still in progress?"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      }
    >
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        List tasks that are still in progress and add notes about their status.
      </p>
      
      <TagInput
        tags={items}
        onChange={(newItems) => onChange({ items: newItems, reasoning })}
        placeholder="Add an in-progress task..."
      />
      
      {items.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Add reasoning for in-progress items:</h4>
          
          <div className="flex flex-col space-y-3">
            <select
              value={selectedItem || ''}
              onChange={(e) => setSelectedItem(e.target.value || null)}
              className="input"
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            
            <textarea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Why is this still in progress? What's blocking it?"
              className="input min-h-[100px]"
              disabled={!selectedItem}
            />
            
            <button
              type="button"
              onClick={handleAddReason}
              disabled={!selectedItem || !reasonText.trim()}
              className="btn-primary self-end"
            >
              Add Reason
            </button>
          </div>
          
          {Object.keys(reasoning).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Current reasoning:</h4>
              <ul className="space-y-2">
                {Object.entries(reasoning).map(([item, reason]) => (
                  <li key={item} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex justify-between">
                      <strong className="font-medium">{item}</strong>
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove item"
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
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </CollapsibleSection>
  );
} 