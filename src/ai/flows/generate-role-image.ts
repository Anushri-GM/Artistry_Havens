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


const artisanImageUrl = "https://image2url.com/images/1758398342370-5ab14d02-0dc5-4db2-a827-b098c96e830e.jpg";
const buyerImageUrl = "https://picsum.photos/seed/buyer-role/400/400";
const sponsorImageUrl = "https://picsum.photos/seed/sponsor-role/400/400";

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

    if (input.roleName === 'Buyer') {
        return { imageDataUri: buyerImageUrl };
    }

    if (input.roleName === 'Sponsor') {
        return { imageDataUri: sponsorImageUrl };
    }
    
    // Fallback for any other role
    throw new Error(`No static image URL defined for role: ${input.roleName}`);
  }
);
