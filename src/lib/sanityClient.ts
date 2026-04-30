import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: 'l134t0br', // O ID do seu projeto Sanity
  dataset: 'production',
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster reads
  apiVersion: '2024-04-29', // Use current date for API version
  // token: process.env.VITE_SANITY_TOKEN, // Você precisará disso apenas para criar/editar posts
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
