'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  parseCodeResponse,
  createFileTree,
  createStructuredPrompt,
} from '@/utils/codeParser';
import { FileNode } from '@/utils/types';

// Use dynamic import to avoid SSR issues with Sandpack
const SandpackPreview = dynamic(
  () => import('@/components/sandpack/SandpackPreview'),
  { ssr: false }
);

const FileExplorer = dynamic(
  () => import('@/components/sandpack/FileExplorer'),
  { ssr: false }
);

interface CodeGeneratorPreviewProps {
  initialCode?: string;
}

export default function CodeGeneratorPreview({
  initialCode = '',
}: CodeGeneratorPreviewProps) {
  const [files, setFiles] = useState<Record<string, string>>(
    initialCode ? parseCodeResponse(initialCode) : {}
  );
  const [fileTree, setFileTree] = useState<FileNode[]>(
    initialCode ? createFileTree(parseCodeResponse(initialCode)) : []
  );
  const [selectedPath, setSelectedPath] = useState('/app/page.tsx');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate code from prompt
  const generateCode = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const structuredPrompt = createStructuredPrompt(prompt);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: structuredPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate code');
      }

      // Parse the response into files
      const parsedFiles = parseCodeResponse(data.code);
      setFiles(parsedFiles);

      // Create file tree for explorer
      const tree = createFileTree(parsedFiles);
      setFileTree(tree);

      // Select the main file
      if (parsedFiles['/app/page.tsx']) {
        setSelectedPath('/app/page.tsx');
      } else if (Object.keys(parsedFiles).length > 0) {
        setSelectedPath(Object.keys(parsedFiles)[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleSelectFile = (path: string) => {
    setSelectedPath(path);
  };

  // Check if we have files to display
  const hasFiles = Object.keys(files).length > 0;

  return (
    <div className='flex flex-col h-full'>
      {isLoading && (
        <div className='absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50'>
          <div className='bg-white p-4 rounded-lg shadow-lg flex items-center'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-3'></div>
            <p>Generating code...</p>
          </div>
        </div>
      )}

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 p-3 mb-4 rounded'>
          {error}
        </div>
      )}

      {hasFiles ? (
        <div className='flex flex-1 overflow-hidden'>
          <div className='w-64 h-full overflow-hidden'>
            <FileExplorer
              files={fileTree}
              onSelectFile={handleSelectFile}
              selectedPath={selectedPath}
            />
          </div>
          <div className='flex-1 overflow-hidden'>
            <SandpackPreview files={files} activePath={selectedPath} />
          </div>
        </div>
      ) : (
        <div className='flex-1 flex items-center justify-center bg-gray-50'>
          <div className='text-center p-6 max-w-md'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No code generated yet
            </h3>
            <p className='text-gray-500'>
              Enter a prompt to generate code, or select one of the examples
              below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
