# Backend - Binance Order Book API

FastAPI backend that streams real-time order book data from Binance.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

The server will start on `http://localhost:8000`

## Endpoints

- `GET /` - Health check
- `WebSocket /ws/orderbook` - WebSocket endpoint for real-time order book data
