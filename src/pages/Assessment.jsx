import {useState} from 'react'
import { useNavigate } from 'react-router'
import questionsData from '../data/questions.json'
import { useAssessment } from '../context/assessment-context'
import { CircleCheckIcon, SproutIcon } from '../components/Icons'
import './Assessment.css'

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
    const answeredCount = Object.keys(answers).length
    const percentComplete = Math.round((answeredCount / questions.length) * 100)

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
        <section className="assessment">
            <div className="assessment-progress">
                <p className="assessment-label">Interest assessment</p>
                <p className="assessment-count">
                    Question {currIndex+1} of {questions.length} / {percentComplete}% complete
                </p>
            </div>
            <div
                className="progress-track"
                role="progressbar"
                aria-label="Assessment progress"
                aria-valuenow={percentComplete}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div className="progress-fill" style={{ width: `${percentComplete}%` }} />
            </div>

            <h1>How much would you enjoy this activity?</h1>
            <div className="activity-prompt">
                <span className="activity-symbol">
                    <SproutIcon />
                </span>
                <p className="activity-text">{question.text}</p>
            </div>

            <fieldset className="response-scale">
                <legend className="visually-hidden">Your answer: {question.text}</legend>
                {answerOptions.map((option) => {
                    const isSelected = option.value === currentAnswer
                    return (
                        <label
                            key={option.value}
                            className={isSelected ? 'response-option is-selected' : 'response-option'}
                        >
                            <input
                                className="visually-hidden"
                                type="radio"
                                name="answer"
                                value={option.value}
                                checked={isSelected}
                                onChange={() => setAnswer(question.index, option.value)}
                            />
                            <span className="response-top">
                                <span className="response-value">{option.value}</span>
                                {isSelected ? (
                                    <span className="response-check"><CircleCheckIcon /></span>
                                ) : (
                                    <span className="response-ring" aria-hidden="true" />
                                )}
                            </span>
                            <span className="response-name">{option.name}</span>
                        </label>
                    )
                })}
            </fieldset>

            <div className="reassurance">
                <p>Choose the response that feels most natural. There are no right or wrong answers.</p>
                <p className="reassurance-note">Your progress is saved automatically on this device.</p>
            </div>

            <div className="assessment-actions">
                <button type="button" className="btn btn-secondary" onClick={goBack} disabled={isFirst}>
                    Back
                </button>
                <div className="assessment-actions-right">
                    {/* TODO (A6): Save & exit */}
                    <button type="button" className="btn btn-secondary">
                        Save &amp; exit
                    </button>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!isAnswered}>
                        {isLast ? "See results" : "Next"}
                    </button>
                </div>
            </div>
        </section>
        
    )
}

export default Assessment