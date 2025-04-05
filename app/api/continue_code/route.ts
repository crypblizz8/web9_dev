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
              content: `Continue to edit the code as per the provided codebase ${prompt}.  Be compatible with Next.js 12.1.6 and React 18.2.0. Limit changes to the wallet infastructure code.
                    IMPORTANT: Your entire response must be ONLY the code - no introduction, no explanation, just the code itself.`,
            },
          ],
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
