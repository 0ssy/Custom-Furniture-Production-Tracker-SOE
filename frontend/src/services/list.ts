// Helper that pulls the list out of a backend answer.
// Jose's list endpoints answer like { count: 3, furniture: [...] },
// but the name of the list changes (customers, orders, payments...).
// This function accepts a plain array, the named list, or the first list it finds.
export function extractList<T>(data: unknown, key: string): T[] {
  // Case 1: the answer is already a list
  if (Array.isArray(data)) return data as T[]

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>

    // Case 2: the list is under the name we expect
    if (Array.isArray(obj[key])) return obj[key] as T[]

    // Case 3: the list has another name, so take the first list we find
    const firstList = Object.values(obj).find((value) => Array.isArray(value))
    if (firstList) return firstList as T[]
  }

  // Nothing found, so show an empty list
  return []
}