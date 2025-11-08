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

function App() {
  const dockLayoutRef = useRef<DockLayout>(null);
  const bookIdCounterRef = useRef(0);
  const [books, setBooks] = useState<BookWindow[]>([
    { id: 'book-0', symbol: 'BTCUSDT', title: 'BTC/USDT' },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [layout, setLayout] = useState<LayoutData>({
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
              closable: true,
            },
          ],
        },
      ],
    },
  });

  const loadTab = (data: TabData) => {
    // Always ensure content is present
    if (data.id && data.id.startsWith('book-')) {
      const bookData = books.find(b => b.id === data.id);
      if (bookData) {
        return {
          ...data,
          title: bookData.title,
          content: <OrderBook symbol={bookData.symbol} />,
          cached: true,
          closable: true,
        };
      }
    }
    return data;
  };

  const createNewBook = (symbol: string) => {
    bookIdCounterRef.current++;
    const newBookId = `book-${bookIdCounterRef.current}`;
    const title = `${symbol.slice(0, -4)}/${symbol.slice(-4)}`;

    const newBook: BookWindow = {
      id: newBookId,
      symbol,
      title,
    };

    // Update books state first
    setBooks(prevBooks => [...prevBooks, newBook]);

    // Create new tab
    const newTab: TabData = {
      id: newBookId,
      title,
      content: <OrderBook symbol={symbol} />,
      cached: true,
      closable: true,
    };

    // Update layout to add the new tab
    setLayout(prevLayout => {
      // Check if we have any existing panels with tabs
      let hasExistingPanel = false;
      
      if (prevLayout.dockbox?.children && Array.isArray(prevLayout.dockbox.children)) {
        for (const child of prevLayout.dockbox.children) {
          if ('tabs' in child && child.tabs && child.tabs.length > 0) {
            hasExistingPanel = true;
            break;
          }
        }
      }

      // If no existing panel with tabs, create a fresh layout
      if (!hasExistingPanel) {
        return {
          dockbox: {
            mode: 'horizontal',
            children: [
              {
                tabs: [newTab],
                panelLock: {},
              },
            ],
          },
        };
      }

      // Add to first panel with tabs
      const newLayout: LayoutData = {
        ...prevLayout,
        dockbox: {
          ...prevLayout.dockbox!,
          children: prevLayout.dockbox!.children!.map((child, index) => {
            if (index === 0 && 'tabs' in child) {
              return {
                ...child,
                tabs: [...(child.tabs || []), newTab],
              };
            }
            return child;
          }),
        },
      };
      
      return newLayout;
    });
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
          layout={layout}
          onLayoutChange={setLayout}
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
