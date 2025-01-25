export function formatPhone(value: string): string {
  if (!value) return ''

  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, '')
  
  // Limita a 11 dígitos
  const phone = numbers.slice(0, 11)
  
  // Formata o número
  if (phone.length <= 2) {
    return `(${phone}`
  }
  if (phone.length <= 7) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2)}`
  }
  return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`
} 