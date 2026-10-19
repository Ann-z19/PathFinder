import { useMemo } from 'react'
import occupationsData from '../data/occupations.json'
import { rankOccupations } from '../lib/matching'
import CareerCard from '../components/CareerCard'
import { useAssessment } from "../context/assessment-context"
import questionsData from "../data/questions.json"
import { calculateScores, getTopAreas } from "../lib/scoring"
import { Link } from "react-router"
import InterestProfile from "../components/InterestProfile"
import "./Results.css"

const RESULT_LIMIT = 10

function Results() {
  const { answers } = useAssessment()
  const scores = useMemo(()=>calculateScores(answers),[answers])
  const topAreas = getTopAreas(scores)
  const ranked = useMemo(()=>rankOccupations(scores, occupationsData.occupations), [scores])
  const topMatches = ranked.slice(0, RESULT_LIMIT)
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
          <p className="results-count">Top {topMatches.length} matches</p>

          <ul className="career-list">
            {topMatches.map((occ) => (
              <li key={occ.code}>
                <CareerCard occupation={occ} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Results
