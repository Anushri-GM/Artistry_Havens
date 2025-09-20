
'use server';
/**
 * @fileOverview Generates product details (name, description, story) from an image.
 *
 * - generateProductDetails - A function that handles the product detail generation.
 */

import {ai} from '@/ai/genkit';
import { GenerateProductDetailsInput, GenerateProductDetailsInputSchema, GenerateProductDetailsOutput, GenerateProductDetailsOutputSchema } from '@/ai/types/generate-product-details-types';
import { googleAI } from '@genkit-ai/googleai';
import { translateText } from './translate-text';

export async function generateProductDetails(input: GenerateProductDetailsInput): Promise<GenerateProductDetailsOutput> {
  return generateProductDetailsFlow(input);
}

const productDetailsPrompt = ai.definePrompt({
    name: 'productDetailsPrompt',
    input: { schema: GenerateProductDetailsInputSchema },
    output: { schema: GenerateProductDetailsOutputSchema },
    model: googleAI.model('gemini-1.5-flash'),
    prompt: `You are an expert product marketer for an online marketplace for artisans. 
    
    Given the image of a new product and its category, generate a compelling product name, a detailed product description, and an engaging product story in English.

    The tone should be evocative, highlighting the craftsmanship and uniqueness of the item.

    - The product name should be creative and descriptive.
    - The product description should detail the materials, dimensions (if inferrable), and potential uses.
    - The product story should create an emotional connection to the artisan and the craft.

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

    // If the target language is not English, translate the generated content.
    if (input.targetLanguage !== 'en') {
        const [translatedName, translatedDescription, translatedStory] = await Promise.all([
            translateText({ text: output.productName, targetLanguage: input.targetLanguage }),
            translateText({ text: output.productDescription, targetLanguage: input.targetLanguage }),
            translateText({ text: output.productStory, targetLanguage: input.targetLanguage })
        ]);

        return {
            productName: translatedName.translatedText,
            productDescription: translatedDescription.translatedText,
            productStory: translatedStory.translatedText,
        };
    }
    
    return output;
  }
);

    
