# Form Components

This document provides information about the form components used in the Neuron Log daily log system.

## Overview

The daily log form in Neuron Log consists of multiple specialized sections, each implemented as a separate component. This modular design allows for better maintenance and focused user experience.

## Form Sections

### AccomplishedSection

**File Location**: `app/dashboard/log/sections/AccomplishedSection.tsx`

**Purpose**: Allows users to log tasks they've completed during the day.

**Key Features**:
- Editable list interface
- Add, remove functionality
- Empty state handling

### InProgressSection

**File Location**: `app/dashboard/log/sections/InProgressSection.tsx`

**Purpose**: Allows users to log tasks that are still in progress.

**Key Features**:
- Similar structure to AccomplishedSection
- Tracks ongoing work

### BlockersSection

**File Location**: `app/dashboard/log/sections/BlockersSection.tsx`

**Purpose**: Allows users to log issues or blockers they've encountered.

**Key Features**:
- Tracks obstacles and challenges
- Provides section-specific guidance

### DecisionsSection

**File Location**: `app/dashboard/log/sections/DecisionsSection.tsx`

**Purpose**: Allows users to log decisions that need to be made.

**Key Features**:
- Captures decision points
- Helps track pending decisions

### TomorrowSection

**File Location**: `app/dashboard/log/sections/TomorrowSection.tsx`

**Purpose**: Allows users to plan tasks for the following day.

**Key Features**:
- Facilitates planning
- Creates continuity between daily logs

### ThoughtsSection

**File Location**: `app/dashboard/log/sections/ThoughtsSection.tsx`

**Purpose**: Provides a free-form text area for reflections or additional thoughts.

**Key Features**:
- Multi-line text input
- Character count

### CleanupSection

**File Location**: `app/dashboard/log/sections/CleanupSection.tsx`

**Purpose**: Allows users to check off cleanup tasks before ending their day.

**Key Features**:
- Checkboxes for common cleanup tasks
- Visual progress indicator

### ShutdownSection

**File Location**: `app/dashboard/log/sections/ShutdownSection.tsx`

**Purpose**: Allows users to formally "shutdown" their workday.

**Key Features**:
- Toggle switch for completion
- Encouraging message

## Main Form Component

### LogForm

**File Location**: `app/dashboard/log/LogForm.tsx`

**Purpose**: Container for all form sections, manages overall form state and database operations.

**Key Features**:
- Manages the overall form state
- Provides update handlers for sections
- Handles auto-save functionality
- Shows save status feedback

## Common Patterns

### State Management

Each section follows a consistent pattern for state management:

```tsx
// In LogForm.tsx
const [logData, setLogData] = useState<LogData>(existingLog?.log_data || initialLogData);

// Update handlers for each section
const updateAccomplished = (items: string[]) => {
  setLogData(prev => ({ ...prev, accomplished: items }));
};

// In AccomplishedSection.tsx
interface AccomplishedSectionProps {
  items: string[];
  onChange: (items: string[]) => void;
}

export function AccomplishedSection({ items, onChange }: AccomplishedSectionProps) {
  // Component implementation
}
```

### List Management

List sections (Accomplished, InProgress, Blockers, etc.) follow this pattern:

```tsx
// Adding an item
const handleAddItem = () => {
  if (!newItem.trim()) return;
  onChange([...items, newItem.trim()]);
  setNewItem('');
};

// Removing an item
const handleRemoveItem = (index: number) => {
  const newItems = [...items];
  newItems.splice(index, 1);
  onChange(newItems);
};
```

### Auto-Save Implementation

The LogForm implements auto-saving with debouncing:

```tsx
// Auto-save on changes
useEffect(() => {
  if (isInitialRender.current || isSaving) {
    isInitialRender.current = false;
    return;
  }
  
  const timerId = setTimeout(() => {
    saveLog();
  }, 2000); // Debounce for 2 seconds
  
  return () => clearTimeout(timerId);
}, [logData]);
```

## Reusable UI Components

The form sections utilize these reusable UI components:

### Card

Provides a consistent container with optional title and footer.

### EditableList

Displays a list of items with remove functionality.

### TextInput

Provides a consistent text input with label and error handling.

## Form Section Usage

In the main LogForm component, sections are used like this:

```tsx
return (
  <div className="space-y-8">
    <AccomplishedSection 
      items={logData.accomplished} 
      onChange={updateAccomplished} 
    />
    <InProgressSection 
      items={logData.inProgress} 
      onChange={updateInProgress} 
    />
    {/* Other sections */}
  </div>
);
```

## Future Enhancements

Planned improvements for form components:

1. **Drag-and-drop reordering** for list items
2. **Rich text editing** for thoughts section
3. **Priority indicators** for tomorrow section
4. **Custom cleanup tasks** in cleanup section
5. **Form validation** improvements
6. **Undo functionality** for accidental deletions 