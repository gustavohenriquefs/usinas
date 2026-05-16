/**
 * Formata uma string ISO "YYYY-MM-DD" no formato local do idioma ativo.
 *
 * pt-BR → DD/MM/YYYY
 * en-US → MM/DD/YYYY
 *
 * Usa Intl.DateTimeFormat para garantir consistência com o locale do i18n.
 * Adiciona T12:00 para evitar off-by-one causado por UTC midnight.
 */
export function formatDate(isoStr: string | null | undefined, locale: string): string {
  if (!isoStr) return '';
  const date = new Date(`${isoStr}T12:00:00`);
  if (isNaN(date.getTime())) return isoStr;
  return new Intl.DateTimeFormat(locale, {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
  }).format(date);
}
