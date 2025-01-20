// validateCpf.ts
export function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
  
    const digits = cpf.split('').map(Number);
    const checkDigit1 = calculateCheckDigit(digits.slice(0, 9));
    const checkDigit2 = calculateCheckDigit(digits.slice(0, 10));
  
    return digits[9] === checkDigit1 && digits[10] === checkDigit2;
}
  
function calculateCheckDigit(numbers: number[]): number {
    const sum = numbers.reduce((acc, num, index) => {
      const factor = numbers.length + 1 - index;
      return acc + num * factor;
    }, 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
}
  