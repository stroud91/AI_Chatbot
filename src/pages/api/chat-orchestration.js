import { Configuration, OpenAIApi } from 'openai';
import { BedrockClient } from '@aws-sdk/client-bedrock';
import { PineconeClient } from '@pinecone-database/pinecone';

const openaiConfig = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);
const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY });

const bedrockClient = new BedrockClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    let responseText;

    if (prompt.toLowerCase().includes('search')) {
   
      const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: prompt,
      });

      const promptEmbedding = embeddingResponse.data[0].embedding;
      const queryResponse = await pinecone.query({
        indexName: 'your-index-name',
        queryRequest: {
          topK: 5,
          includeValues: true,
          includeMetadata: true,
          vector: promptEmbedding,
        },
      });

      const relevantDocuments = queryResponse.matches.map((match) => match.metadata.text);
      const combinedPrompt = `${prompt}\n\nRelevant Information:\n${relevantDocuments.join('\n')}`;

      const completionResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: combinedPrompt }],
        max_tokens: 150,
      });

      responseText = completionResponse.data.choices[0]?.message?.content?.trim();
    } else {
     
      const completionResponse = await bedrockClient.send(
        new BedrockClient.InvokeModelCommand({
          modelId: 'anthropic.claude-v1',
          content: JSON.stringify({ text: prompt }),
        })
      );

      responseText = completionResponse.body;
    }

    res.status(200).json({ text: responseText || 'No response from AI.' });
  } catch (error) {
    console.error('Error handling AI response:', error);
    res.status(500).json({ message: 'Error handling AI response. Please try again.' });
  }
}
