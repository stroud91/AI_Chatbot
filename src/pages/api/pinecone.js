const { PineconeClient } = require('@pinecone-database/pinecone');
const { Configuration, OpenAIApi } = require('openai');


const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT 
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
 
    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: prompt,
    });
    const embedding = embeddingResponse.data[0].embedding;

   
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    await index.upsert([
      {
        id: `vec_${Date.now()}`,
        values: embedding,
        metadata: { text: prompt }
      }
    ]);

  
    const queryResponse = await index.query({
      topK: 2,
      vector: embedding,
      includeValues: true,
      includeMetadata: true,
    });
    const relevantDocuments = queryResponse.matches.map(match => match.metadata.text);
    const combinedPrompt = `${prompt}\n\nRelevant Information:\n${relevantDocuments.join('\n')}`;

  
    const completionResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: combinedPrompt }
      ],
      max_tokens: 150
    });

    const botResponse = completionResponse.data.choices[0]?.message?.content?.trim() || 'No response from AI.';
    res.status(200).json({ text: botResponse });
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ message: 'Error processing the request.' });
  }
};
