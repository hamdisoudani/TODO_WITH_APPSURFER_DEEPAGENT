# TodoCraft - Modern Todo Application

## 🤖 Built with CodeSurfer
This project was collaboratively built by **codersurfer**, 
an AI-powered development assistant.

## Description
A stylish and feature-rich todo application built with Next.js 14, TypeScript, and shadcn/ui. Experience modern task management with drag-and-drop functionality, dark mode support, and intuitive categorization.

## Features
- **Core Functionality**: Add, edit, delete todos with ease
- **Advanced Organization**: Categories with color coding and priority levels
- **Smart Scheduling**: Due dates with overdue detection
- **Drag & Drop**: Reorder tasks with keyboard and mouse support
- **Search & Filter**: Real-time search and multi-criteria filtering
- **Dark Mode**: Automatic system preference detection with manual toggle
- **Statistics**: Real-time task dashboard with insights
- **Responsive Design**: Optimized for all screen sizes
- **Modern UI**: Glassmorphism effects with smooth animations
- **Local Storage**: Persistent data with cross-tab synchronization

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit
- **Date Handling**: date-fns
- **Animations**: CSS transitions and micro-interactions
- **Storage**: Browser LocalStorage with cross-tab sync

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd todo-app

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure
```
src/
├── app/                    # App Router pages
│   ├── globals.css        # Global styles and custom utilities
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── todo-item.tsx     # Individual todo card
│   ├── todo-list.tsx     # Main todo list component
│   ├── add-todo.tsx      # Todo creation dialog
│   └── header.tsx        # App header with theme toggle
├── hooks/                # Custom React hooks
│   ├── use-todos.ts      # Todo state management
│   └── use-theme.ts      # Theme management
├── lib/                  # Utility libraries
│   ├── storage.ts        # LocalStorage utilities
│   └── utils.ts          # Common utilities
└── types/                # TypeScript type definitions
    └── todo.ts           # Todo and Category types
```

## Usage

### Adding Todos
1. Click the "Add Todo" button
2. Fill in the required title field
3. Optionally add description, priority, category, and due date
4. Click "Add Todo" to save

### Managing Todos
- **Complete**: Click the checkbox to mark as complete
- **Edit**: Click the three-dot menu and select "Edit"
- **Delete**: Click the three-dot menu and select "Delete"
- **Reorder**: In manual sort mode, drag todos to reorder

### Filtering and Sorting
- Use the search bar to find specific todos
- Filter by category, priority, or completion status
- Sort manually, by priority, due date, or creation date
- Toggle between list and grid view modes

### Categories
Categories help organize your todos:
- Personal (Blue)
- Work (Green) 
- Shopping (Orange)
- Health (Red)

### Priority Levels
- **High**: Red indicator
- **Medium**: Yellow indicator  
- **Low**: Green indicator

### Dark Mode
- Automatically detects system preference
- Toggle manually using the moon/sun icon in the header
- Preference is saved and persists across sessions

## Data Storage
- All data is stored in browser LocalStorage
- Automatic synchronization across browser tabs
- No server or database required
- Data persists between sessions

## Development

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npx tsc --noEmit   # Type checking
```

### Component Guidelines
- Use TypeScript for type safety
- Follow shadcn/ui component patterns
- Implement responsive design
- Add proper accessibility attributes
- Include loading and error states

## Contributing
This project was built as a demonstration of modern React/Next.js development practices with AI assistance.

## License
MIT License - feel free to use this project as a learning resource or starting point for your own todo application.

---

**Built with ❤️ using Next.js, TypeScript, and shadcn/ui**