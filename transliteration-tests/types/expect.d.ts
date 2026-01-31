import type { Matchers } from '@playwright/test';

declare module '@playwright/test' {
  interface Matchers<R> {
    toBeSimilarTo(expected: string, threshold?: number): R;
  }
}

export {};
