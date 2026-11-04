import { JOB_ZONE_OPTIONS } from "../lib/jobZones";
import {usd} from "../lib/format";
import "./PreparationSnapshot.css"

//Any fact can be missing (API failed, or ONET has no data). show "-"
function PreparationSnapshot({career, localData}){
    const education = career?.education?.education_usually_needed?.[0] ?? "-"
    const zone = JOB_ZONE_OPTIONS.find((option)=>option.zone === localData?.jobZone)
    const preparation = zone ? zone.name : "-"
    const salary = career?.job_outlook?.salary?.annual_median
    const medianSalary = salary ? `${usd.format(salary)} / year` : "-"
    const outlook = career?.job_outlook?.outlook?.category ?? "-"

    return (
        <aside className = "career-snapshot">
            <h2 className = "career-snapshot-title">Preparation Snapshot</h2>
            <dl className = "career-snapshot-fact">
                <div>
                    <dt>Typical Education</dt>
                    <dd>{education}</dd>
                </div>
                <div>
                    <dt>Preparation</dt>
                    <dd>{preparation}</dd>
                </div>
                <div>
                    <dt>Median Salary</dt>
                    <dd>{medianSalary}</dd>
                </div>
                <div>
                    <dt>Job Outlook</dt>
                    <dd>{outlook}</dd>
                </div>
            </dl>
        </aside>
    )   
}   

export default PreparationSnapshot