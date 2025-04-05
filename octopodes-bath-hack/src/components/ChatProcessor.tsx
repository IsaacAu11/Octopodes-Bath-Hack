import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: "https://hack.funandprofit.ai/api/providers/openai/v1",
  dangerouslyAllowBrowser: true 
});

export async function processMessage(message: string): Promise<string> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // Using the most affordable model
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || "No response received";
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return "Sorry, there was an error processing your message.";
  }
}