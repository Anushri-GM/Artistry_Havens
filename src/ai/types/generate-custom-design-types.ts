
import {z} from 'genkit';

export const GenerateCustomDesignInputSchema = z.object({
  prompt: z.string().describe('The user\'s text prompt describing the desired design.'),
  category: z.string().describe('The category of the artisan to create the design.'),
  referenceImageDataUri: z
    .string()
    .optional()
    .describe(
      "An optional reference image of the design, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateCustomDesignInput = z.infer<typeof GenerateCustomDesignInputSchema>;

export const GenerateCustomDesignOutputSchema = z.object({
  designDataUri: z
    .string()
    .describe(
      "The generated design image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateCustomDesignOutput = z.infer<typeof GenerateCustomDesignOutputSchema>;
