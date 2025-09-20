
'use server';
/**
 * @fileOverview Generates a unique icon for a given artisan craft category.
 *
 * - generateCategoryIcon - A function that handles the icon generation.
 * - GenerateCategoryIconInput - The input type for the function.
 * - GenerateCategoryIconOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateCategoryIconInputSchema = z.object({
  categoryName: z.string().describe('The name of the artisan craft category.'),
});
export type GenerateCategoryIconInput = z.infer<typeof GenerateCategoryIconInputSchema>;

export const GenerateCategoryIconOutputSchema = z.object({
  iconDataUri: z
    .string()
    .describe(
      "The generated icon image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateCategoryIconOutput = z.infer<typeof GenerateCategoryIconOutputSchema>;


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
        prompt: `Generate a simple, clean, modern icon for the artisan craft category: '${input.categoryName}'. 
        The icon should be on a transparent or neutral light-colored background, suitable for use in a web application. 
        The style should be minimalist, professional, and easily recognizable. It should look like a high-quality app icon.`,
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
