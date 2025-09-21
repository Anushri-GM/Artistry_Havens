
'use server';
/**
 * @fileOverview Generates a unique icon for a given artisan craft category.
 *
 * - generateCategoryIcon - A function that handles the icon generation.
 */

import {ai} from '@/ai/genkit';
import { GenerateCategoryIconInput, GenerateCategoryIconInputSchema, GenerateCategoryIconOutput, GenerateCategoryIconOutputSchema } from '@/ai/types/generate-category-icon-types';


export async function generateCategoryIcon(
  input: GenerateCategoryIconInput
): Promise<GenerateCategoryIconOutput> {
  return generateCategoryIconFlow(input);
}

const staticCategoryImages: Record<string, string> = {
    "Woodwork": "https://image2url.com/images/1758430013038-0a39e0a3-945c-4e04-8fa5-21badbd31c2e.png",
    "Pottery": "https://image2url.com/images/1758430169173-a1afbd44-922d-44ba-a13b-68461050b091.jpg",
    "Paintings": "https://image2url.com/images/1758430305350-e32f36f4-cc9d-4236-9d17-39efacb9cf77.jpg",
    "Sculptures": "https://image2url.com/images/1758430424232-91ab745d-8472-449a-97a9-dbdc0e94a32a.png",
    "Textiles": "https://image2url.com/images/1758430934799-a964b4d4-713a-4640-982b-38447266499f.png",
    "Jewelry": "https://image2url.com/images/1758432571106-f5c52cc3-7e03-4e71-b440-baba65a831ed.jpg",
    "Metalwork": "https://image2url.com/images/1758432893677-d6ab2c29-6690-4ddb-8a1d-634c77de02d1.jpg"
};


const generateCategoryIconFlow = ai.defineFlow(
  {
    name: 'generateCategoryIconFlow',
    inputSchema: GenerateCategoryIconInputSchema,
    outputSchema: GenerateCategoryIconOutputSchema,
  },
  async (input) => {
    
    if (staticCategoryImages[input.categoryName]) {
        return { iconDataUri: staticCategoryImages[input.categoryName] };
    }

    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Generate a high-quality, realistic photograph of a beautiful artisan product from the category: '${input.categoryName}'.
        The product should be displayed on a clean, neutral-colored background, suitable for a product showcase in a web application.
        The image should look professional and appealing, like a photograph taken for a high-end online store.
        Do not include any text or words in the image.`,
         config: {
            aspectRatio: "1:1"
        }
    });
    
    const url = media.url;
    if (!url) {
        throw new Error('Image generation for category icon failed.');
    }

    return { iconDataUri: url };
  }
);



