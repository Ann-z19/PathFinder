import { Link } from 'react-router'
import './CareerCard.css'

//Short labels for each Job Zone
//Education is derived from Job Zone
const JOB_ZONE_LABELS ={
    1: 'Ready now',
    2: 'Ready now',
    3: 'Some preparation',
    4: "Bachelor's level",
    5: 'Advanced degree',
}

// One career in the Results list: title, match %, Job Zone, description,
// and a link to the details page.
function CareerCard({occupation}){
    const {code, title, jobZone, description, match} = occupation

    return(
        <article className='career-card'>
            <header className="career-card-header">
                <h3 className="career-card-title">{title}</h3>
                <span className="career-card-match">{match}% match</span>
            </header>

            <p className="career-card-meta">
                Job Zone {jobZone} · {JOB_ZONE_LABELS[jobZone]}
            </p>

            <p className="career-card-description">{description}</p>

            <footer className="career-card-actions">
                <Link to={`/careers/${code}`} className="btn btn-secondary">
                View details
                </Link>
            </footer>
        </article>
    )
}

export default CareerCard