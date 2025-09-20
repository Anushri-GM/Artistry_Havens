
'use server';
/**
 * @fileOverview Generates a unique image for a given user role.
 *
 * - generateRoleImage - A function that handles the image generation for roles.
 */

import {ai} from '@/ai/genkit';
import { GenerateRoleImageInput, GenerateRoleImageInputSchema, GenerateRoleImageOutput, GenerateRoleImageOutputSchema } from '@/ai/types/generate-role-image-types';


export async function generateRoleImage(
  input: GenerateRoleImageInput
): Promise<GenerateRoleImageOutput> {
  return generateRoleImageFlow(input);
}

const prompts: Record<string, string> = {
    Artisan: `Generate a high-quality, realistic photograph of an artisan working on their craft. 
              The image should be vibrant and show the artisan's hands and the product they are making. 
              Focus on the details of the craft, such as woodworking, pottery, or weaving.
              The setting should be a well-lit workshop or studio.
              The image should look professional and inspiring, suitable for a web application.`,
    Buyer: `Generate a high-quality, realistic photograph of a person admiring artisan crafts at a market or boutique.
            The person should look engaged and interested in the products.
            The background should be filled with various beautiful handmade items.
            The image should convey a sense of discovery and appreciation for craftsmanship.`,
    Sponsor: `Generate a high-quality, professional photograph representing patronage and support for the arts.
              This could be an image of a handshake in front of an art piece, or a person discussing a craft with an artisan.
              The mood should be collaborative and positive.
              The image should convey trust and partnership.`
}


const generateRoleImageFlow = ai.defineFlow(
  {
    name: 'generateRoleImageFlow',
    inputSchema: GenerateRoleImageInputSchema,
    outputSchema: GenerateRoleImageOutputSchema,
  },
  async (input) => {
    
    const prompt = prompts[input.roleName] || `Generate a high-quality, realistic photograph representing a ${input.roleName}.`;

    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: prompt,
         config: {
            aspectRatio: "1:1"
        }
    });
    
    const url = media.url;
    if (!url) {
        throw new Error('Image generation for role failed.');
    }

    return { imageDataUri: url };
  }
);
