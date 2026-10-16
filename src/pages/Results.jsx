import { useAssessment } from "../context/assessment-context"
import { calculateScores } from "../lib/scoring"

function Results(){
    const {answers} = useAssessment()
    const scores = calculateScores(answers)
    return(
        <section>
            <h1>Results</h1>
            <p>Answered: {Object.keys(answers).length} / 30</p>
            <pre>{JSON.stringify(scores, null, 2)}</pre>
        </section>
    )
}

export default Results