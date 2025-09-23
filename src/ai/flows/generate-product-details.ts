
'use server';
/**
 * @fileOverview Generates product details (name, description, story, category) from an image.
 *
 * - generateProductDetails - A function that handles the product detail generation.
 */

import {ai} from '@/ai/genkit';
import { GenerateProductDetailsInput, GenerateProductDetailsInputSchema, GenerateProductDetailsOutput, GenerateProductDetailsOutputSchema } from '@/ai/types/generate-product-details-types';
import { googleAI } from '@genkit-ai/googleai';
import { translateText } from './translate-text';

const categories = ["Woodwork", "Pottery", "Paintings", "Sculptures", "Textiles", "Jewelry", "Metalwork"];

export async function generateProductDetails(input: GenerateProductDetailsInput): Promise<GenerateProductDetailsOutput> {
  return generateProductDetailsFlow(input);
}

const productDetailsPrompt = ai.definePrompt({
    name: 'productDetailsPrompt',
    input: { schema: GenerateProductDetailsInputSchema },
    output: { schema: GenerateProductDetailsOutputSchema },
    prompt: `You are an expert product marketer for an online marketplace for artisans. 
    
    Given the image of a new product, generate a compelling product name, a detailed product description, an engaging product story, and predict its category in English.

    - The product name should be creative and descriptive.
    - The product description should detail the materials, dimensions (if inferrable), and potential uses. It should be a maximum of 175 words.
    - The product story should create an emotional connection to the artisan and the craft.
    - The predictedCategory must be one of the following exact values: ${categories.join(', ')}.

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
            predictedCategory: output.predictedCategory, // Category is not translated
        };
    }
    
    return output;
  }
);
