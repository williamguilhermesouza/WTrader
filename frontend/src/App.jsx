import { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [], symbol: '', lastUpdateId: null });
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/orderbook');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setOrderBook(data);
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('Connection error');
      setConnected(false);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const formatPrice = (price) => parseFloat(price).toFixed(2);
  const formatAmount = (amount) => parseFloat(amount).toFixed(4);

  const calculateTotal = useCallback((orders, index) => {
    return orders.slice(0, index + 1).reduce((sum, order) => sum + parseFloat(order[1]), 0);
  }, []);

  const maxTotal = Math.max(
    orderBook.bids.length > 0 ? calculateTotal(orderBook.bids, orderBook.bids.length - 1) : 0,
    orderBook.asks.length > 0 ? calculateTotal(orderBook.asks, orderBook.asks.length - 1) : 0
  );

  return (
    <div className="App">
      <header className="header">
        <h1>📊 Binance Order Book</h1>
        <div className="status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
          <span>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="container">
        <div className="symbol-header">
          <h2>{orderBook.symbol || 'Loading...'}</h2>
          {orderBook.lastUpdateId && (
            <span className="update-id">Update ID: {orderBook.lastUpdateId}</span>
          )}
        </div>

        <div className="orderbook-container">
          {/* Asks (Sell Orders) */}
          <div className="orderbook-section asks-section">
            <h3 className="section-title asks-title">Asks (Sell Orders)</h3>
            <div className="orderbook-header">
              <span>Price (USDT)</span>
              <span>Amount (BTC)</span>
              <span>Total (BTC)</span>
            </div>
            <div className="orderbook-rows">
              {[...orderBook.asks].reverse().map((ask, index) => {
                const reversedIndex = orderBook.asks.length - 1 - index;
                const total = calculateTotal(orderBook.asks, reversedIndex);
                const barWidth = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                
                return (
                  <div key={index} className="orderbook-row ask-row">
                    <div className="bar ask-bar" style={{ width: `${barWidth}%` }}></div>
                    <span className="price ask-price">{formatPrice(ask[0])}</span>
                    <span className="amount">{formatAmount(ask[1])}</span>
                    <span className="total">{formatAmount(total)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spread */}
          <div className="spread-section">
            {orderBook.asks.length > 0 && orderBook.bids.length > 0 && (
              <>
                <div className="spread-value">
                  Spread: ${(parseFloat(orderBook.asks[0][0]) - parseFloat(orderBook.bids[0][0])).toFixed(2)}
                </div>
                <div className="mid-price">
                  Mid Price: ${((parseFloat(orderBook.asks[0][0]) + parseFloat(orderBook.bids[0][0])) / 2).toFixed(2)}
                </div>
              </>
            )}
          </div>

          {/* Bids (Buy Orders) */}
          <div className="orderbook-section bids-section">
            <h3 className="section-title bids-title">Bids (Buy Orders)</h3>
            <div className="orderbook-header">
              <span>Price (USDT)</span>
              <span>Amount (BTC)</span>
              <span>Total (BTC)</span>
            </div>
            <div className="orderbook-rows">
              {orderBook.bids.map((bid, index) => {
                const total = calculateTotal(orderBook.bids, index);
                const barWidth = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                
                return (
                  <div key={index} className="orderbook-row bid-row">
                    <div className="bar bid-bar" style={{ width: `${barWidth}%` }}></div>
                    <span className="price bid-price">{formatPrice(bid[0])}</span>
                    <span className="amount">{formatAmount(bid[1])}</span>
                    <span className="total">{formatAmount(total)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
