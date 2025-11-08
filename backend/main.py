from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import websockets
from typing import Dict, Set

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active WebSocket connections per symbol
# symbol -> Set of WebSocket connections
symbol_connections: Dict[str, Set[WebSocket]] = {}

# Store Binance WebSocket tasks per symbol
binance_tasks: Dict[str, asyncio.Task] = {}

# Store last prices per symbol
last_prices: Dict[str, str] = {}


async def binance_orderbook_stream(symbol: str):
    """Connect to Binance WebSocket and stream order book data for a specific symbol"""
    symbol_lower = symbol.lower()
    # Combine depth and ticker streams
    url = f"wss://stream.binance.com:9443/stream?streams={symbol_lower}@depth20@100ms/{symbol_lower}@ticker"
    
    print(f"Starting Binance stream for {symbol.upper()}")
    
    while True:
        try:
            async with websockets.connect(url) as websocket:
                while True:
                    try:
                        # Check if there are still clients subscribed to this symbol
                        if symbol not in symbol_connections or len(symbol_connections[symbol]) == 0:
                            print(f"No more clients for {symbol.upper()}, closing stream")
                            return
                        
                        message = await websocket.recv()
                        data = json.loads(message)
                        
                        # Handle combined stream format
                        if "stream" in data:
                            stream_name = data["stream"]
                            stream_data = data["data"]
                            
                            # Update last price from ticker
                            if "ticker" in stream_name:
                                last_prices[symbol] = stream_data.get("c", "0")  # 'c' is last price
                            
                            # Process depth updates
                            elif "depth" in stream_name:
                                # Process and forward to all connected clients for this symbol
                                orderbook_data = {
                                    "symbol": symbol.upper(),
                                    "lastUpdateId": stream_data.get("lastUpdateId"),
                                    "bids": stream_data.get("bids", [])[:10],  # Top 10 bids
                                    "asks": stream_data.get("asks", [])[:10],  # Top 10 asks
                                    "lastPrice": last_prices.get(symbol, "0"),
                                }
                                
                                # Send to all clients subscribed to this symbol
                                if symbol in symbol_connections:
                                    disconnected = set()
                                    for connection in symbol_connections[symbol]:
                                        try:
                                            await connection.send_json(orderbook_data)
                                        except Exception:
                                            disconnected.add(connection)
                                    
                                    # Remove disconnected clients
                                    symbol_connections[symbol].difference_update(disconnected)
                        
                    except websockets.exceptions.ConnectionClosed:
                        print(f"Binance WebSocket connection closed for {symbol.upper()}, reconnecting...")
                        break
                    except Exception as e:
                        print(f"Error processing message for {symbol.upper()}: {e}")
                        
        except Exception as e:
            print(f"Error connecting to Binance for {symbol.upper()}: {e}")
            await asyncio.sleep(5)  # Wait before reconnecting


def start_binance_stream(symbol: str):
    """Start a Binance stream for a symbol if not already running"""
    if symbol not in binance_tasks or binance_tasks[symbol].done():
        binance_tasks[symbol] = asyncio.create_task(binance_orderbook_stream(symbol))
        print(f"Created Binance stream task for {symbol.upper()}")


@app.get("/")
async def root():
    return {"message": "Binance Order Book API", "status": "running"}


@app.websocket("/ws/orderbook/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str):
    """WebSocket endpoint for clients to receive order book updates for a specific symbol"""
    symbol = symbol.upper()
    
    await websocket.accept()
    print(f"Client connected for {symbol}")
    
    # Add connection to the symbol's connection set
    if symbol not in symbol_connections:
        symbol_connections[symbol] = set()
    symbol_connections[symbol].add(websocket)
    
    # Start Binance stream for this symbol if not already running
    start_binance_stream(symbol)
    
    try:
        while True:
            # Keep connection alive and wait for messages from client
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print(f"Client disconnected from {symbol}")
    except Exception as e:
        print(f"WebSocket error for {symbol}: {e}")
    finally:
        # Remove connection
        if symbol in symbol_connections and websocket in symbol_connections[symbol]:
            symbol_connections[symbol].remove(websocket)
            
        # Clean up if no more connections for this symbol
        if symbol in symbol_connections and len(symbol_connections[symbol]) == 0:
            del symbol_connections[symbol]
            print(f"No more connections for {symbol}, stream will close")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
