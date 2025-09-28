'use server';
/**
 * @fileOverview Anomaly detection in server logs using Genkit.
 *
 * - detectAnomalies - A function that detects anomalies in server logs.
 * - DetectAnomaliesInput - The input type for the detectAnomalies function.
 * - DetectAnomaliesOutput - The return type for the detectAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomaliesInputSchema = z.object({
  logs: z.string().describe('The server logs to analyze.'),
});
export type DetectAnomaliesInput = z.infer<typeof DetectAnomaliesInputSchema>;

const DetectAnomaliesOutputSchema = z.object({
  anomalies: z.array(
    z.object({
      description: z.string().describe('A description of the anomaly.'),
      severity: z.string().describe('The severity of the anomaly (e.g., low, medium, high).'),
      logEntries: z.array(z.string()).describe('The specific log entries related to the anomaly.'),
    })
  ).describe('The detected anomalies in the logs.'),
});
export type DetectAnomaliesOutput = z.infer<typeof DetectAnomaliesOutputSchema>;

export async function detectAnomalies(input: DetectAnomaliesInput): Promise<DetectAnomaliesOutput> {
  return detectAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomaliesPrompt',
  input: {schema: DetectAnomaliesInputSchema},
  output: {schema: DetectAnomaliesOutputSchema},
  prompt: `You are an expert system administrator specializing in detecting anomalies in server logs.

You will analyze the provided server logs and identify any unusual patterns or anomalies that could indicate security threats or performance issues.

For each detected anomaly, provide a description, severity (low, medium, high), and the specific log entries related to the anomaly.

Server Logs:
{{{logs}}}`,
});

const detectAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAnomaliesFlow',
    inputSchema: DetectAnomaliesInputSchema,
    outputSchema: DetectAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
