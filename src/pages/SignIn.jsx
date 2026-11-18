import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, useLocation} from "react-router"
import { EyeIcon, BookmarkCheckIcon } from "../components/Icons"
import "./SignIn.css"

// Example rows for the card on the right (not real data)
const PREVIEW = [
  { title: "Environmental Scientist", match: "92%" },
  { title: "UX Researcher", match: "88%" },
  { title: "Data Analyst", match: "84%" },
]

function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  // true while we wait for Supabase to answer
  const [busy, setBusy] = useState(false)
  // "signin" or "signup": which job the form is doing
  const [mode, setMode] = useState("signin")
  const isSignUp = mode === "signup"
  const navigate = useNavigate()
  const location = useLocation()
  // true = show the password as plain text
  const [showPassword, setShowPassword] = useState(false)
  //true = SaveButton sent user here
  const [ showNotice, setNotice ] = useState(location.state?.reason === "save")

  //Hide the notice after 4 seconds
  useEffect(()=>{
    if(!showNotice)return
    const timer = setTimeout(()=>setNotice(false), 4000)
    return ()=>clearTimeout(timer)
  }, [showNotice])

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setErrorMessage("")
    const { error } = isSignUp ?
                       await supabase.auth.signUp({ email, password })
                      : await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) {
      setErrorMessage(error.message)
    }else{
      navigate("/shortlist")
    }
  }

  return (
    <section className="signin">
      <div className="signin-main">
        {showNotice && (
          <p className="signin-notice" role="status">
            Sign in to save careers to your shortlist.
          </p>
        )}
        <p className="signin-eyebrow">
          {isSignUp ? "Start your shortlist" : "Pick up where you left off"}
        </p>
        <div className="signin-welcome">
          <h1>{isSignUp ? "Create your account." : "Welcome back."}</h1>
          <p>
            {isSignUp
              ? "Save careers and notes, and find them again on any device."
              : "Continue exploring the careers you saved."}
          </p>
        </div>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-field">
            <label htmlFor="email">Email</label>
            <input
              className="signin-input"
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="signin-field">
            <label htmlFor="password">Password</label>
            <div className="signin-password">
              <input
                className="signin-input"
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={isSignUp ? 6 : undefined}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="signin-eye"
                aria-label="Show password"
                aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeIcon />
              </button>
            </div>
            {isSignUp && <p className="signin-hint">Use at least 6 characters.</p>}
          </div>
          {errorMessage && <p className="signin-error" role="alert">{errorMessage}</p>}
          <button type="submit" className="signin-submit" disabled={busy}>
            {isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>
        <div className="signin-switch">
          <p>{isSignUp ? "Already have an account?" : "New to PathFinder?"}</p>
          <button
            type="button"
            className="signin-link-btn"
            onClick={() => setMode(isSignUp ? "signin" : "signup")}
          >
            {isSignUp ? "Sign in" : "Create an account"}
          </button>
        </div>
      </div>

      <aside className="signin-promo">
        <div className="signin-art" aria-hidden="true">
          <div className="signin-art-shapes">
            <span className="signin-art-left" />
            <span className="signin-art-center" />
            <span className="signin-art-right" />
          </div>
        </div>
        <div className="signin-promo-body">
          <p className="signin-promo-label">Your shortlist is waiting</p>
          <h2>Keep every promising career in one place.</h2>
          <p className="signin-promo-text">
            Return to your saved paths, personal notes, and the possibilities you want to explore.
          </p>
          {/* Example careers, only to show what a shortlist looks like */}
          <ul className="signin-preview" aria-label="Example of a shortlist">
            {PREVIEW.map((item) => (
              <li key={item.title}>
                <BookmarkCheckIcon />
                <span className="signin-preview-title">{item.title}</span>
                <span className="signin-preview-match">{item.match}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  )
}

export default SignIn