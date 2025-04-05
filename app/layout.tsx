import type { Metadata } from 'next';
import { bricolage } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vib3',
  description: 'Turn your ideas into dapps',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className={bricolage.className}>{children}</body>
    </html>
  );
}
