# WTraderWeb - Quick Reference

## 🚀 Quick Start

```bash
# Terminal 1 - Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

**Or use the quick start script:**
```bash
./start.sh
```

## 📋 Common Tasks

### Create New Order Book
1. Click `File > New Order Book` (or press ⌘N)
2. Enter trading pair (e.g., `ETHUSDT`)
3. Click `Create`

### Arrange Windows
- **Drag tab** to reorder
- **Drag to edge** to split panel
- **Drag out** to float window
- **Close tab** with X button

### Supported Trading Pairs
- Format: `{BASE}{QUOTE}` (e.g., BTCUSDT)
- Must be uppercase
- Common pairs:
  - BTCUSDT, ETHUSDT, BNBUSDT
  - ADAUSDT, SOLUSDT, XRPUSDT
  - DOGEUSDT, DOTUSDT, MATICUSDT

## 🎨 UI Components

### Order Book Display
- **Green** = Bids (Buy orders)
- **Red** = Asks (Sell orders)
- **Yellow** = Symbol and spread
- **Depth bars** = Cumulative volume
- **Pulse indicator** = Connection status

### Menubar Options
- **File**: New, Save, Load, Exit
- **View**: Display options
- **Window**: Manage open books
- **Help**: Documentation

## 🔧 Configuration

### Backend (main.py)
```python
# Line 68: Change default symbol
asyncio.create_task(binance_orderbook_stream("ethusdt"))

# Line 24: Change update frequency
url = f"wss://stream.binance.com:9443/ws/{symbol}@depth20@1000ms"

# Lines 35-36: Change number of levels
"bids": data.get("bids", [])[:20],  # Top 20
```

### Frontend URLs
```typescript
// src/components/OrderBook.tsx, line 14
const ws = new WebSocket('ws://localhost:8000/ws/orderbook');
```

## 📊 Data Format

### WebSocket Message
```json
{
  "symbol": "BTCUSDT",
  "lastUpdateId": 12345678,
  "bids": [
    ["95000.00", "0.1234"],  // [price, amount]
    ["94999.50", "0.5678"]
  ],
  "asks": [
    ["95100.00", "0.0987"],
    ["95100.50", "0.2345"]
  ]
}
```

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Check Python version
python3 --version  # Should be 3.8+

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Frontend Not Starting
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### WebSocket Disconnected
1. Verify backend is running on port 8000
2. Check browser console for errors
3. Restart both backend and frontend

### No Data Showing
1. Verify symbol is correct (uppercase, valid pair)
2. Check Binance API status
3. Look at backend console for errors

## 📦 Dependencies

### Backend
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
websockets==12.0
```

### Frontend (Key)
```
react@18.3.1
typescript@5.x
vite@7.x
tailwindcss@3.x
rc-dock@latest
@radix-ui/react-*
```

## 🎯 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘N / Ctrl+N | New Order Book |
| ⌘S / Ctrl+S | Save Layout (planned) |
| Tab | Switch between windows |

## 📱 Ports

| Service | Port | URL |
|---------|------|-----|
| Backend | 8000 | http://localhost:8000 |
| Frontend | 5173 | http://localhost:5173 |

## 🔄 Development Workflow

1. Make changes to source files
2. Vite HMR auto-reloads frontend
3. Restart backend if Python changes
4. Check browser console for errors
5. Check terminal for server logs

## 📝 File Locations

```
frontend/src/
├── App.tsx              # Main app with dock
├── components/
│   ├── OrderBook.tsx    # Order book display
│   ├── NewBookDialog.tsx # Create book dialog
│   └── ui/              # UI components
├── lib/utils.ts         # Utilities
└── types/index.ts       # TypeScript types
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Health check |
| WebSocket | /ws/orderbook | Order book stream |

## 💡 Tips

1. **Performance**: Close unused order book windows
2. **Layout**: Drag tabs to edges for split view
3. **Monitoring**: Use multiple books for comparison
4. **Symbols**: Verify on Binance before creating

## 🆘 Getting Help

1. Check GUIDE.md for detailed instructions
2. Review PROJECT_SUMMARY.md for architecture
3. Read README.md for overview
4. Check browser/terminal console for errors
