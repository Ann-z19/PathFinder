import riasecData from '../data/riasec.json'
import './InterestProfile.css'

const areas = riasecData.areas

// "YOUR PROFILE" panel on the Results page: the user's top interest areas,
// each with a 0–100 strength bar and an expandable description.
function InterestProfile({ scores, topAreas }) {
  return (
    <section className="interest-profile" aria-labelledby="interest-profile-title">
      <h2 id="interest-profile-title" className="profile-label">
        Your profile
      </h2>

      <ul className="profile-list">
        {topAreas.map((code) => {
          const area = areas[code]
          const score = scores[code]
          // Area scores range from 5 to 25; turn that into 0–100.
          const percent = Math.round(((score - 5) / 20) * 100)

          return (
            <li key={code} className="profile-item">
              <div className="profile-row">
                <span className="profile-score">
                  {code} {percent}
                </span>
                <span className="profile-title">{area.title}</span>
              </div>
              <div
                className="profile-track"
                role="meter"
                aria-label={`${area.title} interest`}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="profile-bar" style={{ width: `${percent}%` }} />
              </div>
              <details className="profile-details">
                <summary>What does {area.title} mean?</summary>
                <p>{area.description}</p>
              </details>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default InterestProfile
