import { createContext, useContext } from "react"

// The shared "locker" for the careers the user wants to compare
export const CompareContext = createContext(null)

// Any component calls useCompare() to read or change the compare list
export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error("useCompare must be used inside <CompareProvider>")
  }
  return context
}