# WTraderWeb - Binance Order Book Viewer

A professional real-time cryptocurrency order book viewer with desktop-like interface, streaming market data from Binance. Built with Python FastAPI backend and React + TypeScript + Vite frontend.

## Features

- 📊 Real-time order book data from Binance (BTC/USDT and other pairs)
- 🪟 Desktop-style application with menubar (File, View, Window, Help)
- 🔄 WebSocket connection for live updates
- � Dockable windows system - arrange multiple order books as you like
- 🎨 Modern dark-themed UI with Tailwind CSS and shadcn/ui components
- 💱 Create multiple order book windows for different trading pairs
- �📈 Visual depth bars showing cumulative volume
- 💰 Display of bid/ask prices, amounts, and totals
- 🎯 Spread and mid-price calculation
- ⚡ Fast and responsive TypeScript interface

## Project Structure

```
WTraderWeb/
├── backend/          # Python FastAPI backend
│   ├── main.py      # FastAPI application with WebSocket
│   ├── requirements.txt
│   └── README.md
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx  # Main order book component
│   │   ├── App.css  # Styling
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md        # This file
```

## Setup and Running

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
python main.py
```

The backend will start on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. Start the backend server first (it will connect to Binance WebSocket)
2. Start the frontend development server
3. Open your browser to `http://localhost:5173`
4. Watch real-time order book updates for BTC/USDT

## Technical Details

### Backend
- **FastAPI**: Modern Python web framework
- **WebSockets**: For real-time bidirectional communication
- **Binance Stream**: Connects to Binance's official WebSocket API
- **Data**: Streams top 10 bids and asks at 100ms intervals

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe development
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **rc-dock**: Docking window system for desktop-like experience
- **WebSocket Client**: Connects to backend for real-time updates
- **Radix UI**: Accessible component primitives

## API Endpoints

### Backend Endpoints

- `GET /` - Health check endpoint
- `WebSocket /ws/orderbook` - WebSocket endpoint for order book data

### Data Format

```json
{
  "symbol": "BTCUSDT",
  "lastUpdateId": 12345678,
  "bids": [
    ["95000.00", "0.1234"],  // [price, amount]
    ...
  ],
  "asks": [
    ["95100.00", "0.0987"],
    ...
  ]
}
```

## Customization

### Change Trading Pair

Edit `backend/main.py` line 68:
```python
asyncio.create_task(binance_orderbook_stream("ethusdt"))  # Change to any trading pair
```

### Adjust Update Frequency

Modify the Binance WebSocket URL in `backend/main.py` line 24:
```python
url = f"wss://stream.binance.com:9443/ws/{symbol}@depth20@1000ms"  # 1000ms instead of 100ms
```

### Number of Order Book Levels

Change the slice in `backend/main.py` lines 35-36:
```python
"bids": data.get("bids", [])[:20],  # Show top 20 instead of 10
"asks": data.get("asks", [])[:20],
```

## Requirements

### Backend
- Python 3.8+
- FastAPI
- Uvicorn
- Websockets

### Frontend
- Node.js 16+
- npm or yarn
- TypeScript 5+

## License

MIT

## Notes

- This is a demo application for educational purposes
- Real trading applications require additional features like authentication, error handling, and data validation
- Binance API rate limits apply
- No API key required for public market data streams
