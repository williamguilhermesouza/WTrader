import { useState, useRef } from 'react';
import DockLayout, { type LayoutData, type TabData } from 'rc-dock';
import 'rc-dock/dist/rc-dock.css';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { NewBookDialog } from '@/components/NewBookDialog';
import { OrderBook } from '@/components/OrderBook';
import type { BookWindow } from '@/types';
import './App.css';

let bookIdCounter = 0;

function App() {
  const dockLayoutRef = useRef<DockLayout>(null);
  const [books, setBooks] = useState<BookWindow[]>([
    { id: 'book-0', symbol: 'BTCUSDT', title: 'BTC/USDT' },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const defaultLayout: LayoutData = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          tabs: [
            {
              id: 'book-0',
              title: 'BTC/USDT',
              content: <OrderBook symbol="BTCUSDT" />,
              cached: true,
            },
          ],
        },
      ],
    },
  };

  const loadTab = (data: TabData) => {
    // Load tab content based on saved data
    if (data.id && data.id.startsWith('book-')) {
      const bookData = books.find(b => b.id === data.id);
      const symbol = bookData?.symbol || 'BTCUSDT';
      return {
        ...data,
        content: <OrderBook symbol={symbol} />,
        cached: true,
      };
    }
    return data;
  };

  const createNewBook = (symbol: string) => {
    bookIdCounter++;
    const newBookId = `book-${bookIdCounter}`;
    const title = `${symbol.slice(0, -4)}/${symbol.slice(-4)}`;

    const newBook: BookWindow = {
      id: newBookId,
      symbol,
      title,
    };

    setBooks([...books, newBook]);

    // Add new tab to dock layout
    const newTab: TabData = {
      id: newBookId,
      title,
      content: <OrderBook symbol={symbol} />,
      cached: true,
    };

    // Use the dock layout API to add a new tab
    if (dockLayoutRef.current) {
      dockLayoutRef.current.dockMove(newTab, null, 'middle');
    }
  };

  const handleNewBook = () => {
    setDialogOpen(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Menubar */}
      <div className="border-b bg-background">
        <Menubar className="rounded-none border-none px-2 h-9">
          <MenubarMenu>
            <MenubarTrigger className="font-normal">File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleNewBook}>
                New Order Book
                <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem disabled>
                Save Layout
                <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>Load Layout</MenubarItem>
              <MenubarSeparator />
              <MenubarItem disabled>Exit</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="font-normal">View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem disabled>Fullscreen</MenubarItem>
              <MenubarSeparator />
              <MenubarItem disabled>Dark Mode</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="font-normal">Window</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleNewBook}>New Order Book</MenubarItem>
              <MenubarSeparator />
              {books.map((book) => (
                <MenubarItem key={book.id} disabled>
                  {book.title}
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="font-normal">Help</MenubarTrigger>
            <MenubarContent>
              <MenubarItem disabled>Documentation</MenubarItem>
              <MenubarItem disabled>About</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Dock Layout */}
      <div className="flex-1 relative">
        <DockLayout
          ref={dockLayoutRef}
          defaultLayout={defaultLayout}
          loadTab={loadTab}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      {/* New Book Dialog */}
      <NewBookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreateBook={createNewBook}
      />
    </div>
  );
}

export default App;
