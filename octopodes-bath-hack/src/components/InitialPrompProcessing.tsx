import OpenAI from 'openai';

interface StoryCharacter {
  name: string;
  occupation: string;
}

interface Location {
  locationName: string;
  description: string;
  characters: string[];
}

interface StoryElements {
  characters: StoryCharacter[];
  locations: Location[];
  storyline: string;
}

export async function initalPromptProcessing(message: string): Promise<StoryElements> {  
  try {
    // Store the initial prompt in localStorage
    localStorage.setItem('initialPrompt', message);

    const client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      baseURL: "https://hack.funandprofit.ai/api/providers/openai/v1",
      dangerouslyAllowBrowser: true 
    });

    const systemPrompt = `Given the user's story prompt, generate:
1. Characters each with a name and occupation but make sure there are a minimum of 10 characters, you must ensure that the characters are unique and not more than 2 characters in each location
2. Exactly 15 Locations: Each with a name and a brief description and a list of characters that are associated with it (between 0 and 2 characters each)
3. An interesting storyline that connects these elements

If the users story prompt doesn't have enough information, make up a story, characters and locations that sticks to a consistent theme and connects the characters to the locations.
If the users story prompt is a specific character from well know media then still make up a story, characters and locations with the minimum of 10 characters and a maximum of 30 characters and minimum of 15 locations that sticks to a consistent theme and connects the characters to the locations.

Format the response as a valid JSON object with this exact structure:
{
  "characters": [["name", "occupation"], ...] (make sure that the characters are unique and not more than 2 characters in each location),
  "locations": [["locationName", "description", [character1, character2, ...]], ...] (between 0 and 2 characters in each location, MAKE SURE THAT THE CHARACTERS ARE NOT IN MORE THAN ONE LOCATION),
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
      locations: response.locations.map((loc: [string, string, string[]]) => ({
        locationName: loc[0],
        description: loc[1],
        characters: loc[2]
      })),
      storyline: response.storyline
    };

    console.log("OpenAI JSON response:", storyElements);

    const backendPayload = {
      characters: storyElements.characters.map(char => [char.name, char.occupation]),
      locations: storyElements.locations.map(loc => [
        loc.locationName,
        loc.description,
        loc.characters
      ])
    };
    
    console.log("Backend payload:", backendPayload);

    const backendResponse = await fetch("http://127.0.0.1:8000/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload)
    });
  
    const data = await backendResponse.json();
    console.log("Backend JSON response:", data);

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.statusText}`);
    }

    localStorage.setItem('currentMap', JSON.stringify(data));

    return storyElements;

  } catch (error) {
    console.error('Error processing initial prompt:', error);
    throw new Error('Failed to process the story prompt');
  }
}

export async function getSettingFromPrompt(): Promise<string> {
  try {
    const initialPrompt = localStorage.getItem('initialPrompt');
    if (!initialPrompt) return '';

    const client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      baseURL: "https://hack.funandprofit.ai/api/providers/openai/v1",
      dangerouslyAllowBrowser: true 
    });

    const systemPrompt = `Given the user's story prompt, identify the general setting or time period of the story. 
If the prompt doesn't have enough information or a concrete setting, return an empty string.
If there is a clear setting, describe it in a few words maximum.
Format your response as a simple string, not JSON.`;

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: initialPrompt }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
    });

    const setting = completion.choices[0].message.content?.trim() || '';
    localStorage.setItem('setting', setting);
    return setting;

  } catch (error) {
    console.error('Error getting setting from prompt:', error);
    return '';
  }
} 