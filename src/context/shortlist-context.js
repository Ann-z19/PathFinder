import { createContext, useContext } from "react"

export const ShortlistContext = createContext(null)

export function useShortlist() {
  const context = useContext(ShortlistContext)
  if (!context) {
    throw new Error("useShortlist must be used inside <ShortlistProvider>")
  }
  return context
}