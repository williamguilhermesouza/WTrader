import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBook: (symbol: string) => void;
}

export function NewBookDialog({ open, onOpenChange, onCreateBook }: NewBookDialogProps) {
  const [symbol, setSymbol] = useState('BTCUSDT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onCreateBook(symbol.trim().toUpperCase());
      setSymbol('BTCUSDT');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Order Book</DialogTitle>
          <DialogDescription>
            Enter the trading pair symbol to create a new order book window.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="symbol" className="text-right">
                Symbol
              </Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="BTCUSDT"
                className="col-span-3"
                autoFocus
              />
            </div>
            <div className="col-span-4 text-xs text-muted-foreground px-4">
              Examples: BTCUSDT, ETHUSDT, BNBUSDT
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
