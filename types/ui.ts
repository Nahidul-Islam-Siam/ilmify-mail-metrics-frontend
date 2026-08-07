export type ToastKind = 'success' | 'error' | 'info';
export type ToastFunction = (message: string) => void;

export interface SelectOption {
  value: string;
  label: string;
}

export interface ChartDatum {
  l: string;
  v: number;
}

export interface DonutSegment {
  l?: string;
  v: number;
  c: string;
}
