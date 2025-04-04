'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to avoid SSR issues with Sandpack
const TabsTopSandpackPreview = dynamic(
  () => import('../components/sandpack/TabsTopSandpackPreview'),
  { ssr: false }
);

export default function TabsTopDemoPage() {
  return (
    <div className='flex h-screen bg-[#1e1e1e] text-white'>
      <div className='w-1/3 border-r border-gray-800 flex flex-col'>
        <div className='p-4 border-b border-gray-800 flex items-center'>
          <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold mr-3'>
            web9
          </div>
          <h1 className='text-lg font-semibold'>web nine</h1>
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

      {/* Right side - Code and Preview tabs at the top */}
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
          <TabsTopSandpackPreview />
        </div>
      </div>
    </div>
  );
}
