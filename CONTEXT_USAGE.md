# Context Provider System

This document explains how to use the context provider system for managing wine data across the Iberieli Cellar application.

## Overview

The context provider system consists of:

1. **WineContext** - Manages wine data, loading states, and API calls
2. **ContextProviderWrapper** - Main provider that wraps the entire app
3. **useWines** - Direct access to wine context
4. **useContextProvider** - Enhanced hook with additional utility functions

## Setup

The context provider is already configured in the main layout (`src/app/layout.tsx`):

```jsx
import { ContextProviderWrapper } from "@/contexts/AppContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ContextProviderWrapper>
          <Layout>{children}</Layout>
        </ContextProviderWrapper>
      </body>
    </html>
  );
}
```

## Usage

### Basic Usage with useWines

```jsx
"use client";

import { useWines } from "@/contexts/AppContext";

export default function MyComponent() {
  const { wines, loading, error, winesByCategory } = useWines();

  if (loading) return <p>Loading wines...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>We have {wines.length} wines available</h2>
      {Object.entries(winesByCategory).map(([category, categoryWines]) => (
        <div key={category}>
          <h3>
            {category} ({categoryWines.length})
          </h3>
          {categoryWines.map((wine) => (
            <p key={wine.id}>{wine.name}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Enhanced Usage with useContextProvider

```jsx
"use client";

import { useContextProvider } from "@/hooks/useContextProvider";

export default function AdvancedWineComponent() {
  const {
    wines,
    totalWinesCount,
    getCategoryStats,
    searchWines,
    getSimilarWines,
    loading,
  } = useContextProvider();

  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = searchQuery ? searchWines(searchQuery) : wines;
  const categoryStats = getCategoryStats();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Wine Collection ({totalWinesCount} wines)</h2>

      <div>
        <p>Red: {categoryStats.red}</p>
        <p>White: {categoryStats.white}</p>
        <p>Pink: {categoryStats.pink}</p>
        <p>Amber: {categoryStats.amber}</p>
      </div>

      <input
        type="text"
        placeholder="Search wines..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {searchResults.map((wine) => (
        <div key={wine.id}>
          <h3>{wine.name}</h3>
          <p>{wine.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Getting Wine by ID

```jsx
"use client";

import { useWines } from "@/contexts/AppContext";

export default function WineDetailComponent({ wineId }) {
  const { getWineById, loading } = useWines();
  const wine = getWineById(wineId);

  if (loading) return <p>Loading...</p>;
  if (!wine) return <p>Wine not found</p>;

  return (
    <div>
      <h1>{wine.name}</h1>
      <p>{wine.description}</p>
      <p>Category: {wine.category}</p>
      <p>Location: {wine.location}</p>
    </div>
  );
}
```

## Available Context Values

### From useWines():

- `wines: IWine[]` - All wines
- `loading: boolean` - Loading state
- `error: string | null` - Error message if any
- `winesByCategory: Record<string, IWine[]>` - Wines grouped by category
- `getWineById(id: string): IWine | undefined` - Get wine by ID
- `refetchWines(): Promise<void>` - Refetch wine data from API

### Additional from useContextProvider():

- `totalWinesCount: number` - Total number of wines
- `availableWines: IWine[]` - All available wines
- `getWinesByCategory(category: string): IWine[]` - Get wines by category
- `getCategoriesWithCounts()` - Get categories with wine counts
- `searchWines(query: string): IWine[]` - Search wines by query
- `getSimilarWines(wine: IWine, limit?: number): IWine[]` - Get similar wines
- `getCategoryStats()` - Get statistics by category

## API Integration

The context automatically fetches wine data from `/api/wines` on component mount. The API returns data in the database format, which is automatically mapped to the frontend interface.

### Data Flow:

1. **API Response** (Database format):

   ```json
   {
     "wineId": "saperavi",
     "nameEn": "Saperavi",
     "color": "Red",
     "variety": "Saperavi",
     "description": "A classic Georgian red wine...",
     "tastingNotes": "Deep ruby color...",
     "vinification": { "fermentation": "...", "aging": "..." },
     "terroir": { "soil": "...", "climate": "..." }
   }
   ```

2. **Frontend Interface** (Mapped format):
   ```json
   {
     "id": "saperavi",
     "name": "Saperavi",
     "category": "red",
     "description": "A classic Georgian red wine...",
     "tastingNotes": "Deep ruby color...",
     "vinification": { "harvest": "...", "fermentation": "..." }
   }
   ```

## Error Handling

The context provides built-in error handling:

```jsx
const { wines, loading, error, refetchWines } = useWines();

if (error) {
  return (
    <div className="error">
      <p>Error loading wines: {error}</p>
      <button onClick={refetchWines}>Retry</button>
    </div>
  );
}
```

## Example Components

See these examples of components using the context:

1. **Wine List** - `src/app/wines/page.tsx`
2. **Wine Detail** - `src/app/wines/[id]/page.tsx`
3. **Wine Statistics** - `src/components/molecules/WineStats/index.tsx`

## Best Practices

1. **Always handle loading states** - Show loading indicators while data is being fetched
2. **Handle errors gracefully** - Show error messages and retry options
3. **Use client components** - Context can only be used in client components (`'use client'`)
4. **Minimize re-renders** - Destructure only the values you need from the context
5. **Type safety** - Use TypeScript interfaces for better development experience

## Adding New Context Data

To add new data to the context:

1. Update the `WineContextType` interface in `src/contexts/WineContext.tsx`
2. Add the new state/computed value to the `contextValue` object
3. Update the `useContextProvider` hook if needed
4. Update this documentation with the new functionality
