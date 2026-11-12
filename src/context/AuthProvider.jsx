import { useEffect, useState } from "react"
import { AuthContext } from "./auth-context"
import { supabase } from "../lib/supabase"

function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setLoading(false) 
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,   // the user inside the session, or null when there is no session
    loading,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider