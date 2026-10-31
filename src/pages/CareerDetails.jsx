import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { fetchCareer } from "../lib/onetProxy"
import { ArrowLeftIcon, CheckIcon } from "../components/Icons"
import "./CareerDetails.css"

function CareerDetails(){
    const { code } = useParams()
    // The answer remembers which code it belongs to
    const [result, setResult] = useState({ code: null })

    useEffect(() => {
        let ignore = false
        async function load() {
            const answer = await fetchCareer(code)
            if (!ignore) {
                setResult({ code: code, career: answer.career, error: answer.error })
            }
        }
        load()
        return () => { ignore = true }
    }, [code])

    const backLink = (
        <Link to="/results" className="career-back">
            <ArrowLeftIcon />
            Back to matches
        </Link>
    )

    if (result.code !== code) {
        return (
            <section className="career-details">
                {backLink}
                <p className="career-details-status">Loading…</p>
            </section>
        )
    }
    if (result.error) {
        return (
            <section className="career-details">
                {backLink}
                <p className="career-details-status">{result.error}</p>
            </section>
        )
    }

    const { career } = result
    return(
        <section className="career-details">
            {backLink}

            <header className="career-details-heading">
                <h1>{career.title}</h1>
                <p className="career-details-code">O*NET code {code}</p>
            </header>

            <div className="career-details-overview">
                <h2>What you would do</h2>
                <p className="career-details-summary">{career.what_they_do}</p>

                <h3>Common tasks</h3>
                <ul className="career-task-list">
                    {career.on_the_job?.map((task) => (
                        <li key={task} className="career-task">
                            <span className="career-task-check">
                                <CheckIcon />
                            </span>
                            {task}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default CareerDetails