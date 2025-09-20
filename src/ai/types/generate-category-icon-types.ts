
import {z} from 'genkit';

export const GenerateCategoryIconInputSchema = z.object({
  categoryName: z.string().describe('The name of the artisan craft category.'),
});
export type GenerateCategoryIconInput = z.infer<typeof GenerateCategoryIconInputSchema>;

export const GenerateCategoryIconOutputSchema = z.object({
  iconDataUri: z
    .string()
    .describe(
      "The generated icon image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateCategoryIconOutput = z.infer<typeof GenerateCategoryIconOutputSchema>;
