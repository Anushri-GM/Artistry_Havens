
'use server';
/**
 * @fileOverview Generates a custom product design based on user input.
 *
 * - generateCustomDesign - A function that handles the custom design generation.
 */

import {ai} from '@/ai/genkit';
import { GenerateCustomDesignInput, GenerateCustomDesignInputSchema, GenerateCustomDesignOutput, GenerateCustomDesignOutputSchema } from '@/ai/types/generate-custom-design-types';


export async function generateCustomDesign(input: GenerateCustomDesignInput): Promise<GenerateCustomDesignOutput> {
  return generateCustomDesignFlow(input);
}


const generateCustomDesignFlow = ai.defineFlow(
  {
    name: 'generateCustomDesignFlow',
    inputSchema: GenerateCustomDesignInputSchema,
    outputSchema: GenerateCustomDesignOutputSchema,
  },
  async (input) => {

    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Generate a product image for an artisan craft.
        Category: ${input.category}.
        User Request: "${input.prompt}".
        ${input.referenceImageDataUri ? `Use this image as a style reference: {{media url=${input.referenceImageDataUri}}}` : ''}
        The image should be a realistic product mockup on a clean, neutral background.
        `,
    });
    
    const url = media.url;
    if (!url) {
        throw new Error('Image generation failed.');
    }

    return { designDataUri: url };
  }
);
