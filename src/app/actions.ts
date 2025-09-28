"use server";

import { detectAnomalies } from '@/ai/flows/detect-anomalies-in-logs';
import { z } from 'zod';
import type { AnomalyDetectionState } from '@/lib/types';

const schema = z.object({
  logs: z.string().min(50, { message: 'Пожалуйста, предоставьте не менее 50 символов данных логов для значимого анализа.' }),
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
      message: 'Неверный ввод.',
      errors: validatedFields.error.flatten().fieldErrors,
      anomalies: [],
    };
  }

  try {
    const result = await detectAnomalies({ logs: validatedFields.data.logs });
    if (!result || !result.anomalies || result.anomalies.length === 0) {
      return {
        message: 'Анализ завершен. Аномалий не найдено.',
        anomalies: [],
      };
    }
    return {
      message: 'Анализ завершен.',
      anomalies: result.anomalies,
    };
  } catch (error) {
    console.error("Ошибка обнаружения аномалий:", error);
    return {
      message: 'Во время анализа произошла непредвиденная ошибка. Пожалуйста, повторите попытку позже.',
      anomalies: [],
    };
  }
}
