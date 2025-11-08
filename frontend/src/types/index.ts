export interface OrderBookData {
  symbol: string;
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface BookWindow {
  id: string;
  symbol: string;
  title: string;
}
