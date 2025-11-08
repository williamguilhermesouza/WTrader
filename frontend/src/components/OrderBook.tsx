import { useState, useEffect, useCallback } from 'react';
import type { OrderBookData } from '@/types';

interface OrderBookProps {
  symbol: string;
}

export function OrderBook({ symbol }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: [],
    asks: [],
    symbol: '',
    lastUpdateId: 0,
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/orderbook');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data: OrderBookData = JSON.parse(event.data);
        if (data.symbol === symbol.toUpperCase()) {
          setOrderBook(data);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setConnected(false);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  const formatPrice = (price: string) => parseFloat(price).toFixed(2);
  const formatAmount = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toFixed(4);
  };

  const calculateTotal = useCallback((orders: [string, string][], index: number) => {
    return orders.slice(0, index + 1).reduce((sum, order) => sum + parseFloat(order[1]), 0);
  }, []);

  const maxTotal = Math.max(
    orderBook.bids.length > 0 ? calculateTotal(orderBook.bids, orderBook.bids.length - 1) : 0,
    orderBook.asks.length > 0 ? calculateTotal(orderBook.asks, orderBook.asks.length - 1) : 0
  );

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-yellow-400">{orderBook.symbol || symbol.toUpperCase()}</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            <span className="text-xs text-muted-foreground">{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        {orderBook.lastUpdateId > 0 && (
          <span className="text-xs text-muted-foreground">Update: {orderBook.lastUpdateId}</span>
        )}
      </div>

      {/* Order Book Content */}
      <div className="flex-1 overflow-auto">
        {/* Asks */}
        <div className="border-b">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-4 py-2 border-b">
            <h3 className="text-sm font-semibold text-red-400">Asks (Sell Orders)</h3>
          </div>
          <div className="px-4 py-2">
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground mb-2">
              <div>Price (USDT)</div>
              <div className="text-right">Amount (BTC)</div>
              <div className="text-right">Total (BTC)</div>
            </div>
            <div className="space-y-0.5">
              {[...orderBook.asks].reverse().map((ask, index) => {
                const reversedIndex = orderBook.asks.length - 1 - index;
                const total = calculateTotal(orderBook.asks, reversedIndex);
                const barWidth = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

                return (
                  <div key={index} className="relative grid grid-cols-3 gap-2 py-1 hover:bg-accent/50 rounded">
                    <div
                      className="absolute inset-y-0 right-0 bg-red-500/10"
                      style={{ width: `${barWidth}%` }}
                    />
                    <div className="relative z-10 text-sm font-mono text-red-400">{formatPrice(ask[0])}</div>
                    <div className="relative z-10 text-sm font-mono text-right">{formatAmount(ask[1])}</div>
                    <div className="relative z-10 text-sm font-mono text-right text-muted-foreground">
                      {formatAmount(total)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Spread */}
        {orderBook.asks.length > 0 && orderBook.bids.length > 0 && (
          <div className="bg-accent/20 px-4 py-3 border-b">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-muted-foreground">Spread: </span>
                <span className="font-semibold text-yellow-400">
                  ${(parseFloat(orderBook.asks[0][0]) - parseFloat(orderBook.bids[0][0])).toFixed(2)}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Mid: </span>
                <span className="font-semibold">
                  ${((parseFloat(orderBook.asks[0][0]) + parseFloat(orderBook.bids[0][0])) / 2).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bids */}
        <div>
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-4 py-2 border-b">
            <h3 className="text-sm font-semibold text-green-400">Bids (Buy Orders)</h3>
          </div>
          <div className="px-4 py-2">
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground mb-2">
              <div>Price (USDT)</div>
              <div className="text-right">Amount (BTC)</div>
              <div className="text-right">Total (BTC)</div>
            </div>
            <div className="space-y-0.5">
              {orderBook.bids.map((bid, index) => {
                const total = calculateTotal(orderBook.bids, index);
                const barWidth = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

                return (
                  <div key={index} className="relative grid grid-cols-3 gap-2 py-1 hover:bg-accent/50 rounded">
                    <div
                      className="absolute inset-y-0 right-0 bg-green-500/10"
                      style={{ width: `${barWidth}%` }}
                    />
                    <div className="relative z-10 text-sm font-mono text-green-400">{formatPrice(bid[0])}</div>
                    <div className="relative z-10 text-sm font-mono text-right">{formatAmount(bid[1])}</div>
                    <div className="relative z-10 text-sm font-mono text-right text-muted-foreground">
                      {formatAmount(total)}
                    </div>
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
