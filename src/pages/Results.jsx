import { useEffect, useMemo, useState } from 'react'
import occupationsData from '../data/occupations.json'
import { rankOccupations } from '../lib/matching'
import CareerCard from '../components/CareerCard'
import { useAssessment } from "../context/assessment-context"
import questionsData from "../data/questions.json"
import { calculateScores, getTopAreas } from "../lib/scoring"
import { Link, useLocation, useNavigate } from "react-router"
import InterestProfile from "../components/InterestProfile"
import "./Results.css"
import JobZoneFilter from '../components/JobZoneFilter'
import ResultsLoading from '../components/ResultsLoading'

const RESULT_LIMIT = 10
const REVEAL_DELAY = 1500 // ms the loading screen stays after the assessment

function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { answers } = useAssessment()
  // true only when we arrive straight from the last assessment question
  const [isRevealing, setIsRevealing] = useState(location.state?.justFinished === true)
  const [selectedZone, setSelectedZone] = useState(null)
  const scores = useMemo(()=>calculateScores(answers),[answers])
  const topAreas = getTopAreas(scores)
  const ranked = useMemo(()=>rankOccupations(scores, occupationsData.occupations), [scores])
  const filtered = ranked.filter((occ)=> selectedZone===null || occ.jobZone===selectedZone)
  const topMatches = filtered.slice(0, RESULT_LIMIT)
  const isComplete = Object.keys(answers).length === questionsData.questions.length

  // Show the loading screen for REVEAL_DELAY ms, then the results.
  useEffect(() => {
    if (!isRevealing) {
      return
    }
    // Drop the "justFinished" note from history, so a refresh skips the loading screen
    navigate('/results', { replace: true })
    const timerId = setTimeout(() => setIsRevealing(false), REVEAL_DELAY)
    // Cancel the timer if the user leaves the page before it fires
    return () => clearTimeout(timerId)
  }, [isRevealing, navigate])

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

  // 2. Just finished → short loading screen first
  if (isRevealing) {
    return <ResultsLoading careerCount={occupationsData.occupations.length} />
  }

  // 3. Finished → profile on the left, career matches on the right
  return (
    <section className="results">
      <header className="results-intro">
        <h1>Your career matches</h1>
        <p>Based on your assessment and selected preparation level.</p>
      </header>

      <div className="results-workspace">
        <aside className="results-sidebar">
          <InterestProfile scores={scores} topAreas={topAreas} />
          <JobZoneFilter selectedZone={selectedZone} onSelect={setSelectedZone} />
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
