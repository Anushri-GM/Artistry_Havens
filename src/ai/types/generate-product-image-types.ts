
import {z} from 'genkit';

export const GenerateProductImageInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product.'),
});
export type GenerateProductImageInput = z.infer<typeof GenerateProductImageInputSchema>;

export const GenerateProductImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The generated product image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateProductImageOutput = z.infer<typeof GenerateProductImageOutputSchema>;
