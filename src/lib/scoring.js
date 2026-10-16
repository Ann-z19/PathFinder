import questionsData from '../data/questions.json'

const questions = questionsData.questions

// answers: { 1: 4, 2: 2, ... }  →  scores: { R: 12, I: 20, A: 9, S: 15, E: 18, C: 7 }

export function calculateScores(answers){
    const scores = { R: 0, I: 0, A: 0, 
                     S: 0, E: 0, C: 0 }
    
    for(const q of questions){
        const answer = answers[q.index]
        if(!answer){
            continue
        }
        scores[q.area] += answer
    }
    return scores
}