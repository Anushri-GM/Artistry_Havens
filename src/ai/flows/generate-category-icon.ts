
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
    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Generate a high-quality, realistic photograph of a beautiful artisan product from the category: '${input.categoryName}'.
        The product should be displayed on a clean, neutral-colored background, suitable for a product showcase in a web application.
        The image should look professional and appealing, like a photograph taken for a high-end online store.
        Do not include any text or words in the image.`,
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
