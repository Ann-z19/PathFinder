import { useEffect, useState } from "react";
import { AssessmentContext } from "./assessment-context";

const STORAGE_KEY = 'pathfinder.answers'

function AssessmentProvider({children}){
    //answer state
    //state for store the user's answer
    const [answers, setAnswers] = useState(()=>{
        try{
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : {}
        }catch{
            return{}
        }
    })

    useEffect(()=>{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    },[answers])

    //chooseAnswer Function
    function setAnswer(questionIndex, value){
        setAnswers((prev) => ({
            ...prev,
            [questionIndex]: value
        }))
    }

    //reset Answer
    function resetAnswers(){
        setAnswers({})
    }

    const value = {answers, setAnswer, resetAnswers}
    return(
        <AssessmentContext.Provider value={value}>
            {children}
        </AssessmentContext.Provider>
    )
}

export default AssessmentProvider