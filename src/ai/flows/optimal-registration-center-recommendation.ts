'use server';
/**
 * @fileOverview This flow provides personalized recommendations for the most accessible or convenient voter registration center
 * based on a user's current location and preferred transport, along with routing options.
 *
 * - optimalRegistrationCenterRecommendation - A function that handles the registration center recommendation process.
 * - OptimalRegistrationCenterRecommendationInput - The input type for the optimalRegistrationCenterRecommendation function.
 * - OptimalRegistrationCenterRecommendationOutput - The return type for the optimalRegistrationCenterRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OptimalRegistrationCenterRecommendationInputSchema = z.object({
  userLocation: z
    .string()
    .describe(
      'The user\'s current location (e.g., address, city, or "latitude,longitude").'
    ),
  preferredTransport: z
    .enum(['walking', 'public_transport', 'driving', 'cycling'])
    .describe('The user\'s preferred mode of transport.'),
  registrationCenters: z
    .array(
      z.object({
        name: z.string().describe('The official name of the registration center.'),
        address: z.string().describe('The physical address of the registration center.'),
        coordinates: z
          .string()
          .optional()
          .describe('Optional: Geographic coordinates of the center (e.g., "-1.286389, 36.817223").'),
      })
    )
    .describe('A list of available voter registration centers.'),
});
export type OptimalRegistrationCenterRecommendationInput = z.infer<
  typeof OptimalRegistrationCenterRecommendationInputSchema
>;

const OptimalRegistrationCenterRecommendationOutputSchema = z.object({
  recommendedCenterName: z
    .string()
    .describe('The name of the most accessible or convenient registration center.'),
  reasoning: z
    .string()
    .describe('A brief explanation of why this center was recommended.'),
  estimatedTravelTime: z
    .string()
    .optional()
    .describe(
      'Estimated travel time to the recommended center (e.g., "15 minutes walking", "30 mins by public transport").'
    ),
  routeDescription: z
    .string()
    .optional()
    .describe('A summary or step-by-step description of the recommended route.'),
});
export type OptimalRegistrationCenterRecommendationOutput = z.infer<
  typeof OptimalRegistrationCenterRecommendationOutputSchema
>;

/**
 * A dummy tool that estimates travel time and provides a route description.
 * In a real application, this would interact with a mapping API (e.g., Google Maps Directions API).
 */
const getTravelTimeAndRoute = ai.defineTool(
  {
    name: 'getTravelTimeAndRoute',
    description:
      'Estimates travel time and provides a route description between two locations using a specified mode of transport.',
    inputSchema: z.object({
      origin:
        z.string().describe('The starting location (e.g., address or coordinates).'),
      destination:
        z.string().describe('The destination location (e.g., address or coordinates of the registration center).'),
      modeOfTransport: z
        .enum(['walking', 'public_transport', 'driving', 'cycling'])
        .describe('The preferred mode of transport.'),
    }),
    outputSchema: z.object({
      travelTime: z
        .string()
        .describe(
          'Estimated travel time (e.g., "15 minutes walking", "30 mins by public transport").'
        ),
      routeDescription: z
        .string()
        .describe('A summary or step-by-step description of the route.'),
    }),
  },
  async (input) => {
    const { origin, destination, modeOfTransport } = input;
    let travelTime: string;
    let routeDescription: string;

    // Mock logic for demonstration purposes. Replace with actual API calls in production.
    switch (modeOfTransport) {
      case 'walking':
        travelTime = '15 minutes walking';
        routeDescription = `Walk from ${origin} towards ${destination}. Go straight for 1km, then turn left at the roundabout.`;
        break;
      case 'public_transport':
        travelTime = '30 minutes by public transport';
        routeDescription = `Take bus #123 from near ${origin} towards ${destination} stop. Depart in 5 minutes.`;
        break;
      case 'driving':
        travelTime = '10 minutes driving';
        routeDescription = `Drive from ${origin} to ${destination}. Follow main roads and signs.`;
        break;
      case 'cycling':
        travelTime = '20 minutes cycling';
        routeDescription = `Cycle from ${origin} to ${destination}. Use bike lanes where available and be aware of traffic.`;
        break;
      default:
        travelTime = 'Unknown travel time';
        routeDescription = `Could not determine route for ${modeOfTransport}.`;
    }

    return {
      travelTime,
      routeDescription,
    };
  }
);

const optimalRegistrationCenterRecommendationPrompt = ai.definePrompt({
  name: 'optimalRegistrationCenterRecommendationPrompt',
  input: { schema: OptimalRegistrationCenterRecommendationInputSchema },
  output: { schema: OptimalRegistrationCenterRecommendationOutputSchema },
  tools: [getTravelTimeAndRoute],
  prompt: `You are an AI assistant specialized in recommending the most accessible or convenient voter registration centers.
Your task is to analyze the user's current location, their preferred mode of transport, and a list of available registration centers.
For each registration center, you MUST use the 'getTravelTimeAndRoute' tool to estimate the travel time and get a route description from the user's location to the center, using their preferred transport.
After evaluating all provided centers using the tool, recommend ONE registration center that is the most accessible or convenient based on estimated travel time and any other relevant factors from the route description.

User's current location: {{{userLocation}}}
User's preferred transport: {{{preferredTransport}}}

Available Registration Centers:
{{#each registrationCenters}}
- Name: {{{name}}}, Address: {{{address}}} {{#if coordinates}}(Coordinates: {{{coordinates}}}){{/if}}
{{/each}}

Please provide the recommended center's name, your reasoning, the estimated travel time, and a summary of the route.
`,
});

const optimalRegistrationCenterRecommendationFlow = ai.defineFlow(
  {
    name: 'optimalRegistrationCenterRecommendationFlow',
    inputSchema: OptimalRegistrationCenterRecommendationInputSchema,
    outputSchema: OptimalRegistrationCenterRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await optimalRegistrationCenterRecommendationPrompt(input);
    return output!;
  }
);

export async function optimalRegistrationCenterRecommendation(
  input: OptimalRegistrationCenterRecommendationInput
): Promise<OptimalRegistrationCenterRecommendationOutput> {
  return optimalRegistrationCenterRecommendationFlow(input);
}
