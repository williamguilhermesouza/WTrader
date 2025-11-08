# WTraderWeb - User Guide

## Overview

WTraderWeb is a professional cryptocurrency trading tool that provides real-time order book data from Binance with a desktop-like interface featuring dockable windows.

## Getting Started

### First Time Setup

1. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Linux/Mac
   pip install -r requirements.txt
   python main.py
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Features

### Application Menubar

The menubar at the top provides desktop-like functionality:

- **File Menu**
  - New Order Book (⌘N): Create a new order book window
  - Save Layout (⌘S): Save your window layout (coming soon)
  - Load Layout: Restore a saved layout (coming soon)
  - Exit: Close the application (coming soon)

- **View Menu**
  - Fullscreen: Toggle fullscreen mode (coming soon)
  - Dark Mode: Toggle dark/light theme (coming soon)

- **Window Menu**
  - New Order Book: Create a new order book window
  - List of all open order book windows

- **Help Menu**
  - Documentation: View documentation (coming soon)
  - About: About WTraderWeb (coming soon)

### Dockable Windows

The application uses a sophisticated docking system that allows you to:

1. **Create Multiple Windows**
   - Click "File > New Order Book" or "Window > New Order Book"
   - Enter a trading pair symbol (e.g., BTCUSDT, ETHUSDT, BNBUSDT)
   - Click "Create"

2. **Arrange Windows**
   - **Drag tabs** to reorder them
   - **Drag tabs out** to create floating windows
   - **Drag tabs to edges** to dock them side by side
   - **Split horizontally or vertically** by dragging to panel edges

3. **Close Windows**
   - Click the X button on any tab to close that order book

### Order Book Display

Each order book window shows:

- **Header**
  - Trading pair symbol (e.g., BTC/USDT)
  - Connection status indicator (green = connected, red = disconnected)
  - Last update ID

- **Asks Section** (Red - Sell Orders)
  - Price in USDT
  - Amount in base currency
  - Cumulative total
  - Visual depth bars

- **Spread Information**
  - Current spread between best bid and ask
  - Mid-market price

- **Bids Section** (Green - Buy Orders)
  - Price in USDT
  - Amount in base currency
  - Cumulative total
  - Visual depth bars

## Trading Pairs

You can create order books for any Binance spot trading pair. Common examples:

- **Bitcoin**: BTCUSDT
- **Ethereum**: ETHUSDT
- **Binance Coin**: BNBUSDT
- **Cardano**: ADAUSDT
- **Solana**: SOLUSDT
- **Ripple**: XRPUSDT
- **Dogecoin**: DOGEUSDT

**Note**: The symbol must be in all caps and end with USDT (or another quote currency available on Binance).

## Keyboard Shortcuts

- `⌘N` or `Ctrl+N`: Create new order book
- `⌘S` or `Ctrl+S`: Save layout (coming soon)

## Tips & Tricks

1. **Multiple Monitors**: Drag windows out to separate floating windows and move them to other monitors

2. **Side-by-Side Comparison**: 
   - Create multiple order books for different pairs
   - Drag tabs to the left or right edge to dock them side by side
   - Compare market depth across different cryptocurrencies

3. **Vertical Stacking**:
   - Drag tabs to the top or bottom edge to stack them vertically
   - Good for monitoring multiple pairs in a compact space

4. **Tab Organization**:
   - Keep frequently watched pairs in tabs for quick switching
   - Close unused pairs to reduce resource usage

## Technical Details

### WebSocket Connection

- The application maintains a single WebSocket connection to the backend
- The backend connects to Binance's official WebSocket API
- Updates are received approximately every 100ms
- Automatic reconnection on connection loss

### Data Updates

- **Top 10 levels**: Shows the top 10 bid and ask orders
- **Real-time**: Updates stream continuously
- **Depth visualization**: Bars show cumulative volume at each price level

### Performance

- **Cached tabs**: Tabs maintain their state when switching
- **Efficient rendering**: Only visible components are updated
- **Low latency**: Direct WebSocket connection minimizes delay

## Troubleshooting

### "Disconnected" Status
- Check if the backend server is running
- Verify the backend is accessible at `localhost:8000`
- Check browser console for WebSocket errors

### No Data Appearing
- Verify the trading pair symbol is correct
- Check if Binance API is accessible
- Look for errors in the backend console

### Slow Performance
- Close unused order book windows
- Check your internet connection
- Reduce the number of simultaneously open windows

## Future Features

- Save and load window layouts
- Multiple backend connections
- Chart integration
- Trade execution
- Portfolio tracking
- Custom themes
- Keyboard shortcuts customization
- Export data
- Alerts and notifications

## Support

For issues, questions, or feature requests, please check the main README.md file.
