
import React from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <header style={styles.header}>
        <h1>AI Chatbot</h1>
      </header>
      <main style={styles.main}>
        <Component {...pageProps} />
      </main>
      <footer style={styles.footer}>
        <p>&copy; 2024 AI Chatbot. All rights reserved.</p>
      </footer>
    </>
  );
}

const styles = {
  header: {
    padding: '10px',
    backgroundColor: '#6200ea',
    color: '#fff',
    textAlign: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '0 0 10px 10px',
  },
  main: {
    padding: '20px',
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: '10px',
    backgroundColor: '#6200ea',
    color: '#fff',
    textAlign: 'center',
    boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px 10px 0 0',
  },
};

export default MyApp;
