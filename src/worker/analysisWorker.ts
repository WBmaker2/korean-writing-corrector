import { analyzeText } from '../lib/analyze';
import { rules } from '../data/rules';
import { dictionary } from '../data/dictionary';

self.onmessage = (e: MessageEvent<{ text: string; id: number; options?: any }>) => {
  const { text, id, options } = e.data;
  const opts = options
    ? {
        ...options,
        ignoredRuleIds: new Set(options.ignoredRuleIds ?? []),
        userDictionary: options.userDictionary ?? [],
      }
    : {};
  const errors = analyzeText(text, rules, dictionary, opts);
  self.postMessage({ id, errors });
};
