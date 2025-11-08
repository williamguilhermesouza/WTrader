from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import websockets
from typing import Set

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active WebSocket connections
active_connections: Set[WebSocket] = set()


async def binance_orderbook_stream(symbol: str = "btcusdt"):
    """Connect to Binance WebSocket and stream order book data"""
    url = f"wss://stream.binance.com:9443/ws/{symbol}@depth20@100ms"
    
    try:
        async with websockets.connect(url) as websocket:
            while True:
                try:
                    message = await websocket.recv()
                    data = json.loads(message)
                    
                    # Process and forward to all connected clients
                    orderbook_data = {
                        "symbol": symbol.upper(),
                        "lastUpdateId": data.get("lastUpdateId"),
                        "bids": data.get("bids", [])[:10],  # Top 10 bids
                        "asks": data.get("asks", [])[:10],  # Top 10 asks
                    }
                    
                    # Send to all connected clients
                    disconnected = set()
                    for connection in active_connections:
                        try:
                            await connection.send_json(orderbook_data)
                        except Exception:
                            disconnected.add(connection)
                    
                    # Remove disconnected clients
                    active_connections.difference_update(disconnected)
                    
                except websockets.exceptions.ConnectionClosed:
                    print("Binance WebSocket connection closed, reconnecting...")
                    break
                except Exception as e:
                    print(f"Error processing message: {e}")
                    
    except Exception as e:
        print(f"Error connecting to Binance: {e}")


@app.on_event("startup")
async def startup_event():
    """Start the Binance WebSocket stream on application startup"""
    asyncio.create_task(binance_orderbook_stream("btcusdt"))


@app.get("/")
async def root():
    return {"message": "Binance Order Book API", "status": "running"}


@app.websocket("/ws/orderbook")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for clients to receive order book updates"""
    await websocket.accept()
    active_connections.add(websocket)
    
    try:
        while True:
            # Keep connection alive
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        active_connections.remove(websocket)
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        if websocket in active_connections:
            active_connections.remove(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
