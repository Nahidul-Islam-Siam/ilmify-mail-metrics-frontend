export type ValidationStatus = 'valid' | 'invalid' | 'disposable' | 'risky';
export type ValidationCheckState = 'pass' | 'fail' | 'warn' | 'unknown' | 'skipped';

export interface ValidationChecks {
  format: ValidationCheckState;
  mx: ValidationCheckState;
  [check: string]: ValidationCheckState;
}

export interface ValidationResult {
  score: number;
  status: ValidationStatus;
  disposable: boolean;
  live: boolean;
  checks: ValidationChecks;
  [field: string]: unknown;
}
