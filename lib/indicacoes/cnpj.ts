export function sanitizeDigits(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "");
}

export function isValidCnpj(value: string | null | undefined): boolean {
  const digits = sanitizeDigits(value);

  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const calcCheckDigit = (base: string) => {
    let weight = base.length - 7;
    let sum = 0;
    for (const char of base) {
      sum += Number(char) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const firstCheckDigit = calcCheckDigit(digits.slice(0, 12));
  const secondCheckDigit = calcCheckDigit(digits.slice(0, 12) + firstCheckDigit);

  return digits === digits.slice(0, 12) + String(firstCheckDigit) + String(secondCheckDigit);
}

export function formatCnpj(value: string | null | undefined): string {
  const digits = sanitizeDigits(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function formatTelefone(value: string | null | undefined): string {
  const digits = sanitizeDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function isValidTelefone(value: string | null | undefined): boolean {
  const digits = sanitizeDigits(value);
  return digits.length === 10 || digits.length === 11;
}

export function isValidEmail(value: string | null | undefined): boolean {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
