import React, { useEffect, useState, useMemo, useRef } from 'react';
import OpenAI from 'openai';
import './CharacterDialogues.css';

interface CharacterDialoguesProps {
    character: {
        name: string;
        occupation?: string;
    } | null;
    mapData?: any;
    userMessage?: string;  // New prop for user messages
    onResponse?: (response: string) => void;  // Callback for responses
}

// Define simplified message interface
interface MessageItem {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseURL: "https://hack.funandprofit.ai/api/providers/openai/v1",
    dangerouslyAllowBrowser: true
});

const CharacterDialogues: React.FC<CharacterDialoguesProps> = ({ 
    character, 
    mapData, 
    userMessage, 
    onResponse 
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [conversationHistory, setConversationHistory] = useState<MessageItem[]>([]);
    const initialDialogueGeneratedRef = useRef(false);

    // Use useMemo to extract location information from mapData
    const locationInfo = useMemo(() => {
        if (!mapData || !mapData.locations || !mapData.locations['[1, 1]']) {
            return null;
        }
        
        const currentLocation = mapData.locations['[1, 1]'];
        if (!currentLocation) {
            return null;
        }
        
        return {
            otherCharacters: currentLocation.characters || [],
            locationName: currentLocation.location || 'Unknown location',
            locationDesc: currentLocation.description || 'No description available'
        };
    }, [mapData]);

    // Get character occupation from the full character list
    const characterOccupation = useMemo(() => {
        if (character?.occupation) {
            return character.occupation;
        }
        
        if (character?.name && mapData?.characters && Array.isArray(mapData.characters)) {
            const charData = mapData.characters.find((c: [string, string]) => c[0] === character.name);
            if (charData) {
                return charData[1];
            }
        }
        
        return undefined;
    }, [character, mapData]);

    // Reset state when character changes
    useEffect(() => {
        // Reset state when character changes
        initialDialogueGeneratedRef.current = false;
        setConversationHistory([]);
    }, [character]);

    // Generate initial dialogue when component mounts
    useEffect(() => {
        if (!initialDialogueGeneratedRef.current && character && locationInfo) {
            generateInitialDialogue();
        }
    }, [character, locationInfo, characterOccupation]);

    // Generate response when userMessage changes
    useEffect(() => {
        if (userMessage && character) {
            generateResponse(userMessage);
        }
    }, [userMessage]);

    // Initial dialogue generation
    const generateInitialDialogue = async () => {
        if (!character || !locationInfo || initialDialogueGeneratedRef.current) return;
        
        initialDialogueGeneratedRef.current = true; // Mark as generated right away to prevent duplicates
        setIsLoading(true);
        setErrorMsg(null);

        try {
            const { otherCharacters, locationName, locationDesc } = locationInfo;
            
            // Create a detailed prompt for ChatGPT
            const systemPrompt = `You are ${character.name}${characterOccupation ? `, a ${characterOccupation}` : ''} in a medieval fantasy setting.
            You are currently at ${locationName}, which is described as: ${locationDesc}.
            ${otherCharacters.length > 0 ? `Other characters present are: ${otherCharacters.filter((char: string) => char !== character.name).join(', ')}.` : ''}
            Please generate a short, friendly introduction (2-3 sentences) that:
            1. Introduces yourself
            2. Comments on the current location
            3. Mentions other characters if present
            4. Stays in character and matches the medieval fantasy setting
            Make it sound natural and conversational, as if speaking to a traveler who just arrived.`;
            
            const messages: MessageItem[] = [{ role: "system", content: systemPrompt }];
            setConversationHistory(messages);

            const completion = await openai.chat.completions.create({
                messages: messages as any,
                model: "gpt-3.5-turbo",
                temperature: 0.7,
                max_tokens: 150
            });

            const generatedDialogue = completion.choices[0].message.content;
            if (generatedDialogue) {
                // Add assistant's message to conversation history
                setConversationHistory(prev => [
                    ...prev,
                    { role: "assistant", content: generatedDialogue }
                ]);
                
                // Send the greeting to the parent component
                if (onResponse) {
                    onResponse(generatedDialogue);
                }
            }
        } catch (error) {
            console.error('Error generating dialogue:', error);
            setErrorMsg("Couldn't generate dialogue");
            // Fallback to a basic introduction if API fails
            const fallbackMessage = `Greetings, I am ${character.name}${characterOccupation ? `, a ${characterOccupation}` : ''}. Welcome to our humble establishment.`;
            
            // Add fallback message to conversation history
            setConversationHistory(prev => [
                ...prev,
                { role: "assistant", content: fallbackMessage }
            ]);
            
            // Send the fallback greeting to the parent component
            if (onResponse) {
                onResponse(fallbackMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Generate response to user message
    const generateResponse = async (message: string) => {
        if (!character) return;
        
        setIsLoading(true);
        setErrorMsg(null);

        try {
            // Add user message to conversation history
            const updatedHistory: MessageItem[] = [
                ...conversationHistory,
                { role: "user", content: message }
            ];
            
            setConversationHistory(updatedHistory);
            
            const completion = await openai.chat.completions.create({
                messages: updatedHistory as any,
                model: "gpt-3.5-turbo",
                temperature: 0.7,
                max_tokens: 150
            });

            const response = completion.choices[0].message.content;
            if (response) {
                // Add assistant's response to conversation history
                setConversationHistory(prev => [
                    ...prev,
                    { role: "assistant", content: response }
                ]);
                
                // Call the onResponse callback with the generated response
                if (onResponse) {
                    onResponse(response);
                }
            }
        } catch (error) {
            console.error('Error generating response:', error);
            setErrorMsg("Couldn't generate response");
            const fallbackResponse = `I'm sorry, I'm not sure how to respond to that.`;
            
            // Add fallback response to conversation history
            setConversationHistory(prev => [
                ...prev,
                { role: "assistant", content: fallbackResponse }
            ]);
            
            // Call the onResponse callback with the fallback response
            if (onResponse) {
                onResponse(fallbackResponse);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (errorMsg) {
        return <div className="loading-text error">{errorMsg}</div>;
    }

    // Loading indicator for both initial greeting and responses
    return (
        <div>
            {isLoading && (
                <div className="loading-text">
                    *thinking of what to say...*
                </div>
            )}
        </div>
    );
};

export default CharacterDialogues; 