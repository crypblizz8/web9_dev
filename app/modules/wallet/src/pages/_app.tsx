import '../styles/globals.css';
import type { AppProps } from 'next/app';
import ContextProvider from '../context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider cookies={null}>
      <Component {...pageProps} />
    </ContextProvider>
  );
}
