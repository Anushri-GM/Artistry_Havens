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

const artisanImageDataUri = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAQsA4AMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAAAAQIDBAUG/8QAMBABAQACAQIDBgYCAwEAAAAAAAECEQMSITFBUWEEE3GBkaHwIjKxwdEUFWLR4fFy/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABwRAQEBAQEBAQEBAAAAAAAAAAABEQISITHwA//aAAwDAQACEQMRAD8A/R5ce3L7b7l8b/L63d8WPL3v5cW+V5WXTq3h4b5/DZZZe+Hhvk8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gyyy9wA8/Gtsss