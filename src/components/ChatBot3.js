import React, { useState } from 'react';

const Chatbot3 = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/pinecone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.text };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, I am having trouble understanding that right now. Please try again later.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatBox}>
        {messages.map((message, index) => (
          <div key={index} style={{ ...styles.message, ...(message.sender === 'bot' ? styles.botMessage : styles.userMessage) }}>
            <p style={styles.messageText}><strong>{message.sender === 'bot' ? 'Bot' : 'You'}:</strong> {message.text}</p>
          </div>
        ))}
        {loading && <p style={styles.loadingText}>Bot is typing...</p>}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '70vh',
  },
  chatBox: {
    flex: '1',
    overflowY: 'auto',
    paddingRight: '10px',
    marginBottom: '10px',
  },
  message: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
    wordWrap: 'break-word',
  },
  botMessage: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#c5cae9',
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  messageText: {
    margin: 0,
    fontSize: '14px',
  },
  inputContainer: {
    display: 'flex',
    marginTop: '10px',
  },
  input: {
    flex: '1',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '15px',
    border: '1px solid #ccc',
    marginRight: '10px',
    outline: 'none',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sendButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#6200ea',
    color: '#fff',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  },
  loadingText: {
    color: '#999',
    fontStyle: 'italic',
  },
};

export default Chatbot3;
