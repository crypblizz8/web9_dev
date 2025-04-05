'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Use dynamic import to avoid SSR issues with Sandpack
const SandpackPreview = dynamic(
  () => import('./components/sandpack/SandpackPreview'),
  { ssr: false }
);

export default function Page() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!prompt.trim()) return;

  //   // Here you would typically call your API
  //   setIsGenerating(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsGenerating(false);
  //     // Navigate to results page or show preview
  //   }, 1500);
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Navigate to generate page with the prompt as a query parameter
    window.location.href = `/generate`;
  };

  return (
    <div className='min-h-screen bg-black text-white flex flex-col'>
      {/* Header */}
      <header className='p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <div className='flex flex-row items-center gap-2 p-4'>
            <Image
              src='/vib3_logo.png'
              alt='Vib3 Logo'
              width={40}
              height={40}
            />
            <Image
              src='/vib3_text_logo.png'
              alt='Vib3'
              width={84}
              height={30}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className='flex-1 flex flex-col items-center justify-center p-4'>
        <Image
          className='mb-8'
          src='/vib3_logo.png'
          alt='Vib3 Logo'
          width={120}
          height={120}
        />
        <h1 className='text-6xl font-bold mb-4'>Turn your ideas</h1>
        <h1 className='text-6xl font-bold mb-20'>into dapps</h1>

        <form onSubmit={handleSubmit} className='w-full max-w-2xl'>
          <div className='relative'>
            <input
              type='text'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Build a staking dapp...'
              className='w-full h-[100px] bg-[#111] border border-[#333] rounded-md p-4 pr-12 focus:outline-none focus:ring-1 focus:ring-gray-500'
            />
            <div className='absolute right-0 top-0 h-full flex items-center pr-3 gap-2'>
              <button
                type='submit'
                className='text-gray-400 hover:text-white'
                disabled={isGenerating || !prompt.trim()}
                title='Submit'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M22 2L11 13'></path>
                  <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
