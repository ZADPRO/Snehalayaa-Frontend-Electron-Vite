export const formatINRCurrency = (value: string | number) => {
  const num = Number(value)
  if (isNaN(num)) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(num)
}
