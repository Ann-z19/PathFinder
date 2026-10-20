import { Link } from 'react-router'
import { JOB_ZONE_OPTIONS } from '../lib/jobZones'
import './CareerCard.css'



// One career in the Results list: title, match %, Job Zone, description,
// and a link to the details page.
function CareerCard({occupation}){
    const {code, title, jobZone, description, match} = occupation
    const zoneName = JOB_ZONE_OPTIONS.find((o)=>o.zone===jobZone).name

    return(
        <article className='career-card'>
            <header className="career-card-header">
                <h3 className="career-card-title">{title}</h3>
                <span className="career-card-match">{match}% match</span>
            </header>

            <p className='career-card-meta'>Preparation: {zoneName}</p>

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