import { createContext, useContext } from "react";

//The shared 'locker' for aseessment answers
export const AssessmentContext = createContext(null)

//Any component calls useAssessment() to read answers
export function useAssessment(){
    const context = useContext(AssessmentContext)
    if(!context){
        throw new Error('useAssessment must be used inside <AssessmentProvider>')
    }
    return context
}