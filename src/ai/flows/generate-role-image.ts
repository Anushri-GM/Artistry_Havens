
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
    Buyer: `Generate a high-quality, professional photograph of a discerning buyer thoughtfully examining artisan crafts in a high-end boutique or gallery setting. 
            The person should appear sophisticated and engaged, appreciating the quality and detail of the handmade products. 
            The ambiance should be elegant and well-lit, highlighting the beauty of the crafts. 
            The image should convey a sense of refined taste and appreciation for unique, high-quality items.`,
    Sponsor: `Generate a high-quality, professional photograph representing patronage and support for the arts.
              This could be an image of a handshake in front of an art piece, or a person discussing a craft with an artisan.
              The mood should be collaborative and positive.
              The image should convey trust and partnership.`
}

const artisanImageUrl = "https://image2url.com/images/1758398342370-5ab14d02-0dc5-4db2-a827-b098c96e830e.jpg";

const generateRoleImageFlow = ai.defineFlow(
  {
    name: 'generateRoleImageFlow',
    inputSchema: GenerateRoleImageInputSchema,
    outputSchema: GenerateRoleImageOutputSchema,
  },
  async (input) => {

    if (input.roleName === 'Artisan') {
        return { imageDataUri: artisanImageUrl };
    }

    const prompt = prompts[input.roleName];
    if (!prompt) {
        throw new Error(`No prompt defined for role: ${input.roleName}`);
    }

    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: prompt,
        config: {
            aspectRatio: "1:1"
        }
    });
    
    const url = media.url;
    if (!url) {
        throw new Error(`Image generation for role '${input.roleName}' failed.`);
    }

    return { imageDataUri: url };
  }
);
