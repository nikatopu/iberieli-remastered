# Admin Dashboard Components

This directory contains all the components, hooks, and utilities specific to the admin dashboard. It's designed as a self-contained mini-project within the main app.

## Structure

```
admin/
├── components/           # UI Components
│   ├── AdminHeader.tsx  # Header with logout functionality
│   ├── WineList.tsx     # Grid view of all wines
│   ├── WineCard.tsx     # Individual wine card component
│   ├── WineEditForm.tsx # Wine editing form
│   ├── ui/              # Generic UI components
│   │   ├── LoadingSpinner.tsx # Loading state component
│   │   └── ErrorMessage.tsx   # Error display component
│   └── index.ts         # Component exports
├── hooks/               # Custom hooks
│   ├── useAdminAuth.ts  # Authentication logic
│   ├── useWineManager.ts # Wine management logic
│   └── index.ts         # Hook exports
├── dashboard/           # Dashboard page
│   ├── page.tsx         # Main dashboard component (clean & focused)
│   └── page.module.scss # Minimal dashboard styles
└── components.md        # This documentation
```

## Component Responsibilities

### AdminHeader

- Displays admin dashboard title
- Handles logout functionality
- Responsive design for mobile

### WineList

- Displays all wines in a grid
- Shows wine count statistics
- Handles empty state
- Manages wine card layout

### WineCard

- Individual wine display
- Shows wine image, name, and description
- Category badge
- Edit button functionality

### WineEditForm

- Form for editing wine details
- Character counters
- Save/cancel functionality
- Form validation

### UI Components

- **LoadingSpinner**: Reusable loading states
- **ErrorMessage**: Standardized error display

## Custom Hooks

### useAdminAuth

- Handles authentication state
- Login/logout functionality
- Route protection

### useWineManager

- Wine CRUD operations
- Form state management
- Database synchronization

## Design Principles

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused and tested
3. **Clean Architecture**: Logic separated into custom hooks
4. **Self-Contained**: Admin section doesn't pollute the main app
5. **Maintainability**: Easy to understand and modify

## Usage

```tsx
import { useAdminAuth, useWineManager } from "../hooks";
import { AdminHeader, WineList, ErrorMessage } from "../components";

export default function AdminDashboard() {
  const { isLoggedIn, logout } = useAdminAuth();
  const { wines, handleEditWine } = useWineManager();

  return (
    <div>
      <AdminHeader onLogout={logout} />
      <WineList wines={wines} onEditWine={handleEditWine} />
    </div>
  );
}
```

This structure makes the admin dashboard much more maintainable, testable, and easier to extend with new features.
