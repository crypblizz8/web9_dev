'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ChatInterface from '../components/ChatInterface';

// Use dynamic import to avoid SSR issues with Sandpack
const SandpackPreview = dynamic(
  () => import('../components/sandpack/SandpackPreview'),
  { ssr: false }
);

export default function SandpackDemoPage() {
  const chatInterfaceRef = useRef<any>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateCode = async (inputPrompt: string) => {
    if (!inputPrompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      const data = await response.json();
      console.log('data', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate code');
      }

      setCode(data.code);

      // Add assistant response to chat
      if (chatInterfaceRef.current) {
        chatInterfaceRef.current.addAssistantMessage(
          'Code generated successfully! Check the preview tab to see the result.'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');

      // Add error message to chat
      if (chatInterfaceRef.current) {
        chatInterfaceRef.current.addAssistantMessage(
          `Error: ${
            err instanceof Error ? err.message : 'Something went wrong'
          }`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load prompt from sessionStorage when component mounts
  useEffect(() => {
    const initialPrompt = sessionStorage.getItem('initialPrompt');

    if (initialPrompt && chatInterfaceRef.current) {
      // Remove the prompt from sessionStorage to prevent it from being used again
      sessionStorage.removeItem('initialPrompt');

      // Add user message with the prompt
      chatInterfaceRef.current.addUserMessage({
        id: Date.now().toString(),
        role: 'user',
        content: initialPrompt,
      });

      // Wait a bit then handle code generation
      setTimeout(() => {
        handleGenerateCode(initialPrompt);
      }, 500);
    }
  }, []);

  return (
    <div className='flex h-screen bg-[#1e1e1e] text-white'>
      {/* Left sidebar - similar to your web9 chat */}
      <div className='w-1/3 border-r border-gray-800 flex flex-col'>
        <div className='p-4 border-b border-gray-800 flex items-center'>
          <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold mr-3'>
            Vib3
          </div>
          <h1 className='text-lg font-semibold'>Vib3</h1>
        </div>
        {/* 
        <div className='flex-1 p-4'>
          <div className='bg-gray-800 bg-opacity-40 p-4 rounded mb-6'>
            <p>
              Welcome to vib3.dev! Describe what you want to build, and I will
              generate the code for you.
            </p>
          </div>

          <p className='italic mb-2 text-gray-300'>Templates</p>
          <button
            onClick={() => console.log('thinking....')}
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200'
          >
            Wallet
          </button>

          <button className='ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200'>
            Voting App
          </button>
        </div> */}

        {/* <div className='p-4 border-t border-gray-800'>
          <div className='flex items-center'>
            <input
              type='text'
              placeholder='Describe what you want to build...'
              className='flex-1 bg-gray-800 text-white placeholder:text-gray-400 p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500'
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
        </div> */}
        <div className='border-r border-muted'>
          <ChatInterface
            ref={chatInterfaceRef}
            onSubmit={handleGenerateCode}
            isLoading={isLoading}
          />
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
                <line
                  x1='10'
                  y1='14'
                  x2='21'
                  y2='3'
                ></line>
              </svg>
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-hidden'>
          {code ? (
            <SandpackPreview
              files={{
                '/app/page.tsx': code,
              }}
              activePath='/app/page.tsx'
            />
          ) : (
            <div className='flex items-center justify-center h-full bg-[#1a1a1a]'>
              <p className='text-gray-500'>
                Code will appear here when generated
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
