// Gives today's date as YYYY-MM-DD using the computer's own timezone.
// We build it by hand from the year, month and day, so it is the same in
// every browser. padStart adds a leading 0, so month 5 becomes "05".
export function getToday() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0') // getMonth starts at 0
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}