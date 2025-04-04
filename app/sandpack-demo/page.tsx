'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to avoid SSR issues with Sandpack
const SandpackPreview = dynamic(
  () => import('../components/sandpack/SandpackPreview'),
  { ssr: false }
);

// Sample project structure for demonstration
const SAMPLE_PROJECT = {
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

export default function SandpackDemoPage() {
  return (
    <div className='flex h-screen bg-[#1e1e1e] text-white'>
      {/* Left sidebar - similar to your web9 chat */}
      <div className='w-1/3 border-r border-gray-800 flex flex-col'>
        <div className='p-4 border-b border-gray-800 flex items-center'>
          <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold mr-3'>
            web9
          </div>
          <h1 className='text-lg font-semibold'>web9</h1>
        </div>

        <div className='flex-1 p-4'>
          <div className='bg-gray-800 bg-opacity-40 p-4 rounded mb-6'>
            <p>
              Welcome to web9! Describe what you want to build, and I'll
              generate the code for you.
            </p>
          </div>

          <div className='ml-auto mr-0 bg-blue-600 text-white p-3 rounded-lg max-w-[85%] mb-6'>
            <p>
              Create a bakery landing page with a hero section and product cards
            </p>
          </div>

          <div className='bg-gray-800 bg-opacity-40 p-3 rounded-lg max-w-[85%]'>
            <p>
              Code generated successfully! Check the code tab to see the result.
            </p>
          </div>
        </div>

        <div className='p-4 border-t border-gray-800'>
          <div className='flex items-center'>
            <input
              type='text'
              placeholder='Describe what you want to build...'
              className='flex-1 bg-gray-800 text-white placeholder:text-gray-400 p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500'
              disabled
            />
            <button className='ml-2 bg-blue-600 p-2 rounded-md'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='22' y1='2' x2='11' y2='13'></line>
                <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Code and Preview */}
      <div className='flex-1 flex flex-col'>
        <div className='p-4 border-b border-gray-800 flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>Generated Code</h2>
          <div className='flex space-x-2'>
            <button className='p-1.5 rounded hover:bg-gray-800'>
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
                <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                <polyline points='15 3 21 3 21 9'></polyline>
                <line x1='10' y1='14' x2='21' y2='3'></line>
              </svg>
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-hidden'>
          <SandpackPreview files={SAMPLE_PROJECT} activePath='/app/page.tsx' />
        </div>
      </div>
    </div>
  );
}
