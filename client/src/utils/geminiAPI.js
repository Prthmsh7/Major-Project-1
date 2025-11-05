import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Using the latest Gemini 2.5 Flash model
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const generateMealPlan = async (preferences, dietaryRestrictions, mealTypes, days) => {
  console.log('[generateMealPlan] Starting with params:', { 
    preferences, 
    dietaryRestrictions, 
    mealTypes, 
    days 
  });
  
  if (!GEMINI_API_KEY) {
    const errorMsg = 'Gemini API key not configured. Please set the VITE_GEMINI_API_KEY environment variable in your .env file.';
    console.error('[generateMealPlan] Error:', errorMsg);
    throw new Error(errorMsg);
  }

  const prompt = `You are a helpful meal planning assistant. Generate a ${days}-day meal plan based on the following preferences:
  - Food preferences: ${preferences.join(', ') || 'No specific preferences'}
  - Dietary restrictions: ${dietaryRestrictions.join(', ') || 'None'}
  - Meal types: ${mealTypes.join(', ')}

  For each day, please provide:
  1. A list of meals with their types (breakfast, lunch, dinner, etc.)
  2. For each meal, include:
     - Recipe name
     - List of ingredients
     - Simple cooking instructions
  3. Ensure the meals are varied, balanced, and meet the specified dietary needs

  Format your response as a valid JSON object with the following structure:
  {
    "days": [
      {
        "day": 1,
        "meals": [
          {
            "type": "Breakfast",
            "recipe": "Recipe Name",
            "ingredients": ["ingredient 1", "ingredient 2"],
            "instructions": "Step 1. Do this\nStep 2. Then do that",
            "calories": 400,
            "protein": 20,
            "carbs": 50,
            "fat": 15,
            "prepTime": 15
          }
        ]
      }
    ]
  }`;

  console.log('[generateMealPlan] Sending prompt to Gemini API...');
  
  try {
    console.log('[generateMealPlan] Sending request to Gemini API...');
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096
        }
      },
      { 
        headers: { 
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    console.log('[generateMealPlan] Received response from API');
    
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('[generateMealPlan] Invalid response format:', response.data);
      throw new Error('Invalid response format from API. Please try again.');
    }
    
    const generatedText = response.data.candidates[0].content.parts[0].text;
    console.log('[generateMealPlan] Generated text:', generatedText.substring(0, 200) + (generatedText.length > 200 ? '...' : ''));
    
    // Try to extract JSON from the response if it contains markdown code blocks
    const jsonMatch1 = generatedText.match(/```json\n([\s\S]*?)\n```/);
    const jsonMatch2 = generatedText.match(/```\n([\s\S]*?)\n```/);
    
    let jsonString = generatedText;
    if (jsonMatch1) {
      jsonString = jsonMatch1[1];
    } else if (jsonMatch2) {
      jsonString = jsonMatch2[1];
    }
    
    const parsed = JSON.parse(jsonString.trim());
    console.log('[generateMealPlan] Successfully parsed response');
    return parsed;
    } catch (error) {
    console.error('[generateMealPlan] Error:', error);
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data
      });
      throw new Error(`API Error (${error.response.status}): ${error.response.data?.error?.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from the server. Please check your internet connection.');
    } else {
      console.error('Error setting up request:', error.message);
      throw new Error(`Failed to generate meal plan: ${error.message}`);
    }
  }
};

export const analyzeFoodImage = async (base64Image) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Analyze this food image and identify the food items along with their estimated quantities. 
                      For each item, provide the name, quantity, and unit of measurement (e.g., grams, pieces, etc.).
                      Format the response as a JSON object with an 'items' array containing objects with 'name', 'quantity', and 'unit' properties.`
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the response text
    const responseText = response.data.candidates[0].content.parts[0].text;
    
    // Try to parse the JSON response
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/```\n([\s\S]*?)\n```/);
      
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      const parsed = JSON.parse(jsonString);
      
      // Ensure the response has the expected format
      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
      throw new Error('Invalid response format from API');
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      console.log('Raw response:', responseText);
      throw new Error('Failed to parse the analysis results. Please try again.');
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze the image. Please try again.');
  }
};

export const suggestRecipes = async (query, dietaryRestrictions) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please set the VITE_GEMINI_API_KEY environment variable in your .env file.');
  }
  

  const prompt = `
    Suggest 5 recipe ideas for: ${query}.
    Consider dietary restrictions: ${dietaryRestrictions.join(', ') || 'None'}.
    For each recipe, provide: name, key ingredients, simple instructions, and why it fits.
    Output in JSON format:
    [
      {"name": "Recipe1", "ingredients": ["item1"], "instructions": "Steps", "reason": "Why"},
      ...
    ]
  `;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(generatedText.trim());
  } catch (error) {
    console.error('Error suggesting recipes:', error);
    throw new Error('Failed to suggest recipes. Please check your API key and try again.');
  }
};
