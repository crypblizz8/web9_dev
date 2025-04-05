import { DEFAULT_VIEM_WALLET } from '@/app/modules/wallet/reference_viem';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://web9.vercel.app',
          'X-Title': 'web9',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          // stream: true,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert web3 developer specializing in Next.js 12.1.6, React 18.2.0, and Tailwind CSS. Create production-ready, maintainable code following industry best practices.',
            },
            {
              role: 'user',
              content: `ONLY CODE OUTPUT You must follow the exact format / output of ${DEFAULT_VIEM_WALLET} with tailwind styling. :
                    1. Use viem for wallet interaction
                    2. Handle wallet connection states properly
                    3. Implement proper error handling
                    4. Use TypeScript with appropriate interfaces
                    5. Support wallet connection events
                    6. Allow wallet disconnection
                    7. Be compatible with Next.js 12.1.6 and React 18.2.0
                    8. Use Tailwind CSS for styling
                    IMPORTANT: Ensure format follows 'FOLDER/FILENAME': CODE... and comma separted. like the object example. IMPORTANT
                    IMPORTANT: Your entire response must be ONLY the code - no introduction, no explanation, just the code itself.`,
            },
          ],

          // messages: [
          //   {
          //     role: 'system',
          //     content:
          //       'You are a skilled web developer specializing in Next.js, React, and Tailwind CSS. You generate clean, modern, responsive code based on user descriptions.',
          //   },
          //   {
          //     role: 'user',
          //     content: prompt,
          //   },
          // ],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenRouter');
    }

    return NextResponse.json({ code: data.choices[0].message.content });
  } catch (error) {
    console.error('Error generating code:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}
