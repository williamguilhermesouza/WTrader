# WTraderWeb - Project Summary

## What Was Built

A professional cryptocurrency trading application with a desktop-like interface featuring:

### 🎨 Frontend (TypeScript + React + Vite)

**Architecture:**
- Full TypeScript conversion from JavaScript
- Modern React 18 with hooks
- Vite for fast development and building
- Component-based architecture

**UI Framework:**
- Tailwind CSS for styling
- shadcn/ui components (Radix UI based)
- Custom dark theme with CSS variables
- Responsive design

**Key Features:**
1. **Desktop-like Menubar**
   - File menu (New Order Book, Save/Load Layout)
   - View menu (Fullscreen, Dark Mode)
   - Window menu (List all open books)
   - Help menu (Documentation, About)

2. **Dockable Window System**
   - rc-dock library integration
   - Drag and drop tabs
   - Split panels horizontally/vertically
   - Floating windows support
   - Persistent tab states

3. **Order Book Component**
   - Real-time WebSocket data
   - Bid/Ask display with color coding
   - Visual depth bars
   - Spread calculation
   - Connection status indicator

4. **Multi-Book Management**
   - Create multiple order book instances
   - Each book can watch different trading pairs
   - Dialog for creating new books
   - Independent WebSocket connections per book

### 🐍 Backend (Python + FastAPI)

**Features:**
- FastAPI web framework
- WebSocket server for client connections
- Binance WebSocket client integration
- Real-time order book streaming
- CORS enabled for frontend access

**Data Flow:**
1. Connects to Binance WebSocket API
2. Receives depth updates every 100ms
3. Processes and filters top 10 levels
4. Broadcasts to all connected clients
5. Automatic reconnection on failures

## File Structure

```
WTraderWeb/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   │   ├── menubar.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   └── select.tsx
│   │   │   ├── OrderBook.tsx      # Order book component
│   │   │   └── NewBookDialog.tsx  # New book dialog
│   │   ├── lib/
│   │   │   └── utils.ts     # Utility functions
│   │   ├── types/
│   │   │   └── index.ts     # TypeScript types
│   │   ├── App.tsx          # Main application
│   │   ├── App.css          # Custom styles
│   │   ├── main.tsx         # Entry point
│   │   ├── index.css        # Global styles
│   │   └── rc-dock.d.ts     # Type definitions
│   ├── tsconfig.json        # TypeScript config
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── tailwind.config.js   # Tailwind config
│   ├── postcss.config.js
│   ├── vite.config.ts       # Vite config
│   └── package.json
│
├── README.md                # Main documentation
├── GUIDE.md                 # User guide
├── start.sh                 # Quick start script
└── setup.sh                 # Setup script
```

## Technology Stack

### Frontend
- **React 18**: UI library
- **TypeScript 5**: Type safety
- **Vite 7**: Build tool
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **Radix UI**: Primitive components
- **rc-dock**: Docking system
- **lucide-react**: Icons
- **class-variance-authority**: Component variants
- **clsx & tailwind-merge**: Class utilities

### Backend
- **Python 3.8+**
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **websockets**: WebSocket library

## Key Components

### 1. Menubar Component
Located: `frontend/src/components/ui/menubar.tsx`
- Radix UI based
- Keyboard shortcuts support
- Nested menus
- Separators and labels

### 2. Order Book Component
Located: `frontend/src/components/OrderBook.tsx`
- Real-time data display
- Visual depth indicators
- Spread calculation
- Connection status

### 3. New Book Dialog
Located: `frontend/src/components/NewBookDialog.tsx`
- Symbol input validation
- Form submission
- Cancel/Create actions

### 4. Dock Layout
Located: `frontend/src/App.tsx`
- Window management
- Tab creation/deletion
- Layout persistence
- Event handling

## Configuration

### Tailwind CSS
- Custom color scheme using CSS variables
- Dark theme by default
- Responsive utilities
- Animation support

### TypeScript
- Strict mode enabled
- Path aliases (@/* -> src/*)
- React JSX transform
- Node type definitions

### Vite
- Path resolution
- React plugin
- Fast HMR (Hot Module Replacement)
- Optimized builds

## Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `python main.py` - Start FastAPI server

### Combined
- `./start.sh` - Start both servers

## API Endpoints

### Backend
- `GET /` - Health check
- `WebSocket /ws/orderbook` - Order book stream

### WebSocket Message Format
```json
{
  "symbol": "BTCUSDT",
  "lastUpdateId": 12345678,
  "bids": [["95000.00", "0.1234"], ...],
  "asks": [["95100.00", "0.0987"], ...]
}
```

## Future Enhancements

Planned features (currently disabled in UI):
- Save/Load window layouts
- Theme switching (light/dark)
- Fullscreen mode
- Chart integration
- Trade execution
- Multiple data sources
- Custom alerts
- Export functionality

## Development Notes

### Adding New Components
1. Create component in `src/components/`
2. Add TypeScript types in `src/types/`
3. Import and use in App.tsx

### Adding New UI Components
1. Copy from shadcn/ui documentation
2. Place in `src/components/ui/`
3. Ensure proper TypeScript types

### Modifying Styles
1. Use Tailwind classes for most styling
2. Custom CSS in App.css for dock-specific styles
3. CSS variables in index.css for theming

## Testing

To test the application:
1. Start backend: `cd backend && python main.py`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. Click "File > New Order Book"
5. Enter a trading pair (e.g., ETHUSDT)
6. Verify real-time data streams
7. Test docking by dragging tabs

## Performance Considerations

- **Cached tabs**: Tabs maintain state when inactive
- **Efficient WebSocket**: Single connection to backend
- **Optimized rendering**: React memo and callbacks
- **Lazy loading**: Components loaded on demand

## Security Notes

- No API keys required (public data only)
- CORS enabled for local development
- WebSocket over localhost only
- No user authentication (demo app)

## License

MIT License - See main README for details
