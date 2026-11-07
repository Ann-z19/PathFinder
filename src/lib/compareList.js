export const MAX_COMPARE = 3

// Add a career code. Never change `list` itself: return a NEW array.
// Already in the list, or the list is full -> return the list unchanged.
export function addCareer(list, code) {
  if (list.includes(code)) return list
  if (list.length >= MAX_COMPARE) return list
  return [...list, code]
}

// Remove a career code. Also returns a NEW array.
export function removeCareer(list, code) {
  return list.filter((c) => c !== code)
}