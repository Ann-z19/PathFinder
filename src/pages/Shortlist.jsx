import { useState } from "react"
import { Link } from "react-router"
import { useShortlist } from "../context/shortlist-context"
import occupationsData from "../data/occupations.json"
import { useAuth } from "../context/auth-context"
import routeIcon from "../assets/route.svg"
import "./Shortlist.css"

function Shortlist() {
  const { saved, updateNote, remove, ready } = useShortlist()
  //Code of the card whose note is being edited, or null
  const [editingCode, setEditingCode] = useState(null)
  //User can save a note draft
  const [draft, setDraft] = useState("")
  // Code of the card that is asking "Remove?", or null
  const[confirmingCode, setConfirmingCode] = useState(null)
  const{user, loading} = useAuth()
  //each saved career + it's local data
  const careers = saved.map((row) => {
    const occ = occupationsData.occupations.find((o)=>o.code === row.onet_code)

    if(!occ) return null
    return{...occ, note: row.note}
  }).filter((career) => career !== null)

  function startEdit(career){
    setEditingCode(career.code)
    setDraft(career.note)
  }

  async function saveNote(e, code){
    e.preventDefault()
    await updateNote(code, draft)
    setEditingCode(null)
  }

  if(loading) return null

  if(!user){
    return(
      <section className="shortlist-empty">
        <h1>Your shortlist</h1>
        <p>Sign in to see the careers you saved.</p>
        <Link to="/signin" className="btn btn-primary">Sign in</Link>
      </section>
    )
  }

  if(!ready) return null //rows are still loading

  if(careers.length === 0){
    return(
      <section className="shortlist-empty">
        <h1>Your shortlist</h1>
        <p>You have not saved any careers yet.</p>
        <Link to="/results" className="btn btn-primary">See your matches</Link>
      </section>
    )
  }

  return (
    <section className="shortlist">
      <header className="shortlist-intro">
        <h1>Your shortlist</h1>
        <p>
          {careers.length} saved {careers.length === 1 ? "career" : "careers"} · Add notes as you narrow your direction.
        </p>
      </header>

      <ul className="shortlist-list">
        {careers.map((career)=>(
          <li key={career.code} className="shortlist-card">
            <div className="shortlist-summary">
              <h2 className="shortlist-title">{career.title}</h2>

              <div className="shortlist-actions">
                <Link to={`/careers/${career.code}`} className="shortlist-action">
                  View details
                </Link>
                <button type="button" className="shortlist-action" onClick={()=>startEdit(career)}>
                  Edit note
                </button>
                {confirmingCode !== career.code && (
                  <button type="button" className="shortlist-action" onClick={() => setConfirmingCode(career.code)}>
                    Remove
                  </button>
                )}
              </div>

              {confirmingCode === career.code && (
                <div className="shortlist-confirm" role="alert">
                  <p>Remove {career.title} from your shortlist?</p>
                  <div className="shortlist-confirm-buttons">
                    <button type="button" className="btn btn-primary" onClick={()=>remove(career.code)}>
                      Remove
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={()=>setConfirmingCode(null)}>
                      Keep
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="shortlist-note">
              <p className="shortlist-note-label">Personal note</p>
              {editingCode === career.code ? (
                <form className="shortlist-note-form" onSubmit={(e)=>saveNote(e, career.code)}>
                  <textarea
                    className="shortlist-note-input"
                    value={draft}
                    onChange={(e)=>setDraft(e.target.value)}
                    aria-label={`Note for ${career.title}`}
                    rows={3}
                  />
                  <div className="shortlist-note-buttons">
                    <button type="submit" className="btn btn-primary">Save note</button>
                    <button type="button" className="btn btn-secondary" onClick={()=>setEditingCode(null)}>Cancel</button>
                  </div>
                </form>
              ):(
                <p className="shortlist-note-text">{career.note || "No note yet."}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="shortlist-next">
        <span
          className="shortlist-next-icon"
          style={{ "--icon": `url("${routeIcon}")` }}
          aria-hidden="true"
        />
        Next step: compare your top two, then review education and outlook.
      </p>
    </section>
  )
}

export default Shortlist
