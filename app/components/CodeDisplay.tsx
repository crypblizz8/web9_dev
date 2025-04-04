import { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeDisplayProps {
  code: string;
}

export default function CodeDisplay({ code }: CodeDisplayProps) {
  const [value, setValue] = useState(code);

  // Update the editor when code prop changes
  useEffect(() => {
    setValue(code);
  }, [code]);

  // If no code, show a placeholder
  if (!code) {
    return (
      <div className='p-4 text-muted-foreground text-center h-full flex items-center justify-center'>
        <div className='max-w-md'>
          <h3 className='text-lg font-medium mb-2'>
            Your code will appear here
          </h3>
          <p className='text-sm'>
            Describe what you want to build in the chat, and I'll generate the
            code for you.
          </p>
        </div>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        // Show a temporary "Copied!" message
        const button = document.getElementById('copy-button');
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='p-4 border-b border-muted flex items-center justify-between'>
        <div className='flex items-center'>
          <span className='text-sm text-muted-foreground'>index.html</span>
        </div>
        <button
          id='copy-button'
          onClick={copyToClipboard}
          className='text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-opacity-90'
        >
          Copy Code
        </button>
      </div>
      <div className='flex-1 overflow-auto'>
        <Editor
          value={value}
          onValueChange={setValue}
          highlight={(code) =>
            Prism.highlight(code, Prism.languages.markup, 'markup')
          }
          padding={16}
          readOnly={true}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            height: '100%',
          }}
          className='min-h-full'
        />
      </div>
    </div>
  );
}
