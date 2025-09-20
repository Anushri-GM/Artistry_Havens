
import {z} from 'genkit';

export const GenerateRoleImageInputSchema = z.object({
  roleName: z.string().describe('The name of the user role (Artisan, Buyer, Sponsor).'),
});
export type GenerateRoleImageInput = z.infer<typeof GenerateRoleImageInputSchema>;

export const GenerateRoleImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The generated image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateRoleImageOutput = z.infer<typeof GenerateRoleImageOutputSchema>;
