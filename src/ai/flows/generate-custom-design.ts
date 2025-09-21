
'use server';
/**
 * @fileOverview Generates a custom product design based on user input.
 *
 * - generateCustomDesign - A function that handles the custom design generation.
 */

import {ai} from '@/ai/genkit';
import { GenerateCustomDesignInput, GenerateCustomDesignInputSchema, GenerateCustomDesignOutput, GenerateCustomDesignOutputSchema } from '@/ai/types/generate-custom-design-types';
import { googleAI } from '@genkit-ai/googleai';

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

    const textPrompt = `Generate a product image for an artisan craft.
        Category: ${input.category}.
        User Request: "${input.prompt}".
        The image should be a realistic product mockup on a clean, neutral background.
        `;

    const promptParts: any[] = [{ text: textPrompt }];
    
    if (input.referenceImageDataUri) {
        promptParts.push({ media: { url: input.referenceImageDataUri } });
        promptParts.push({ text: "Use the provided image as a style reference." });
    }

    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-image-preview'),
        prompt: promptParts,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        }
    });
    
    const url = media.url;
    if (!url) {
        throw new Error('Image generation failed.');
    }

    return { designDataUri: url };
  }
);

