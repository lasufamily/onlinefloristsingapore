import { brand } from './brand';

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

function trimAtWord(value: string, maximum: number): string {
  const text = normalize(value);
  if (text.length <= maximum) return text;
  const shortened = text.slice(0, maximum);
  return `${shortened.slice(0, shortened.lastIndexOf(' ')).replace(/[,:;.!?]+$/, '')}.`;
}

export function optimizeTitle(title: string, subject?: string): string {
  const normalized = normalize(title);
  if (normalized.length >= 30 && normalized.length <= 65) return normalized;

  const base = normalize(subject ?? normalized.split('|')[0]);
  return trimAtWord(`${base} Singapore Guide | ${brand.name}`, 65);
}

export function optimizeDescription(description: string, supportingText?: string): string {
  const primary = normalize(description);
  const supporting = normalize(supportingText ?? 'Find practical Singapore guidance for choosing, planning, and caring for flowers with confidence.');
  const combined = primary.length >= 110 || primary.includes(supporting) ? primary : `${primary} ${supporting}`;
  return trimAtWord(combined, 160);
}
