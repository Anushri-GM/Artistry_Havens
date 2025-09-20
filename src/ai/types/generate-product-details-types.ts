
import {z} from 'genkit';

export const GenerateProductDetailsInputSchema = z.object({
  productImageDataUri: z
    .string()
    .describe(
      "The product image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
    category: z.string().describe('The category of the product.'),
    targetLanguage: z.string().describe("The target language for the generated details, specified as a two-letter language code (e.g., 'en', 'hi')."),
});
export type GenerateProductDetailsInput = z.infer<typeof GenerateProductDetailsInputSchema>;

export const GenerateProductDetailsOutputSchema = z.object({
  productName: z.string().describe("The generated name for the product."),
  productDescription: z.string().describe("The generated description for the product."),
  productStory: z.string().describe("The generated story for the product."),
});
export type GenerateProductDetailsOutput = z.infer<typeof GenerateProductDetailsOutputSchema>;

    