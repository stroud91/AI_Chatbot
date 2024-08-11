import Head from 'next/head';
import Chat from '../components/ChatBot3';

export default function Home() {
  return (
    <div>
      <Head>
        <title>AI Chatbot</title>
        <meta name="description" content="A simple AI chatbot with hardcoded responses" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Chat />
      </main>
    </div>
  );
}
