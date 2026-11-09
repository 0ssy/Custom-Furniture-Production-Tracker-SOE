// Rounds an amount to 2 decimals and adds commas, for showing on screen only.
// Rounding removes errors like 0.30000000000000004.
export function showMoney(amount: number) {
  return (Math.round(amount * 100) / 100).toLocaleString()
}