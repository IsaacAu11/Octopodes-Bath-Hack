import OpenAI from 'openai';

interface StoryCharacter {
  name: string;
  occupation: string;
}

interface Location {
  locationName: string;
  description: string;
}

interface StoryElements {
  characters: StoryCharacter[];
  locations: Location[];
  storyline: string;
}

export async function initalPromptProcessing(message: string): Promise<StoryElements> {
  try {
    const client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      baseURL: "https://hack.funandprofit.ai/api/providers/openai/v1",
      dangerouslyAllowBrowser: true 
    });

    const systemPrompt = `Given the user's story prompt, generate:
1. Exactly 30 Characters: Each with a name and occupation
2. Exactly 30 Locations: Each with a name, x/y coordinates (between 0-100), and a brief description
3. An interesting storyline that connects these elements

Format the response as a valid JSON object with this exact structure:
{
  "characters": [["name", "occupation"], ...] (exactly 30 entries),
  "locations": [["locationName", "description"], ...] (exactly 30 entries),
  "storyline": "the story narrative"
}`;

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");

    // Transform the response into our TypeScript interface format
    const storyElements: StoryElements = {
      characters: response.characters.map((char: [string, string]) => ({
        name: char[0],
        occupation: char[1]
      })),
      locations: response.locations.map((loc: [string, string]) => ({
        locationName: loc[0],
        description: loc[1]
      })),
      storyline: response.storyline
    };

    return storyElements;

  } catch (error) {
    console.error('Error processing initial prompt:', error);
    throw new Error('Failed to process the story prompt');
  }
} 