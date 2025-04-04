import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackFiles,
} from '@codesandbox/sandpack-react';
import { web9Theme } from './web9Theme';

// Sample Next.js project files
const DEFAULT_NEXTJS_FILES = {
  '/app/page.tsx': `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
          Generated by web9
        </p>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold">Welcome to the Bakery</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        <ProductCard 
          title="Sourdough Bread" 
          price="$4.99" 
          description="Our signature sourdough with a perfect crust" 
        />
        <ProductCard 
          title="Croissant" 
          price="$3.50" 
          description="Buttery, flaky, and perfectly baked" 
        />
        <ProductCard 
          title="Chocolate Cake" 
          price="$24.99" 
          description="Rich chocolate cake with ganache frosting" 
        />
      </div>
    </main>
  );
}`,
  '/app/layout.tsx': `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bakery Landing Page',
  description: 'A delicious bakery with fresh bread and pastries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`,
  '/app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}`,
  '/components/ProductCard.tsx': `interface ProductCardProps {
  title: string;
  price: string;
  description: string;
  image?: string;
}

export default function ProductCard({ 
  title, 
  price, 
  description, 
  image = '/product-placeholder.jpg'
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="font-bold text-green-600">{price}</span>
        </div>
        <p className="mt-2 text-gray-600 text-sm">{description}</p>
        <button className="mt-4 w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
}`,
  '/components/Header.tsx': `export default function Header() {
  return (
    <header className="bg-amber-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold">Fresh Bakery</span>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-amber-200">Home</a></li>
            <li><a href="#" className="hover:text-amber-200">Products</a></li>
            <li><a href="#" className="hover:text-amber-200">About</a></li>
            <li><a href="#" className="hover:text-amber-200">Contact</a></li>
          </ul>
        </nav>
        
        <div>
          <button className="bg-white text-amber-700 px-4 py-2 rounded-md hover:bg-amber-100">
            Order Now
          </button>
        </div>
      </div>
    </header>
  );
}`,
};

interface TabsTopSandpackPreviewProps {
  files?: SandpackFiles;
  activePath?: string;
}

const TabsTopSandpackPreview = forwardRef<
  { setFiles: (files: SandpackFiles) => void },
  TabsTopSandpackPreviewProps
>(({ files = DEFAULT_NEXTJS_FILES, activePath = '/app/page.tsx' }, ref) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [currentFiles, setCurrentFiles] = useState<SandpackFiles>(files);

  // Update files when props change
  useImperativeHandle(ref, () => ({
    setFiles: (newFiles: SandpackFiles) => {
      if (Object.keys(newFiles).length > 0) {
        setCurrentFiles(newFiles);
      }
    },
  }));

  return (
    <div className='h-full flex flex-col bg-[#1e1e1e] text-white'>
      {/* Tabs */}
      <div className='flex border-b border-gray-800 p-0'>
        <button
          className={`px-4 py-2 ${
            activeTab === 'code'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('code')}
        >
          <div className='flex items-center space-x-1'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <polyline points='16 18 22 12 16 6'></polyline>
              <polyline points='8 6 2 12 8 18'></polyline>
            </svg>
            <span>Code</span>
          </div>
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'preview'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          <div className='flex items-center space-x-1'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <rect x='2' y='3' width='20' height='14' rx='2' ry='2'></rect>
              <line x1='8' y1='21' x2='16' y2='21'></line>
              <line x1='12' y1='17' x2='12' y2='21'></line>
            </svg>
            <span>Preview</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-hidden'>
        <SandpackProvider
          template='nextjs'
          theme={web9Theme}
          files={currentFiles}
          options={{
            activeFile: activePath,
            visibleFiles: Object.keys(currentFiles),
            classes: {
              'sp-layout': 'custom-layout',
              'sp-tabs': 'custom-tabs',
            },
          }}
        >
          <SandpackLayout className='!border-0 !bg-[#1e1e1e] !rounded-none'>
            {activeTab === 'code' ? (
              <div className='h-full flex'>
                <div className='w-48 h-full border-r border-gray-800 bg-[#1e1e1e] overflow-auto'>
                  <SandpackFileExplorer className='!bg-[#1e1e1e] !border-0' />
                </div>
                <div className='flex-1 h-full overflow-auto'>
                  <SandpackCodeEditor
                    showTabs
                    showLineNumbers
                    showInlineErrors
                    wrapContent
                    closableTabs={false}
                    className='h-full'
                  />
                </div>
              </div>
            ) : (
              <div className='h-full bg-white'>
                <SandpackPreview showNavigator />
              </div>
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
});

export default TabsTopSandpackPreview;
