import questionsData from '../data/questions.json'

const questions = questionsData.questions

// Calculates RIASEC interest scores from assessment answers.
// Each answer is 1–5 (Strongly Dislike → Strongly Like).
// Each area has 5 questions, so each area score is the sum of its 5 answers (range 5–25).
// Unanswered questions are skipped.
//
// answers: { 1: 4, 2: 2, ... }  →  scores: { R: 20, I: 9, A: 14, S: 20, E: 16, C: 18 }

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