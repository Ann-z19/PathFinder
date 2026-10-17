import { useAssessment } from "../context/assessment-context"
import questionsData from "../data/questions.json"
import { calculateScores, getTopAreas } from "../lib/scoring"
import { Link } from "react-router"
import InterestProfile from "../components/InterestProfile"
import "./Results.css"

function Results() {
  const { answers } = useAssessment()
  const scores = calculateScores(answers)
  const topAreas = getTopAreas(scores)
  const isComplete = Object.keys(answers).length === questionsData.questions.length

  // 1. Not finished yet → ask the user to finish first
  if (!isComplete) {
    return (
      <section className="results-empty">
        <h1>Your career matches</h1>
        <p>Finish the assessment to see your interest profile and career matches.</p>
        <Link to="/assessment" className="btn btn-primary">
          Continue assessment
        </Link>
      </section>
    )
  }

  // 2. Finished → profile on the left, career matches on the right
  return (
    <section className="results">
      <header className="results-intro">
        <h1>Your career matches</h1>
        <p>Based on your assessment and selected preparation level.</p>
      </header>

      <div className="results-workspace">
        <aside className="results-sidebar">
          <InterestProfile scores={scores} topAreas={topAreas} />
        </aside>

        <div className="results-main">
          {/* Week 2: career cards, sort and filters */}
          <p className="results-placeholder">Career matches coming next.</p>
        </div>
      </div>
    </section>
  )
}

export default Results
