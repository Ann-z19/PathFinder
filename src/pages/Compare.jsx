import { useEffect, useState} from "react"
import { fetchCareer } from "../lib/onetProxy"
import { usd } from "../lib/format"
import { Link } from "react-router"
import { useCompare } from "../context/compare-context"
import { useAssessment } from "../context/assessment-context"
import questionsData from "../data/questions.json"
import { calculateScores, getInterestTypes } from "../lib/scoring"
import {matchPercent} from "../lib/matching"
import { JOB_ZONE_OPTIONS } from "../lib/jobZones"
import occupationsData from "../data/occupations.json"
import "./Compare.css"

function Compare(){
    const { answers } = useAssessment()
    const isComplete = Object.keys(answers).length === questionsData.questions.length
    const scores = calculateScores(answers)
    const { compareList } = useCompare()

    const careers = compareList
            .map((code) => occupationsData.occupations.find(
                (o) => o.code === code)
            )
            .filter((career) => career !== undefined)

        // API details for every compared career: { "15-1252.00": career, ... }
    // Like CareerDetails, the result remembers which list it belongs to.
    const [result, setResult] = useState({key: null, details: {}})
    const key = careers.map((career)=>(career.code)).join(",")

    useEffect(()=>{
        if(key==="")return //nothing to load
        let ignore = false
        async function load() {
            const codes = key.split(",")
            const answers = await Promise.all(codes.map((code)=>fetchCareer(code)))
            if(!ignore){
                const details ={}
                codes.forEach((code, i) =>{
                    details[code] = answers[i].career
                })
                setResult({key, details})
            }
        }
        load()
        return()=>{
            ignore = true
        }
    }, [key])

    const isLoading = result.key !== key

    
    //helper function: Text for a cell that needs API data : "..." while loading, "-" when it's missing
    function apiValue(career, pick){
        if (isLoading) return "..."
        const detail = result.details[career.code]
        return(detail && pick(detail)) ?? "-"
    }

    const ROWS = [
        {
            label: "Match",
            getValue : (career)=>(isComplete ? `${matchPercent(scores, career.riasec)}%` : "-")
        },
        {
            label: "Preparation",
            getValue : (career) => JOB_ZONE_OPTIONS.find((option)=> option.zone === career.jobZone)?.name ?? "-",
        },
        {
            label: "Typical education",
            getValue: (career) => apiValue(career, (detail) => detail.education?.education_usually_needed?.[0]),
        },
        {
            label: "Median pay",
            getValue: (career) =>
                apiValue(career, (detail) => {
                const pay = detail.job_outlook?.salary?.annual_median
                return pay ? usd.format(pay) : undefined
                }),
        },
        {
            label: "Outlook",
            getValue: (career) => apiValue(career, (detail) => detail.job_outlook?.outlook.category),
        },
        {
            label: "Best for",
            getValue: (career) => getInterestTypes(career.riasec)
        }
    ]


    
    //Comparing needs at least 2 careers to compare
    if(careers.length < 2){
        return (
            <section className="compare-empty">
                <h1>Compare careers</h1>
                <p>{careers.length === 0 ? 
                "You haven't added any careers to compare yet." 
                : "Add one more career to compare." 
                    }
                </p>
                <Link to="/results" className="btn btn-primary">
                Browse your matches
                </Link>

            </section>
        )
    }
    return (
        <section className="compare">
            <h1>Compare careers</h1>
            <p className="compare-intro">See the tradeoffs side by side. Add up to three careers to compare.</p>

            {/* The wrapper scrolls sideways on small screens; the page itself does not */}
            <div className="compare-table-wrap">
                <table className="compare-table">
                    <thead>
                        <tr>
                            <th scope="col">Your possibilities</th>
                            {careers.map((career)=>(
                                <th key = {career.code} scope="col">
                                    <Link to={ `/careers/${career.code}`}>
                                        {career.title}
                                    </Link>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ROWS.map((row)=>(
                            <tr key={row.label}>
                                <th scope="row">
                                    {row.label}
                                </th>
                                {careers.map((career) => (
                                    <td key={career.code}>{row.getValue(career)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default Compare