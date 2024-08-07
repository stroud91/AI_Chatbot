import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...messages,
            userMessage
          ],
          max_tokens: 150
        })
      });
      
      if (res.status === 429) {
        setError('Too many requests. Please try again later.');
        setLoading(false);
        return;
      }

      const data = await res.json();ythujnm  
      console.log("this is data", data)
      const aiMessage = { role: "assistant", content: data.choices[0]?.message?.content?.trim() || 'No response from AI.' };
      setMessages([...messages, userMessage, aiMessage]);
    } catch (err) {
      console.error('Error fetching AI response:', err);
      setError('Error fetching AI response. Please try again.');
    } finally {
      setLoading(false);
    }
}
