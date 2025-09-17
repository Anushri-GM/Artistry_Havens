
'use server';
/**
 * @fileOverview Generates a custom product design based on user input.
 *
 * - generateCustomDesign - A function that handles the custom design generation.
 * - GenerateCustomDesignInput - The input type for the generateCustomDesign function.
 * - GenerateCustomDesignOutput - The return type for the generateCustomDesign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateCustomDesignInputSchema = z.object({
  prompt: z.string().describe('The user\'s text prompt describing the desired design.'),
  category: z.string().describe('The category of the artisan to create the design.'),
  referenceImageDataUri: z
    .string()
    .optional()
    .describe(
      "An optional reference image of the design, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateCustomDesignInput = z.infer<typeof GenerateCustomDesignInputSchema>;

export const GenerateCustomDesignOutputSchema = z.object({
  designDataUri: z
    .string()
    .describe(
      "The generated design image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateCustomDesignOutput = z.infer<typeof GenerateCustomDesignOutputSchema>;

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
