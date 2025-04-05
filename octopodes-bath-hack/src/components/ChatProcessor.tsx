// ChatProcessor.tsx
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: "https://hack.funandprofit.ai/api/providers/openai/v1",
  dangerouslyAllowBrowser: true 
});

 export async function processMessage(message: string): Promise<{ response: string; keywords: string[][] }> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [{
        role: "system",
        content: `Extract keywords from the user's message into these categories in ORDER:
        1. Characters (people/entities)
        2. Location (places)
        3. Event type (activities/events)
        4. Item (objects)
        
        Respond with JSON format:
        {
          "response": "your_response",
          "keywords": {
            "characters": [],
            "location": [],
            "eventType": [],
            "item": []
          }
        }`
      }, {
        role: "user",
        content: message
      }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    
    // Convert to array of arrays maintaining order
    const keywordArrays = [
      result.keywords?.characters || [],
      result.keywords?.location || [],
      result.keywords?.eventType || [],
      result.keywords?.item || []
    ];

    return {
      response: result.response || "No response received",
      keywords: keywordArrays
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      response: "Sorry, there was an error processing your message.",
      keywords: [[], [], [], []]
    };
  }
}