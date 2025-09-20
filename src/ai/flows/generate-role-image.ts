
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

const generateRoleImageFlow = ai.defineFlow(
  {
    name: 'generateRoleImageFlow',
    inputSchema: GenerateRoleImageInputSchema,
    outputSchema: GenerateRoleImageOutputSchema,
  },
  async (input) => {
    
    if (input.roleName === 'Artisan') {
        return { imageDataUri: 'https://image2url.com/images/1758398342370-5ab14d02-0dc5-4db2-a827-b098c96e830e.jpg' };
    }

    if (input.roleName === 'Buyer') {
        return { imageDataUri: 'https://image2url.com/images/1758400871847-a0e569c3-4fe5-45ac-96d1-b7d5e7f8d277.jpg' };
    }

    if (input.roleName === 'Sponsor') {
        return { imageDataUri: 'https://i.ibb.co/PZW4dF9/sponsor.jpg' };
    }
    
    // Fallback for any other role
    throw new Error(`No static image URL defined for role: ${input.roleName}`);
  }
);
