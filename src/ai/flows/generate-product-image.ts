
'use server';
/**
 * @fileOverview Generates a product image from a name and category.
 *
 * - generateProductImage - A function that handles the image generation.
 */

import {ai} from '@/ai/genkit';
import { GenerateProductImageInput, GenerateProductImageInputSchema, GenerateProductImageOutput, GenerateProductImageOutputSchema } from '@/ai/types/generate-product-image-types';

export async function generateProductImage(
  input: GenerateProductImageInput
): Promise<GenerateProductImageOutput> {
  return generateProductImageFlow(input);
}

const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async (input) => {
    
    const prompt = `Generate a high-quality, realistic photograph of a beautiful artisan product.
Product Name: '${input.productName}'
Category: '${input.category}'
The product should be the main focus, displayed on a clean, neutral, and professional studio background.
The image should be well-lit and visually appealing for an e-commerce website.
Do not include any text or logos in the image.`;

    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: prompt,
         config: {
            aspectRatio: "1:1"
        }
    });
    
    const url = media.url;
    if (!url) {
        throw new Error('Image generation for product failed.');
    }

    return { imageDataUri: url };
  }
);
