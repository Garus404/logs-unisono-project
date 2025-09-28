"use server";

import { detectAnomalies } from '@/ai/flows/detect-anomalies-in-logs';
import { z } from 'zod';
import type { AnomalyDetectionState } from '@/lib/types';

const schema = z.object({
  logs: z.string().min(50, { message: 'Please provide at least 50 characters of log data for a meaningful analysis.' }),
});

export async function detectAnomaliesAction(
  prevState: AnomalyDetectionState,
  formData: FormData
): Promise<AnomalyDetectionState> {
  const validatedFields = schema.safeParse({
    logs: formData.get('logs'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
      anomalies: [],
    };
  }

  try {
    const result = await detectAnomalies({ logs: validatedFields.data.logs });
    if (!result || !result.anomalies || result.anomalies.length === 0) {
      return {
        message: 'Analysis complete. No anomalies found.',
        anomalies: [],
      };
    }
    return {
      message: 'Analysis complete.',
      anomalies: result.anomalies,
    };
  } catch (error) {
    console.error("Anomaly detection error:", error);
    return {
      message: 'An unexpected error occurred during analysis. Please try again later.',
      anomalies: [],
    };
  }
}
