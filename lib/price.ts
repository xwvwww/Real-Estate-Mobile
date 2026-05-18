export function formatPriceInput(value: string) {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  return new Intl.NumberFormat('ru-RU').format(Number(digits));
}

export function parsePriceInput(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : NaN;
}
