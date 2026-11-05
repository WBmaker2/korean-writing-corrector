import { useEffect, useRef, useState } from 'react';
import { analyzeText } from '../lib/analyze';
import { rules } from '../data/rules';
import { dictionary } from '../data/dictionary';
import type { ErrorItem } from '../types';
import type { Settings } from './useSettings';

export function useAnalysis(text: string, settings?: Settings) {
  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const workerRef = useRef<Worker | null>(null);
  const reqId = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      workerRef.current = new Worker(new URL('../worker/analysisWorker.ts', import.meta.url), { type: 'module' });
    } catch {
      workerRef.current = null;
    }
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const id = ++reqId.current;
      const options = {
        ignoredRuleIds: settings?.ignoredRuleIds ?? [],
        userDictionary: settings?.userDictionary ?? [],
        minConfidence: settings?.minConfidence ?? 0,
      };
      if (workerRef.current) {
        const onMsg = (ev: MessageEvent) => {
          if (ev.data.id !== id) return;
          setErrors(ev.data.errors);
          workerRef.current?.removeEventListener('message', onMsg);
        };
        workerRef.current.addEventListener('message', onMsg);
        workerRef.current.postMessage({ text, id, options });
        return;
      }
      setErrors(analyzeText(text, rules, dictionary, {
        ignoredRuleIds: new Set(options.ignoredRuleIds),
        userDictionary: options.userDictionary,
        minConfidence: options.minConfidence,
      }));
    }, settings?.debounceMs ?? 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, settings]);

  return { errors };
}
