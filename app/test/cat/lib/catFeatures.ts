export type CatFeatures = Partial<{
  simple_sel_rt_mean: number; // seconds
  simple_sel_rt_sd: number; // seconds
  sustained_omission: number; // 0~1
  sustained_commission: number; // 0~1
  interference_omission: number; // 0~1
  interference_commission: number; // 0~1
  p_survey: number; // 0~1 (optional)
}>;

const STORAGE_KEY = 'acts:catFeatures:v1';

function isBrowser() {
  return typeof window !== 'undefined';
}

function safeJsonParse<T>(raw: string | null): T | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function getCatFeatures(): CatFeatures {
  if (!isBrowser()) return {};
  const data = safeJsonParse<CatFeatures>(sessionStorage.getItem(STORAGE_KEY));
  return data && typeof data === 'object' ? data : {};
}

/**
 * Merge-and-persist. If a key is set to `undefined`, it will be removed.
 */
export function setCatFeatures(patch: CatFeatures): void {
  if (!isBrowser()) return;
  const prev = getCatFeatures();
  const next: CatFeatures = { ...prev, ...patch };

  // Remove explicit undefined keys so "missing" logic works cleanly.
  (Object.keys(next) as (keyof CatFeatures)[]).forEach((k) => {
    if (next[k] === undefined) delete next[k];
  });

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearCatFeatures(opts?: { keepSurvey?: boolean }): void {
  if (!isBrowser()) return;
  if (!opts?.keepSurvey) {
    sessionStorage.removeItem(STORAGE_KEY);
    return;
  }

  const { p_survey } = getCatFeatures();
  sessionStorage.removeItem(STORAGE_KEY);
  if (p_survey !== undefined) setCatFeatures({ p_survey });
}

export function parseOptionalNumber(input: string): number | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

export function mean(nums: number[]): number | undefined {
  if (nums.length === 0) return undefined;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/**
 * Population standard deviation (divide by N).
 */
export function sd(nums: number[]): number | undefined {
  if (nums.length === 0) return undefined;
  const m = mean(nums);
  if (m === undefined) return undefined;
  const v = nums.reduce((acc, x) => acc + (x - m) ** 2, 0) / nums.length;
  return Math.sqrt(v);
}

export function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}


