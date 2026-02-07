import type { UnitPreference } from '../types';
import { POINTS_PER_CM, POINTS_PER_INCH, POINTS_PER_MM } from '../constants';

export function pointsToUnit(pts: number, unit: UnitPreference): number {
  switch (unit) {
    case 'cm':
      return pts / POINTS_PER_CM;
    case 'in':
      return pts / POINTS_PER_INCH;
    case 'mm':
      return pts / POINTS_PER_MM;
  }
}

export function unitToPoints(value: number, unit: UnitPreference): number {
  switch (unit) {
    case 'cm':
      return value * POINTS_PER_CM;
    case 'in':
      return value * POINTS_PER_INCH;
    case 'mm':
      return value * POINTS_PER_MM;
  }
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
