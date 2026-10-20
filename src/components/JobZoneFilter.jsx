import { JOB_ZONE_OPTIONS } from '../lib/jobZones'
import { CheckIcon } from './Icons'
import './JobZoneFilter.css'

// "Preparation level" filter in the Results sidebar.
// One option at a time; clicking the selected option again clears it.
function JobZoneFilter({selectedZone, onSelect}){
    return(
        <section className="job-zone-filter" aria-labelledby="job-zone-filter-title">
            <h2 id="job-zone-filter-title" className="filter-label">
                Preparation level
            </h2>

            <ul className='filter-options'>
                {JOB_ZONE_OPTIONS.map((option)=>{
                    const isSelected = option.zone === selectedZone
                    return(
                        <li key={option.zone}>
                            <button 
                                type='button' 
                                className='filter-option' 
                                aria-pressed={isSelected} 
                                onClick={()=>onSelect(isSelected? null:option.zone)}
                            >
                                <span className='filter-option-name'>{option.name}</span>
                                {isSelected && <CheckIcon />}
                            </button>
                        </li>
                    )
                })}
            </ul>
            <button
                type='button'
                className='filter-clear'
                onClick={()=>onSelect(null)}
                disabled={selectedZone===null}
            >
                Clear all filters
            </button>
        </section>
    )
}
export default JobZoneFilter