"use client";

import { useFormState, useFormStatus } from "react-dom";
import { detectAnomaliesAction } from "@/app/actions";
import type { AnomalyDetectionState } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, Loader2, ShieldCheck } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const initialState: AnomalyDetectionState = {
  anomalies: [],
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Анализировать логи
    </Button>
  );
}

const severityMap = {
  low: {
    icon: Info,
    class: "bg-blue-950/50 border-blue-500/50 text-blue-300",
    iconClass: "text-blue-400"
  },
  medium: {
    icon: AlertTriangle,
    class: "bg-yellow-950/50 border-yellow-500/50 text-yellow-300",
    iconClass: "text-yellow-400"
  },
  high: {
    icon: AlertTriangle,
    class: "bg-red-950/50 border-red-500/50 text-red-300",
    iconClass: "text-red-400"
  },
};

export default function AnomalyView() {
  const [state, formAction] = useFormState(detectAnomaliesAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== 'Анализ завершен.') {
      toast({
        title: state.message,
        variant: (state.errors || state.message.includes('ошибка')) ? 'destructive' : 'default',
      });
    }
  }, [state, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Обнаружение аномалий с помощью ИИ</CardTitle>
          <CardDescription>
            Вставьте логи вашего сервера ниже. ИИ проанализирует их на наличие необычных паттернов,
            потенциальных угроз безопасности или проблем с производительностью.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
            <Textarea
              name="logs"
              placeholder="Вставьте логи сервера здесь..."
              className="min-h-[300px] font-mono text-xs"
              required
            />
            {state.errors?.logs && (
              <p className="text-sm text-destructive mt-2">{state.errors.logs[0]}</p>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Результаты анализа</CardTitle>
          <CardDescription>
            Обнаруженные ИИ аномалии будут отображены здесь.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
            {state.anomalies && state.anomalies.length > 0 ? (
              state.anomalies.map((anomaly, index) => {
                const severityKey = anomaly.severity.toLowerCase() as keyof typeof severityMap;
                const { icon: Icon, class: severityClass, iconClass } = severityMap[severityKey] || severityMap.medium;

                return (
                  <Alert key={index} className={severityClass}>
                    <Icon className={`h-4 w-4 ${iconClass}`} />
                    <AlertTitle className="flex items-center gap-2">
                        {anomaly.severity}
                    </AlertTitle>
                    <AlertDescription>
                      <p className="font-semibold">{anomaly.description}</p>
                      <ul className="mt-2 list-disc list-inside font-mono text-xs space-y-1">
                        {anomaly.logEntries.map((entry, i) => (
                          <li key={i}>{entry}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full p-8 rounded-lg border-2 border-dashed">
                <ShieldCheck className="w-16 h-16 mb-4" />
                <h3 className="text-lg font-semibold">Пока нет результатов</h3>
                <p className="text-sm">Отправьте логи, чтобы начать анализ.</p>
              </div>
            )}
          </div>
            </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
