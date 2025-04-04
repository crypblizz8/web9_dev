import { useState, FormEvent } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export default function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSubmit(inputValue);
    }
  };

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='prompt' className='block text-sm font-medium mb-2'>
            Describe what you want to build
          </label>
          <textarea
            id='prompt'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='e.g., Create a landing page for a small bakery shop with a hero section, product gallery, and contact form'
            className='w-full h-32 px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            disabled={isLoading}
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            type='submit'
            disabled={isLoading || !inputValue.trim()}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <span className='flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Code'
            )}
          </button>
          <button
            type='button'
            onClick={() => setInputValue('')}
            className='text-sm text-muted-foreground hover:text-foreground'
            disabled={isLoading || !inputValue}
          >
            Clear
          </button>
        </div>
      </form>
      <div className='mt-4'>
        <h3 className='text-sm font-medium mb-2'>Example Prompts:</h3>
        <div className='space-y-2'>
          <button
            onClick={() =>
              setInputValue(
                'Create a landing page for a small bakery shop with a hero section, product gallery, and contact form'
              )
            }
            className='text-sm text-blue-600 hover:underline block'
            disabled={isLoading}
          >
            Bakery landing page
          </button>
          <button
            onClick={() =>
              setInputValue(
                'Build a to-do list app with the ability to add, complete, and delete tasks'
              )
            }
            className='text-sm text-blue-600 hover:underline block'
            disabled={isLoading}
          >
            To-do list app
          </button>
          <button
            onClick={() =>
              setInputValue(
                'Design a pricing table for a SaaS product with three tiers'
              )
            }
            className='text-sm text-blue-600 hover:underline block'
            disabled={isLoading}
          >
            SaaS pricing table
          </button>
        </div>
      </div>
    </div>
  );
}
