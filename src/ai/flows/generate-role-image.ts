
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
    Buyer: `Generate a high-quality, professional photograph of a discerning buyer thoughtfully examining artisan crafts in a high-end boutique or gallery setting. 
            The person should appear sophisticated and engaged, appreciating the quality and detail of the handmade products. 
            The ambiance should be elegant and well-lit, highlighting the beauty of the crafts. 
            The image should convey a sense of refined taste and appreciation for unique, high-quality items.`,
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
