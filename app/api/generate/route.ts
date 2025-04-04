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
                "You are a skilled web developer. Generate clean, modern, responsive code based on the user's description.",
            },
            {
              role: 'user',
              content: `Generate HTML, CSS, and JavaScript code for: ${prompt}.
                     Use semantic HTML5, modern CSS, and simple JavaScript.
                     Include comments explaining key sections.
                     Format the code as a single HTML file with internal CSS and JavaScript.
                     Make sure the design is clean, modern, and responsive.
                     Return ONLY the complete HTML file without any explanations or markdown.`,
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
