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

// 'use client';

// import { useState, useRef } from 'react';
// import CodeDisplay from './components/CodeDisplay';
// import Preview from './components/Preview';
// import ChatInterface from './components/ChatInterface';
// import Tabs from './components/ui/Tabs';

// export default function Home() {
//   const [code, setCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const chatInterfaceRef = useRef<any>(null);

//   const handleGenerateCode = async (inputPrompt: string) => {
//     if (!inputPrompt.trim()) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt: inputPrompt }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to generate code');
//       }

//       setCode(data.code);

//       // Add assistant response to chat
//       // We can add a simple confirmation message here
//       if (chatInterfaceRef.current) {
//         chatInterfaceRef.current.addAssistantMessage(
//           'Code generated successfully! Check the preview tab to see the result.'
//         );
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Something went wrong');

//       // Add error message to chat
//       if (chatInterfaceRef.current) {
//         chatInterfaceRef.current.addAssistantMessage(
//           `Error: ${
//             err instanceof Error ? err.message : 'Something went wrong'
//           }`
//         );
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const tabs = [
//     {
//       label: 'Code',
//       icon: (
//         <svg
//           xmlns='http://www.w3.org/2000/svg'
//           width='16'
//           height='16'
//           viewBox='0 0 24 24'
//           fill='none'
//           stroke='currentColor'
//           strokeWidth='2'
//           strokeLinecap='round'
//           strokeLinejoin='round'
//         >
//           <polyline points='16 18 22 12 16 6'></polyline>
//           <polyline points='8 6 2 12 8 18'></polyline>
//         </svg>
//       ),
//       content: <CodeDisplay code={code} />,
//     },
//     {
//       label: 'Preview',
//       icon: (
//         <svg
//           xmlns='http://www.w3.org/2000/svg'
//           width='16'
//           height='16'
//           viewBox='0 0 24 24'
//           fill='none'
//           stroke='currentColor'
//           strokeWidth='2'
//           strokeLinecap='round'
//           strokeLinejoin='round'
//         >
//           <rect x='2' y='3' width='20' height='14' rx='2' ry='2'></rect>
//           <line x1='8' y1='21' x2='16' y2='21'></line>
//           <line x1='12' y1='17' x2='12' y2='21'></line>
//         </svg>
//       ),
//       content: <Preview code={code} />,
//     },
//   ];

//   return (
//     <main className='flex h-screen overflow-hidden'>
//       {/* Left sidebar - Chat interface */}
//       <div className='w-1/3 border-r border-muted'>
//         <ChatInterface
//           ref={chatInterfaceRef}
//           onSubmit={handleGenerateCode}
//           isLoading={isLoading}
//         />
//       </div>

//       {/* Right side - Code and Preview tabs */}
//       <div className='flex-1 flex flex-col'>
//         <header className='p-4 border-b border-muted flex justify-between items-center'>
//           <div className='flex items-center space-x-2'>
//             <span className='text-lg font-medium'>Generated Code</span>
//             {isLoading && (
//               <span className='inline-block animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full ml-2'></span>
//             )}
//           </div>

//           <div className='flex items-center space-x-2'>
//             <button className='p-1.5 rounded-md hover:bg-muted'>
//               <svg
//                 xmlns='http://www.w3.org/2000/svg'
//                 width='16'
//                 height='16'
//                 viewBox='0 0 24 24'
//                 fill='none'
//                 stroke='currentColor'
//                 strokeWidth='2'
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//               >
//                 <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
//                 <polyline points='15 3 21 3 21 9'></polyline>
//                 <line x1='10' y1='14' x2='21' y2='3'></line>
//               </svg>
//             </button>
//             <button className='p-1.5 rounded-md hover:bg-muted'>
//               <svg
//                 xmlns='http://www.w3.org/2000/svg'
//                 width='16'
//                 height='16'
//                 viewBox='0 0 24 24'
//                 fill='none'
//                 stroke='currentColor'
//                 strokeWidth='2'
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//               >
//                 <polyline points='16 16 12 12 8 16'></polyline>
//                 <line x1='12' y1='12' x2='12' y2='21'></line>
//                 <path d='M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3'></path>
//                 <polyline points='16 16 12 12 8 16'></polyline>
//               </svg>
//             </button>
//           </div>
//         </header>

//         <div className='flex-1 overflow-auto'>
//           {error && (
//             <div className='m-4 p-3 bg-red-100 text-red-800 rounded-md'>
//               {error}
//             </div>
//           )}

//           <div className='h-full'>
//             <Tabs tabs={tabs} />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
