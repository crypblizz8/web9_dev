'use client';

import { useEffect, useRef, useState } from 'react';
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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate code');
      }

      setCode(data.code);
      console.log('AI CODEEEEEE', data.code);

      // Add assistant response to chat
      // We can add a simple confirmation message here
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
  }, [code]);

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
        <div className='h-full flex border-r border-muted'>
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
          <div className='flex space-x-2'></div>
        </div>

        <div className='flex-1 overflow-hidden'>
          {/* {code ? <SandpackPreview files={code} activePath='/app/page.tsx' />} */}
          {code && <SandpackPreview activePath='/pages/_app.tsx' />}
        </div>
      </div>
    </div>
  );
}
