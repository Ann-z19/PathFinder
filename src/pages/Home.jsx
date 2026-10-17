import { Link } from 'react-router'
import { useAssessment } from '../context/assessment-context'
import questionsData from '../data/questions.json'
import { FingerprintIcon, RouteIcon, SparklesIcon } from '../components/Icons'
import './Home.css'

const totalQuestions = questionsData.questions.length

// The three steps in the "Your path, at a glance" card.
const JOURNEY_STEPS = [
  { title: 'Discover', text: `${totalQuestions} questions to discover your interests`, Icon: SparklesIcon },
  { title: 'Understand', text: 'See what makes your RIASEC profile unique', Icon: FingerprintIcon },
  { title: 'Explore', text: 'Compare career paths worth pursuing', Icon: RouteIcon },
]

function Home() {
  const { answers } = useAssessment()
  const answeredCount = Object.keys(answers).length

  let primaryLabel
  let primaryTo

  if(answeredCount===0){
    primaryLabel = "Start assessment"
    primaryTo = "/assessment"
  }else if(answeredCount === totalQuestions){
    primaryLabel = 'See your results'
    primaryTo = '/results'
  }else{
    primaryLabel = `Continue assessment (${answeredCount}/${totalQuestions})`
    primaryTo = '/assessment'
  }

  return (
    <section className="home">
      <div className="home-promise">
        <p className="home-eyebrow">Career clarity starts with</p>
        <h1>A path that fits who you are.</h1>
        <p className="home-lead">
          Take a guided interest assessment, explore evidence-backed career matches,
          and save the paths worth pursuing.
        </p>

        <div className="home-actions">
          <Link to={primaryTo} className="btn btn-primary">{primaryLabel}</Link>
          <Link to="/results" className="btn btn-secondary">Explore careers</Link>
        </div>

        <p className="home-note">No account required · About 8 minutes · Save anytime</p>
      </div>

      <aside className="journey" aria-labelledby="journey-title">
        <h2 id="journey-title" className="journey-label">Your path, at a glance</h2>

        <ol className="journey-steps">
          {JOURNEY_STEPS.map(({ title, text, Icon }) => (
            <li key={title} className="journey-step">
              <span className="journey-symbol">
                <Icon />
              </span>
              <span className="journey-text">
                <span className="journey-title">{title}</span>
                <span className="journey-desc">{text}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="journey-evidence">
          <p className="journey-evidence-label">Built around O*NET career data</p>
          <p>Your results are grounded in evidence-backed career information, not guesswork.</p>
        </div>
      </aside>
    </section>
  )
}

export default Home