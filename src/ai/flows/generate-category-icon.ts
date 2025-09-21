
'use server';
/**
 * @fileOverview Generates a unique icon for a given artisan craft category.
 *
 * - generateCategoryIcon - A function that handles the icon generation.
 */

import {ai} from '@/ai/genkit';
import { GenerateCategoryIconInput, GenerateCategoryIconInputSchema, GenerateCategoryIconOutput, GenerateCategoryIconOutputSchema } from '@/ai/types/generate-category-icon-types';


export async function generateCategoryIcon(
  input: GenerateCategoryIconInput
): Promise<GenerateCategoryIconOutput> {
  return generateCategoryIconFlow(input);
}

const generateCategoryIconFlow = ai.defineFlow(
  {
    name: 'generateCategoryIconFlow',
    inputSchema: GenerateCategoryIconInputSchema,
    outputSchema: GenerateCategoryIconOutputSchema,
  },
  async (input) => {
    
    const prompt = `Generate a visually appealing, abstract icon that represents the artisan craft category of '${input.categoryName}'.
The icon should be simple, modern, and easily recognizable.
It should be suitable for a web application interface, displayed on a clean, neutral-colored, flat background.
Do not include any text or words in the image.
The style should be a graphic illustration, not a photograph.
Focus on a single, strong visual metaphor for the category.
The image must be square.`;

    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: prompt,
         config: {
            aspectRatio: "1:1"
        }
    });
    
    const url = media.url;
    if (!url) {
        throw new Error('Image generation for category icon failed.');
    }

    return { iconDataUri: url };
  }
);
