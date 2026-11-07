import { useEffect, useState } from "react";
import { CompareContext } from "./compare-context";
import {MAX_COMPARE, addCareer, removeCareer} from '../lib/compareList'

const STORAGE_KEY = 'pathfinder.compare'

function CompareProvider({children}){
    // List of career codes, e.g. ["15-1252.00", "29-1141.00"]
    const [compareList, setCompareList] = useState(()=>{
        try{
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : []
        }catch{
            return[]
        }
    })

    useEffect(()=>{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList))
    },[compareList])

    function add(code){
        setCompareList((prev) => addCareer(prev, code))
    }

    function remove(code){
        setCompareList((prev) => removeCareer(prev, code))
    }

    const value = {
    compareList,
    add,
    remove,
    isFull: compareList.length >= MAX_COMPARE,
  }
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

export default CompareProvider