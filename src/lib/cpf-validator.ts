/**
 * Validates a Brazilian CPF (Cadastro de Pessoas Físicas) number
 * Uses the checksum algorithm to verify the verification digits
 */

// Known invalid CPFs (all same digits)
const INVALID_CPFS = [
  "00000000000",
  "11111111111",
  "22222222222",
  "33333333333",
  "44444444444",
  "55555555555",
  "66666666666",
  "77777777777",
  "88888888888",
  "99999999999",
];

/**
 * Calculates the verification digit for CPF
 */
function calculateDigit(cpfPartial: string, factor: number): number {
  let sum = 0;
  for (let i = 0; i < cpfPartial.length; i++) {
    sum += parseInt(cpfPartial[i], 10) * (factor - i);
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/**
 * Validates a CPF string
 * @param cpf - The CPF to validate (can include formatting like dots and dashes)
 * @returns true if the CPF is valid, false otherwise
 */
export function isValidCPF(cpf: string): boolean {
  // Remove any non-digit characters
  const cleanCpf = cpf.replace(/\D/g, "");

  // Check if it has exactly 11 digits
  if (cleanCpf.length !== 11) {
    return false;
  }

  // Check if it's a known invalid CPF (all same digits)
  if (INVALID_CPFS.includes(cleanCpf)) {
    return false;
  }

  // Extract the base (first 9 digits) and verification digits (last 2)
  const base = cleanCpf.substring(0, 9);
  const verificationDigits = cleanCpf.substring(9);

  // Calculate first verification digit
  const firstDigit = calculateDigit(base, 10);
  
  // Calculate second verification digit
  const secondDigit = calculateDigit(base + firstDigit, 11);

  // Compare calculated digits with provided digits
  const calculatedVerification = `${firstDigit}${secondDigit}`;
  
  return verificationDigits === calculatedVerification;
}

/**
 * Formats a CPF string to the standard format (XXX.XXX.XXX-XX)
 * @param cpf - The CPF to format
 * @returns The formatted CPF string
 */
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "");
  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .slice(0, 14);
}
