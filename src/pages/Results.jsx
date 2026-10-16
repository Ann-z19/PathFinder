import { useAssessment } from "../context/assessment-context"

function Results(){
    const {answers} = useAssessment()
    return(
        <section>
            <h1>Results</h1>
            <p>Answered: {Object.keys(answers).length} / 30</p>
        </section>
    )
}

export default Results