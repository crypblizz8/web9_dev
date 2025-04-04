import { useEffect, useRef, useState } from 'react';

interface PreviewProps {
  code: string;
}

export default function Preview({ code }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [aspectRatio, setAspectRatio] = useState<
    'desktop' | 'tablet' | 'mobile'
  >('desktop');
  const [isLoading, setIsLoading] = useState(false);

  // Update iframe content when code changes
  useEffect(() => {
    if (iframeRef.current && code) {
      setIsLoading(true);

      // Get the iframe document
      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;

      if (iframeDoc) {
        // Write the code to the iframe
        iframeDoc.open();
        iframeDoc.write(code);
        iframeDoc.close();

        // Wait for iframe to load
        iframeRef.current.onload = () => {
          setIsLoading(false);
        };
      }
    }
  }, [code]);

  // If no code, show a placeholder
  if (!code) {
    return (
      <div className='border border-muted rounded-md p-4 bg-muted text-muted-foreground text-center h-64 flex items-center justify-center'>
        <p>Preview will appear here</p>
      </div>
    );
  }

  // Get aspect ratio class
  const getWidthClass = () => {
    switch (aspectRatio) {
      case 'mobile':
        return 'w-[320px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium'>Preview</h2>
        <div className='flex space-x-2'>
          <button
            onClick={() => setAspectRatio('mobile')}
            className={`p-1 rounded-md ${
              aspectRatio === 'mobile'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
            title='Mobile view'
          >
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
              <rect x='7' y='4' width='10' height='16' rx='1' ry='1' />
              <path d='M12 18h.01' />
            </svg>
          </button>
          <button
            onClick={() => setAspectRatio('tablet')}
            className={`p-1 rounded-md ${
              aspectRatio === 'tablet'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
            title='Tablet view'
          >
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
              <rect x='4' y='2' width='16' height='20' rx='2' ry='2' />
              <path d='M12 18h.01' />
            </svg>
          </button>
          <button
            onClick={() => setAspectRatio('desktop')}
            className={`p-1 rounded-md ${
              aspectRatio === 'desktop'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
            title='Desktop view'
          >
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
              <rect x='2' y='3' width='20' height='14' rx='2' ry='2' />
              <path d='M8 21h8' />
              <path d='M12 17v4' />
            </svg>
          </button>
        </div>
      </div>

      <div className='border border-muted rounded-md h-[600px] overflow-hidden flex items-center justify-center bg-white relative'>
        {isLoading && (
          <div className='absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center'>
            <div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full'></div>
          </div>
        )}

        <div
          className={`transition-all duration-300 h-full overflow-auto ${getWidthClass()}`}
        >
          <iframe
            ref={iframeRef}
            className='w-full h-full border-0'
            title='Code preview'
            sandbox='allow-scripts allow-same-origin'
          ></iframe>
        </div>
      </div>
    </div>
  );
}
