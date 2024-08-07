import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [hover, setHover] = useState(false);


  const handleSend = () => {
    if (input.trim() === '') return;

    let botResponse = 'I am sorry, I do not understand.';

    if (input.toLowerCase().includes('hello')) {
      botResponse = 'Hi there! How can I help you?';
    } else if (input.toLowerCase().includes('help')) {
      botResponse = 'Sure, I am here to help! What do you need assistance with?';
    }

    setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: botResponse }]);
    setInput('');
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatBox}>
        {messages.map((message, index) => (
          <div key={index} style={{ ...styles.message, ...(message.sender === 'bot' ? styles.botMessage : styles.userMessage) }}>
            <p style={styles.messageText}><strong>{message.sender === 'bot' ? 'Bot' : 'You'}:</strong> {message.text}</p>
          </div>
        ))}
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
        <button onClick={handleSend} style={{
            ...styles.sendButton,...(hover && styles.sendButtonHover),}} 
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        >Send</button>
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
  sendButtonHover: {
    backgroundColor: '#3700b3',
  },
};

export default Chatbot;
