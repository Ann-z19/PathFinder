import {useCompare} from '../context/compare-context'

// Add / remove one career from the compare list. Used on career cards and the details page.
function CompareButton({code, className=""}){
    const {compareList, add, remove, isFull} = useCompare()
    const isCompare = compareList.includes(code)

    if(isCompare){
        return(
            <button type="button" className={`btn btn-secondary ${className}`} onClick={()=>remove(code)}>
                Remove from compare
            </button>
        )
    }
    return(
        <button type="button" className={`btn btn-secondary ${className}`} onClick={()=>add(code)} disabled={isFull}>
            Add to compare
        </button>
    )
}

export default CompareButton