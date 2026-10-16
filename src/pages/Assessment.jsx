import {useState} from 'react'
import { useNavigate } from 'react-router'
import questionsData from '../data/questions.json'
import { useAssessment } from '../context/assessment-context'

//constant data stay outside of the function
const questions = questionsData.questions
const answerOptions = questionsData.answerOptions

function Assessment(){
    //Hooks
    const {answers, setAnswer} = useAssessment()
    const [currIndex, setCurrIndex] = useState(()=>{
        const firstUnanswered = questions.findIndex((q)=> answers[q.index] === undefined)
        return firstUnanswered === -1 ? questions.length - 1 : firstUnanswered
    })
    const navigate = useNavigate()

    //state values
    const question = questions[currIndex]
    const currentAnswer = answers[question.index]
    const isFirst = currIndex === 0
    const isLast = currIndex === questions.length - 1
    const isAnswered = currentAnswer !== undefined

    function goBack(){
        setCurrIndex((prev)=> prev-1)
    }

    function goNext(){
        if(isLast){
            navigate('/results')
        }else{
            setCurrIndex((prev)=> prev+1)
        }
    }

    

    return(
        <section>
            <p>Interest assessment</p>
            <p>Question {currIndex+1} of {questions.length}</p>

            <h1>How much would you enjoy this activity?</h1>
            <p>{question.text}</p>

            <fieldset>
                <legend>Your answer</legend>
                {answerOptions.map((option) => (
                    <label key={option.value}>
                    <input
                        type="radio"
                        name="answer"
                        value={option.value}
                        checked={option.value === currentAnswer}
                        onChange={() => setAnswer(question.index, option.value)}
                    />
                    {option.value} {option.name}
                    </label>
                ))}
            </fieldset>

            <button type="button" onClick={goBack} disabled={isFirst}>
                Back
            </button>
            <button type="button" onClick={goNext} disabled={!isAnswered}>
                {isLast ? "See results" : "Next"}
            </button>
        </section>
        
    )
}

export default Assessment