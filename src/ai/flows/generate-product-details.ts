
'use server';
/**
 * @fileOverview Generates product details (name, description, story) from an image.
 *
 * - generateProductDetails - A function that handles the product detail generation.
 */

import {ai} from '@/ai/genkit';
import { GenerateProductDetailsInput, GenerateProductDetailsInputSchema, GenerateProductDetailsOutput, GenerateProductDetailsOutputSchema } from '@/ai/types/generate-product-details-types';


export async function generateProductDetails(input: GenerateProductDetailsInput): Promise<GenerateProductDetailsOutput> {
  return generateProductDetailsFlow(input);
}

const productDetailsPrompt = ai.definePrompt({
    name: 'productDetailsPrompt',
    input: { schema: GenerateProductDetailsInputSchema },
    output: { schema: GenerateProductDetailsOutputSchema },
    prompt: `You are an expert product marketer for an online marketplace for artisans. 
    
    Given the image of a new product and its category, generate a compelling product name, description, and story.

    The tone should be evocative, highlighting the craftsmanship and uniqueness of the item.

    Category: {{{category}}}
    Product Image: {{media url=productImageDataUri}}
    `,
});


const generateProductDetailsFlow = ai.defineFlow(
  {
    name: 'generateProductDetailsFlow',
    inputSchema: GenerateProductDetailsInputSchema,
    outputSchema: GenerateProductDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await productDetailsPrompt(input);
    if (!output) {
        throw new Error("Failed to generate product details.");
    }
    return output;
  }
);
