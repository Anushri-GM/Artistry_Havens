'use server';
/**
 * @fileOverview Generates social media content for artisans to promote their products.
 *
 * - generateSocialMediaContent - A function that generates social media content.
 * - GenerateSocialMediaContentInput - The input type for the generateSocialMediaContent function.
 * - GenerateSocialMediaContentOutput - The return type for the generateSocialMediaContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaContentInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  productStory: z.string().describe('The story behind the product and its creation.'),
  socialMediaPlatforms: z
    .array(z.enum(['Instagram', 'Facebook', 'Snapchat', 'Twitter(X)']))
    .describe('The social media platforms to generate content for.'),
});
export type GenerateSocialMediaContentInput = z.infer<
  typeof GenerateSocialMediaContentInputSchema
>;

const GenerateSocialMediaContentOutputSchema = z.object({
  content: z.record(z.string(), z.string()).describe(
    'A map of social media platforms to generated content for that platform.'
  ),
});
export type GenerateSocialMediaContentOutput = z.infer<
  typeof GenerateSocialMediaContentOutputSchema
>;

export async function generateSocialMediaContent(
  input: GenerateSocialMediaContentInput
): Promise<GenerateSocialMediaContentOutput> {
  return generateSocialMediaContentFlow(input);
}

const generateSocialMediaContentPrompt = ai.definePrompt({
  name: 'generateSocialMediaContentPrompt',
  input: {schema: GenerateSocialMediaContentInputSchema},
  output: {schema: GenerateSocialMediaContentOutputSchema},
  prompt: `You are a social media marketing expert helping artisans promote their products.

  Generate engaging content for the following social media platforms based on the product information provided.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Product Story: {{{productStory}}}

  The content should be tailored to each platform and include relevant hashtags to maximize reach.

  Social Media Platforms: {{#each socialMediaPlatforms}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Output the results as a JSON object with each social media platform as a key, and generated content as a value.
  `,
});

const generateSocialMediaContentFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaContentFlow',
    inputSchema: GenerateSocialMediaContentInputSchema,
    outputSchema: GenerateSocialMediaContentOutputSchema,
  },
  async input => {
    const {output} = await generateSocialMediaContentPrompt(input);
    return output!;
  }
);
